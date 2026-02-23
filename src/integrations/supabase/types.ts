export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          area: string | null
          city: string
          created_at: string
          delivery_zone_id: string | null
          full_name: string
          id: string
          is_default: boolean | null
          label: string | null
          phone: string
          postal_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          area?: string | null
          city: string
          created_at?: string
          delivery_zone_id?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone: string
          postal_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          area?: string | null
          city?: string
          created_at?: string
          delivery_zone_id?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone?: string
          postal_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          position: string | null
          sort_order: number | null
          subtitle: string | null
          subtitle_bn: string | null
          title: string | null
          title_bn: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          subtitle?: string | null
          subtitle_bn?: string | null
          title?: string | null
          title_bn?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          subtitle?: string | null
          subtitle_bn?: string | null
          title?: string | null
          title_bn?: string | null
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          created_at: string
          id: string
          image_path: string
          focus_x: number | null
          focus_y: number | null
          zoom: number | null
          is_active: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          focus_x?: number | null
          focus_y?: number | null
          zoom?: number | null
          is_active?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          focus_x?: number | null
          focus_y?: number | null
          zoom?: number | null
          is_active?: boolean | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          description_bn: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          name_bn: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          name_bn: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          name_bn?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          sender_type: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          sender_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          sender_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_order_amount: number | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          charge: number
          created_at: string
          estimated_days: number | null
          id: string
          is_active: boolean | null
          min_order_free_delivery: number | null
          name: string
          name_bn: string
        }
        Insert: {
          charge: number
          created_at?: string
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          min_order_free_delivery?: number | null
          name: string
          name_bn: string
        }
        Update: {
          charge?: number
          created_at?: string
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          min_order_free_delivery?: number | null
          name?: string
          name_bn?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: Json | null
          id: string
          is_active: boolean | null
          section_key: string
          subtitle: string | null
          subtitle_bn: string | null
          title: string | null
          title_bn: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          id?: string
          is_active?: boolean | null
          section_key: string
          subtitle?: string | null
          subtitle_bn?: string | null
          title?: string | null
          title_bn?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          id?: string
          is_active?: boolean | null
          section_key?: string
          subtitle?: string | null
          subtitle_bn?: string | null
          title?: string | null
          title_bn?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      incomplete_orders: {
        Row: {
          cart_data: Json | null
          converted_order_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_zone_id: string | null
          id: string
          is_converted: boolean | null
          last_updated_at: string
          notes: string | null
          session_id: string | null
          shipping_address: string | null
          shipping_area: string | null
          shipping_city: string | null
          user_id: string | null
        }
        Insert: {
          cart_data?: Json | null
          converted_order_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_zone_id?: string | null
          id?: string
          is_converted?: boolean | null
          last_updated_at?: string
          notes?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_area?: string | null
          shipping_city?: string | null
          user_id?: string | null
        }
        Update: {
          cart_data?: Json | null
          converted_order_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_zone_id?: string | null
          id?: string
          is_converted?: boolean | null
          last_updated_at?: string
          notes?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_area?: string | null
          shipping_city?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incomplete_orders_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incomplete_orders_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          courier_name: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
          tracking_number: string | null
          tracking_url: string | null
        }
        Insert: {
          courier_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
          tracking_number?: string | null
          tracking_url?: string | null
        }
        Update: {
          courier_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          tracking_number?: string | null
          tracking_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          courier_sent_at: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_charge: number | null
          delivery_zone_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          partial_payment_amount: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipping_address: string
          shipping_area: string | null
          shipping_city: string
          shipping_postal_code: string | null
          steadfast_consignment_id: string | null
          steadfast_status: string | null
          steadfast_tracking_code: string | null
          subtotal: number
          total_amount: number
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          courier_sent_at?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_charge?: number | null
          delivery_zone_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number: string
          order_status?: Database["public"]["Enums"]["order_status"]
          partial_payment_amount?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address: string
          shipping_area?: string | null
          shipping_city: string
          shipping_postal_code?: string | null
          steadfast_consignment_id?: string | null
          steadfast_status?: string | null
          steadfast_tracking_code?: string | null
          subtotal: number
          total_amount: number
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          courier_sent_at?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_charge?: number | null
          delivery_zone_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          partial_payment_amount?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: string
          shipping_area?: string | null
          shipping_city?: string
          shipping_postal_code?: string | null
          steadfast_consignment_id?: string | null
          steadfast_status?: string | null
          steadfast_tracking_code?: string | null
          subtotal?: number
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          gateway_id: string | null
          id: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          gateway_id?: string | null
          id?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          gateway_id?: string | null
          id?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          api_base_url: string
          created_at: string
          currency: string
          environment: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          public_key: string | null
          secret_key_encrypted: string | null
          webhook_secret_encrypted: string | null
          webhook_url: string | null
          updated_at: string
        }
        Insert: {
          api_base_url: string
          created_at?: string
          currency: string
          environment?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          public_key?: string | null
          secret_key_encrypted?: string | null
          webhook_secret_encrypted?: string | null
          webhook_url?: string | null
          updated_at?: string
        }
        Update: {
          api_base_url?: string
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          public_key?: string | null
          secret_key_encrypted?: string | null
          webhook_secret_encrypted?: string | null
          webhook_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          error_message: string | null
          gateway_id: string | null
          id: string
          is_refunded: boolean
          manual_approved: boolean
          metadata: Json | null
          order_id: string | null
          payment_method: string | null
          provider_transaction_id: string | null
          raw_request: Json | null
          raw_response: Json | null
          status: Database["public"]["Enums"]["payment_transaction_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          error_message?: string | null
          gateway_id?: string | null
          id?: string
          is_refunded?: boolean
          manual_approved?: boolean
          metadata?: Json | null
          order_id?: string | null
          payment_method?: string | null
          provider_transaction_id?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          status?: Database["public"]["Enums"]["payment_transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway_id?: string | null
          id?: string
          is_refunded?: boolean
          manual_approved?: boolean
          metadata?: Json | null
          order_id?: string | null
          payment_method?: string | null
          provider_transaction_id?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          status?: Database["public"]["Enums"]["payment_transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["subscription_interval"]
          interval_count: number
          is_active: boolean
          metadata: Json | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency: string
          description?: string | null
          id?: string
          interval: Database["public"]["Enums"]["subscription_interval"]
          interval_count?: number
          is_active?: boolean
          metadata?: Json | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["subscription_interval"]
          interval_count?: number
          is_active?: boolean
          metadata?: Json | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          last_payment_transaction_id: string | null
          metadata: Json | null
          plan_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          ended_at?: string | null
          id?: string
          last_payment_transaction_id?: string | null
          metadata?: Json | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          last_payment_transaction_id?: string | null
          metadata?: Json | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_last_payment_transaction_id_fkey"
            columns: ["last_payment_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      page_contents: {
        Row: {
          content: Json | null
          id: string
          page_key: string
          title: string
          title_bn: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          id?: string
          page_key: string
          title: string
          title_bn?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          id?: string
          page_key?: string
          title?: string
          title_bn?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          name_bn: string
          price: number
          product_id: string
          sale_price: number | null
          sku: string | null
          stock_quantity: number | null
          weight_unit: string | null
          weight_value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          name_bn: string
          price: number
          product_id: string
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          weight_unit?: string | null
          weight_value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          name_bn?: string
          price?: number
          product_id?: string
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          weight_unit?: string | null
          weight_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          name_bn: string
          sale_price: number | null
          sku: string | null
          slug: string
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          name_bn: string
          sale_price?: number | null
          sku?: string | null
          slug: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          name_bn?: string
          sale_price?: number | null
          sku?: string | null
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quantity_discounts: {
        Row: {
          created_at: string
          discount_percentage: number
          id: string
          is_active: boolean | null
          min_quantity: number
        }
        Insert: {
          created_at?: string
          discount_percentage: number
          id?: string
          is_active?: boolean | null
          min_quantity: number
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          id?: string
          is_active?: boolean | null
          min_quantity?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          is_approved: boolean | null
          product_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name: string
          id?: string
          is_approved?: boolean | null
          product_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          is_approved?: boolean | null
          product_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          announcement_text: string | null
          countdown_end: string | null
          cta_link: string | null
          cta_text: string | null
          custom_scripts: string | null
          custom_head_scripts: string | null
          facebook_link: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_dark_mode: boolean | null
          logo_url: string | null
          meta_keywords: string | null
          meta_pixel_id: string | null
          og_image_url: string | null
          popup_enabled: boolean | null
          popup_image_url: string | null
          popup_text: string | null
          phone_number: string | null
          primary_color: string | null
          testimonial_json: Json | null
          footer_copyright: string | null
          show_testimonials: boolean | null
          show_promo_bar: boolean | null
          show_faq_link: boolean | null
          site_description: string | null
          site_title: string | null
          whatsapp_number: string | null
        }
        Insert: {
          announcement_text?: string | null
          countdown_end?: string | null
          cta_link?: string | null
          cta_text?: string | null
          custom_scripts?: string | null
          custom_head_scripts?: string | null
          facebook_link?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_dark_mode?: boolean | null
          logo_url?: string | null
          meta_keywords?: string | null
          meta_pixel_id?: string | null
          og_image_url?: string | null
          popup_enabled?: boolean | null
          popup_image_url?: string | null
          popup_text?: string | null
          phone_number?: string | null
          primary_color?: string | null
          testimonial_json?: Json | null
          footer_copyright?: string | null
          show_testimonials?: boolean | null
          show_promo_bar?: boolean | null
          show_faq_link?: boolean | null
          site_description?: string | null
          site_title?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          announcement_text?: string | null
          countdown_end?: string | null
          cta_link?: string | null
          cta_text?: string | null
          custom_scripts?: string | null
          custom_head_scripts?: string | null
          facebook_link?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_dark_mode?: boolean | null
          logo_url?: string | null
          meta_keywords?: string | null
          meta_pixel_id?: string | null
          og_image_url?: string | null
          popup_enabled?: boolean | null
          popup_image_url?: string | null
          popup_text?: string | null
          phone_number?: string | null
          primary_color?: string | null
          testimonial_json?: Json | null
          footer_copyright?: string | null
          show_testimonials?: boolean | null
          show_promo_bar?: boolean | null
          show_faq_link?: boolean | null
          site_description?: string | null
          site_title?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string | null
          customer_name: string
          id: string
          is_active: boolean | null
          product_name: string | null
          rating: number | null
          sort_order: number | null
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string | null
          customer_name: string
          id?: string
          is_active?: boolean | null
          product_name?: string | null
          rating?: number | null
          sort_order?: number | null
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string | null
          customer_name?: string
          id?: string
          is_active?: boolean | null
          product_name?: string | null
          rating?: number | null
          sort_order?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "staff" | "user"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_method: "cod" | "uddoktapay" | "bkash" | "nagad"
      payment_status: "unpaid" | "partial" | "paid" | "refunded"
      payment_transaction_status: "pending" | "success" | "failed" | "refunded" | "cancelled"
      subscription_interval: "monthly" | "yearly"
      subscription_status: "active" | "past_due" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "staff", "user"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_method: ["cod", "uddoktapay", "bkash", "nagad"],
      payment_status: ["unpaid", "partial", "paid", "refunded"],
      payment_transaction_status: ["pending", "success", "failed", "refunded", "cancelled"],
      subscription_interval: ["monthly", "yearly"],
      subscription_status: ["active", "past_due", "cancelled", "expired"],
    },
  },
} as const
