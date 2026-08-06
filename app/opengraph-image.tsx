import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Firstie Firearms — Commemorative Service Academy Pistols"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FF_logo_b7946b_transparent_3x2_sticker-Xhndhjntfrtu0cxctix0wVGKjyVaQH.png"
          alt="Firstie Firearms logo"
          width={600}
          height={400}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
