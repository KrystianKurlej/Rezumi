import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ExperienceForm() {
    return(
        <>
        <FieldLegend>
            Experience
        </FieldLegend>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                    Add New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Experience</DialogTitle>
                    <DialogDescription>
                        Add your work experience details here.
                    </DialogDescription>
                </DialogHeader>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">
                                Title
                            </FieldLabel>
                            <Input
                                id="title"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="company">
                                Company
                            </FieldLabel>
                            <Input
                                id="company"
                            />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="startDate">
                                    Start Date
                                </FieldLabel>
                                <Input
                                    id="startDate"
                                    type="date"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="endDate">
                                    End Date
                                </FieldLabel>
                                <Input
                                    id="endDate"
                                    type="date"
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}