"use client";
import { useMemo, useState, type FormEvent } from "react";
import type { JournalPost, Product, Review } from "@/lib/types";
import { site } from "@/lib/site";
import { Icon, type IconName } from "../Icon";

type Section = "overview" | "products" | "orders" | "reviews" | "journal" | "rewards" | "enquiries" | "settings";

const sections: { id: Section; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "products", label: "Products & stock", icon: "box" },
  { id: "orders", label: "Orders", icon: "bag" },
  { id: "reviews", label: "Reviews", icon: "star" },
  { id: "journal", label: "Journal", icon: "book" },
  { id: "rewards", label: "KC Circle", icon: "gift" },
  { id: "enquiries", label: "Enquiries", icon: "inbox" },
  { id: "settings", label: "Site settings", icon: "settings" },
];

type PendingReview = Review & { status: "pending" | "approved" | "rejected"; productName: string };

export function AdminDashboard({ products, posts, reviews }: { products: Product[]; posts: JournalPost[]; reviews: Review[] }) {
  const [section, setSection] = useState<Section>("overview");
  const [rows, setRows] = useState(products.map((p) => ({ slug: p.slug, name: p.name, subCategory: p.subCategory, price: p.price, mrp: p.mrp, stock: p.stock, active: true })));
  const [queue, setQueue] = useState<PendingReview[]>(
    reviews.map((r, i) => ({ ...r, status: i === 0 ? "approved" : "pending", productName: products.find((p) => p.slug === r.productSlug)?.name ?? "General" })),
  );
  const [postList, setPostList] = useState(posts.map((p) => ({ slug: p.slug, title: p.title, category: p.category, date: p.date, published: true })));
  const [saved, setSaved] = useState<string | null>(null);

  const flash = (msg: string) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(null), 2400);
  };

  const lowStock = useMemo(() => rows.filter((r) => r.stock < 10), [rows]);
  const pendingCount = queue.filter((q) => q.status === "pending").length;

  const updateRow = (slug: string, key: "price" | "mrp" | "stock", value: number) =>
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, [key]: Number.isFinite(value) ? Math.max(0, value) : 0 } : r)));

  const addProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    if (!name) return;
    setRows((prev) => [
      { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, subCategory: String(f.get("sub") ?? ""), price: Number(f.get("price")), mrp: Number(f.get("mrp")), stock: Number(f.get("stock")), active: true },
      ...prev,
    ]);
    e.currentTarget.reset();
    flash("Product added (preview only)");
  };

  const addPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") ?? "").trim();
    if (!title) return;
    setPostList((prev) => [{ slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title, category: String(f.get("category")) as JournalPost["category"], date: new Date().toISOString().slice(0, 10), published: f.get("publish") === "on" }, ...prev]);
    e.currentTarget.reset();
    flash("Article saved (preview only)");
  };

  return (
    <div className="admin">
      <aside className="admin__side" aria-label="Admin sections">
        <p className="admin__brand">KudaratCare Admin</p>
        <nav>
          {sections.map((s) => (
            <button key={s.id} type="button" className={section === s.id ? "is-active" : undefined} aria-current={section === s.id ? "page" : undefined} onClick={() => setSection(s.id)}>
              <Icon name={s.icon} size={18} />
              <span>{s.label}</span>
              {s.id === "reviews" && pendingCount ? <span className="badge badge--inline">{pendingCount}</span> : null}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin__main">
        <p className="notice">Preview dashboard. Changes are not saved yet. In Phase 2 every section reads and writes Supabase, and access is limited to KudaratCare admin accounts.</p>

        {section === "overview" ? (
          <>
            <h1>Good day.</h1>
            <div className="stats">
              <div className="stat">
                <span>Products</span>
                <b>{rows.length}</b>
              </div>
              <div className="stat">
                <span>Low or out of stock</span>
                <b>{lowStock.length}</b>
              </div>
              <div className="stat">
                <span>Reviews to approve</span>
                <b>{pendingCount}</b>
              </div>
              <div className="stat">
                <span>Orders today</span>
                <b>0</b>
              </div>
            </div>
            <div className="card">
              <h2>Needs attention</h2>
              {lowStock.length ? (
                <ul className="plain-list">
                  {lowStock.map((r) => (
                    <li key={r.slug}>
                      {r.name} <span className="tag">{r.stock === 0 ? "Out of stock" : `${r.stock} left`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Everything looks good.</p>
              )}
            </div>
          </>
        ) : null}

        {section === "products" ? (
          <>
            <h1>Products & stock</h1>
            <div className="table-wrap card">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">MRP (₹)</th>
                    <th scope="col">Price (₹)</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Visible</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.slug}>
                      <th scope="row">
                        {r.name}
                        <small>{r.subCategory}</small>
                      </th>
                      <td>
                        <input className="input input--sm" type="number" min={0} aria-label={`MRP for ${r.name}`} value={r.mrp} onChange={(e) => updateRow(r.slug, "mrp", e.target.valueAsNumber)} />
                      </td>
                      <td>
                        <input className="input input--sm" type="number" min={0} aria-label={`Price for ${r.name}`} value={r.price} onChange={(e) => updateRow(r.slug, "price", e.target.valueAsNumber)} />
                      </td>
                      <td>
                        <input className={r.stock < 10 ? "input input--sm is-warn" : "input input--sm"} type="number" min={0} aria-label={`Stock for ${r.name}`} value={r.stock} onChange={(e) => updateRow(r.slug, "stock", e.target.valueAsNumber)} />
                      </td>
                      <td>
                        <label className="switch">
                          <input type="checkbox" checked={r.active} onChange={(e) => setRows((prev) => prev.map((x) => (x.slug === r.slug ? { ...x, active: e.target.checked } : x)))} />
                          <span className="sr-only">Show {r.name} on the website</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => flash("Prices and stock saved (preview only)")}>
              Save changes
            </button>
            <form className="card form" onSubmit={addProduct}>
              <h2 className="form__title">Add a product</h2>
              <p className="muted">Matches the columns in the product Excel sheet. Bulk import from the sheet is also supported in Phase 2.</p>
              <div className="form__grid">
                <div className="field">
                  <label htmlFor="ap-name">Product name</label>
                  <input id="ap-name" name="name" className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="ap-sub">Category / sub-category</label>
                  <input id="ap-sub" name="sub" className="input" required placeholder="e.g. Skin care / Serums" />
                </div>
                <div className="field">
                  <label htmlFor="ap-mrp">MRP (₹)</label>
                  <input id="ap-mrp" name="mrp" type="number" min={0} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="ap-price">Selling price (₹)</label>
                  <input id="ap-price" name="price" type="number" min={0} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="ap-stock">Stock quantity</label>
                  <input id="ap-stock" name="stock" type="number" min={0} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="ap-size">Size / weight</label>
                  <input id="ap-size" name="size" className="input" placeholder="e.g. 30 ml" />
                </div>
                <div className="field field--full">
                  <label htmlFor="ap-short">Short description</label>
                  <input id="ap-short" name="short" className="input" />
                </div>
                <div className="field field--full">
                  <label htmlFor="ap-desc">Full description, key ingredients and how to use</label>
                  <textarea id="ap-desc" name="desc" rows={4} className="input" />
                </div>
                <div className="field field--full">
                  <label htmlFor="ap-img">Product photos (2 to 3, white background)</label>
                  <input id="ap-img" name="images" type="file" accept="image/*" multiple className="input" />
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Add product
              </button>
            </form>
          </>
        ) : null}

        {section === "orders" ? (
          <>
            <h1>Orders</h1>
            <div className="card empty">
              <Icon name="bag" size={30} />
              <p>Paid Razorpay orders appear here with status, customer and delivery details. GST invoices are generated per order.</p>
            </div>
          </>
        ) : null}

        {section === "reviews" ? (
          <>
            <h1>Reviews</h1>
            <div className="review-queue">
              {queue.map((r) => (
                <article key={r.id} className="card">
                  <div className="rcard__top">
                    <b>{r.title}</b>
                    <span className={`tag tag--${r.status}`}>{r.status}</span>
                  </div>
                  <p>{r.body}</p>
                  <p className="muted">
                    {r.name} · {r.productName} · {r.rating}/5 {r.mediaType ? `· ${r.mediaType} attached` : ""}
                  </p>
                  {r.status === "pending" ? (
                    <div className="form__actions">
                      <button type="button" className="btn btn-primary" onClick={() => setQueue((q) => q.map((x) => (x.id === r.id ? { ...x, status: "approved" } : x)))}>
                        Approve{r.mediaType ? ` and add ${r.mediaType === "photo" ? site.rewards.photoReviewBonus : site.rewards.videoReviewBonus} points` : ""}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => setQueue((q) => q.map((x) => (x.id === r.id ? { ...x, status: "rejected" } : x)))}>
                        Reject
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : null}

        {section === "journal" ? (
          <>
            <h1>Journal</h1>
            <div className="table-wrap card">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {postList.map((p) => (
                    <tr key={p.slug}>
                      <th scope="row">{p.title}</th>
                      <td>{p.category}</td>
                      <td>{p.date}</td>
                      <td>
                        <span className="tag">{p.published ? "Published" : "Draft"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form className="card form" onSubmit={addPost}>
              <h2 className="form__title">New article</h2>
              <div className="form__grid">
                <div className="field field--full">
                  <label htmlFor="jp-title">Title</label>
                  <input id="jp-title" name="title" className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="jp-cat">Category</label>
                  <select id="jp-cat" name="category" className="input">
                    {["Skin", "Hair", "Ingredients", "Wellness"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="jp-cover">Cover image</label>
                  <input id="jp-cover" name="cover" type="file" accept="image/*" className="input" />
                </div>
                <div className="field field--full">
                  <label htmlFor="jp-excerpt">Short summary (used for Google)</label>
                  <input id="jp-excerpt" name="excerpt" className="input" maxLength={160} />
                </div>
                <div className="field field--full">
                  <label htmlFor="jp-body">Article</label>
                  <textarea id="jp-body" name="body" rows={8} className="input" />
                </div>
              </div>
              <label className="check">
                <input type="checkbox" name="publish" />
                <span>Publish now</span>
              </label>
              <button className="btn btn-primary" type="submit">
                Save article
              </button>
            </form>
          </>
        ) : null}

        {section === "rewards" ? (
          <>
            <h1>{site.rewards.name} rules</h1>
            <form
              className="card form"
              onSubmit={(e) => {
                e.preventDefault();
                flash("Reward rules saved (preview only)");
              }}
            >
              <p className="muted">Proposed starting rules. Adjust and save; customers see the updated rules on the KC Circle page.</p>
              <div className="form__grid">
                {[
                  { id: "earn", label: "Points earned per ₹100 spent", value: site.rewards.pointsPer100 },
                  { id: "value", label: "Value of 1 point (₹)", value: site.rewards.pointValueInr },
                  { id: "min", label: "Minimum points to redeem", value: site.rewards.minRedeem },
                  { id: "expiry", label: "Points expire after (months)", value: site.rewards.expiryMonths },
                  { id: "photo", label: "Bonus for approved photo review", value: site.rewards.photoReviewBonus },
                  { id: "video", label: "Bonus for approved video review", value: site.rewards.videoReviewBonus },
                ].map((f) => (
                  <div className="field" key={f.id}>
                    <label htmlFor={`rw-${f.id}`}>{f.label}</label>
                    <input id={`rw-${f.id}`} type="number" min={0} className="input" defaultValue={f.value} />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" type="submit">
                Save rules
              </button>
            </form>
          </>
        ) : null}

        {section === "enquiries" ? (
          <>
            <h1>Enquiries</h1>
            <div className="stats stats--two">
              <div className="card">
                <h2>Consult a Doctor</h2>
                <p className="muted">Requests are forwarded to {site.clinic.name} on WhatsApp and logged here.</p>
              </div>
              <div className="card">
                <h2>Bulk & consultants</h2>
                <p className="muted">Consultant, retailer, reseller and bulk buyer enquiries with quantity, budget and delivery date.</p>
              </div>
            </div>
          </>
        ) : null}

        {section === "settings" ? (
          <>
            <h1>Site settings</h1>
            <form
              className="card form"
              onSubmit={(e) => {
                e.preventDefault();
                flash("Settings saved (preview only)");
              }}
            >
              <h2 className="form__title">Contact details</h2>
              <div className="form__grid">
                {["Business address", "Contact number", "WhatsApp number", "Email", "Instagram link", "YouTube link", "Google Reviews link", "Clinic WhatsApp number"].map((l) => (
                  <div className="field" key={l}>
                    <label htmlFor={`st-${l}`}>{l}</label>
                    <input id={`st-${l}`} className="input" />
                  </div>
                ))}
              </div>
              <h2 className="form__title">Shipping</h2>
              <div className="form__grid">
                <div className="field">
                  <label htmlFor="st-fee">Shipping charge (₹)</label>
                  <input id="st-fee" type="number" className="input" defaultValue={site.shipping.flatFee} />
                </div>
                <div className="field">
                  <label htmlFor="st-free">Free shipping above (₹)</label>
                  <input id="st-free" type="number" className="input" defaultValue={site.shipping.freeAbove} />
                </div>
                <div className="field field--full">
                  <label htmlFor="st-eta">Expected delivery time</label>
                  <input id="st-eta" className="input" defaultValue={site.shipping.deliveryEstimate} />
                </div>
                <div className="field field--full">
                  <label htmlFor="st-pins">Serviceable PIN codes (comma separated, or leave blank for all India)</label>
                  <textarea id="st-pins" rows={3} className="input" />
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Save settings
              </button>
            </form>
          </>
        ) : null}
      </div>
      <div className={saved ? "toast is-on" : "toast"} role="status" aria-live="polite">
        {saved}
      </div>
    </div>
  );
}
