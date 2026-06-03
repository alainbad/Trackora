import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'

export default function Terms() {
  useSEO({
    title: 'Terms of Service | Trackora',
    description: 'Trackora Terms of Service — the rules and conditions governing your use of our shipment tracking platform.',
    canonical: 'https://www.track-ora.com/terms',
  })

  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Legal
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: '12px' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)' }}>Last updated: June 3, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '15px', color: 'rgba(248,250,252,0.7)', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>By accessing or using Trackora ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all visitors, registered users, and paying subscribers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>2. Description of Service</h2>
            <p>Trackora provides real-time shipment tracking by aggregating data from third-party carrier APIs. Tracking data is sourced from external providers and displayed for informational purposes only. We do not operate as a carrier, freight forwarder, or logistics provider.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>3. Accuracy of Tracking Data</h2>
            <p>Trackora displays tracking information as provided by carriers and third-party tracking services. We do not guarantee the accuracy, completeness, or timeliness of any tracking data. Shipping ETAs are estimates only. For authoritative shipment information, always consult the carrier directly.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>4. Free and Paid Plans</h2>
            <p>The Free plan is provided at no cost and includes express courier and land freight tracking, plus sea freight carrier redirects, limited to 10 saved shipments.</p>
            <p style={{ marginTop: '12px' }}>Pro and Business plans are billed monthly via Gumroad. Subscriptions renew automatically until cancelled. Downgrading or cancelling your plan takes effect at the end of the current billing period.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>5. Acceptable Use Policy</h2>
            <p>You agree not to use Trackora for any of the following prohibited activities:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Sending unsolicited messages or spam through or in connection with the Service</li>
              <li>Scraping, crawling, or using automated tools to extract data from the Service beyond normal use</li>
              <li>Reverse engineering, decompiling, or attempting to derive source code from the Service</li>
              <li>Using the Service to track shipments of illegal goods or in furtherance of any unlawful activity</li>
              <li>Impersonating any person or entity or misrepresenting your affiliation with any person or entity</li>
              <li>Distributing malware, viruses, or any other malicious code through or in connection with the Service</li>
              <li>Attempting to gain unauthorised access to any part of the Service or its infrastructure</li>
            </ul>
            <p style={{ marginTop: '12px' }}>Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>6. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others or use the Service for any illegal purpose.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>7. Intellectual Property</h2>
            <p>All content, design, and code on Trackora are the property of Trackora and may not be reproduced without permission. Carrier names, logos, and trademarks belong to their respective owners and are used for identification purposes only.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>8. Warranty Disclaimer</h2>
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TRACKORA EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Any warranty that the Service will be uninterrupted, timely, secure, or error-free</li>
              <li>Any warranty regarding the accuracy, reliability, or completeness of carrier-provided tracking data</li>
              <li>Any warranty that the Service will meet your specific requirements or expectations</li>
              <li>Any implied warranty of merchantability, fitness for a particular purpose, or non-infringement</li>
            </ul>
            <p style={{ marginTop: '12px' }}>Your use of the Service is at your sole risk. Carrier data is sourced from third parties and Trackora has no control over its accuracy or timeliness.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Trackora shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to losses resulting from inaccurate tracking data, delayed delivery information, or service interruptions.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>10. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Trackora and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Your use of or access to the Service</li>
              <li>Your violation of any provision of these Terms of Service</li>
              <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
              <li>Any claim that your use of the Service caused damage to a third party</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>11. Refund Policy</h2>
            <p>If you subscribe to a Pro or Business plan and wish to request a refund:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>You may request a full refund within <strong style={{ color: '#f8fafc' }}>7 days of your first payment</strong>, provided you have not used any Pro or Business features during that period.</li>
              <li>To request a refund, email <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a> with your order details.</li>
              <li>After 7 days from your first payment, no refunds will be issued.</li>
              <li>Monthly renewal charges are non-refundable once processed.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>12. Changes to the Service</h2>
            <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time. For material changes or discontinuation, we will provide at least <strong style={{ color: '#f8fafc' }}>30 days' notice</strong> via email to registered users or via a prominent notice on the website. Continued use of the Service after such notice constitutes your acceptance of the changes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>13. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, abuse the Service, or engage in fraudulent activity. You may close your account at any time by contacting support.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>14. Governing Law</h2>
            <p>These terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved under the jurisdiction of the courts of Dubai, UAE.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>15. Contact</h2>
            <p>Questions about these terms: <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a><br />Trackora, Business Bay, Dubai, UAE</p>
          </section>
        </div>
      </div>
    </div>
  )
}
