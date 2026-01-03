import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Breadcrumbs({
  items,
}: Readonly<{
  items: Array<{
    label: string
    href?: string
  }>
}>) {
  return (
    <Breadcrumb className="py-2 max-w-6xl mx-auto px-4">
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/">Rezumi</BreadcrumbLink>
                <BreadcrumbSeparator />
            </BreadcrumbItem>
            {items.map((item, index) => (
            <BreadcrumbItem key={index}>
                {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {index < items.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
            ))}
        </BreadcrumbList>
    </Breadcrumb>
  )
}