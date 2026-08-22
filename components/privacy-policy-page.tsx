import { cn } from "@/lib/utils"

const GOLD = "#b8946a"

type Section = { title: string; body: React.ReactNode }

const sections: Section[] = [
  {
    title: "Overview",
    body: (
      <div className="space-y-3">
        <p>
          {
            "Firstie Firearms LLC respects your privacy. This policy explains, in plain English, what information we collect, how we use it, and the choices you have."
          }
        </p>
        <p>
          {
            "This page is provided for informational purposes and is not legal advice. If you have questions about anything below, contact us using the information at the end of this page."
          }
        </p>
      </div>
    ),
  },
  {
    title: "Information We Collect",
    body: (
      <div className="space-y-3">
        <p>{"We collect only what we need to process orders and communicate with you. This may include:"}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{"Name, email address, phone number, and shipping or billing address"}</li>
          <li>{"Order details, including the products you purchase and your selected FFL dealer"}</li>
          <li>{"Payment confirmation details provided by our payment processor (we do not store full card numbers)"}</li>
          <li>{"Messages you send us, such as email or form inquiries"}</li>
          <li>{"Basic technical and usage information, such as browser type, device type, and pages visited"}</li>
        </ul>
      </div>
    ),
  },
  {
    title: "How We Use Your Information",
    body: (
      <div className="space-y-3">
        <p>{"We use the information we collect to:"}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{"Process, build, and fulfill your order"}</li>
          <li>{"Coordinate lawful transfer of firearms through a licensed FFL dealer"}</li>
          <li>{"Send order confirmations, production updates, and shipping notifications"}</li>
          <li>{"Respond to your questions and provide customer support"}</li>
          <li>{"Send marketing communications when you have affirmatively opted in"}</li>
          <li>{"Meet our legal, regulatory, and recordkeeping obligations as a Federal Firearms Licensee"}</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Email and SMS Communications",
    body: (
      <div className="space-y-3">
        <p>
          {
            "Email consent and SMS consent are separate and affirmative. Providing your email address alone does not opt you into SMS messages, and providing your phone number alone does not opt you into SMS marketing. You must affirmatively opt in to each channel."
          }
        </p>
        <p>
          {
            "Consent to receive marketing email or SMS messages is not required to purchase from Firstie Firearms. Message and data rates may apply to SMS messages."
          }
        </p>
        <div className="border border-border rounded-sm divide-y divide-border">
          <div className="px-4 py-3 space-y-0.5">
            <p className="font-semibold text-foreground">{"Email opt-out"}</p>
            <p>{"Use the unsubscribe link included at the bottom of any marketing email."}</p>
          </div>
          <div className="px-4 py-3 space-y-0.5">
            <p className="font-semibold text-foreground">{"SMS opt-out"}</p>
            <p>{"Reply STOP to any marketing text message to stop receiving further messages."}</p>
          </div>
        </div>
        <p>
          {
            "Even if you opt out of marketing messages, we may still send you transactional messages about an active order, such as payment confirmations, production updates, or shipping notices."
          }
        </p>
      </div>
    ),
  },
  {
    title: "Klaviyo",
    body: (
      <div className="space-y-3">
        <p>
          {
            "We use Klaviyo as our email and SMS service provider. When you sign up for updates, Klaviyo processes your signup information on our behalf in order to deliver those email and SMS communications."
          }
        </p>
        <p>
          {
            "Klaviyo acts as a service provider and is permitted to use your information only to provide these services to Firstie Firearms."
          }
        </p>
      </div>
    ),
  },
  {
    title: "How We Share Information",
    body: (
      <div className="space-y-3">
        <p>
          {
            "Firstie Firearms does not sell your personal information. We also do not share SMS consent or phone number data with third parties or affiliates for their own marketing purposes."
          }
        </p>
        <p>{"We share information only as needed with:"}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{"Service providers who help us operate the business, such as our payment processor, email and SMS provider, and shipping carriers"}</li>
          <li>{"The licensed FFL dealer you select, in order to complete a lawful firearm transfer"}</li>
          <li>{"Government or law enforcement authorities when required by law or regulation"}</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Cookies and Analytics",
    body: (
      <div className="space-y-3">
        <p>
          {
            "Our website uses cookies and similar technologies to keep your cart working, remember your preferences, and understand how visitors use the site so we can improve it."
          }
        </p>
        <p>
          {
            "Most browsers let you block or delete cookies through your browser settings. Blocking some cookies may affect site functionality, such as your shopping cart."
          }
        </p>
      </div>
    ),
  },
  {
    title: "Data Retention",
    body: (
      <p>
        {
          "We keep personal information only as long as needed for the purposes described in this policy, including to complete your order, provide support, and satisfy our legal, tax, and Federal Firearms Licensee recordkeeping obligations. Certain firearm transaction records must be retained for periods set by federal law."
        }
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        {
          "We use reasonable administrative and technical safeguards to protect your information, and payment transactions are handled by our payment processor over an encrypted connection. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."
        }
      </p>
    ),
  },
  {
    title: "Your Rights and Choices",
    body: (
      <div className="space-y-3">
        <p>{"Depending on where you live, you may have the right to:"}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{"Request a copy of the personal information we hold about you"}</li>
          <li>{"Request correction of inaccurate information"}</li>
          <li>{"Request deletion of information we are not required to retain by law"}</li>
          <li>{"Opt out of marketing email or SMS at any time"}</li>
        </ul>
        <p>
          {
            "To make a request, email us using the contact information below. We may need to verify your identity before acting on your request."
          }
        </p>
      </div>
    ),
  },
  {
    title: "Children's Privacy",
    body: (
      <p>
        {
          "Our website and products are intended for adults who meet all legal requirements to purchase a firearm. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it."
        }
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    body: (
      <p>
        {
          "We may update this policy from time to time. When we do, we will revise the effective date at the top of this page. Material changes will be reflected here, so we encourage you to review this page periodically."
        }
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <div className="space-y-3">
        <p>{"If you have questions about this privacy policy or your information, contact us:"}</p>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{"Firstie Firearms LLC"}</p>
          <p>{"Dallas, TX 75229"}</p>
          <p>
            <a href="mailto:info@firstiefirearms.com" className="underline hover:text-foreground transition-colors">
              {"info@firstiefirearms.com"}
            </a>
          </p>
        </div>
      </div>
    ),
  },
]

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-8 md:pt-16 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: GOLD }}>
          {"Privacy Policy"}
        </h1>
        <p className="text-sm text-muted-foreground">{"Effective Date: August 21, 2026"}</p>
      </section>

      {/* Policy Content */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
          {sections.map((section, i) => (
            <div
              key={section.title}
              className={cn("space-y-3", i > 0 && "pt-8 md:pt-10 border-t border-border")}
            >
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
                {section.title}
              </h2>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed space-y-3">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
