import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectDesign } from "@/lib/slices/templatesSlice"
import { designs } from "@/components/cv-templates/index"
import Image from "next/image"

interface DesignCardProps {
    id: string
    selected?: boolean
    title: string
    description?: string
}

function DesignCard({ id, title, description }: DesignCardProps) {
    const dispatch = useAppDispatch()
    const selectedDesign = useAppSelector(state => state.templates.selectedDesign)

    const handleSelect = () => {
        dispatch(selectDesign(id))
    }
    
    return (
        <div
            id={id}
            className={`relative rounded transition-all overflow-hidden cursor-pointer border bg-background shadow-xs ${selectedDesign === id ? 'border-primary' : 'hover:bg-accent'} `}
            onClick={handleSelect}
        >
            <div className="bg-gray-50 dark:bg-gray-900 relative">
                <Image
                    src={`/templates-thumbs/${id}.png`}
                    alt={`${title} thumbnail`}
                    width={400}
                    height={200}
                />
            </div>
            <div className="p-4">
                <span className="font-semibold text-sm">{title}</span>
                {description && (
                    <p className="text-primary text-sm">{description}</p>
                )}
                {selectedDesign === id && <i className="bi bi-check-circle-fill text-lg absolute top-2 right-2"></i>}
            </div>
        </div>
    )
}

export default function DesignForm() {
    return (
        <div className="grid grid-cols-2 gap-2">
            {Object.entries(designs).map(([id, design]) => (
                <DesignCard
                    key={id}
                    id={id}
                    title={design.title}
                    description={design.description}
                />
            ))}
        </div>
    )
}