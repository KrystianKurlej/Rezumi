'use client'

import PersonalForm from "@/components/cv/form/personal"
import ExperienceForm from "@/components/cv/form/experience";
import EducationForm from "@/components/cv/form/education";
import SkillsForm from "@/components/cv/form/skills";
import FooterForm from "@/components/cv/form/footer";
import Preview from "@/components/cv/preview";
import PreviewScale from "@/components/PreviewScale";
import { Accordion } from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="grid grid-cols-6">
      <div className="h-screen p-6 overflow-y-auto">
      </div>
      <div className="col-span-3 bg-gray-50 h-screen px-6 border-x overflow-y-hidden relative">
        <div className="h-full overflow-auto w-full my-6">
          <Preview />
        </div>
        <PreviewScale />
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
        <Accordion type="multiple" defaultValue="personal-section">
          <PersonalForm />
          <ExperienceForm />
          <EducationForm />
          <SkillsForm />
          <FooterForm />
        </Accordion>
      </div>
    </div>
  );
}
