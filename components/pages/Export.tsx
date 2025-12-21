import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Field,
  FieldDescription,
  FieldSet,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Export() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass="bi-send-arrow-down">
                <PageHeaderTitle>
                    Send & Save Application
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Create a PDF version of your CV and save it together with job details, so you always know what you sent and where.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4 pb-12">
                <FieldGroup>
                    <FieldSet>
                        <div>
                            <span className="text-lg font-semibold">
                                Send CV for a specific job
                            </span>
                            <FieldDescription>
                                Save this CV together with job details. When a recruiter calls, you can instantly see what version you sent and for which role.
                            </FieldDescription>
                        </div>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Filename
                                </FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="my-cv.pdf"
                                />
                                <FieldDescription>
                                    Set the desired filename for your exported CV.
                                </FieldDescription>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>
                                        Company Name
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="Acme Corp"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Job Title / Position
                                    </FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="Frontend Developer"
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel>
                                    Job Offer Link (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="https://..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Notes (optional)
                                </FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Recruiter name, tech stack, salary range, etc."
                                />
                            </Field>
                        </FieldGroup>
                        <Field>
                            <Button>
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF & Save as Application
                            </Button>
                            <FieldDescription className="text-center text-xs">
                                This will save a snapshot of your CV exactly as it was sent.
                            </FieldDescription>
                        </Field>
                    </FieldSet>
                    <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <span className="text-lg font-semibold">
                                Download CV only
                            </span>
                            <FieldDescription>
                                Just export your current CV as a PDF, without saving it to your applications.
                            </FieldDescription>
                        </div>
                        <Field>
                            <FieldLabel>
                                Filename
                            </FieldLabel>
                            <Input
                                type="text"
                                placeholder="my-cv.pdf"
                            />
                            <FieldDescription>
                                Set the desired filename for your exported CV.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <Button variant="secondary">
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                Download PDF
                            </Button>
                        </Field>
                    </FieldSet>
                    <FieldSet className="mt-2 pt-5 border-t">
                        <div>
                            <span className="text-lg font-semibold">
                                Export CV data
                            </span>
                            <FieldDescription>
                                Download your CV data as a file. Useful for backups or moving your data to another device.
                            </FieldDescription>
                        </div>
                        <Field>
                            <Button variant="secondary">
                                <i className="bi bi-download"></i>
                                Export CV Data (JSON)
                            </Button>
                            <FieldDescription className="text-center text-xs">
                                This file is not a CV. It contains editable data only.
                            </FieldDescription >
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </div>
        </ScrollArea>
    )
}