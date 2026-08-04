import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | VitalX AI',
  description: 'VitalX AI Privacy Policy — how we collect, use, and protect your health data.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: January 1, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              VitalX AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our web application, mobile application, and related services (collectively,
              the &quot;Service&quot;).
            </p>
            <p className="mt-2">
              By using the Service, you agree to the collection and use of information in accordance
              with this policy. If you do not agree, please discontinue use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following categories of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and password (stored as a
                hashed value). If you sign in via Google or Apple, we receive your name and email
                address from the OAuth provider.
              </li>
              <li>
                <strong>Health &amp; Fitness Data:</strong> Body metrics (height, weight, age, gender),
                workout logs, exercise history, nutrition and meal logs, sleep data, heart rate data,
                body composition measurements, and health goals you enter.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, timestamps, device type,
                browser type, IP address, and referring URLs.
              </li>
              <li>
                <strong>Cookies &amp; Similar Technologies:</strong> We use essential cookies to
                maintain your session and preferences. We do not use advertising or cross-site tracking
                cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, personalise, and improve the Service, including generating AI-powered health recommendations.</li>
              <li>Maintain your account and authenticate your identity.</li>
              <li>Analyze usage patterns to improve features and user experience.</li>
              <li>Communicate with you about product updates, security alerts, and support responses.</li>
              <li>Detect, prevent, and address technical issues or security breaches.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. How We Share Your Information</h2>
            <p>
              <strong>We do not sell your personal data to third parties.</strong>
            </p>
            <p className="mt-2">We may share information in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Service Providers:</strong> Trusted third-party vendors who assist with hosting
                (e.g., Vercel), analytics, and infrastructure. These providers are contractually
                obligated to keep your data confidential and use it only for the services they provide
                to us.
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law, court order, or governmental
                regulation, or to protect the rights, property, or safety of VitalX AI, our users,
                or the public.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale
                of assets, with prior notice to you.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Retention &amp; Deletion</h2>
            <p>
              We retain your account and health data for as long as your account is active or as
              needed to provide the Service. You may delete your account and all associated data at
              any time from your account settings. Upon deletion, we remove your personal data from
              our active systems within 30 days, though anonymised, aggregated data may be retained
              for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (TLS/HTTPS),
              encryption at rest, access controls, and regular security audits. However, no method of
              electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access a copy of the personal data we hold about you.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict certain processing of your data.</li>
              <li>Data portability — receive your data in a structured, machine-readable format.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@vitalx-ai.com" className="text-emerald-400 hover:underline">
                privacy@vitalx-ai.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for users under the age of 13 (or 16 in the EU/EEA). We
              do not knowingly collect personal data from children. If we discover that we have
              collected data from a child, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the updated policy on this page and updating the &quot;Effective Date&quot;
              above. Your continued use of the Service after changes are posted constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>VitalX AI</strong><br />
              Email:{' '}
              <a href="mailto:privacy@vitalx-ai.com" className="text-emerald-400 hover:underline">
                privacy@vitalx-ai.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
