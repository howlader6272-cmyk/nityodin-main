-- Fix missing INSERT policy for order_items
CREATE POLICY "Anyone can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Ensure orders can be inserted by anyone (already exists, but just for safety)
-- CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Ensure users can view their own order items
-- (Updating existing policy to be more robust)
DROP POLICY IF EXISTS "Order items follow order access" ON public.order_items;
CREATE POLICY "Order items follow order access"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
);
