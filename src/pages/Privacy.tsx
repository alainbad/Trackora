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
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)' }}>Last updated: 30 May 2026</p>
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
              <li><strong style={{ color: '#f8fafc' }}>Cloudflare</strong> — CDN and security infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>5. Cookies</h2>
            <p>We use essential cookies for session management and anonymised analytics cookies via Google Analytics. No advertising or tracking cookies are set by Trackora itself. You may disable cookies in your browser settings; this may affect the functionality of the service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>6. Data Retention</h2>
            <p>Account data is retained for as long as your account is active. Saved shipment records are kept until you delete them or close your account. Analytics data is retained for 26 months per Google Analytics defaults.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>8. Security</h2>
            <p>All data is encrypted in transit via TLS 1.3. Passwords are hashed using bcrypt. Our database is hosted on Supabase's SOC 2 Type II certified infrastructure.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>9. Changes to This Policy</h2>
            <p>We may update this policy periodically. Material changes will be notified via email to registered users. Continued use of the service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>10. Contact</h2>
            <p>For privacy inquiries: <a href="mailto:support@track-ora.com" style={{ color: '#818cf8' }}>support@track-ora.com</a><br />Trackora, Business Bay, Dubai, UAE</p>
          </section>
        </div>
      </div>
    </div>
  )
}
