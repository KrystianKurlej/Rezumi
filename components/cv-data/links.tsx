'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setLinks, loadLinksFromDB } from '@/lib/slices/linksSlice'
import { updateLinks as updateLinksDB, getLinks } from '@/lib/db'
import type { Links } from '@/lib/db/types'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '../ui/field'
import { InputGroup, InputGroupInput } from '../ui/input-group'
import { Button } from '../ui/button'
import { InputHint } from '../pages/CvData'

const linkFields: Array<{ key: keyof Links; label: string; placeholder: string }> = [
    { key: 'portfolio', label: 'Portfolio', placeholder: 'https://your-portfolio.com' },
    { key: 'website', label: 'Website', placeholder: 'https://your-site.com' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
]

export default function LinksForm() {
    const dispatch = useAppDispatch()
    const links = useAppSelector(state => state.links)
    const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)
    const defaultLanguage = useAppSelector(state => state.settings.defaultLanguage)
    const [localLinks, setLocalLinks] = useState<Links>({
        languageId: links.languageId,
        linkedin: links.linkedin || '',
        github: links.github || '',
        portfolio: links.portfolio || '',
        twitter: links.twitter || '',
        facebook: links.facebook || '',
        instagram: links.instagram || '',
        website: links.website || '',
    })
    const [defaultLanguageData, setDefaultLanguageData] = useState<Links | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        dispatch(loadLinksFromDB())

        if (selectedLanguage !== defaultLanguage) {
            getLinks(null).then((data) => {
                if (data) {
                    setDefaultLanguageData({
                        languageId: null,
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        portfolio: data.portfolio || '',
                        twitter: data.twitter || '',
                        facebook: data.facebook || '',
                        instagram: data.instagram || '',
                        website: data.website || '',
                    })
                }
            })
        } else {
            setDefaultLanguageData(null)
        }
    }, [selectedLanguage, defaultLanguage, dispatch])

    useEffect(() => {
        setLocalLinks({
            languageId: links.languageId,
            linkedin: links.linkedin || '',
            github: links.github || '',
            portfolio: links.portfolio || '',
            twitter: links.twitter || '',
            facebook: links.facebook || '',
            instagram: links.instagram || '',
            website: links.website || '',
        })
    }, [links])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id as keyof Links
        setLocalLinks((prev: Links) => ({ ...prev, [key]: value }))
    }

    const getDefaultLanguageHint = (fieldName: keyof Links): string | null => {
        if (selectedLanguage === defaultLanguage) return null
        if (!defaultLanguageData) return null
        if (localLinks[fieldName]) return null
        if (!defaultLanguageData[fieldName]) return null
        return (defaultLanguageData[fieldName] as string) || null
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null
            const dataToSave: Links = { ...localLinks, languageId }
            await updateLinksDB(dataToSave)
            dispatch(setLinks(dataToSave))
        } catch (error) {
            console.error('Error saving links:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AccordionItem value="links-section">
            <AccordionTrigger>
                Links & Socials
            </AccordionTrigger>
            <AccordionContent>
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {linkFields.map(({ key, label, placeholder }) => (
                            <Field key={key}>
                                <FieldLabel htmlFor={key as string}>{label}</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id={key as string}
                                        value={(localLinks[key] as string) || ''}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        type="url"
                                    />
                                    {getDefaultLanguageHint(key) && (
                                        <InputHint
                                            onClick={() => {
                                                setLocalLinks((prev: Links) => ({
                                                    ...prev,
                                                    [key]: getDefaultLanguageHint(key) || '',
                                                }))
                                            }}
                                        >
                                            {getDefaultLanguageHint(key)}
                                        </InputHint>
                                    )}
                                </InputGroup>
                            </Field>
                        ))}
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        Save Links <i className="bi bi-check"></i>
                    </Button>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    )
}