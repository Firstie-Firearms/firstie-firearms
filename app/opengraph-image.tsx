import { ImageResponse } from "next/og"
import { logoDataUrl } from "@/lib/og-logo"

export const runtime = "edge"
export const alt = "Firstie Firearms — Commemorative Service Academy Pistols"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUrl}
          alt="Firstie Firearms"
          style={{ width: 520, height: "auto", objectFit: "contain" }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
