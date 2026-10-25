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
                    <span className="muted">{i.value ?? pending}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
