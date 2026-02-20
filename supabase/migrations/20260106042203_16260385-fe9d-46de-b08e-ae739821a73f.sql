-- Add admin role for ifterahman.web@gmail.com (idempotent by email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'ifterahman.web@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
