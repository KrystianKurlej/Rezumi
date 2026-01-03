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
            </BreadcrumbItem>
            {items.map((item, index) => (
            <BreadcrumbItem key={index}>
				<BreadcrumbSeparator />
                {item.href ? (
                	<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                	<BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
            </BreadcrumbItem>
            ))}
        </BreadcrumbList>
    </Breadcrumb>
  )
}