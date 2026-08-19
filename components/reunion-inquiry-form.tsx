"use client"

import { Mail } from "lucide-react"
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

interface ReunionInquiryFormProps {
  initialAcademy?: Academy
}

export function ReunionInquiryForm({ initialAcademy }: ReunionInquiryFormProps) {
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

        <form className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-10" onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <div className="grid gap-7 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" name="name" autoComplete="name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="academy">Academy</FieldLabel>
                <Select name="academy" defaultValue={initialAcademy}>
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
                <Input id="class-year" name="classYear" inputMode="numeric" placeholder="e.g. 1996" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="reunion-date">Reunion date</FieldLabel>
                <Input id="reunion-date" name="reunionDate" type="date" required />
                <FieldDescription>Use the expected date if your event is not yet finalized.</FieldDescription>
              </Field>
            </div>

            <Alert>
              <Mail aria-hidden="true" />
              <AlertTitle>Email delivery is being connected</AlertTitle>
              <AlertDescription>
                This form is ready to send inquiries to info@firstiefirearms.com once an email provider is added. Submission is temporarily disabled.
              </AlertDescription>
            </Alert>

            <Button type="submit" size="lg" className="w-full" disabled>
              Send reunion inquiry
            </Button>
          </FieldGroup>
        </form>
      </div>
    </main>
  )
}
