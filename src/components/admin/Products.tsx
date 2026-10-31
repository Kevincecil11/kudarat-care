"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { mapSheet, readSheet, slugify, type SheetProduct } from "@/lib/admin/sheet";
import { resolveMedia } from "@/lib/media-resolve";
import { errText, uploadPublic, type SectionProps } from "./shared";

type Cat = { id: string; slug: string; name: string };
type Row = {
  id: string;
  slug: string;
  name: string;
  sub_category: string;
  mrp: number;
  price: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_sample: boolean;
  images: string[];
  category_id: string | null;
};

function thumb(images: string[] | null | undefined): string {
  try {
    const first = (images ?? []).find(Boolean) ?? "botanical";
    return resolveMedia(first).small || "";
  } catch {
    return "";
  }
}

const COLS = "id, slug, name, sub_category, mrp, price, stock, is_active, is_featured, is_sample, images, category_id";

export function Products({ db, flash }: SectionProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [orig, setOrig] = useState<Record<string, string>>({});
  const [cats, setCats] = useState<Cat[]>([]);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [sheet, setSheet] = useState<{ products: SheetProduct[]; problems: string[] } | null>(null);

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([db.from("products").select(COLS).order("sort_order").order("name"), db.from("categories").select("id, slug, name").order("sort_order")]);
    const list = ((p.data ?? []) as Row[]).map((r) => ({ ...r, images: Array.isArray(r.images) ? r.images : [], sub_category: r.sub_category ?? "" }));
    setRows(list);
    setOrig(Object.fromEntries(list.map((r) => [r.id, JSON.stringify(r)])));
    setCats((c.data ?? []) as Cat[]);
    setLoaded(true);
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  const changed = useMemo(() => rows.filter((r) => orig[r.id] !== JSON.stringify(r)), [rows, orig]);
  const set = (id: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const n = (v: number) => (Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0);

  const save = async () => {
    const bad = changed.find((r) => r.price > r.mrp);
    if (bad) return flash(`${bad.name}: selling price can't be above MRP`);
    setBusy(true);
    try {
      for (const r of changed) {
        const { error } = await db
          .from("products")
          .update({ mrp: r.mrp, price: r.price, stock: r.stock, is_active: r.is_active, is_featured: r.is_featured, category_id: r.category_id })
          .eq("id", r.id);
        if (error) throw error;
      }
      flash(`Saved ${changed.length} product${changed.length === 1 ? "" : "s"}`);
      await load();
    } catch (e) {
      flash(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: Row) => {
    if (!window.confirm(`Delete "${r.name}" permanently? Past orders keep their record.`)) return;
    const { error } = await db.from("products").delete().eq("id", r.id);
    if (error) return flash(errText(error));
    flash("Product deleted");
    await load();
  };

  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const lines = (k: string, sep: RegExp) =>
      get(k)
        .split(sep)
        .map((x) => x.trim())
        .filter(Boolean);
    const name = get("name");
    const mrp = n(Number(get("mrp")));
    const price = n(Number(get("price")));
    if (price > mrp) return flash("Selling price can't be above MRP");
    setBusy(true);
    try {
      const slug = slugify(name);
      const files = f.getAll("images").filter((x): x is File => typeof x !== "string" && x.size > 0).slice(0, 4);
      const images: string[] = [];
      for (const file of files) images.push(await uploadPublic(db, "product-images", slug, file));
      const { error } = await db.from("products").insert({
        slug,
        name,
        category_id: get("category") || null,
        sub_category: get("sub"),
        mrp,
        price,
        stock: n(Number(get("stock"))),
        size: get("size"),
        short_description: get("short"),
        description: get("desc"),
        key_ingredients: lines("ingredients", /[,;\n]+/),
        how_to_use: lines("howto", /\n+/),
        images: images.length ? images : ["botanical"],
        is_featured: f.get("featured") === "on",
        sort_order: rows.length,
      });
      if (error) throw error;
      form.reset();
      setNewCat("");
      flash("Product added. It appears on the website after you publish changes.");
      await load();
    } catch (err) {
      flash(errText(err));
    } finally {
      setBusy(false);
    }
  };

  const addPhotos = async (r: Row, list: FileList | null) => {
    const files = Array.from(list ?? []).slice(0, 4);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadPublic(db, "product-images", r.slug, file));
      const keep = r.images.filter((x) => /^https?:/.test(x));
      const { error } = await db.from("products").update({ images: [...urls, ...keep].slice(0, 6) }).eq("id", r.id);
      if (error) throw error;
      flash("Photos updated");
      await load();
    } catch (e) {
      flash(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const pickSheet = async (file: File | undefined) => {
    if (!file) return;
    try {
      setSheet(mapSheet(await readSheet(file)));
    } catch (e) {
      flash(errText(e));
    }
  };

  const importSheet = async () => {
    if (!sheet?.products.length) return;
    setBusy(true);
    try {
      const catMap = new Map<string, string>();
      cats.forEach((c) => {
        catMap.set(c.slug, c.id);
        catMap.set(c.name.toLowerCase(), c.id);
      });
      const names = Array.from(new Set(sheet.products.map((p) => p.category).filter(Boolean)));
      for (const name of names) {
        if (catMap.has(name.toLowerCase()) || catMap.has(slugify(name))) continue;
        const { data, error } = await db.from("categories").insert({ slug: slugify(name), name, sort_order: cats.length }).select("id").single();
        if (error) throw error;
        catMap.set(name.toLowerCase(), (data as { id: string }).id);
      }
      const payload = sheet.products.map((p, i) => {
        const { category, ...rest } = p;
        const categoryId = category ? catMap.get(category.toLowerCase()) ?? catMap.get(slugify(category)) ?? null : null;
        return { ...rest, category_id: categoryId, is_sample: false, is_active: true, sort_order: i };
      });
      const { error } = await db.from("products").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      flash(`Imported ${payload.length} products. Add photos per product in the table.`);
      setSheet(null);
      await load();
    } catch (e) {
      flash(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const hideSamples = async () => {
    if (!window.confirm("Hide all sample products from the website?")) return;
    const { error } = await db.from("products").update({ is_active: false }).eq("is_sample", true);
    if (error) return flash(errText(error));
    flash("Sample products hidden");
    await load();
  };

  const catValue = newCat || cats[0]?.id || "";

  return (
    <div className="admin-section">
      <h1>Products & stock</h1>
      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">MRP (₹)</th>
              <th scope="col">Price (₹)</th>
              <th scope="col">Stock</th>
              <th scope="col">Visible</th>
              <th scope="col">Featured</th>
              <th scope="col">Photos</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <span>{r.name}</span>
                  <small>{`${r.sub_category}${r.is_sample ? " · sample" : ""}`}</small>
                </th>
                <td>
                  <select className="input input--sm select-inline" aria-label={`Category for ${r.name}`} value={r.category_id ?? ""} onChange={(e) => set(r.id, { category_id: e.target.value || null })}>
                    <option value="">None</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input className="input input--sm input--xs" type="number" min={0} aria-label={`MRP for ${r.name}`} value={r.mrp} onChange={(e) => set(r.id, { mrp: n(e.target.valueAsNumber) })} />
                </td>
                <td>
                  <input className={r.price > r.mrp ? "input input--sm input--xs is-warn" : "input input--sm input--xs"} type="number" min={0} aria-label={`Price for ${r.name}`} value={r.price} onChange={(e) => set(r.id, { price: n(e.target.valueAsNumber) })} />
                </td>
                <td>
                  <input className={r.stock < 10 ? "input input--sm input--xs is-warn" : "input input--sm input--xs"} type="number" min={0} aria-label={`Stock for ${r.name}`} value={r.stock} onChange={(e) => set(r.id, { stock: n(e.target.valueAsNumber) })} />
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={r.is_active} onChange={(e) => set(r.id, { is_active: e.target.checked })} />
                    <span className="sr-only">{`Show ${r.name} on the website`}</span>
                  </label>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={r.is_featured} onChange={(e) => set(r.id, { is_featured: e.target.checked })} />
                    <span className="sr-only">{`Feature ${r.name} on the homepage`}</span>
                  </label>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      aria-hidden="true"
                      style={{ display: "inline-block", width: 32, height: 32, borderRadius: 6, backgroundColor: "#DCE4DC", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: thumb(r.images) ? `url("${thumb(r.images)}")` : undefined }}
                    />
                    <label className="text-btn">
                      <span>Change</span>
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void addPhotos(r, e.target.files)} />
                    </label>
                  </div>
                </td>
                <td>
                  <button type="button" className="text-btn" onClick={() => void remove(r)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loaded && !rows.length ? <p className="muted">No products yet. Import the sheet or add one below.</p> : null}
      </div>
      <div className="admin-row-actions">
        <button type="button" className="btn btn-primary" disabled={busy || !changed.length} onClick={() => void save()}>
          {changed.length ? `Save ${changed.length} change${changed.length === 1 ? "" : "s"}` : "No changes"}
        </button>
        <button type="button" className="btn btn-ghost" hidden={!rows.some((r) => r.is_sample && r.is_active)} onClick={() => void hideSamples()}>
          Hide sample products
        </button>
      </div>

      <section className="card form">
        <h2 className="form__title">Import from the product sheet</h2>
        <p className="muted">
          Upload the Excel sheet (.xlsx) or a CSV. Columns we read: Product name, Category, Sub-category, MRP, Selling price, Stock, Size, Short description, Description, Key ingredients, How to
          use, SKU, HSN, GST. Products with the same name are updated, not duplicated.
        </p>
        <input type="file" className="input" accept=".xlsx,.csv" aria-label="Product sheet" onChange={(e) => void pickSheet(e.target.files?.[0])} />
        {sheet ? (
          <div>
            {sheet.problems.length ? (
              <ul className="notice">
                {sheet.problems.slice(0, 8).map((p, i) => (
                  <li key={`${i}-${p}`}>{p}</li>
                ))}
              </ul>
            ) : null}
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">MRP</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.products.slice(0, 50).map((p, i) => (
                    <tr key={`${i}-${p.slug}`}>
                      <th scope="row">{p.name}</th>
                      <td>{p.category || "None"}</td>
                      <td>{String(p.mrp)}</td>
                      <td>{String(p.price)}</td>
                      <td>{String(p.stock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-row-actions">
              <button type="button" className="btn btn-primary" disabled={busy || !sheet.products.length} onClick={() => void importSheet()}>
                {`Import ${sheet.products.length} products`}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setSheet(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <form className="card form" onSubmit={add}>
        <h2 className="form__title">Add a product</h2>
        <div className="form__grid">
          <div className="field">
            <label htmlFor="ap-name">Product name</label>
            <input id="ap-name" name="name" className="input" required />
          </div>
          <div className="field">
            <label htmlFor="ap-cat">Category</label>
            <select id="ap-cat" name="category" className="input" value={catValue} onChange={(e) => setNewCat(e.target.value)}>
              <option value="">None</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ap-sub">Sub-category</label>
            <input id="ap-sub" name="sub" className="input" placeholder="e.g. Serums" />
          </div>
          <div className="field">
            <label htmlFor="ap-size">Size / weight</label>
            <input id="ap-size" name="size" className="input" placeholder="e.g. 30 ml" />
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
            <label htmlFor="ap-img">Photos (up to 4, 5 MB each)</label>
            <input id="ap-img" name="images" type="file" accept="image/*" multiple className="input" />
          </div>
          <div className="field field--full">
            <label htmlFor="ap-short">Short description</label>
            <input id="ap-short" name="short" className="input" maxLength={160} />
          </div>
          <div className="field field--full">
            <label htmlFor="ap-desc">Full description</label>
            <textarea id="ap-desc" name="desc" rows={4} className="input" />
          </div>
          <div className="field">
            <label htmlFor="ap-ing">Key ingredients (comma separated)</label>
            <textarea id="ap-ing" name="ingredients" rows={3} className="input" />
          </div>
          <div className="field">
            <label htmlFor="ap-how">How to use (one step per line)</label>
            <textarea id="ap-how" name="howto" rows={3} className="input" />
          </div>
        </div>
        <label className="check">
          <input type="checkbox" name="featured" />
          <span>Feature on the homepage</span>
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Add product"}
        </button>
      </form>
    </div>
  );
}
