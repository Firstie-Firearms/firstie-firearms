import type { AcademyFaqItem } from "@/lib/academy-page-content"

const GOLD = "#b8946a"

/**
 * Server-rendered FAQ section. Uses native <details>/<summary> instead of a
 * client-side accordion so every question and answer is present in the
 * initial HTML and fully crawlable, with expand/collapse working without
 * JavaScript. FAQPage structured data is intentionally not added here — a
 * later SEO task will decide how/when to introduce that schema.
 */
export function AcademyFaqSection({ heading, faqs }: { heading: string; faqs: AcademyFaqItem[] }) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-8" style={{ color: GOLD }}>
        {heading}
      </h2>
      <div className="max-w-3xl mx-auto divide-y divide-border border-t border-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-foreground text-sm md:text-base leading-snug">
              {faq.question}
              <span
                className="mt-0.5 shrink-0 transition-transform duration-200 group-open:rotate-45"
                style={{ color: GOLD }}
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="pt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
