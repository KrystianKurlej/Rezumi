'use client'

import { useState, ReactNode } from 'react'
import { updateTemplate } from '@/lib/db/templates'
import { DBTemplates } from '@/lib/db/types'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSelectedDesign, setCurrentDesignId } from "@/lib/slices/templatesSlice"
import { reloadPreview } from "@/lib/slices/previewSlice"
import DesignForm from "@/components/templates/Design"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from '../ui/textarea'
import { ExperienceTemplateSection } from './ExperienceTemplateSection'
import { EducationTemplateSection } from './EducationTemplateSection'
import { CoursesTemplateSection } from './CoursesTemplateSection'
import { SkillsTemplateSection } from './SkillsTemplateSection'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface TemplateEditDialogProps {
  template: DBTemplates
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => Promise<void>
  trigger: ReactNode
}

function TemplateEditSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className='mb-2'>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TemplateEditSectionItem({children, clx}: { children: ReactNode, clx?: string }) {
  return (
    <div className={`p-4 border border-secondary rounded-md mb-2 flex gap-2 justify-between ${clx}`}>
      {children}
    </div>
  )
}

function TemplateEditSectionItemTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="text font-medium text-foreground">
      {children}
    </h4>
  )
}

function TemplateEditSectionWithToggle({ 
  title, 
  checked, 
  onCheckedChange,
  customValue,
  onCustomValueChange,
  placeholder 
}: { 
  title: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  customValue?: string
  onCustomValueChange?: (value: string) => void
  placeholder?: string
}) {
  const hasCustomContent = customValue !== undefined && customValue !== ''
  
  return (
    <TemplateEditSectionItem>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <TemplateEditSectionItemTitle>{title}</TemplateEditSectionItemTitle>
          <Switch
            id={`${title}-show`}
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
        </div>
        {onCustomValueChange && (
          <Textarea
            className="mt-2"
            placeholder={placeholder || `Custom ${title.toLowerCase()} content`}
            value={customValue || ''}
            onChange={(e) => onCustomValueChange(e.target.value)}
            rows={4}
          />
        )}
      </div>
    </TemplateEditSectionItem>
  )
}

