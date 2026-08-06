"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const GOLD = "#b8946a"

type FaqItem = { question: string; answer: React.ReactNode }
type FaqCategory = { title: string; items: FaqItem[] }

const categories: FaqCategory[] = [
  {
    title: "Ordering",
    items: [
      {
        question: "When do USNA Class of 2027 orders open?",
        answer:
          "Orders for the USNA Class of 2027 commemorative pistol are open now. Two scheduled production batches are planned — order by November 1, 2026 for the First Production Batch, or by April 1, 2027 for the Commissioning Delivery Batch.",
      },
      {
        question: "What does the product cost?",
        answer:
          "Pricing is listed on the USNA Class of 2027 product page.",
      },
      {
        question: "Is full payment required at the time of ordering?",
        answer:
          "Yes. Full payment is required to place an order and secure your production slot.",
      },
      {
        question: "Is financing available?",
        answer:
          "Financing is not currently available. Payment may be made by check, money order, Visa, or Mastercard. Discover and American Express are not accepted.",
      },
      {
        question: "Are all sales final?",
        answer:
          "We allow a 24-hour window from the time of purchase to request a cancellation. After that period, all sales are final. By agreeing to our Terms and Conditions at checkout, you acknowledge and accept this policy.",
      },
      {
        question: "Can I order after graduation?",
        answer:
          "Yes. The Class of 2027 design will remain available after graduation. Orders placed outside the scheduled production batches have an estimated three-month production timeline.",
      },
    ],
  },
  {
    title: "Production",
    items: [
      {
        question: "Is each pistol made to order?",
        answer:
          "Yes. Each commemorative pistol is built individually to order. Firstie Firearms does not maintain pre-built inventory.",
      },
      {
        question: "What are the scheduled batch deadlines?",
        answer: (
          <div className="space-y-3">
            <p>{"The Class of 2027 production schedule includes two batches:"}</p>
            <div className="border border-border rounded-sm divide-y divide-border">
              <div className="px-4 py-3 space-y-0.5">
                <p className="font-semibold text-foreground">{"First Production Batch"}</p>
                <p>{"Order deadline: November 1, 2026"}</p>
                <p>{"Estimated delivery: December 15, 2026"}</p>
              </div>
              <div className="px-4 py-3 space-y-0.5">
                <p className="font-semibold text-foreground">{"Commissioning Delivery Batch"}</p>
                <p>{"Order by April 1, 2027 to be included in the batch scheduled for delivery before Commissioning Week."}</p>
                <p>{"Estimated delivery: May 15, 2027"}</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        question: "Are delivery dates guaranteed?",
        answer:
          "Delivery dates are estimates and are not guaranteed. Production schedules are planned around the academy calendar, and we will communicate updates if timelines change.",
      },
      {
        question: "What is the normal lead time after the scheduled batches?",
        answer:
          "Orders placed outside the scheduled production batches have an estimated three-month production timeline from the date of order.",
      },
    ],
  },
  {
    title: "FFL Delivery",
    items: [
      {
        question: "Why can't the pistol ship directly to my home?",
        answer:
          "Federal law requires that serialized firearms be transferred through a licensed dealer (FFL). The pistol ships from Firstie Firearms to an FFL dealer of your choosing, who then completes the transfer to you in compliance with all applicable federal and state requirements.",
      },
      {
        question: "How do I find a receiving FFL?",
        answer:
          "Any federally licensed firearms dealer can serve as your receiving FFL. Most gun stores, sporting goods stores, and pawnshops with a firearms license will accept transfers. Contact dealers in your area to confirm they accept incoming transfers and to ask about their transfer fee before placing your order.",
      },
      {
        question: "Where should the dealer send its license?",
        answer:
          "Following your purchase, you will receive an email from Firstie Firearms with instructions for submitting your receiving dealer's FFL license. We must have a copy of the dealer's license on file before the pistol can ship.",
      },
      {
        question: "Who pays the dealer transfer fee?",
        answer:
          "The transfer fee charged by your receiving FFL is separate from the purchase price and is paid directly to that dealer. Transfer fees vary by dealer.",
      },
      {
        question: "Can a parent buy the pistol as a gift for their midshipman or cadet?",
        answer:
          "Yes. A parent or family member may purchase the pistol as a gift. The firearm will transfer to the recipient through the receiving FFL, who will complete the required background check and paperwork with the person taking possession. The recipient must be legally eligible to receive a firearm in the state where the transfer takes place.",
      },
    ],
  },
  {
    title: "Product",
    items: [
      {
        question: "What firearm is used?",
        answer:
          "Each commemorative pistol is built on a factory-new, unfired GLOCK 19X V chambered in 9x19 mm. The base firearm includes the factory GLOCK Marksman Barrel, factory passive Safe Action system, and factory tritium sights.",
      },
      {
        question: "What custom components are installed?",
        answer: (
          <div className="space-y-2">
            <p>{"The following components are installed on every USNA Class of 2027 pistol:"}</p>
            <ul className="space-y-1.5 pl-1">
              {[
                "Overwatch Precision PolyDAT trigger shoe",
                "SLR Rifleworks magwell",
                "Deep multi-layer laser engraving",
                "Hand-finishing and polishing",
                "Tungsten Cerakote",
                "Burnt Bronze Cerakote",
                "Custom two-level protective presentation case",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        question: "How many magazines are included?",
        answer:
          "Each pistol ships with three factory magazines: one 17-round magazine and two 17+2-round magazines.",
      },
      {
        question: "Are reduced-capacity magazines available?",
        answer:
          "No. Firstie Firearms does not substitute reduced-capacity magazines. The product ships with the factory magazine configuration described above. The product cannot be shipped or transferred in jurisdictions where the included configuration is prohibited.",
      },
      {
        question: "Does Firstie Firearms test-fire the completed pistol?",
        answer:
          "No. Each pistol is factory-new and remains unfired by Firstie Firearms. The completed build is inspected and finished, but not fired.",
      },
      {
        question: "What is included with the case?",
        answer:
          "The completed pistol is housed in a custom two-level protective presentation case. The upper level displays the pistol and is designed to present the firearm as a commemorative piece. The lower level provides dedicated storage for the included magazines. Dense, closed-cell black-core foam protects all contents.",
      },
    ],
  },
]

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="font-semibold text-foreground text-sm md:text-base leading-snug">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200",
            open && "rotate-180"
          )}
          style={{ color: GOLD }}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm md:text-base text-muted-foreground leading-relaxed space-y-2">
          {item.answer}
        </div>
      )}
    </div>
  )
}

export function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: typeof item.answer === "string" ? item.answer : cat.title,
        },
      }))
    ),
  }

  return (
    <div className="min-h-screen pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative min-h-[25vh] md:min-h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/custom-tactical-glock-pistol-close-up-on-dark-back.jpg"
            alt="Firstie Firearms FAQ"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: GOLD }}>
            {"Frequently Asked Questions"}
          </h1>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
          {categories.map((cat, i) => (
            <div key={cat.title} className={cn("space-y-1", i > 0 && "pt-8 md:pt-10 border-t border-border")}>
              <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: GOLD }}>
                {cat.title}
              </h2>
              <div className="divide-y divide-border border-t border-border">
                {cat.items.map((item) => (
                  <FaqAccordionItem key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}

          {/* Shipping note */}
          <div className="pt-8 md:pt-10 border-t border-border space-y-3">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
              {"Domestic Orders Only"}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {"At this time, Firstie Firearms does not accept or ship orders outside of the United States, including U.S. territories."}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
