export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string;
          event_additional_items: Json | null;
          event_celebration: string | null;
          event_city: string | null;
          event_date: string | null;
          event_description: string | null;
          event_enable_additional_items: boolean | null;
          event_end_time: string | null;
          event_guest_count: string | null;
          event_items: Json | null;
          event_location: string | null;
          event_name: string | null;
          event_start_time: string | null;
          event_state: string | null;
          event_street_address: string | null;
          event_zip_code: string | null;
          id: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_additional_items?: Json | null;
          event_celebration?: string | null;
          event_city?: string | null;
          event_date?: string | null;
          event_description?: string | null;
          event_enable_additional_items?: boolean | null;
          event_end_time?: string | null;
          event_guest_count?: string | null;
          event_items?: Json | null;
          event_location?: string | null;
          event_name?: string | null;
          event_start_time?: string | null;
          event_state?: string | null;
          event_street_address?: string | null;
          event_zip_code?: string | null;
          id?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_additional_items?: Json | null;
          event_celebration?: string | null;
          event_city?: string | null;
          event_date?: string | null;
          event_description?: string | null;
          event_enable_additional_items?: boolean | null;
          event_end_time?: string | null;
          event_guest_count?: string | null;
          event_items?: Json | null;
          event_location?: string | null;
          event_name?: string | null;
          event_start_time?: string | null;
          event_state?: string | null;
          event_street_address?: string | null;
          event_zip_code?: string | null;
          id?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      listing_images: {
        Row: {
          caption: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          image_url: string;
          is_primary: boolean | null;
          listing_id: string;
        };
        Insert: {
          caption?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url: string;
          is_primary?: boolean | null;
          listing_id: string;
        };
        Update: {
          caption?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string;
          is_primary?: boolean | null;
          listing_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "active_listings_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      listing_views: {
        Row: {
          id: string;
          ip_address: unknown | null;
          listing_id: string;
          user_agent: string | null;
          viewed_at: string | null;
          viewer_id: string | null;
        };
        Insert: {
          id?: string;
          ip_address?: unknown | null;
          listing_id: string;
          user_agent?: string | null;
          viewed_at?: string | null;
          viewer_id?: string | null;
        };
        Update: {
          id?: string;
          ip_address?: unknown | null;
          listing_id?: string;
          user_agent?: string | null;
          viewed_at?: string | null;
          viewer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "listing_views_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "active_listings_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_views_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      listings: {
        Row: {
          agent_email: string;
          agent_name: string;
          agent_phone: string;
          annual_tax_amount: number | null;
          bathrooms: number;
          bedrooms: number;
          brokerage: string | null;
          city: string;
          created_at: string | null;
          created_by: string | null;
          description: string;
          garage_spaces: number | null;
          half_bathrooms: number | null;
          has_attic: boolean | null;
          has_basement: boolean | null;
          has_central_air: boolean | null;
          has_central_heat: boolean | null;
          has_fireplace: boolean | null;
          has_hardwood_floors: boolean | null;
          has_hottub: boolean | null;
          has_pool: boolean | null;
          highlights: string | null;
          hoa_fees: number | null;
          id: string;
          latitude: number | null;
          listing_type: string;
          longitude: number | null;
          lot_size: number | null;
          mls_number: string | null;
          neighborhood: string | null;
          price: number;
          property_type: string;
          square_feet: number;
          state: string;
          status: string | null;
          stories: number | null;
          street_address: string;
          title: string;
          updated_at: string | null;
          virtual_tour_url: string | null;
          year_built: number | null;
          zip_code: string;
        };
        Insert: {
          agent_email: string;
          agent_name: string;
          agent_phone: string;
          annual_tax_amount?: number | null;
          bathrooms: number;
          bedrooms: number;
          brokerage?: string | null;
          city: string;
          created_at?: string | null;
          created_by?: string | null;
          description: string;
          garage_spaces?: number | null;
          half_bathrooms?: number | null;
          has_attic?: boolean | null;
          has_basement?: boolean | null;
          has_central_air?: boolean | null;
          has_central_heat?: boolean | null;
          has_fireplace?: boolean | null;
          has_hardwood_floors?: boolean | null;
          has_hottub?: boolean | null;
          has_pool?: boolean | null;
          highlights?: string | null;
          hoa_fees?: number | null;
          id?: string;
          latitude?: number | null;
          listing_type: string;
          longitude?: number | null;
          lot_size?: number | null;
          mls_number?: string | null;
          neighborhood?: string | null;
          price: number;
          property_type: string;
          square_feet: number;
          state: string;
          status?: string | null;
          stories?: number | null;
          street_address: string;
          title: string;
          updated_at?: string | null;
          virtual_tour_url?: string | null;
          year_built?: number | null;
          zip_code: string;
        };
        Update: {
          agent_email?: string;
          agent_name?: string;
          agent_phone?: string;
          annual_tax_amount?: number | null;
          bathrooms?: number;
          bedrooms?: number;
          brokerage?: string | null;
          city?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          garage_spaces?: number | null;
          half_bathrooms?: number | null;
          has_attic?: boolean | null;
          has_basement?: boolean | null;
          has_central_air?: boolean | null;
          has_central_heat?: boolean | null;
          has_fireplace?: boolean | null;
          has_hardwood_floors?: boolean | null;
          has_hottub?: boolean | null;
          has_pool?: boolean | null;
          highlights?: string | null;
          hoa_fees?: number | null;
          id?: string;
          latitude?: number | null;
          listing_type?: string;
          longitude?: number | null;
          lot_size?: number | null;
          mls_number?: string | null;
          neighborhood?: string | null;
          price?: number;
          property_type?: string;
          square_feet?: number;
          state?: string;
          status?: string | null;
          stories?: number | null;
          street_address?: string;
          title?: string;
          updated_at?: string | null;
          virtual_tour_url?: string | null;
          year_built?: number | null;
          zip_code?: string;
        };
        Relationships: [];
      };
      portals_client_users: {
        Row: {
          auth_user_id: string | null;
          avatar_url: string | null;
          client_id: string;
          created_at: string | null;
          created_by: string;
          email: string;
          email_notifications_enabled: boolean;
          id: string;
          invite_accepted_at: string | null;
          invite_sent_at: string | null;
          invite_token: string | null;
          job_title: string | null;
          last_login_at: string | null;
          name: string;
          notification_preferences: Json | null;
          organization_id: string;
          phone: string | null;
          portal_access_enabled: boolean;
          portal_last_accessed_at: string | null;
          role: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          auth_user_id?: string | null;
          avatar_url?: string | null;
          client_id: string;
          created_at?: string | null;
          created_by: string;
          email: string;
          email_notifications_enabled?: boolean;
          id?: string;
          invite_accepted_at?: string | null;
          invite_sent_at?: string | null;
          invite_token?: string | null;
          job_title?: string | null;
          last_login_at?: string | null;
          name: string;
          notification_preferences?: Json | null;
          organization_id: string;
          phone?: string | null;
          portal_access_enabled?: boolean;
          portal_last_accessed_at?: string | null;
          role?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          auth_user_id?: string | null;
          avatar_url?: string | null;
          client_id?: string;
          created_at?: string | null;
          created_by?: string;
          email?: string;
          email_notifications_enabled?: boolean;
          id?: string;
          invite_accepted_at?: string | null;
          invite_sent_at?: string | null;
          invite_token?: string | null;
          job_title?: string | null;
          last_login_at?: string | null;
          name?: string;
          notification_preferences?: Json | null;
          organization_id?: string;
          phone?: string | null;
          portal_access_enabled?: boolean;
          portal_last_accessed_at?: string | null;
          role?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "portals_client_users_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "portals_clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "portals_client_users_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "portals_organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      portals_clients: {
        Row: {
          address: Json | null;
          company_name: string;
          created_at: string | null;
          created_by: string;
          custom_fields: Json | null;
          email: string;
          id: string;
          logo_url: string | null;
          notes: string | null;
          organization_id: string;
          phone: string | null;
          status: string;
          tags: string[] | null;
          updated_at: string | null;
          updated_by: string | null;
          website: string | null;
        };
        Insert: {
          address?: Json | null;
          company_name: string;
          created_at?: string | null;
          created_by: string;
          custom_fields?: Json | null;
          email: string;
          id?: string;
          logo_url?: string | null;
          notes?: string | null;
          organization_id: string;
          phone?: string | null;
          status?: string;
          tags?: string[] | null;
          updated_at?: string | null;
          updated_by?: string | null;
          website?: string | null;
        };
        Update: {
          address?: Json | null;
          company_name?: string;
          created_at?: string | null;
          created_by?: string;
          custom_fields?: Json | null;
          email?: string;
          id?: string;
          logo_url?: string | null;
          notes?: string | null;
          organization_id?: string;
          phone?: string | null;
          status?: string;
          tags?: string[] | null;
          updated_at?: string | null;
          updated_by?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "portals_clients_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "portals_organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      portals_organizations: {
        Row: {
          created_at: string | null;
          custom_domain: string | null;
          email_from_name: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          onboarding_completed: boolean | null;
          onboarding_step: number | null;
          owner_clerk_id: string;
          owner_email: string;
          owner_name: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          slug: string;
          storage_limit_bytes: number;
          storage_used_bytes: number;
          stripe_customer_id: string | null;
          subscription_status: string | null;
          subscription_tier: string | null;
          trial_ends_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          custom_domain?: string | null;
          email_from_name?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          onboarding_completed?: boolean | null;
          onboarding_step?: number | null;
          owner_clerk_id: string;
          owner_email: string;
          owner_name?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          slug: string;
          storage_limit_bytes?: number;
          storage_used_bytes?: number;
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          custom_domain?: string | null;
          email_from_name?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          onboarding_completed?: boolean | null;
          onboarding_step?: number | null;
          owner_clerk_id?: string;
          owner_email?: string;
          owner_name?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          slug?: string;
          storage_limit_bytes?: number;
          storage_used_bytes?: number;
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      stl_directory_businesses: {
        Row: {
          average_rating: number | null;
          banner_image_url: string | null;
          business_address: string | null;
          business_category: string;
          business_category_slug: string | null;
          business_city: string | null;
          business_description: string;
          business_email: string | null;
          business_meta: Json | null;
          business_name: string;
          business_phone: string | null;
          business_state: string | null;
          business_website: string | null;
          business_zip: string | null;
          clerk_id: string;
          created_at: string | null;
          gallery_images: Json | null;
          hours_of_operation: Json | null;
          id: string;
          is_active: boolean | null;
          is_featured: boolean | null;
          is_verified: boolean | null;
          latitude: number | null;
          logo_url: string | null;
          longitude: number | null;
          review_count: number | null;
          search_vector: unknown | null;
          social_media: Json | null;
          updated_at: string | null;
          view_count: number | null;
          year_established: number | null;
        };
        Insert: {
          average_rating?: number | null;
          banner_image_url?: string | null;
          business_address?: string | null;
          business_category: string;
          business_category_slug?: string | null;
          business_city?: string | null;
          business_description: string;
          business_email?: string | null;
          business_meta?: Json | null;
          business_name: string;
          business_phone?: string | null;
          business_state?: string | null;
          business_website?: string | null;
          business_zip?: string | null;
          clerk_id: string;
          created_at?: string | null;
          gallery_images?: Json | null;
          hours_of_operation?: Json | null;
          id?: string;
          is_active?: boolean | null;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          latitude?: number | null;
          logo_url?: string | null;
          longitude?: number | null;
          review_count?: number | null;
          search_vector?: unknown | null;
          social_media?: Json | null;
          updated_at?: string | null;
          view_count?: number | null;
          year_established?: number | null;
        };
        Update: {
          average_rating?: number | null;
          banner_image_url?: string | null;
          business_address?: string | null;
          business_category?: string;
          business_category_slug?: string | null;
          business_city?: string | null;
          business_description?: string;
          business_email?: string | null;
          business_meta?: Json | null;
          business_name?: string;
          business_phone?: string | null;
          business_state?: string | null;
          business_website?: string | null;
          business_zip?: string | null;
          clerk_id?: string;
          created_at?: string | null;
          gallery_images?: Json | null;
          hours_of_operation?: Json | null;
          id?: string;
          is_active?: boolean | null;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          latitude?: number | null;
          logo_url?: string | null;
          longitude?: number | null;
          review_count?: number | null;
          search_vector?: unknown | null;
          social_media?: Json | null;
          updated_at?: string | null;
          view_count?: number | null;
          year_established?: number | null;
        };
        Relationships: [];
      };
      stl_directory_contact_form: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          message: string | null;
          name: string | null;
          phone: string | null;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      stl_directory_favorites: {
        Row: {
          business_id: string | null;
          clerk_id: string | null;
          created_at: string;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          business_id?: string | null;
          clerk_id?: string | null;
          created_at?: string;
          id?: number;
          updated_at?: string | null;
        };
        Update: {
          business_id?: string | null;
          clerk_id?: string | null;
          created_at?: string;
          id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stl_directory_favorites_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "stl_directory_businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      stl_directory_reviews: {
        Row: {
          admin_notes: string | null;
          business_id: string;
          clerk_id: string;
          created_at: string;
          helpful_count: number | null;
          id: string;
          is_approved: boolean | null;
          is_featured: boolean | null;
          is_verified: boolean | null;
          rating: number;
          reported_count: number | null;
          review_content: string;
          review_images: string[] | null;
          review_meta: Json | null;
          review_title: string | null;
          reviewer_avatar_url: string | null;
          reviewer_email: string | null;
          reviewer_first_name: string | null;
          reviewer_last_name: string | null;
          reviewer_name: string;
          reviewer_username: string | null;
          search_vector: unknown | null;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          business_id: string;
          clerk_id: string;
          created_at?: string;
          helpful_count?: number | null;
          id?: string;
          is_approved?: boolean | null;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          rating: number;
          reported_count?: number | null;
          review_content: string;
          review_images?: string[] | null;
          review_meta?: Json | null;
          review_title?: string | null;
          reviewer_avatar_url?: string | null;
          reviewer_email?: string | null;
          reviewer_first_name?: string | null;
          reviewer_last_name?: string | null;
          reviewer_name: string;
          reviewer_username?: string | null;
          search_vector?: unknown | null;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          business_id?: string;
          clerk_id?: string;
          created_at?: string;
          helpful_count?: number | null;
          id?: string;
          is_approved?: boolean | null;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          rating?: number;
          reported_count?: number | null;
          review_content?: string;
          review_images?: string[] | null;
          review_meta?: Json | null;
          review_title?: string | null;
          reviewer_avatar_url?: string | null;
          reviewer_email?: string | null;
          reviewer_first_name?: string | null;
          reviewer_last_name?: string | null;
          reviewer_name?: string;
          reviewer_username?: string | null;
          search_vector?: unknown | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stl_directory_reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "stl_directory_businesses";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      active_listings_view: {
        Row: {
          agent_email: string | null;
          agent_name: string | null;
          agent_phone: string | null;
          annual_tax_amount: number | null;
          bathrooms: number | null;
          bed_bath_text: string | null;
          bedrooms: number | null;
          brokerage: string | null;
          city: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          formatted_price: string | null;
          formatted_sqft: string | null;
          garage_spaces: number | null;
          half_bathrooms: number | null;
          has_attic: boolean | null;
          has_basement: boolean | null;
          has_central_air: boolean | null;
          has_central_heat: boolean | null;
          has_fireplace: boolean | null;
          has_hardwood_floors: boolean | null;
          has_hottub: boolean | null;
          has_pool: boolean | null;
          highlights: string | null;
          hoa_fees: number | null;
          id: string | null;
          latitude: number | null;
          listing_type: string | null;
          longitude: number | null;
          lot_size: number | null;
          mls_number: string | null;
          neighborhood: string | null;
          price: number | null;
          property_type: string | null;
          square_feet: number | null;
          state: string | null;
          status: string | null;
          stories: number | null;
          street_address: string | null;
          title: string | null;
          updated_at: string | null;
          virtual_tour_url: string | null;
          year_built: number | null;
          zip_code: string | null;
        };
        Insert: {
          agent_email?: string | null;
          agent_name?: string | null;
          agent_phone?: string | null;
          annual_tax_amount?: number | null;
          bathrooms?: number | null;
          bed_bath_text?: never;
          bedrooms?: number | null;
          brokerage?: string | null;
          city?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          formatted_price?: never;
          formatted_sqft?: never;
          garage_spaces?: number | null;
          half_bathrooms?: number | null;
          has_attic?: boolean | null;
          has_basement?: boolean | null;
          has_central_air?: boolean | null;
          has_central_heat?: boolean | null;
          has_fireplace?: boolean | null;
          has_hardwood_floors?: boolean | null;
          has_hottub?: boolean | null;
          has_pool?: boolean | null;
          highlights?: string | null;
          hoa_fees?: number | null;
          id?: string | null;
          latitude?: number | null;
          listing_type?: string | null;
          longitude?: number | null;
          lot_size?: number | null;
          mls_number?: string | null;
          neighborhood?: string | null;
          price?: number | null;
          property_type?: string | null;
          square_feet?: number | null;
          state?: string | null;
          status?: string | null;
          stories?: number | null;
          street_address?: string | null;
          title?: string | null;
          updated_at?: string | null;
          virtual_tour_url?: string | null;
          year_built?: number | null;
          zip_code?: string | null;
        };
        Update: {
          agent_email?: string | null;
          agent_name?: string | null;
          agent_phone?: string | null;
          annual_tax_amount?: number | null;
          bathrooms?: number | null;
          bed_bath_text?: never;
          bedrooms?: number | null;
          brokerage?: string | null;
          city?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          formatted_price?: never;
          formatted_sqft?: never;
          garage_spaces?: number | null;
          half_bathrooms?: number | null;
          has_attic?: boolean | null;
          has_basement?: boolean | null;
          has_central_air?: boolean | null;
          has_central_heat?: boolean | null;
          has_fireplace?: boolean | null;
          has_hardwood_floors?: boolean | null;
          has_hottub?: boolean | null;
          has_pool?: boolean | null;
          highlights?: string | null;
          hoa_fees?: number | null;
          id?: string | null;
          latitude?: number | null;
          listing_type?: string | null;
          longitude?: number | null;
          lot_size?: number | null;
          mls_number?: string | null;
          neighborhood?: string | null;
          price?: number | null;
          property_type?: string | null;
          square_feet?: number | null;
          state?: string | null;
          status?: string | null;
          stories?: number | null;
          street_address?: string | null;
          title?: string | null;
          updated_at?: string | null;
          virtual_tour_url?: string | null;
          year_built?: number | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      specialty_type:
        | "portrait"
        | "wedding"
        | "event"
        | "family"
        | "newborn"
        | "maternity"
        | "headshot"
        | "product"
        | "real-estate"
        | "commercial"
        | "boudoir"
        | "food"
        | "fine-art";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      specialty_type: [
        "portrait",
        "wedding",
        "event",
        "family",
        "newborn",
        "maternity",
        "headshot",
        "product",
        "real-estate",
        "commercial",
        "boudoir",
        "food",
        "fine-art",
      ],
    },
  },
} as const;
