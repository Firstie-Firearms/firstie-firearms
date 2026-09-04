import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Three Columns */}
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-4 md:gap-8 md:text-left">
          {/* Firstie Firearms Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: "#b8946a" }}>
              {"Firstie Firearms LLC"}
            </h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>{"Veteran-owned"}</p>
              <p>{"Academy-graduate founded"}</p>
              <p>{"Type 07 Federal Firearms Licensee"}</p>
              <p className="text-xs pt-0.5">{"FFL: 5-75-113-07-9F-42974"}</p>
            </div>
          </div>

          {/* Customer Service Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: "#b8946a" }}>
              {"Customer Service"}
            </h3>
            <div className="space-y-2">
              <Link
                href="/faq"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                {"Frequently Asked Questions"}
              </Link>
            </div>
          </div>

          {/* Policies Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: "#b8946a" }}>Policies</h3>
            <div className="space-y-2">
              <Link href="/refund-policy" className="block text-sm text-muted-foreground underline transition-colors hover:text-foreground">Refund Policy</Link>
              <Link href="/terms-and-conditions" className="block text-sm text-muted-foreground underline transition-colors hover:text-foreground">Terms &amp; Conditions</Link>
              <Link href="/shipping-policy" className="block text-sm text-muted-foreground underline transition-colors hover:text-foreground">Shipping Policy</Link>
              <Link href="/delivery-timeframe" className="block text-sm text-muted-foreground underline transition-colors hover:text-foreground">Delivery Timeframe</Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: "#b8946a" }}>
              {"Contact"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{"Dallas, TX 75229"}</p>
              <p>
                <a href="mailto:info@firstiefirearms.com" className="hover:text-foreground transition-colors">
                  {"info@firstiefirearms.com"}
                </a>
              </p>

            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
