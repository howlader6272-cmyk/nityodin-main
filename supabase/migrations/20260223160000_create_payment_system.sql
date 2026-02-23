CREATE TYPE public.payment_transaction_status AS ENUM ('pending', 'success', 'failed', 'refunded', 'cancelled');

CREATE TYPE public.subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'expired');

CREATE TYPE public.subscription_interval AS ENUM ('monthly', 'yearly');

CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_base_url TEXT NOT NULL,
  public_key TEXT,
  secret_key_encrypted TEXT,
  webhook_secret_encrypted TEXT,
  webhook_url TEXT,
  currency TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment gateways"
ON public.payment_gateways
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE UNIQUE INDEX IF NOT EXISTS payment_gateways_default_per_env
ON public.payment_gateways(environment)
WHERE is_default = true;

CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status public.payment_transaction_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  provider_transaction_id TEXT,
  is_refunded BOOLEAN NOT NULL DEFAULT false,
  manual_approved BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  metadata JSONB,
  raw_request JSONB,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment transactions"
ON public.payment_transactions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX payment_transactions_order_id_idx
ON public.payment_transactions(order_id);

CREATE INDEX payment_transactions_status_idx
ON public.payment_transactions(status);

CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL,
  interval public.subscription_interval NOT NULL,
  interval_count INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscription plans"
ON public.subscription_plans
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  status public.subscription_status NOT NULL DEFAULT 'active',
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  last_payment_transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON public.subscriptions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX subscriptions_user_id_idx
ON public.subscriptions(user_id);

CREATE INDEX subscriptions_plan_id_idx
ON public.subscriptions(plan_id);

CREATE TABLE public.payment_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment activity logs"
ON public.payment_activity_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

