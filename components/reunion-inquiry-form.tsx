"use client"

import { useRef, useState } from "react"
import { CircleAlert, CircleCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Academy } from "@/types"

const academyNames: Record<Academy, string> = {
  USNA: "United States Naval Academy",
  USMA: "United States Military Academy",
  USAFA: "United States Air Force Academy",
}

const SUCCESS_MESSAGE =
  "Thank you. We've received your reunion inquiry and a member of the Firstie Firearms team will be in touch."

type SubmitStatus = "idle" | "sending" | "success" | "error"

interface ReunionInquiryFormProps {
  initialAcademy?: Academy
}

export function ReunionInquiryForm({ initialAcademy }: ReunionInquiryFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    // Read values straight off the form so a failed send leaves every field
    // exactly as the customer typed it, with nothing to restore.
    const payload = Object.fromEntries(new FormData(form).entries())

    setStatus("sending")

    try {
      const response = await fetch("/api/reunion-inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setStatus("error")
        return
      }

      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  const isSending = status === "sending"

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4 text-center">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-primary">Reunion Editions</p>
          <h1 className="text-balance font-serif text-4xl text-foreground md:text-6xl">
            Contact Firstie Firearms Now
          </h1>
          <p className="text-pretty font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            Tell us about your class and reunion date so we can begin a conversation about a limited commemorative edition.
          </p>
        </header>

        <form
          ref={formRef}
          className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-10"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <div className="grid gap-7 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" name="name" autoComplete="name" required disabled={isSending} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" autoComplete="email" required disabled={isSending} />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" required disabled={isSending} />
              </Field>
              <Field>
                <FieldLabel htmlFor="academy">Academy</FieldLabel>
                <Select name="academy" defaultValue={initialAcademy} required disabled={isSending}>
                  <SelectTrigger id="academy" className="w-full">
                    <SelectValue placeholder="Select an academy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(academyNames).map(([code, name]) => (
                        <SelectItem key={code} value={code}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="class-year">Class</FieldLabel>
                <Input
                  id="class-year"
                  name="classYear"
                  inputMode="numeric"
                  placeholder="e.g. 1996"
                  required
                  disabled={isSending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="reunion-date">Reunion date</FieldLabel>
                <Input id="reunion-date" name="reunionDate" type="date" required disabled={isSending} />
                <FieldDescription>Use the expected date if your event is not yet finalized.</FieldDescription>
              </Field>
            </div>

            {/*
              Honeypot: positioned off-screen rather than `display:none`, since
              some bots skip hidden inputs. Real users never focus it, so any
              value here marks the submission as automated.
            */}
            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div aria-live="polite">
              {status === "success" && (
                <Alert>
                  <CircleCheck aria-hidden="true" />
                  <AlertTitle>Inquiry sent</AlertTitle>
                  <AlertDescription>{SUCCESS_MESSAGE}</AlertDescription>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>
                    {/*
                      Single <p> so the sentence and link flow inline —
                      AlertDescription is a grid, so bare siblings would each
                      become their own row and strand the closing period.
                    */}
                    <p>
                      We couldn&apos;t send your inquiry. Please try again or email{" "}
                      <a href="mailto:info@firstiefirearms.com" className="underline">
                        info@firstiefirearms.com
                      </a>
                      .
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSending}>
              {isSending ? "Sending…" : "Send reunion inquiry"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </main>
  )
}
