import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'

export default function Privacy() {
  useSEO({
    title: 'Privacy Policy | Trackora',
    description: 'Trackora Privacy Policy — how we collect, use, and protect your personal information when you use our shipment tracking service.',
    canonical: 'https://www.track-ora.com/privacy',
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)' }}>Last updated: June 3, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '15px', color: 'rgba(248,250,252,0.7)', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>1. Who We Are</h2>
            <p>Trackora ("we", "us", "our") is a global shipment tracking platform operated from Business Bay, Dubai, UAE. Our website is accessible at <strong style={{ color: '#818cf8' }}>track-ora.com</strong>. If you have questions about this policy, contact us at <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>2. Information We Collect</h2>
            <p><strong style={{ color: '#f8fafc' }}>Account information:</strong> When you create an account, we collect your email address and a hashed password. We do not store plain-text passwords.</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Tracking data:</strong> Tracking numbers you submit are processed to retrieve shipment status from carriers. Saved shipments (if you are signed in) are stored in our secure database associated with your account.</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Usage data:</strong> We collect standard web analytics data via Google Analytics (page views, session duration, referral source). This data is aggregated and does not identify you personally.</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Device data:</strong> Browser type, operating system, and IP address are logged automatically by our hosting infrastructure (Cloudflare Pages) for security and performance purposes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>3. How We Use Your Information</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To provide shipment tracking results in real time</li>
              <li>To maintain your saved shipments dashboard</li>
              <li>To send email status-change notifications (only when you opt in)</li>
              <li>To process subscription payments through Gumroad</li>
              <li>To improve the platform through anonymised analytics</li>
              <li>To protect against fraud and abuse</li>
              <li>To display relevant advertisements through Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>4. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information. We share data only with:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#f8fafc' }}>Supabase</strong> — our database and authentication provider (GDPR-compliant)</li>
              <li><strong style={{ color: '#f8fafc' }}>Carrier APIs</strong> — tracking numbers are shared with carriers (AfterShip, 17track, Shipsgo) solely to retrieve tracking data</li>
              <li><strong style={{ color: '#f8fafc' }}>Resend</strong> — for transactional email delivery (opt-in status alerts only)</li>
              <li><strong style={{ color: '#f8fafc' }}>Google Analytics</strong> — anonymised usage statistics</li>
              <li><strong style={{ color: '#f8fafc' }}>Google AdSense</strong> — advertising partner (see Section 5 below)</li>
              <li><strong style={{ color: '#f8fafc' }}>Cloudflare</strong> — CDN and security infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>5. Advertising & Google AdSense</h2>
            <p>We display advertisements on Trackora through Google AdSense, a service provided by Google LLC. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to this website and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to Trackora and/or other sites on the Internet.</p>
            <p style={{ marginTop: '12px' }}>You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" style={{ color: '#818cf8' }} target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website. The use of advertising cookies by Google allows Google and its partners to serve ads based on visits to Trackora and other sites on the Internet.</p>
            <p style={{ marginTop: '12px' }}>For more information on how Google uses data when you use our site, please visit <a href="https://policies.google.com/technologies/partner-sites" style={{ color: '#818cf8' }} target="_blank" rel="noopener noreferrer">How Google uses data when you use our partners' sites</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>6. Cookies</h2>
            <p>We use the following categories of cookies on Trackora:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <strong style={{ color: '#f8fafc' }}>(a) Essential cookies</strong> — required for session management, authentication, and core functionality. These cookies cannot be disabled without affecting how the service operates.
              </li>
              <li>
                <strong style={{ color: '#f8fafc' }}>(b) Analytics cookies (Google Analytics)</strong> — we use Google Analytics to collect anonymised data about how visitors interact with Trackora (page views, session duration, referral source). This data helps us improve the service. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: '#818cf8' }} target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </li>
              <li>
                <strong style={{ color: '#f8fafc' }}>(c) Advertising cookies (Google AdSense)</strong> — Google AdSense places cookies to serve personalised advertisements based on your interests. These cookies may track your browsing activity across multiple websites and over time to build an interest profile and serve you relevant ads. You can manage your ad personalisation preferences at <a href="https://www.google.com/settings/ads" style={{ color: '#818cf8' }} target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>You may disable cookies in your browser settings; this may affect the functionality of the service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>7. Data Retention</h2>
            <p>Account data is retained for as long as your account is active. Saved shipment records are kept until you delete them or close your account. Analytics data is retained for 26 months per Google Analytics defaults.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>8. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>9. GDPR — Rights for EU/EEA Users</h2>
            <p>If you are located in the European Union or European Economic Area, the following applies:</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Legal basis for processing:</strong> We process your personal data on the following legal bases:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#f8fafc' }}>Contract performance</strong> — processing necessary to provide the tracking service you requested</li>
              <li><strong style={{ color: '#f8fafc' }}>Legitimate interest</strong> — analytics, security, and fraud prevention</li>
              <li><strong style={{ color: '#f8fafc' }}>Consent</strong> — email notifications, personalised advertising (where required)</li>
            </ul>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Your GDPR rights include:</strong> the right to access, rectification, erasure ("right to be forgotten"), restriction of processing, data portability, and the right to object to processing (including the right to object to direct marketing at any time).</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>Right to lodge a complaint:</strong> You have the right to lodge a complaint with your local data protection supervisory authority if you believe we have not handled your data in accordance with applicable law.</p>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#f8fafc' }}>International transfers:</strong> Your data may be transferred to and processed in countries outside the EEA (including the United States). Where such transfers occur, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>10. CCPA — Rights for California Residents</h2>
            <p>If you are a California resident, the California Consumer Privacy Act (CCPA) grants you the following rights:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: '#f8fafc' }}>Right to know</strong> — you may request that we disclose what personal information we collect, use, disclose, and sell about you.</li>
              <li><strong style={{ color: '#f8fafc' }}>Right to delete</strong> — you may request deletion of personal information we have collected from you, subject to certain exceptions.</li>
              <li><strong style={{ color: '#f8fafc' }}>Right to opt out of sale</strong> — we do not sell your personal information to third parties. You do not need to opt out.</li>
              <li><strong style={{ color: '#f8fafc' }}>Right to non-discrimination</strong> — we will not discriminate against you for exercising any of your CCPA rights.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>To exercise your CCPA rights, contact us at <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>11. Security</h2>
            <p>All data is encrypted in transit via TLS 1.3. Passwords are hashed using bcrypt. Our database is hosted on Supabase's SOC 2 Type II certified infrastructure.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>12. Changes to This Policy</h2>
            <p>We may update this policy periodically. Material changes will be notified via email to registered users. Continued use of the service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>13. Contact</h2>
            <p>For privacy inquiries: <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a><br />Trackora, Business Bay, Dubai, UAE</p>
          </section>
        </div>
      </div>
    </div>
  )
}
