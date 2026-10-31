"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { resolveMedia } from "@/lib/media-resolve";
import { errText, uploadPublic, type SectionProps } from "./shared";

type S = Record<string, string | number | boolean | null>;
type Advisor = { id: string; name: string; title: string | null; bio: string | null; photo: string | null; sort_order: number };

const TEXT: { id: string; label: string; type?: string }[] = [
  { id: "legal_name", label: "Legal business name (as per GST)" },
  { id: "gstin", label: "GSTIN" },
  { id: "business_address", label: "Business address" },
  { id: "contact_phone", label: "Contact number", type: "tel" },
  { id: "whatsapp", label: "WhatsApp number (with 91)", type: "tel" },
  { id: "email", label: "Email", type: "email" },
  { id: "clinic_whatsapp", label: "Clinic WhatsApp for consultations (with 91)", type: "tel" },
  { id: "instagram_url", label: "Instagram link", type: "url" },
  { id: "youtube_url", label: "YouTube link", type: "url" },
  { id: "google_reviews_url", label: "Google Reviews link", type: "url" },
  { id: "grievance_officer_name", label: "Grievance officer (name and designation)" },
  { id: "grievance_officer_email", label: "Grievance officer email", type: "email" },
  { id: "grievance_officer_phone", label: "Grievance officer phone", type: "tel" },
];

