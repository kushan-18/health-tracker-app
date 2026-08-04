import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | VitalX AI',
  description: 'VitalX AI Terms of Service — your rights and responsibilities when using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">VitalX AI</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Effective Date: January 1, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using VitalX AI (the &quot;Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              VitalX AI is a health and fitness platform that provides AI-powered workout tracking,
              nutrition planning, health analytics, and coaching tools. The Service is designed for
              general wellness and informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old (16 in the EU/EEA) to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>Notify us immediately if you suspect unauthorised access to your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Subscriptions &amp; Billing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Free Tier:</strong> Basic features are available at no cost. No credit card
                is required.
              </li>
              <li>
                <strong>Paid Plans (Pro / Elite):</strong> Subscriptions are billed monthly in
                Indian Rupees (₹). Prices are displayed at checkout and may change with 30 days
                advance notice.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel your subscription at any time from
                your account settings. Cancellation takes effect at the end of your current billing
                period. You retain access to paid features until that date.
              </li>
              <li>
                <strong>Refunds:</strong> Subscription fees are non-refundable except where required
                by applicable law. If you cancel within the first 14 days of a new paid subscription,
                you may be eligible for a full refund — contact us at support@vitalx-ai.com.
              </li>
              <li>
                <strong>Free Trials:</strong> If a free trial is offered, it converts to a paid
                subscription at the end of the trial period unless you cancel before the trial ends.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its systems.</li>
              <li>Interfere with, disrupt, or overload the Service or its infrastructure.</li>
              <li>Use automated tools (bots, scrapers) to access the Service without written permission.</li>
              <li>Impersonate another person or misrepresent your identity.</li>
              <li>Upload malicious code, viruses, or harmful content.</li>
              <li>Resell, sublicense, or commercially exploit the Service without written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              All content, features, code, design, and branding of the Service are the intellectual
              property of VitalX AI and are protected by copyright, trademark, and other intellectual
              property laws. You are granted a limited, non-exclusive, non-transferable licence to
              use the Service for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. User-Generated Content</h2>
            <p>
              You retain ownership of health data, workout logs, nutrition entries, and other content
              you input into the Service. By using the Service, you grant us a limited licence to
              process this data solely for the purpose of providing and improving the Service for you.
              We will not use your content for marketing or share it with third parties without your
              explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Medical Disclaimer</h2>
            <p className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <strong className="text-yellow-400">IMPORTANT:</strong> VitalX AI is not a medical
              device and does not provide medical advice. The Service is intended for general
              wellness and informational purposes only. AI-generated recommendations, workout
              plans, and nutrition guidance are not substitutes for professional medical advice,
              diagnosis, or treatment. Always consult a qualified healthcare provider before making
              changes to your diet, exercise routine, or health regimen. Do not disregard or delay
              seeking professional medical advice because of something you read or received through
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </li>
              <li>
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
                COMPLETELY SECURE.
              </li>
              <li>
                IN NO EVENT SHALL VITALX AI, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                OUT OF YOUR USE OF THE SERVICE.
              </li>
              <li>
                OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS SHALL NOT EXCEED THE
                AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ₹5,000,
                WHICHEVER IS LESS.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless VitalX AI and its affiliates from any claims,
              losses, damages, liabilities, and expenses (including legal fees) arising from your use
              of the Service, your violation of these Terms, or your violation of any rights of a
              third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Modifications to the Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service (or any part of it)
              at any time, with or without notice. We will not be liable for any modification,
              suspension, or discontinuation of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any
              disputes arising under these Terms shall be subject to the exclusive jurisdiction of
              the courts in Bengaluru, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">13. Changes to These Terms</h2>
            <p>
              We may revise these Terms at any time by updating this page. Material changes will be
              communicated via email or in-app notification at least 30 days before they take effect.
              Continued use of the Service after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">14. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>VitalX AI</strong><br />
              Email:{' '}
              <a href="mailto:support@vitalx-ai.com" className="text-emerald-400 hover:underline">
                support@vitalx-ai.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
