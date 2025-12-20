import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-6">
      <div className="h-full">
        <div className="h-full p-6 overflow-y-auto">
          Templates
        </div>
      </div>
      <div className="col-span-3 h-full">
        <div className="bg-gray-50 h-full p-6 border-x overflow-y-auto">
          <div className="p-2 bg-white shadow-sm">
            CV Preview
          </div>
        </div>
      </div>
      <div className="col-span-2 h-full">
        <div className="h-full p-6 overflow-y-auto">
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>
                  Personal Information
                </FieldLegend>
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="fistName">
                        First Name
                      </FieldLabel>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">
                        Last Name
                      </FieldLabel>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">
                      Email Address
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 890"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>Experience</FieldLegend>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
