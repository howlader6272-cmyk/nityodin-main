import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CreditCard, DollarSign, Clock, CheckCircle, Download, CheckCircle2, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type PaymentTransactionRow = Tables<"payment_transactions"> & {
  orders?: Tables<"orders"> | null;
  payment_gateways?: Tables<"payment_gateways"> | null;
};

const AdminPayments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [txStatusFilter, setTxStatusFilter] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions, isLoading: txLoading } = useQuery<PaymentTransactionRow[]>({
    queryKey: ["admin-payment-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*, orders(order_number), payment_gateways(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentTransactionRow[];
    },
  });

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || order.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    paid: orders?.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    unpaid: orders?.filter((o) => o.payment_status === "unpaid").reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    partial: orders?.filter((o) => o.payment_status === "partial").reduce((sum, o) => sum + Number(o.partial_payment_amount || 0), 0) || 0,
  };

  const filteredTransactions = transactions?.filter((tx) => {
    const matchesStatus =
      txStatusFilter === "all" || tx.status === txStatusFilter;
    return matchesStatus;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">পেইড</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">আংশিক</Badge>;
      case "unpaid":
        return <Badge variant="destructive">বকেয়া</Badge>;
      case "refunded":
        return <Badge variant="secondary">রিফান্ড</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "ক্যাশ অন ডেলিভারি";
      case "bkash":
        return "বিকাশ";
      case "nagad":
        return "নগদ";
      case "uddoktapay":
        return "অনলাইন পেমেন্ট";
      default:
        return method;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">সাকসেস</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">পেন্ডিং</Badge>;
      case "failed":
        return <Badge variant="destructive">ফেইল্ড</Badge>;
      case "refunded":
        return <Badge variant="secondary">রিফান্ড</Badge>;
      case "cancelled":
        return <Badge variant="outline">ক্যানসেল্ড</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const approveMutation = useMutation({
    mutationFn: async (tx: PaymentTransactionRow) => {
      const { error: txError } = await supabase
        .from("payment_transactions")
        .update({
          status: "success",
          manual_approved: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tx.id);
      if (txError) throw txError;

      if (tx.order_id) {
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", tx.order_id);
        if (orderError) throw orderError;
      }

      await supabase.from("payment_activity_logs").insert({
        action: "manual_approve_transaction",
        user_id: user?.id ?? null,
        transaction_id: tx.id,
        gateway_id: tx.gateway_id ?? null,
        details: {
          previous_status: tx.status,
          new_status: "success",
          manual_approved: true,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payment-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast.success("ট্রানজেকশন ম্যানুয়ালি অ্যাপ্রুভ করা হয়েছে");
    },
    onError: () => {
      toast.error("অ্যাপ্রুভ করা যায়নি");
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (tx: PaymentTransactionRow) => {
      const { error: txError } = await supabase
        .from("payment_transactions")
        .update({
          status: "refunded",
          is_refunded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tx.id);
      if (txError) throw txError;

      if (tx.order_id) {
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "refunded",
            updated_at: new Date().toISOString(),
          })
          .eq("id", tx.order_id);
        if (orderError) throw orderError;
      }

      await supabase.from("payment_activity_logs").insert({
        action: "refund_transaction",
        user_id: user?.id ?? null,
        transaction_id: tx.id,
        gateway_id: tx.gateway_id ?? null,
        details: {
          previous_status: tx.status,
          new_status: "refunded",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payment-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast.success("ট্রানজেকশন রিফান্ড হিসাবে মার্ক করা হয়েছে");
    },
    onError: () => {
      toast.error("রিফান্ড করা যায়নি");
    },
  });

  const handleExportCsv = () => {
    if (!transactions?.length) {
      toast.error("এক্সপোর্ট করার মতো ট্রানজেকশন নেই");
      return;
    }

    const header = [
      "Date",
      "Order Number",
      "Amount",
      "Currency",
      "Status",
      "Payment Method",
      "Gateway Id",
      "User Id",
      "Provider Transaction Id",
    ];

    const rows = transactions.map((tx) => [
      new Date(tx.created_at).toISOString(),
      tx.orders?.order_number ?? "",
      tx.amount,
      tx.currency,
      tx.status,
      tx.payment_method ?? "",
      tx.gateway_id ?? "",
      tx.user_id ?? "",
      tx.provider_transaction_id ?? "",
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const str = String(value ?? "");
            const escaped = str.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `payment-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV ফাইল ডাউনলোড শুরু হয়েছে");
  };

  if (isLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">পেমেন্ট</h1>
        <p className="text-muted-foreground">সব পেমেন্ট দেখুন ও পরিচালনা করুন</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট বিক্রয়</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">পেইড</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{stats.paid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বকেয়া</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">৳{stats.unpaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আংশিক পেমেন্ট</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">৳{stats.partial.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="অর্ডার নম্বর, নাম বা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
            <SelectItem value="paid">পেইড</SelectItem>
            <SelectItem value="unpaid">বকেয়া</SelectItem>
            <SelectItem value="partial">আংশিক</SelectItem>
            <SelectItem value="refunded">রিফান্ড</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>অর্ডার</TableHead>
                <TableHead>গ্রাহক</TableHead>
                <TableHead>পেমেন্ট মেথড</TableHead>
                <TableHead>মোট</TableHead>
                <TableHead>পেইড</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>তারিখ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentMethodLabel(order.payment_method)}</TableCell>
                  <TableCell>৳{Number(order.total_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    {order.payment_status === "paid"
                      ? `৳${Number(order.total_amount).toLocaleString()}`
                      : order.payment_status === "partial"
                      ? `৳${Number(order.partial_payment_amount || 0).toLocaleString()}`
                      : "৳০"}
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("bn-BD")}
                  </TableCell>
                </TableRow>
              ))}
              {!filteredOrders?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    কোন পেমেন্ট পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              পেমেন্ট ট্রানজেকশন
            </h2>
            <p className="text-sm text-muted-foreground">
              গেটওয়ে লেভেলের সব ট্রানজেকশন দেখুন, ফিল্টার করুন ও এক্সপোর্ট করুন।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={txStatusFilter} onValueChange={setTxStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={txLoading || !transactions?.length}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              CSV এক্সপোর্ট
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>অর্ডার</TableHead>
                  <TableHead>গেটওয়ে</TableHead>
                  <TableHead>অ্যামাউন্ট</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>মেথড</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      ট্রানজেকশন লোড হচ্ছে...
                    </TableCell>
                  </TableRow>
                )}
                {!txLoading &&
                  filteredTransactions?.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {new Date(tx.created_at).toLocaleString("bn-BD")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.orders?.order_number || "—"}
                      </TableCell>
                      <TableCell>
                        {tx.payment_gateways?.name || "—"}
                      </TableCell>
                      <TableCell>
                        ৳{Number(tx.amount).toLocaleString()} {tx.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getTransactionStatusBadge(tx.status)}
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {tx.manual_approved && (
                              <Badge variant="outline">ম্যানুয়ালি অ্যাপ্রুভড</Badge>
                            )}
                            {tx.is_refunded && (
                              <Badge variant="outline">রিফান্ডেড</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tx.payment_method
                          ? getPaymentMethodLabel(tx.payment_method)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => approveMutation.mutate(tx)}
                          disabled={
                            approveMutation.isLoading ||
                            tx.status !== "pending" ||
                            tx.manual_approved
                          }
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          অ্যাপ্রুভ
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => refundMutation.mutate(tx)}
                          disabled={
                            refundMutation.isLoading ||
                            tx.status !== "success" ||
                            tx.is_refunded
                          }
                        >
                          <RotateCcw className="h-3 w-3" />
                          রিফান্ড
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {!txLoading && !filteredTransactions?.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      কোন ট্রানজেকশন পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments;
