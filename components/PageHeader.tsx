import React from 'react';

export function PageHeader({ children, iconClass }: { children: React.ReactNode, iconClass?: string }) {
    return (
        <header className="bg-sidebar p-5 border-b border-secondary ">
            {/* {iconClass && (
                <i className={'text-xl bi text-accent ' + iconClass}></i>
            )} */}
            {children}
        </header>
    )
}

export function PageHeaderTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-2xl font-semibold mb-2">
            {children}
        </h1>
    )
}

export function PageHeaderDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm text-secondary-foreground text-balance">
            {children}
        </p>
    )
}