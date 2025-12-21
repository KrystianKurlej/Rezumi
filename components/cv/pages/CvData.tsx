import PersonalForm from "@/components/cv/form/personal"
import ExperienceForm from "@/components/cv/form/experience";
import EducationForm from "@/components/cv/form/education";
import SkillsForm from "@/components/cv/form/skills";
import FooterForm from "@/components/cv/form/footer";
import { Accordion } from "@/components/ui/accordion"
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CvData() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-file-earmark-person">
                <PageHeaderTitle>
                    CV Data
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Set up your core CV information. Add experience, skills, education, and personal details once and reuse them everywhere.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2">
                <Accordion type="multiple" defaultValue="personal-section">
                    <PersonalForm />
                    <ExperienceForm />
                    <EducationForm />
                    <SkillsForm />
                    <FooterForm />
                </Accordion>
            </div>
        </ScrollArea>
    )
}