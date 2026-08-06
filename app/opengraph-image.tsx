import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Firstie Firearms — Commemorative Service Academy Pistols"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  const logoUrl = new URL(
    "/firstie-logo-transparent.png",
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ).toString()

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
          src={logoUrl}
          alt="Firstie Firearms"
          style={{ width: 540, height: "auto", objectFit: "contain" }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
