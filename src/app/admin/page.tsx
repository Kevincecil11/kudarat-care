import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getPosts, getProducts, getReviews } from "@/lib/repository";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const [products, posts, reviews] = await Promise.all([getProducts(), getPosts(), getReviews()]);
  return (
    <section className="section section--tight">
      <div className="wrap">
        <AdminDashboard products={products} posts={posts} reviews={reviews} />
      </div>
    </section>
  );
}
