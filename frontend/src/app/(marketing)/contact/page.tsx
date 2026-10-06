'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="primary">Student Support Desk</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact UniReportTZ Support
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Need help with university formatting, payment verification, or template guidelines? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>support@unireporttz.co.tz</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+255 754 123 456 (WhatsApp & Call)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-2 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">Support Hours</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Monday – Saturday: 08:00 EAT – 20:00 EAT.<br />Average response time under 15 minutes.
            </p>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card className="p-8">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Received!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Thank you for reaching out. Our support team will reply to your email shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Baraka Msangi"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. baraka@udsm.ac.tz"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label="Subject"
                  placeholder="e.g. Payment issue / University Template Question"
                  {...register('subject')}
                  error={errors.subject?.message}
                />
                <Textarea
                  label="Message"
                  placeholder="Describe your inquiry in detail..."
                  {...register('message')}
                  error={errors.message?.message}
                />
                <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} icon={<Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
