export type Academy = "USNA" | "USMA" | "USAFA"

export interface AcademyColors {
  primary: string
  secondary: string
}

export const academyColors: Record<Academy, AcademyColors> = {
  USNA: { primary: "#002147", secondary: "#C5B358" },
  USMA: { primary: "#000000", secondary: "#D3BC8D" },
  USAFA: { primary: "#00308F", secondary: "#B2B4B2" },
}

export const academyNames: Record<Academy, string> = {
  USNA: "United States Naval Academy",
  USMA: "United States Military Academy",
  USAFA: "United States Air Force Academy",
}
