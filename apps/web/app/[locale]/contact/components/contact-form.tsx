'use client';

// Removed unused imports: Button, Calendar, Input, Label, Popover, PopoverContent, PopoverTrigger, cn, format, CalendarIcon, MoveRight
// Kept: Check (used in benefits section)
import { Check } from 'lucide-react';
import type { Dictionary } from '@repo/internationalization';
// Removed: useState (no longer needed for date)

type ContactFormProps = {
  dictionary: Dictionary;
};

export const ContactForm = ({ dictionary }: ContactFormProps) => {
  // Removed: const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left column with general contact info - remains the same */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                  {dictionary.web.contact.meta.title}
                </h4>
                <p className="max-w-sm text-left text-lg text-muted-foreground leading-relaxed tracking-tight">
                  {dictionary.web.contact.meta.description}
                </p>
              </div>
            </div>
            {dictionary.web.contact.hero.benefits.map((benefit, index) => (
              <div
                className="flex flex-row items-start gap-6 text-left"
                key={index}
              >
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>{benefit.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column - replacing the form with a message */}
          <div className="flex flex-col items-center justify-center rounded-md border p-8">
            <h5 className="text-xl font-semibold mb-4">
              {dictionary.web.contact.hero.form.title || "Get in Touch"} {/* Using existing title or a fallback */}
            </h5>
            <p className="text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              {/* You might want to add a specific dictionary entry for this message */}
              If you'd like to contact us, please send an email to:
            </p>
            <p className="text-center text-lg font-semibold text-primary mt-2">
              contact@example.com
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4">
              (Please note: This is a dummy address for demonstration purposes.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
