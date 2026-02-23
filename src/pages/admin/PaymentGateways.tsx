import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CreditCard,
  PlusCircle,
  Zap,
  Globe2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentGateway {
  id: string;
  name: string;
  api_base_url: string;
  public_key: string | null;
  secret_key_encrypted: string | null;
  webhook_secret_encrypted: string | null;
  webhook_url: string | null;
  currency: string;
  environment: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

type Environment = "sandbox" | "live";

const AdminPaymentGateways = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentGateway | null>(null);

  const [name, setName] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [isActive, setIsActive] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const { data: gateways, isLoading } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_gateways")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentGateway[];
    },
  });

  const resetForm = () => {
    setName("");
    setApiBaseUrl("");
    setPublicKey("");
    setSecretKey("");
    setWebhookSecret("");
    setCurrency("BDT");
    setEnvironment("sandbox");
    setIsActive(false);
    setIsDefault(false);
    setEditing(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (gateway: PaymentGateway) => {
    setEditing(gateway);
    setName(gateway.name);
    setApiBaseUrl(gateway.api_base_url);
    setPublicKey(gateway.public_key || "");
    setSecretKey("");
    setWebhookSecret("");
    setCurrency(gateway.currency);
    setEnvironment((gateway.environment as Environment) || "sandbox");
    setIsActive(gateway.is_active);
    setIsDefault(gateway.is_default);
    setDialogOpen(true);
  };

  const activityLog = async (action: string, gatewayId: string, details: Record<string, unknown>) => {
    try {
      await supabase.from("payment_activity_logs").insert({
        user_id: user?.id ?? null,
        gateway_id: gatewayId,
        action,
        details,
      });
    } catch (error) {
      console.error("Failed to log payment activity", error);
    }
  };

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (!name || !apiBaseUrl || !currency) {
        throw new Error("সব প্রয়োজনীয় ফিল্ড পূরণ করুন");
      }

      if (editing) {
        const { data, error } = await supabase
          .from("payment_gateways")
          .update({
            name,
            api_base_url: apiBaseUrl,
            public_key: publicKey || null,
            secret_key_encrypted: secretKey ? secretKey : editing.secret_key_encrypted,
            webhook_secret_encrypted: webhookSecret ? webhookSecret : editing.webhook_secret_encrypted,
            currency,
            environment,
            is_active: isActive,
            is_default: isDefault,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editing.id)
          .select("*")
          .single();

        if (error) throw error;

        await activityLog("update_gateway", editing.id, {
          name,
          environment,
          currency,
          is_active: isActive,
          is_default: isDefault,
          secret_updated: !!secretKey,
          webhook_secret_updated: !!webhookSecret,
        });

        return data as PaymentGateway;
      }

      const { data, error } = await supabase
        .from("payment_gateways")
        .insert({
          name,
          api_base_url: apiBaseUrl,
          public_key: publicKey || null,
          secret_key_encrypted: secretKey || null,
          webhook_secret_encrypted: webhookSecret || null,
          currency,
          environment,
          is_active: isActive,
          is_default: isDefault,
        })
        .select("*")
        .single();

      if (error) throw error;

      const created = data as PaymentGateway;

      const webhookUrl = `${window.location.origin}/api/webhooks/payment/${created.id}`;

      const { error: updateError, data: updated } = await supabase
        .from("payment_gateways")
        .update({
          webhook_url: webhookUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", created.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      await activityLog("create_gateway", created.id, {
        name,
        environment,
        currency,
        is_active: isActive,
        is_default: isDefault,
      });

      return updated as PaymentGateway;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      setDialogOpen(false);
      resetForm();
      toast.success("পেমেন্ট গেটওয়ে সংরক্ষণ হয়েছে");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "পেমেন্ট গেটওয়ে সংরক্ষণ করা যায়নি";
      toast.error(message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (gateway: PaymentGateway) => {
      const { error } = await supabase
        .from("payment_gateways")
        .update({
          is_active: !gateway.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", gateway.id);
      if (error) throw error;

      await activityLog("toggle_gateway_active", gateway.id, {
        is_active: !gateway.is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
    },
    onError: () => {
      toast.error("স্ট্যাটাস আপডেট করা যায়নি");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (gateway: PaymentGateway) => {
      const { error: clearError } = await supabase
        .from("payment_gateways")
        .update({
          is_default: false,
          updated_at: new Date().toISOString(),
        })
        .eq("environment", gateway.environment);
      if (clearError) throw clearError;

      const { error } = await supabase
        .from("payment_gateways")
        .update({
          is_default: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", gateway.id);
      if (error) throw error;

      await activityLog("set_default_gateway", gateway.id, {
        environment: gateway.environment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      toast.success("ডিফল্ট গেটওয়ে সেট হয়েছে");
    },
    onError: () => {
      toast.error("ডিফল্ট গেটওয়ে সেট করা যায়নি");
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (gateway: PaymentGateway) => {
      if (!gateway.api_base_url) {
        throw new Error("API Base URL সেট করা নেই");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(gateway.api_base_url, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        await activityLog("test_connection", gateway.id, {
          status: response.status,
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("রেসপন্স পেতে দেরি হচ্ছে");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("API কানেকশন সফল");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "API কানেকশন ব্যর্থ হয়েছে";
      toast.error(message);
    },
  });

  const sortedGateways = useMemo(() => {
    if (!gateways) return [];
    return [...gateways].sort((a, b) => {
      if (a.environment === b.environment) {
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;
        return a.created_at < b.created_at ? 1 : -1;
      }
      return a.environment < b.environment ? -1 : 1;
    });
  }, [gateways]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Payment Gateway Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            এক জায়গা থেকে সব পেমেন্ট গেটওয়ে কনফিগার ও ম্যানেজ করুন।
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          নতুন গেটওয়ে
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              সক্রিয় গেটওয়ে
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              একাধিক গেটওয়ে একই সঙ্গে সক্রিয় রাখতে পারবেন। ডিফল্ট গেটওয়ে অটো সিলেক্ট হবে।
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
          ) : !sortedGateways.length ? (
            <p className="text-sm text-muted-foreground">
              এখনো কোনো পেমেন্ট গেটওয়ে যোগ করা হয়নি।
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGateways.map((gateway) => (
                  <TableRow key={gateway.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{gateway.name}</span>
                          {gateway.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          )}
                          {gateway.is_default && (
                            <Badge className="text-xs">Default</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe2 className="h-3 w-3" />
                          {gateway.api_base_url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={gateway.environment === "live" ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        {gateway.environment === "live" ? "Live" : "Sandbox"}
                      </Badge>
                    </TableCell>
                    <TableCell>{gateway.currency}</TableCell>
                    <TableCell className="max-w-xs">
                      {gateway.webhook_url ? (
                        <span className="text-xs break-all">{gateway.webhook_url}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          এখনো জেনারেট হয়নি
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={gateway.is_active}
                        onCheckedChange={() => toggleActiveMutation.mutate(gateway)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant={gateway.is_default ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(gateway)}
                      >
                        {gateway.is_default ? "Default" : "Set Default"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => testConnectionMutation.mutate(gateway)}
                        disabled={testConnectionMutation.isLoading}
                      >
                        <RefreshCw className="h-3 w-3" />
                        Test
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(gateway)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "পেমেন্ট গেটওয়ে আপডেট করুন" : "নতুন পেমেন্ট গেটওয়ে"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gateway-name">Gateway Name</Label>
              <Input
                id="gateway-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="উদাহরণ: UddoktaPay, SSLCommerz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-base-url">API Base URL</Label>
              <Input
                id="api-base-url"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="https://example.com/api"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="public-key">Public Key</Label>
              <Input
                id="public-key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Public key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret-key">
                Secret Key
                <span className="ml-1 text-xs text-muted-foreground">
                  (সার্ভার-সাইড এনক্রিপশন কনফিগার করা জরুরি)
                </span>
              </Label>
              <Input
                id="secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder={editing && editing.secret_key_encrypted ? "Secret অপরিবর্তিত রাখতে ফাঁকা রাখুন" : "Secret key"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret</Label>
              <Input
                id="webhook-secret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder={editing && editing.webhook_secret_encrypted ? "Webhook secret অপরিবর্তিত রাখতে ফাঁকা রাখুন" : "Webhook signing secret"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="BDT"
                />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select
                  value={environment}
                  onValueChange={(value) =>
                    setEnvironment(value as Environment)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Environment নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <span className="text-sm">Default gateway</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              বাতিল
            </Button>
            <Button
              type="button"
              onClick={() => upsertMutation.mutate()}
              disabled={upsertMutation.isLoading}
            >
              {upsertMutation.isLoading
                ? "সংরক্ষণ হচ্ছে..."
                : editing
                ? "আপডেট করুন"
                : "সংরক্ষণ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentGateways;
