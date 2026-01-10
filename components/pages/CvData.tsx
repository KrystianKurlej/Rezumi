import PersonalForm from "@/components/cv-data/personal"
import ExperienceForm from "@/components/cv-data/experience";
import EducationForm from "@/components/cv-data/education";
import CoursesForm from "@/components/cv-data/courses";
import SkillsForm from "@/components/cv-data/skills";
import FreelanceForm from "../cv-data/freelance";
import FooterForm from "@/components/cv-data/footer";
import { Accordion } from "@/components/ui/accordion"
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";
import { getLanguageName } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { InputGroupAddon, InputGroupButton } from "../ui/input-group";
import { getMenuItems } from "@/components/AppSidebar";
import LinksForm from "../cv-data/links";

const contentData = getMenuItems({slug: "personal"});

export function InputHint({ children, onClick, variant }: { 
    children: React.ReactNode; 
    onClick: () => void;
    variant?: "short" | "full";
}) {
    return (
        <InputGroupAddon align="inline-end" className={variant === "full" ? "max-w-[100%]" : "max-w-[50%]"}>
            <InputGroupButton
                variant="secondary"
                onClick={onClick}
                className="max-w-[100%] gap-0"
            >
                <i className="bi bi-copy text-xs"></i>&nbsp;
                <span className="truncate">{children}</span>
            </InputGroupButton>
        </InputGroupAddon>
    )
}

export default function CvData() {
    const selectedLanguage = useAppSelector((state) => state.preview.selectedLanguage);

    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.personal}>
                <PageHeaderTitle>
                    {contentData?.title}
                </PageHeaderTitle>
                <PageHeaderDescription>
                    {contentData?.description}
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2 pb-16">
                {selectedLanguage && (
                    <p className="text-xs text-primary px-3 py-2">
                        <i className="bi bi-info-circle mr-1"></i>
                        You&apos;re editing {getLanguageName(selectedLanguage)} version
                    </p>
                )}
                <Accordion type="single" collapsible>
                    <PersonalForm />
                    <LinksForm />
                    <ExperienceForm />
                    <EducationForm />
                    <CoursesForm />
                    <SkillsForm />
                    <FreelanceForm />
                    <FooterForm />
                </Accordion>
            </div>
        </ScrollArea>
    )
}