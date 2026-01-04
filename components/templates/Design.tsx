import {
  Avatar,
  AvatarColor
} from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectDesign } from "@/lib/slices/templatesSlice"
import { designs } from "@/lib/data/designs"
import Image from "next/image"

interface DesignCardProps {
    id: string
    selected?: boolean
    title: string
    description?: string
    colors: string[]
}

export function DesignAvatar({ designId, thumbnail }: { designId: string, thumbnail?: boolean }) {
    const design = designs[designId as keyof typeof designs]

    if (!design) return null

    return (
        <div className={`flex -space-x-3 ${thumbnail && `absolute bottom-2 left-2`}`}>
            {design.colors.map((color, index) => (
                <Avatar key={index}>
                    <AvatarColor style={{ backgroundColor: color }} />
                </Avatar>
            ))}
        </div>
    )
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
            <div className="bg-gray-50 relative">
                <Image
                    src={`/templates-thumbs/${id}.png`}
                    alt={`${title} thumbnail`}
                    width={400}
                    height={200}
                />
                <DesignAvatar designId={id} thumbnail={true} />
            </div>
            <div className="p-4">
                <span className="font-semibold text-sm">{title}</span>
                {description && (
                    <p className="text-gray-600 text-sm">{description}</p>
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
                    colors={design.colors}
                />
            ))}
        </div>
    )
}