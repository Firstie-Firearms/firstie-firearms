import Link from "next/link"
import { SiteBreadcrumb } from "@/components/site-breadcrumb"
import type { Policy } from "@/lib/policy-content"

export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-28 text-foreground md:px-6">
      <div className="mx-auto max-w-4xl">
        <SiteBreadcrumb items={[{ label: "Home", href: "/" }, { label: policy.title }]} />
        <header className="border-b border-border py-10 md:py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Firstie Firearms legal information</p>
          <h1 className="mt-3 text-balance font-sans text-4xl font-bold md:text-6xl">{policy.title}</h1>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{policy.description}</p>
          <p className="mt-6 text-sm text-muted-foreground">Last Updated: September 4, 2026</p>
        </header>
        <article className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:font-sans prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7">
          {policy.sections.map((section, index) => (
            <section key={`${policy.slug}-${index}`} className="mb-8">
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </section>
          ))}
          <p className="not-prose border-t border-border pt-8 text-sm text-muted-foreground">
            Questions? <Link className="underline underline-offset-4 hover:text-foreground" href="mailto:info@firstiefirearms.com">info@firstiefirearms.com</Link>
          </p>
        </article>
      </div>
    </main>
  )
}
