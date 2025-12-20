'use client'

import PersonalForm from "@/components/cv/form/personal"
import ExperienceForm from "@/components/cv/form/experience";
import EducationForm from "@/components/cv/form/education";
import FooterForm from "@/components/cv/form/footer";
import Preview from "@/components/cv/preview";
import {
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"

export default function Home() {
  return (
    <div className="grid grid-cols-6">
      <div className="h-screen p-6 overflow-y-auto">
      </div>
      <div className="col-span-3 bg-gray-50 h-screen p-6 border-x overflow-y-auto">
        <Preview />
      </div>
      <div className="col-span-2 h-screen py-6 px-3 overflow-y-auto">
        <div className="px-3 mb-4">
          <h2 className="text-lg font-semibold mb-1">
            Configure Your CV
          </h2>
          <p className="text-gray-500 text-sm">
            Complete sections below to build your CV
          </p>
        </div>
        <FieldGroup>
          <PersonalForm />
          <FieldSeparator />
          <ExperienceForm />
          <FieldSeparator />
          <EducationForm />
          <FieldSeparator />
          <FooterForm />
        </FieldGroup>
      </div>
    </div>
  );
}
