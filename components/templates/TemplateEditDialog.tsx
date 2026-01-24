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
import { setSelectedDesign } from "@/lib/slices/templatesSlice"
import DesignForm from "@/components/templates/Design"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

export function TemplateEditDialog({ 
  template, 
  open, 
  onOpenChange, 
  onUpdate,
  trigger 
}: TemplateEditDialogProps) {
  const dispatch = useAppDispatch()
  const selectedDesign = useAppSelector(state => state.templates.selectedDesign)
  const experiences = useAppSelector(state => state.experiences.list)
  const educations = useAppSelector(state => state.educations.list)
  const courses = useAppSelector(state => state.courses.list)
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
        disabled: false,
        customValue: ''
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
        <div className='px-4'>
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
          <Tabs defaultValue="appearance">
            <TabsList className='mt-6 mb-2'>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
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
                  <Accordion type="single" collapsible>
                    <AccordionItem value="personal-information">
                      <AccordionTrigger>Personal Information</AccordionTrigger>
                      <AccordionContent>
                        <div className='border p-3 rounded mb-1'>
                          <div className="text-foreground mb-1">Profile picture</div>
                          <div className="flex items-center space-x-2 py-1">
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
                            <Label htmlFor="profile-picture-show">Show section</Label>
                          </div>
                        </div>
                        <div className='border p-3 rounded'>
                          <div className="text-foreground mb-1">About</div>
                          <div className="flex items-center space-x-2 py-1">
                            <Switch
                              id="about-show"
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
                            />
                            <Label htmlFor="about-show">Show section</Label>
                          </div>
                          <div className="flex items-center space-x-2 py-1">
                            <Switch
                              id="about-custom"
                              checked={editingTemplate?.personalInformation?.about?.customValue !== undefined && editingTemplate?.personalInformation?.about?.customValue !== ''}
                              onCheckedChange={(checked) => {
                                setEditingTemplate(prev => {
                                  if (!prev) return null
          
                                  return {
                                    ...prev,
                                    personalInformation: {
                                      ...prev.personalInformation,
                                      about: {
                                        ...prev.personalInformation?.about,
                                        customValue: checked ? (prev.personalInformation?.about?.customValue || ' ') : ''
                                      }
                                    }
                                  }
                                })
                              }}
                            />
                            <Label htmlFor="about-custom">Use custom content</Label>
                          </div>
                          {(editingTemplate?.personalInformation?.about?.customValue !== undefined && editingTemplate?.personalInformation?.about?.customValue !== '') && (
                            <Textarea
                              className="mt-2"
                              placeholder="Write something about yourself"
                              value={editingTemplate?.personalInformation?.about?.customValue || ''}
                              onChange={(e) => {
                                setEditingTemplate(prev => prev ? {
                                  ...prev,
                                  personalInformation: {
                                    ...prev.personalInformation,
                                    about: {
                                      ...prev.personalInformation?.about,
                                      customValue: e.target.value
                                    }
                                  }
                                } : null)
                              }}
                            />
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="links">
                      <AccordionTrigger>Links & Socials</AccordionTrigger>
                      <AccordionContent>
                        <div className='border p-3 rounded mb-2'>
                          <div className="text-foreground mb-2">Select which social media links to show</div>
                          <div className="flex flex-col gap-2">
                            {['linkedin', 'github', 'portfolio', 'website', 'twitter', 'facebook', 'instagram'].map((link) => (
                              <div key={link} className="flex items-center space-x-2">
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
                                <Label htmlFor={`link-${link}`} className="capitalize">{link}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="experience">
                      <AccordionTrigger>Experience</AccordionTrigger>
                      <AccordionContent>
                        <ExperienceTemplateSection
                          experiences={experiences}
                          editingTemplate={editingTemplate}
                          onUpdate={setEditingTemplate}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="education">
                      <AccordionTrigger>Education</AccordionTrigger>
                      <AccordionContent>
                        <EducationTemplateSection
                          educations={educations}
                          editingTemplate={editingTemplate}
                          onUpdate={setEditingTemplate}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="courses">
                      <AccordionTrigger>Courses</AccordionTrigger>
                      <AccordionContent>
                        <CoursesTemplateSection
                          courses={courses}
                          editingTemplate={editingTemplate}
                          onUpdate={setEditingTemplate}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="skills">
                      <AccordionTrigger>Skills</AccordionTrigger>
                      <AccordionContent>
                        <div className='border p-3 rounded'>
                          <div className="text-foreground mb-1">Skills</div>
                          <div className="flex items-center space-x-2 py-1">
                            <Switch
                              id="skills-show"
                              checked={!editingTemplate?.skills?.disabled}
                              onCheckedChange={(checked) => {
                                setEditingTemplate(prev => prev ? {
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    disabled: !checked
                                  }
                                } : null)
                              }}
                            />
                            <Label htmlFor="skills-show">Show section</Label>
                          </div>
                          {!editingTemplate?.skills?.disabled && (
                            <>
                              <div className="flex items-center space-x-2 py-1">
                                <Switch
                                  id="skills-custom"
                                  checked={editingTemplate?.skills?.customValue !== undefined && editingTemplate?.skills?.customValue !== ''}
                                  onCheckedChange={(checked) => {
                                    setEditingTemplate(prev => {
                                      if (!prev) return null
                                      return {
                                        ...prev,
                                        skills: {
                                          ...prev.skills,
                                          customValue: checked ? (prev.skills?.customValue || ' ') : ''
                                        }
                                      }
                                    })
                                  }}
                                />
                                <Label htmlFor="skills-custom">Use custom content</Label>
                              </div>
                              {(editingTemplate?.skills?.customValue !== undefined && editingTemplate?.skills?.customValue !== '') && (
                                <Textarea
                                  className="mt-2"
                                  placeholder="Custom skills content"
                                  value={editingTemplate?.skills?.customValue || ''}
                                  onChange={(e) => {
                                    setEditingTemplate(prev => prev ? {
                                      ...prev,
                                      skills: {
                                        ...prev.skills,
                                        customValue: e.target.value
                                      }
                                    } : null)
                                  }}
                                  rows={4}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="freelance">
                      <AccordionTrigger>Freelance</AccordionTrigger>
                      <AccordionContent>
                        <div className='border p-3 rounded'>
                          <div className="text-foreground mb-1">Freelance</div>
                          <div className="flex items-center space-x-2 py-1">
                            <Switch
                              id="freelance-show"
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
                            />
                            <Label htmlFor="freelance-show">Show section</Label>
                          </div>
                          {!editingTemplate?.freelance?.disabled && (
                            <>
                              <div className="flex items-center space-x-2 py-1">
                                <Switch
                                  id="freelance-custom"
                                  checked={editingTemplate?.freelance?.customValue !== undefined && editingTemplate?.freelance?.customValue !== ''}
                                  onCheckedChange={(checked) => {
                                    setEditingTemplate(prev => {
                                      if (!prev) return null
                                      return {
                                        ...prev,
                                        freelance: {
                                          ...prev.freelance,
                                          customValue: checked ? (prev.freelance?.customValue || ' ') : ''
                                        }
                                      }
                                    })
                                  }}
                                />
                                <Label htmlFor="freelance-custom">Use custom content</Label>
                              </div>
                              {(editingTemplate?.freelance?.customValue !== undefined && editingTemplate?.freelance?.customValue !== '') && (
                                <Textarea
                                  className="mt-2"
                                  placeholder="Custom freelance content"
                                  value={editingTemplate?.freelance?.customValue || ''}
                                  onChange={(e) => {
                                    setEditingTemplate(prev => prev ? {
                                      ...prev,
                                      freelance: {
                                        ...prev.freelance,
                                        customValue: e.target.value
                                      }
                                    } : null)
                                  }}
                                  rows={4}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="footer">
                      <AccordionTrigger>Footer</AccordionTrigger>
                      <AccordionContent>
                        <div className='border p-3 rounded'>
                          <div className="text-foreground mb-1">Footer</div>
                          <div className="flex items-center space-x-2 py-1">
                            <Switch
                              id="footer-show"
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
                            />
                            <Label htmlFor="footer-show">Show section</Label>
                          </div>
                          {!editingTemplate?.footer?.disabled && (
                            <>
                              <div className="flex items-center space-x-2 py-1">
                                <Switch
                                  id="footer-custom"
                                  checked={editingTemplate?.footer?.customValue !== undefined && editingTemplate?.footer?.customValue !== ''}
                                  onCheckedChange={(checked) => {
                                    setEditingTemplate(prev => {
                                      if (!prev) return null
                                      return {
                                        ...prev,
                                        footer: {
                                          ...prev.footer,
                                          customValue: checked ? (prev.footer?.customValue || ' ') : ''
                                        }
                                      }
                                    })
                                  }}
                                />
                                <Label htmlFor="footer-custom">Use custom content</Label>
                              </div>
                              {(editingTemplate?.footer?.customValue !== undefined && editingTemplate?.footer?.customValue !== '') && (
                                <Textarea
                                  className="mt-2"
                                  placeholder="Custom footer content"
                                  value={editingTemplate?.footer?.customValue || ''}
                                  onChange={(e) => {
                                    setEditingTemplate(prev => prev ? {
                                      ...prev,
                                      footer: {
                                        ...prev.footer,
                                        customValue: e.target.value
                                      }
                                    } : null)
                                  }}
                                  rows={4}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button variant="outline" className="mt-1" onClick={handleResetValues}>
                    Reset all content customizations
                    <i className="bi bi-arrow-clockwise ml-2"></i>
                  </Button>
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </div>
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
