import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createChargeClientSide, verifyPaymentClientSide, type CreateChargeParams } from "@/lib/uddoktapay";

type PaymentMode = "client" | "server";

export function useUddoktaPay(mode: PaymentMode = "client") {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActiveGateway = async () => {
    const { data, error: fetchError } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    
    if (fetchError) {
      console.error("Failed to fetch active payment gateway:", fetchError);
      return null;
    }
    return data;
  };

  const createCharge = async (params: CreateChargeParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const gateway = await getActiveGateway();
      
      const config = gateway ? {
        apiBaseUrl: gateway.api_base_url,
        apiKey: gateway.secret_key_encrypted || "",
      } : undefined;

      if (mode === "client") {
        // Client-side API call
        const result = await createChargeClientSide({
          ...params,
          config
        });
        
        if (result.success && result.payment_url) {
          return { success: true, payment_url: result.payment_url };
        } else {
          setError(result.message || "Failed to create payment");
          return { success: false, message: result.message };
        }
      } else {
        // Server-side via Edge Function
        const { data, error: fnError } = await supabase.functions.invoke("uddoktapay-checkout", {
          body: {
            action: "create-charge",
            ...params,
            gatewayConfig: gateway // Pass the whole gateway config to edge function
          },
        });

        if (fnError) {
          setError(fnError.message);
          return { success: false, message: fnError.message };
        }

        if (data.success && data.payment_url) {
          return { success: true, payment_url: data.payment_url };
        } else {
          setError(data.message || "Failed to create payment");
          return { success: false, message: data.message };
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment error";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (invoiceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const gateway = await getActiveGateway();
      const config = gateway ? {
        apiBaseUrl: gateway.api_base_url,
        apiKey: gateway.secret_key_encrypted || "",
      } : undefined;

      if (mode === "client") {
        // Client-side verification
        const result = await verifyPaymentClientSide(invoiceId, config);
        return result;
      } else {
        // Server-side verification via Edge Function
        const { data, error: fnError } = await supabase.functions.invoke("uddoktapay-checkout", {
          body: {
            action: "verify-payment",
            invoiceId,
            gatewayConfig: gateway
          },
        });

        if (fnError) {
          setError(fnError.message);
          return { success: false, message: fnError.message };
        }

        return data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification error";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCharge,
    verifyPayment,
    isLoading,
    error,
  };
}
