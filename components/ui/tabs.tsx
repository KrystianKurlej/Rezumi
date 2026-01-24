"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-full border-b border-border px-4 gap-5",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        [
          // Base styles
          "inline-flex h-8 items-center justify-center gap-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground",
          "py-1 transition-colors duration-200",
          "text-sm font-medium whitespace-nowrap",
          "cursor-pointer",
          
          // Focus states
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
          "focus-visible:ring-[3px] focus-visible:outline-1",
          
          // Active states
          "data-[state=active]:border-b-accent data-[state=active]:text-foreground",
          
          // Disabled states
          "disabled:pointer-events-none disabled:opacity-50",
          
          // SVG child styles
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        ],
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none px-4", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
