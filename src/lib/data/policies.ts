import type { Policy } from "../types";

const pendingBody = "KudaratCare will provide the approved wording for this section before launch.";

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "How KudaratCare collects, uses and protects your personal information.",
    sections: [
      { heading: "Information we collect", body: pendingBody },
      { heading: "How we use your information", body: pendingBody },
      { heading: "Consultation details", body: pendingBody },
      { heading: "Your choices and rights", body: pendingBody },
      { heading: "Contact", body: pendingBody },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    summary: "The terms for using the KudaratCare website and placing orders.",
    sections: [
      { heading: "Using this website", body: pendingBody },
      { heading: "Orders and pricing", body: pendingBody },
      { heading: "KC Circle rewards", body: pendingBody },
      { heading: "Reviews and user content", body: pendingBody },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    summary: "Delivery areas, timelines and shipping charges.",
    sections: [
      { heading: "Delivery areas", body: pendingBody },
      { heading: "Delivery timelines", body: pendingBody },
      { heading: "Shipping charges", body: pendingBody },
    ],
  },
  {
    slug: "refund-policy",
    title: "Return & Refund Policy",
    summary: "How returns, replacements and refunds work.",
    sections: [
      { heading: "Eligibility", body: pendingBody },
      { heading: "How to request a return", body: pendingBody },
      { heading: "Refund timelines", body: pendingBody },
    ],
  },
];
