import {
  Avatar,
  AvatarColor
} from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectDesign } from "@/lib/slices/designSlice"

interface DesignCardProps {
    id: string
    selected?: boolean
    title: string
    description?: string
    colors: string[]
}

export const designs = {
    "classic": {
        title: "Classic",
        description: "A traditional layout with clear sections and headings.",
        colors: ['#000000', '#555555', '#AAAAAA']
    },
    "modern": {
        title: "Modern",
        description: "A sleek design with emphasis on typography and spacing.",
        colors: ['#1E3A8A', '#3B82F6', '#93C5FD']
    },
    "creative": {
        title: "Creative",
        description: "A visually engaging layout with unique elements.",
        colors: ['#9D174D', '#F472B6', '#FBCFE8']
    },
    "minimalist": {
        title: "Minimalist",
        description: "A clean and simple design focusing on content.",
        colors: ['#374151', '#6B7280', '#D1D5DB']
    }
}

export function DesignAvatar({ designId }: { designId: string }) {
    const design = designs[designId as keyof typeof designs]

    if (!design) return null

    return (
        <div className="flex -space-x-3 mb-2">
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
    const selectedDesign = useAppSelector(state => state.design.selectedDesign)

    const handleSelect = () => {
        dispatch(selectDesign(id))
    }
    
    return (
        <div
            id={id}
            className={`relative rounded p-4 transition-all overflow-hidden cursor-pointer border bg-background shadow-xs ${selectedDesign === id ? 'border-primary' : 'hover:bg-accent'} `}
            onClick={handleSelect}
        >
            <DesignAvatar designId={id} />
            <span className="font-semibold">{title}</span>
            {description && (
                <p className="text-gray-600 text-sm">{description}</p>
            )}
            {selectedDesign === id && <i className="bi bi-check-circle-fill text-lg absolute top-2 right-2"></i>}
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