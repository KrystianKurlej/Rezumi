'use client'

import { useAppSelector } from "@/lib/hooks"

export default function Preview() {
    const personal = useAppSelector(state => state.personal)

    return(
        <div className="p-8 bg-white shadow-sm">
            <div className="text-sm text-gray-500">CV</div>
            <div className="text-4xl font-semibold">{personal.firstName} {personal.lastName}</div>
            <div className="py-1 border-b">
                <div>{personal.email}</div>
                <div>{personal.phone}</div>
            </div>
        </div>
    )
}