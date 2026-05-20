"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Card, CardContent } from "@/components/ui/Card";

type FAQAccordionProps = {
  items: readonly {
    question: string;
    answer: string;
  }[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
