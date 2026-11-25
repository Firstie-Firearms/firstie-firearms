import type { Academy } from "@/types"

const DISCLAIMER_COPY: Record<Academy, string> = {
  USNA:
    "Firstie Firearms is a private, independent company founded by academy graduates. This private organization is a non-federal entity and not an official activity of the United States Naval Academy, United States Naval Academy Alumni Association and Foundation, or the United States Naval Academy Athletic Association. It is not endorsed, recommended, or favored by the United States government. These products are not official products of the United States Naval Academy. The views and opinions expressed do not necessarily state or reflect those of the United States Naval Academy, Department of the Navy, or Department of War.",
  USMA:
    "Firstie Firearms is a private, independent company founded by academy graduates. This private organization is a non-federal entity and not an official activity of the United States Military Academy. It is not endorsed, recommended, or favored by the United States government. These products are not official products of the United States Military Academy. The views and opinions expressed do not necessarily state or reflect those of the United States Military Academy, Department of the Army, or Department of War.",
  USAFA:
    "Firstie Firearms is a private, independent company founded by academy graduates. These products are not official products of the United States Air Force Academy and are not endorsed by the Academy or the Department of the Air Force. This is a private organization. It is not a part of the Department of War or any of its components and it has no governmental status. The views and opinions expressed do not necessarily state or reflect those of the United States Air Force Academy or the Department of War.",
}

export function AcademyDisclaimer({ academy }: { academy: Academy }) {
  const academyName = {
    USNA: "United States Naval Academy",
    USMA: "United States Military Academy",
    USAFA: "United States Air Force Academy",
  }[academy]

  return (
    <aside
      aria-label={`${academyName} disclaimer`}
      className="container mx-auto px-4 py-8 md:py-10"
    >
      <div className="mx-auto max-w-5xl rounded-sm border border-border bg-muted/20 px-4 py-4 md:px-6 md:py-5">
        <p className="font-serif text-xs leading-relaxed text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">{"Disclaimer: "}</span>
          {DISCLAIMER_COPY[academy]}
        </p>
      </div>
    </aside>
  )
}
