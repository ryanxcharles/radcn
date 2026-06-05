import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "../lib/utils"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cn("w-full max-w-xl", className)} {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn("overflow-hidden text-sm data-[state=closed]:hidden", className)}
      {...props}
    >
      <div className="pb-4 text-muted-foreground">{children}</div>
    </AccordionPrimitive.Content>
  )
}

export function renderAccordionFixture(scenario: string) {
  if (scenario === "custom-token") {
    return (
      <Accordion className="reference-fixture-custom-accordion" type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Custom accordion</AccordionTrigger>
          <AccordionContent>Accordion colors use documented RadCN tokens.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  if (scenario === "multiple") {
    return (
      <Accordion type="multiple" defaultValue={["one", "two"]}>
        <AccordionItem value="one">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First item content for visual comparison.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second item content for visual comparison.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  if (scenario === "disabled-item") {
    return (
      <Accordion type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Enabled item</AccordionTrigger>
          <AccordionContent>Enabled item content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two" disabled>
          <AccordionTrigger>Disabled item</AccordionTrigger>
          <AccordionContent>Disabled item content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  return (
    <Accordion type="single" collapsible defaultValue="one">
      <AccordionItem value="one">
        <AccordionTrigger>Is this accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the upstream shadcn/Radix pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Can it collapse?</AccordionTrigger>
        <AccordionContent>The fixture starts with only the first item open.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
