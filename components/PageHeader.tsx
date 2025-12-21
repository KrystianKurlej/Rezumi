import React from 'react';

export function PageHeader({ children, iconClass }: { children: React.ReactNode, iconClass?: string }) {
    return (
        <header className="px-4 py-5 border-b">
            {iconClass && (
                <i className={'text-xl mb-2 block text-gray-600 bi ' + iconClass}></i>
            )}
            {children}
        </header>
    )
}

export function PageHeaderTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-xl text-gray-800 font-semibold">
            {children}
        </h1>
    )
}

export function PageHeaderDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-gray-600 text-sm text-balance">
            {children}
        </p>
    )
}