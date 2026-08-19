"use client"

import { BellRing } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ReleaseNotificationDialogProps {
  academy: string
  classYear: string
  gold: string
  triggerClassName: string
}

export function ReleaseNotificationDialog({
  academy,
  classYear,
  gold,
  triggerClassName,
}: ReleaseNotificationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName} style={{ backgroundColor: gold }}>
          <span className="text-center text-xs sm:text-sm">SIGN UP FOR RELEASE NOTIFICATION</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Release notification</DialogTitle>
          <DialogDescription>
            Be notified when the {academy} {classYear} commemorative pistol is released.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="release-email">Email address</FieldLabel>
            <Input id="release-email" type="email" autoComplete="email" placeholder="name@example.com" disabled />
            <FieldDescription>
              Academy and class context will be sent with your email when Klaviyo is connected.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <Alert>
          <BellRing aria-hidden="true" />
          <AlertTitle>Signup connection in progress</AlertTitle>
          <AlertDescription>
            The form is prepared for Klaviyo, but submissions are temporarily unavailable.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" disabled className="w-full sm:w-auto">
            Sign up for release notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
