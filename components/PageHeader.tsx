import React from 'react';

export function PageHeader({ children, iconClass }: { children: React.ReactNode, iconClass?: string }) {
    return (
        <header className="bg-sidebar px-4 py-5 border-b">
            {iconClass && (
                <i className={'text-3xl bi ' + iconClass}></i>
            )}
            {children}
        </header>
    )
}

export function PageHeaderTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-xl font-semibold mt-2">
            {children}
        </h1>
    )
}

export function PageHeaderDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-primary text-sm text-balance">
            {children}
        </p>
    )
}