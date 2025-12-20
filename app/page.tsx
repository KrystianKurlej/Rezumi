'use client'

import PersonalForm from "@/components/cv/form/personal"
import Preview from "@/components/cv/preview";
import {
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

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
          <Preview />
        </div>
      </div>
      <div className="col-span-2 h-full">
        <div className="h-full p-6 overflow-y-auto">
          <form>
            <FieldGroup>
              <PersonalForm />
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
