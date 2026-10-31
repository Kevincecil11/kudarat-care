import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { pending, site } from "@/lib/site";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact KudaratCare about products, orders, consultations or bulk enquiries by phone, WhatsApp or email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = site.contact;
  const g = site.grievance;
  const items: { icon: IconName; label: string; value: string | null; href?: string }[] = [
    { icon: "pin", label: "Address", value: c.address },
    { icon: "phone", label: "Phone", value: c.phone, href: c.phone ? `tel:${c.phone}` : undefined },
    { icon: "chat", label: "WhatsApp", value: c.whatsapp, href: c.whatsapp ? whatsappLink(c.whatsapp, "Hello KudaratCare") : undefined },
    { icon: "mail", label: "Email", value: c.email, href: c.email ? `mailto:${c.email}` : undefined },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: "Contact" }]} title="Let us start a conversation." lead="Questions about a product, an order or a consultation? We are happy to help." />
      <section className="section">
        <div className="wrap contact">
          <div>
            <ul className="contact__list">
              {items.map((i) => (
                <li key={i.label} className="card">
                  <Icon name={i.icon} size={22} />
                  <div>
                    <b>{i.label}</b>
                    {i.value && i.href ? (
                      <a href={i.href} target={i.icon === "chat" ? "_blank" : undefined} rel="noopener noreferrer">
                        {i.value}
                      </a>
                    ) : (
                      <span className={i.value ? undefined : "muted"}>{i.value ?? pending}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="card" style={{ marginTop: 16 }}>
              <h2 className="form__title">Business details</h2>
              <p>
                <b>{site.legalName}</b>
                {site.gstin ? <> · GSTIN {site.gstin}</> : null}
              </p>
              <p className="muted" style={{ marginBottom: 6 }}>
                Grievance officer
              </p>
              {g.name || g.email || g.phone ? (
                <p style={{ whiteSpace: "pre-line" }}>{[g.name, g.email, g.phone].filter(Boolean).join("\n")}</p>
              ) : (
                <p className="muted">{pending}.</p>
              )}
              <p className="muted">We acknowledge complaints within 48 hours and resolve them within one month.</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
