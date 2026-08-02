"use client";

import { supabase } from "@/lib/supabase";

/** Fetch dashboard stats from Supabase */
export async function getDashboardStats() {
  const [products, orders, testimonials, blogPosts] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
  ]);

  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    testimonials: testimonials.count ?? 0,
    blogPosts: blogPosts.count ?? 0,
  };
}

/** Fetch all products */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Create a product */
export async function createProduct(product: Record<string, unknown>) {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

/** Update a product */
export async function updateProduct(slug: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Delete a product */
export async function deleteProduct(slug: string) {
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) throw error;
}

/** Fetch all orders */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch all categories */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/** Fetch all blog posts */
export async function fetchBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
