import type { Metadata } from "next";
import { ConsultForm } from "@/components/forms/ConsultForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consult a Doctor",
  description: `Request a skin or hair consultation. Fill in a short form and ${site.clinic.name} will contact you on WhatsApp.`,
  alternates: { canonical: "/consult" },
};

export default function ConsultPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Consult a Doctor" }]} title="Care starts with a conversation." lead={`Tell us a little about your skin or hair. Your details go straight to ${site.clinic.name} on WhatsApp.`} />
      <section className="section">
        <div className="wrap consult">
          <div className="consult__aside">
            <Photo k="consult" className="consult__photo" sizes="(max-width: 760px) 92vw, 40vw" />
            <ol className="mini-steps">
              <li>
                <Icon name="steth" size={22} />
                <div>
                  <b>Share your concern</b>
                  <p>A few simple questions, under two minutes.</p>
                </div>
              </li>
              <li>
                <Icon name="chat" size={22} />
                <div>
                  <b>Sent on WhatsApp</b>
                  <p>Your details go directly to the clinic.</p>
                </div>
              </li>
              <li>
                <Icon name="phone" size={22} />
                <div>
                  <b>The clinic gets in touch</b>
                  <p>At your preferred time.</p>
                </div>
              </li>
            </ol>
          </div>
          <ConsultForm />
        </div>
      </section>
    </>
  );
}