export function Settings({ db, flash }: SectionProps) {
  const [s, setS] = useState<S | null>(null);
  const [pins, setPins] = useState("");
  const [admins, setAdmins] = useState<string[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [a, p, al, ad] = await Promise.all([
      db.from("site_settings").select("*").eq("id", 1).single(),
      db.from("serviceable_pincodes").select("pincode").order("pincode"),
      db.from("admin_allowlist").select("email").order("email"),
      db.from("advisors").select("id, name, title, bio, photo, sort_order").order("sort_order"),
    ]);
    setS((a.data as S | null) ?? {});
    setPins(((p.data ?? []) as { pincode: string }[]).map((x) => x.pincode).join(", "));
    setAdmins(((al.data ?? []) as { email: string }[]).map((x) => x.email));
    setAdvisors((ad.data ?? []) as Advisor[]);
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const patch: S = {};
    TEXT.forEach((x) => {
      patch[x.id] = get(x.id) || null;
    });
    patch.shipping_fee = Math.max(0, Number(get("shipping_fee")) || 0);
    patch.free_shipping_above = Math.max(0, Number(get("free_shipping_above")) || 0);
    patch.delivery_estimate = get("delivery_estimate") || "3 to 7 business days";
    patch.cod_enabled = f.get("cod_enabled") === "on";
    ["about_text", "vision_text", "founder_note"].forEach((k) => {
      patch[k] = get(k) || null;
    });
    setBusy(true);
    try {
      const photo = f.get("founder_photo");
      if (photo && typeof photo !== "string" && photo.size) patch.founder_photo = await uploadPublic(db, "site-media", "founder", photo);
      const { error } = await db.from("site_settings").update(patch).eq("id", 1);
      if (error) throw error;
      // PIN codes: replace the list (empty list = deliver everywhere in India).
      const list = Array.from(new Set(get("pins").split(/[^0-9]+/).filter((x) => /^[1-9][0-9]{5}$/.test(x))));
      const del = await db.from("serviceable_pincodes").delete().neq("pincode", "000000");
      if (del.error) throw del.error;
      if (list.length) {
        const ins = await db.from("serviceable_pincodes").insert(list.map((pincode) => ({ pincode })));
        if (ins.error) throw ins.error;
      }
      flash("Settings saved. Publish changes to update the website.");
      await load();
    } catch (err) {
      flash(errText(err));
    } finally {
      setBusy(false);
    }
  };

  const addAdvisor = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    try {
      const file = f.get("photo");
      const photo = file && typeof file !== "string" && file.size ? await uploadPublic(db, "site-media", "advisors", file) : null;
      const { error } = await db.from("advisors").insert({ name: get("name"), title: get("title") || null, bio: get("bio") || null, photo, sort_order: advisors.length });
      if (error) throw error;
      form.reset();
      flash("Advisor added");
      await load();
    } catch (err) {
      flash(errText(err));
    } finally {
      setBusy(false);
    }
  };

  const removeAdvisor = async (a: Advisor) => {
    if (!window.confirm(`Remove ${a.name} from the advisory panel?`)) return;
    const { error } = await db.from("advisors").delete().eq("id", a.id);
    if (error) return flash(errText(error));
    flash("Advisor removed");
    await load();
  };

  const addAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim().toLowerCase();
    if (!email) return;
    const { error } = await db.from("admin_allowlist").insert({ email });
    if (error) return flash(errText(error));
    form.reset();
    flash(`${email} can now sign in to the admin`);
    await load();
  };

  if (!s) return <div className="empty" aria-busy="true">Loading…</div>;
  const v = (k: string) => (s[k] === null || s[k] === undefined ? "" : String(s[k]));

  return (
    <>
      <h1>Site settings</h1>
      <form className="card form" onSubmit={save}>
        <h2 className="form__title">Business and contact details</h2>
        <div className="form__grid">
          {TEXT.map((x) => (
            <div className="field" key={x.id}>
              <label htmlFor={`st-${x.id}`}>{x.label}</label>
              <input id={`st-${x.id}`} name={x.id} type={x.type ?? "text"} className="input" defaultValue={v(x.id)} />
            </div>
          ))}
        </div>
        <h2 className="form__title">Shipping</h2>
        <div className="form__grid">
          <div className="field">
            <label htmlFor="st-fee">Shipping charge (₹)</label>
            <input id="st-fee" name="shipping_fee" type="number" min={0} className="input" defaultValue={v("shipping_fee")} />
          </div>
          <div className="field">
            <label htmlFor="st-free">Free shipping above (₹)</label>
            <input id="st-free" name="free_shipping_above" type="number" min={0} className="input" defaultValue={v("free_shipping_above")} />
          </div>
          <div className="field field--full">
            <label htmlFor="st-eta">Expected delivery time</label>
            <input id="st-eta" name="delivery_estimate" className="input" defaultValue={v("delivery_estimate")} />
          </div>
          <div className="field field--full">
            <label htmlFor="st-pins">Serviceable PIN codes (comma separated, leave blank for all India)</label>
            <textarea id="st-pins" name="pins" rows={3} className="input" defaultValue={pins} key={pins} />
          </div>
        </div>
        <label className="check">
          <input type="checkbox" name="cod_enabled" defaultChecked={Boolean(s.cod_enabled)} />
          <span>Cash on delivery available</span>
        </label>
        <h2 className="form__title">About page</h2>
        <div className="form__grid">
          {[
            { id: "about_text", label: "About KudaratCare" },
            { id: "vision_text", label: "Our vision" },
            { id: "founder_note", label: "Founder's note" },
          ].map((x) => (
            <div className="field field--full" key={x.id}>
              <label htmlFor={`st-${x.id}`}>{x.label}</label>
              <textarea id={`st-${x.id}`} name={x.id} rows={4} className="input" defaultValue={v(x.id)} />
            </div>
          ))}
          <div className="field field--full">
            <label htmlFor="st-founder-photo">Founder photograph{s.founder_photo ? " (leave empty to keep the current one)" : ""}</label>
            {s.founder_photo ? <img src={resolveMedia(String(s.founder_photo)).small} alt="" width={64} height={64} style={{ objectFit: "cover", borderRadius: 8 }} /> : null}
            <input id="st-founder-photo" name="founder_photo" type="file" accept="image/*" className="input" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </form>

      <section className="card form">
        <h2 className="form__title">Advisory panel</h2>
        {advisors.length ? (
          <ul className="plain-list">
            {advisors.map((a) => (
              <li key={a.id}>
                <b>{a.name}</b>
                {a.title ? ` · ${a.title}` : ""}{" "}
                <button type="button" className="text-btn" onClick={() => void removeAdvisor(a)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No advisors yet. The About page shows placeholders until you add them.</p>
        )}
        <form onSubmit={addAdvisor} className="form">
          <div className="form__grid">
            <div className="field">
              <label htmlFor="ad-name">Name</label>
              <input id="ad-name" name="name" className="input" required />
            </div>
            <div className="field">
              <label htmlFor="ad-title">Qualification / role</label>
              <input id="ad-title" name="title" className="input" />
            </div>
            <div className="field field--full">
              <label htmlFor="ad-bio">Short bio</label>
              <textarea id="ad-bio" name="bio" rows={3} className="input" />
            </div>
            <div className="field">
              <label htmlFor="ad-photo">Photo</label>
              <input id="ad-photo" name="photo" type="file" accept="image/*" className="input" />
            </div>
          </div>
          <button className="btn btn-ghost" type="submit" disabled={busy}>
            Add advisor
          </button>
        </form>
      </section>

      <form className="card form" onSubmit={addAdmin}>
        <h2 className="form__title">Admin access</h2>
        <p className="muted">These emails get admin access when they sign in: {admins.join(", ") || "none"}.</p>
        <div className="form__grid">
          <div className="field">
            <label htmlFor="st-admin">Add an admin email</label>
            <input id="st-admin" name="email" type="email" className="input" required />
          </div>
        </div>
        <button className="btn btn-ghost" type="submit">
          Add admin
        </button>
      </form>
    </>
  );
}