export function TemplateEditDialog({ 
  template, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: TemplateEditDialogProps) {
  const dispatch = useAppDispatch()
  const selectedDesign = useAppSelector(state => state.templates.selectedDesign)
  const experiences = useAppSelector(state => state.experiences.list) || []
  const educations = useAppSelector(state => state.educations.list) || []
  const courses = useAppSelector(state => state.courses.list) || []
  const skills = useAppSelector(state => state.skills.skills) || []
  const [editingTemplate, setEditingTemplate] = useState<DBTemplates | null>(null)

  const handleResetValues = () => {
    if (!editingTemplate) return
    
    setEditingTemplate({
      ...editingTemplate,
      personalInformation: {
        ...editingTemplate.personalInformation,
        profilePicture: {
          disabled: false,
        },
        about: {
          disabled: false,
          customValue: '',
        }
      },
      experience: {
        disabled: [],
        customValues: {}
      },
      education: {
        disabled: [],
        customValues: {}
      },
      courses: {
        disabled: [],
        customValues: {}
      },
      skills: {
        disabled: [],
        customValues: {}
      },
      links: {
        disabled: []
      },
      freelance: {
        disabled: false,
        customValue: ''
      },
      footer: {
        disabled: false,
        customValue: ''
      }
    })
  }

  const handleEditChange = (field: keyof DBTemplates, value: string) => {
    setEditingTemplate((prev: DBTemplates | null) => ({
      ...prev,
      [field]: value
    }) as DBTemplates)
  }

  const handleEditSubmit = async () => {
    try {
      if (!editingTemplate) return
      
      const updatedData = {
        name: editingTemplate.name ?? template.name,
        designId: selectedDesign,
        personalInformation: editingTemplate.personalInformation,
        experience: editingTemplate.experience,
        education: editingTemplate.education,
        courses: editingTemplate.courses,
        skills: editingTemplate.skills,
        links: editingTemplate.links,
        freelance: editingTemplate.freelance,
        footer: editingTemplate.footer
      }
      
      await updateTemplate(template.id!, updatedData)
      await onUpdate()
      setEditingTemplate(null)
      dispatch(setSelectedDesign('classic'))
      dispatch(setCurrentDesignId(selectedDesign))
      dispatch(reloadPreview())
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditingTemplate({ ...template })
      dispatch(setSelectedDesign(template.designId))
    } else {
      setEditingTemplate(null)
      dispatch(setSelectedDesign('classic'))
    }
    onOpenChange(newOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit <em>{template.name}</em></SheetTitle>
          <SheetDescription>Templates let you create CV variations without duplicating your data. You can hide sections or override content for specific roles.</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`templateName${template.id}`}>
                Template Name
              </FieldLabel>
              <Input
                id={`templateName${template.id}`}
                value={editingTemplate?.name || template.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                placeholder="e.g. Software Engineer CV"
              />
            </Field>
          </FieldGroup>
        </div>
        <Tabs defaultValue="appearance">
          <TabsList className='mt-2 mb-2'>
            <TabsTrigger value="appearance">
              <i className="bi bi-palette"></i>
              Visual Settings
            </TabsTrigger>
            <TabsTrigger value="content">
              <i className="bi bi-sliders"></i>
              Content Rules
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appearance">
            <FieldGroup>
              <Field>
                <DesignForm />
              </Field>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="content">
            <FieldGroup>
              <Field>
                <TemplateEditSection title="Personal Information">
                  <TemplateEditSectionItem clx="items-center">
                    <TemplateEditSectionItemTitle>Profile Picture</TemplateEditSectionItemTitle>
                    <Switch
                      id="profile-picture-show"
                      checked={!editingTemplate?.personalInformation?.profilePicture?.disabled}
                      onCheckedChange={(checked) => {
                        setEditingTemplate(prev => prev ? {
                          ...prev,
                          personalInformation: {
                            ...prev.personalInformation,
                            profilePicture: {
                              disabled: !checked
                            }
                          }
                        } : null)
                      }}
                    />
                  </TemplateEditSectionItem>
                  
                  <TemplateEditSectionWithToggle
                    title="About"
                    checked={!editingTemplate?.personalInformation?.about?.disabled}
                    onCheckedChange={(checked) => {
                      setEditingTemplate(prev => prev ? {
                        ...prev,
                        personalInformation: {
                          ...prev.personalInformation,
                          about: {
                            ...prev.personalInformation?.about,
                            disabled: !checked
                          }
                        }
                      } : null)
                    }}
                    customValue={editingTemplate?.personalInformation?.about?.customValue}
                    onCustomValueChange={(value) => {
                      setEditingTemplate(prev => prev ? {
                        ...prev,
                        personalInformation: {
                          ...prev.personalInformation,
                          about: {
                            ...prev.personalInformation?.about,
                            customValue: value
                          }
                        }
                      } : null)
                    }}
                    placeholder="Write custom about section (leave empty to use default)"
                  />
                </TemplateEditSection>
                
                <TemplateEditSection title="Links & Socials">
                  <div className="flex flex-col gap-2">
                    {['linkedin', 'github', 'portfolio', 'website', 'twitter', 'facebook', 'instagram'].map((link) => (
                      <TemplateEditSectionItem key={link} clx="items-center">
                        <TemplateEditSectionItemTitle>
                          <span className="capitalize">{link}</span>
                        </TemplateEditSectionItemTitle>
                        <Switch
                          id={`link-${link}`}
                          checked={!editingTemplate?.links?.disabled?.includes(link)}
                          onCheckedChange={(checked) => {
                            setEditingTemplate(prev => {
                              if (!prev) return null
                              const currentDisabled = prev.links?.disabled || []
                              return {
                                ...prev,
                                links: {
                                  disabled: checked
                                    ? currentDisabled.filter(l => l !== link)
                                    : [...currentDisabled, link]
                                }
                              }
                            })
                          }}
                        />
                      </TemplateEditSectionItem>
                    ))}
                  </div>
                </TemplateEditSection>
                
                <TemplateEditSection title="Experience">
                  <ExperienceTemplateSection
                    experiences={experiences}
                    editingTemplate={editingTemplate}
                    onUpdate={setEditingTemplate}
                  />
                </TemplateEditSection>
                
                <TemplateEditSection title="Education">
                  <EducationTemplateSection
                    educations={educations}
                    editingTemplate={editingTemplate}
                    onUpdate={setEditingTemplate}
                  />
                </TemplateEditSection>
                
                <TemplateEditSection title="Courses">
                  <CoursesTemplateSection
                    courses={courses}
                    editingTemplate={editingTemplate}
                    onUpdate={setEditingTemplate}
                  />
                </TemplateEditSection>
                
                <TemplateEditSection title="Skills">
                  <SkillsTemplateSection
                    skills={skills}
                    editingTemplate={editingTemplate}
                    onUpdate={setEditingTemplate}
                  />
                </TemplateEditSection>
                
                <TemplateEditSectionWithToggle
                  title="Freelance"
                  checked={!editingTemplate?.freelance?.disabled}
                  onCheckedChange={(checked) => {
                    setEditingTemplate(prev => prev ? {
                      ...prev,
                      freelance: {
                        ...prev.freelance,
                        disabled: !checked
                      }
                    } : null)
                  }}
                  customValue={editingTemplate?.freelance?.customValue}
                  onCustomValueChange={(value) => {
                    setEditingTemplate(prev => prev ? {
                      ...prev,
                      freelance: {
                        ...prev.freelance,
                        customValue: value
                      }
                    } : null)
                  }}
                  placeholder="Custom freelance content (leave empty to use default)"
                />
                
                <TemplateEditSectionWithToggle
                  title="Footer"
                  checked={!editingTemplate?.footer?.disabled}
                  onCheckedChange={(checked) => {
                    setEditingTemplate(prev => prev ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        disabled: !checked
                      }
                    } : null)
                  }}
                  customValue={editingTemplate?.footer?.customValue}
                  onCustomValueChange={(value) => {
                    setEditingTemplate(prev => prev ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        customValue: value
                      }
                    } : null)
                  }}
                  placeholder="Custom footer content (leave empty to use default)"
                />
                
                <Button variant="outline" className="mt-1" onClick={handleResetValues}>
                  Reset all content customizations
                  <i className="bi bi-arrow-clockwise ml-2"></i>
                </Button>
              </Field>
            </FieldGroup>
          </TabsContent>
        </Tabs>
        <SheetFooter>
          <Button onClick={handleEditSubmit}>
            Save Changes <i className="bi bi-check"></i>
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
