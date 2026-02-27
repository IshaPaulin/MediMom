import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaHandPaper, FaBaby, FaPhoneAlt, FaChartLine, FaLeaf, FaShieldAlt, FaLock } from 'react-icons/fa';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EE', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans { font-family: 'DM Sans', system-ui, sans-serif; }
        
        .hero-headline { 
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        
        .wave-divider {
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        
        .btn-primary {
          background-color: #487A7B;
          color: #F6F3EE;
          padding: 14px 36px;
          border-radius: 60px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          letter-spacing: 0.03em;
          transition: all 0.3s ease;
          display: inline-block;
          text-decoration: none;
          border: 2px solid transparent;
        }
        .btn-primary:hover { background-color: #3a6566; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(72,122,123,0.3); }
        
        .btn-secondary {
          background-color: transparent;
          color: #487A7B;
          padding: 14px 36px;
          border-radius: 60px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          letter-spacing: 0.03em;
          transition: all 0.3s ease;
          display: inline-block;
          text-decoration: none;
          border: 1.5px solid #487A7B;
        }
        .btn-secondary:hover { background-color: rgba(72,122,123,0.05); transform: translateY(-1px); }
        
        .feature-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 40px 36px;
          transition: all 0.3s ease;
          border: 1px solid rgba(212,165,165,0.15);
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(72,122,123,0.1); }
        
        .icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .step-number {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 64px;
          font-weight: 300;
          line-height: 1;
          color: rgba(72,122,123,0.12);
          margin-bottom: 8px;
        }
        
        .trust-badge {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 24px;
          background: rgba(255,255,255,0.7);
          border-radius: 16px;
          border: 1px solid rgba(156,175,136,0.2);
        }
        
        .stat-number {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 42px;
          font-weight: 300;
          color: #487A7B;
          line-height: 1;
        }
        
        .divider-rose {
          height: 1px;
          background: linear-gradient(to right, transparent, #D4A5A5, transparent);
          margin: 0 auto;
          max-width: 200px;
        }
        
        nav a { text-decoration: none; }
      `}</style>

      {/* Navigation */}
      <nav className="sans" style={{ padding: '24px 32px', backgroundColor: '#F6F3EE', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(212,165,165,0.2)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaHeart style={{ color: '#D4A5A5', fontSize: '16px' }} />
            <span className="serif" style={{ fontSize: '22px', fontWeight: 400, color: '#487A7B', letterSpacing: '0.02em' }}>MediMom</span>
            <span className="sans" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#9CAF88', color: '#F6F3EE', fontWeight: 400, letterSpacing: '0.05em' }}>2.1</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '10px 28px', fontSize: '14px' }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ color: '#487A7B', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 400 }}>Sign in</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '10px 28px', fontSize: '14px' }}>Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 32px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left: Text */}
          <div>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 400 }}>
              AI-powered postpartum support
            </p>
            <h1 className="hero-headline" style={{ fontSize: 'clamp(44px, 5vw, 68px)', color: '#487A7B', marginBottom: '12px' }}>
              Because mothers
            </h1>
            <h1 className="hero-headline" style={{ fontSize: 'clamp(44px, 5vw, 68px)', color: '#D4A5A5', marginBottom: '32px', fontStyle: 'italic' }}>
              need monitoring too.
            </h1>
            <p className="sans" style={{ color: '#6B8C8C', fontSize: '17px', lineHeight: '1.75', maxWidth: '440px', marginBottom: '44px', fontWeight: 300 }}>
              Baby tracking and maternal mental wellbeing in one gentle space — designed for the beautiful, exhausting first weeks of motherhood.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-primary">Start daily check-in</Link>
              <Link to="#features" className="btn-secondary">See how it works</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '56px', paddingTop: '40px', borderTop: '1px solid rgba(212,165,165,0.3)' }}>
              <div>
                <div className="stat-number">24/7</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '13px', marginTop: '4px', fontWeight: 300 }}>Support</div>
              </div>
              <div>
                <div className="stat-number">100%</div>
                <div className="sans" style={{ color: '#9CAF88', fontSize: '13px', marginTop: '4px', fontWeight: 300 }}>Free</div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: '32px', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #D4A5A5 0%, #c49090 40%, #9CAF88 100%)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ background: 'rgba(246,243,238,0.92)', borderRadius: '20px', padding: '28px 32px', width: '100%', marginBottom: '16px', backdropFilter: 'blur(10px)' }}>
                  <div className="sans" style={{ color: '#9CAF88', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Last logged</div>
                  <div className="serif" style={{ color: '#487A7B', fontSize: '20px' }}>🍼 Feeding — 2:14 AM</div>
                </div>
                <div style={{ background: 'rgba(246,243,238,0.92)', borderRadius: '20px', padding: '28px 32px', width: '100%', marginBottom: '16px', backdropFilter: 'blur(10px)' }}>
                  <div className="sans" style={{ color: '#9CAF88', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Today's mood</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['😴', '😊', '💙', '😤', '🌸'].map((e, i) => (
                      <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: i === 1 ? '#487A7B' : 'rgba(72,122,123,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>{e}</div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'rgba(246,243,238,0.92)', borderRadius: '20px', padding: '20px 32px', width: '100%', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="sans" style={{ color: '#487A7B', fontSize: '14px' }}>👋 Show a gesture</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#D4A5A5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaHandPaper style={{ color: '#F6F3EE', fontSize: '13px' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Floating decoration */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(156,175,136,0.2)', zIndex: -1 }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(212,165,165,0.15)', zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30C360 60 1080 0 1440 30V60H0V30Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* Problem Section */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left: Visual placeholder */}
          <div style={{ borderRadius: '28px', overflow: 'hidden', background: 'linear-gradient(160deg, #F6F3EE 0%, #EAE5DD 100%)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="serif" style={{ fontSize: '72px', color: 'rgba(72,122,123,0.15)', lineHeight: 1, marginBottom: '16px' }}>1 in 5</div>
              <div className="serif" style={{ fontSize: '22px', color: '#487A7B', fontStyle: 'italic', lineHeight: 1.4 }}>mothers experience postpartum depression</div>
              <div className="divider-rose" style={{ margin: '24px auto' }} />
              <div className="sans" style={{ color: '#9CAF88', fontSize: '14px', lineHeight: 1.6, fontWeight: 300 }}>Yet most go unrecognized and unsupported in the early weeks at home</div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <p className="sans" style={{ color: '#D4A5A5', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>The reality</p>
            <h2 className="serif" style={{ fontSize: '42px', fontWeight: 300, color: '#487A7B', lineHeight: 1.2, marginBottom: '24px' }}>
              The hardest weeks often happen in silence
            </h2>
            <p className="sans" style={{ color: '#6B8C8C', fontSize: '16px', lineHeight: 1.85, marginBottom: '20px', fontWeight: 300 }}>
              After hospital discharge, new mothers are often left navigating feeding schedules, sleep deprivation, and emotional overwhelm — alone, without the support systems that used to surround them.
            </p>
            <p className="sans" style={{ color: '#6B8C8C', fontSize: '16px', lineHeight: 1.85, fontWeight: 300 }}>
              MediMom was built for those 3 AM moments — when you're holding your baby, exhausted and uncertain, and just need something gentle in your corner.
            </p>
          </div>
        </div>
      </section>

      {/* Wave back */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30C360 0 1080 60 1440 30V0H0V30Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* Features Section */}
      <section id="features" style={{ backgroundColor: '#F6F3EE', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>What we offer</p>
            <h2 className="serif" style={{ fontSize: '48px', fontWeight: 300, color: '#487A7B', lineHeight: 1.15, marginBottom: '16px' }}>
              Gentle support for
              <span style={{ color: '#D4A5A5', fontStyle: 'italic', display: 'block' }}>every step</span>
            </h2>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '16px', fontWeight: 300 }}>Designed with love for the early weeks</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <FaHandPaper />, color: '#D4A5A5', title: 'Hands-Free Logging', desc: 'Log feeds and sleep with simple hand gestures. Perfect for those 3 AM feeds when you\'re holding your baby.' },
              { icon: <FaHeart />, color: '#9CAF88', title: 'Mood Care', desc: 'Gentle check-ins that notice when you need extra support. Because your mental health matters too.' },
              { icon: <FaBaby />, color: '#487A7B', title: 'Baby Tracker', desc: 'Keep track of feeds, sleep, and diapers. Generate beautiful PDFs for your pediatrician visits.' },
              { icon: <FaPhoneAlt />, color: '#D4A5A5', title: 'Quick Help', desc: 'Emergency guidelines and helplines at your fingertips. One gesture away when you need it most.' },
              { icon: <FaChartLine />, color: '#9CAF88', title: 'Health Insights', desc: 'See patterns in your baby\'s routine and your mood. Knowledge brings peace of mind.' },
              { icon: <FaLeaf />, color: '#487A7B', title: 'Gentle Reminders', desc: 'Kind nudges to drink water, rest, and breathe. Because taking care of you matters too.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="icon-circle" style={{ backgroundColor: f.color + '22', width: '48px', height: '48px' }}>
                  <span style={{ color: f.color, fontSize: '18px' }}>{f.icon}</span>
                </div>
                <h3 className="serif" style={{ fontSize: '22px', fontWeight: 400, color: '#487A7B', marginBottom: '12px' }}>{f.title}</h3>
                <p className="sans" style={{ color: '#8BA8A9', fontSize: '15px', lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Getting started</p>
            <h2 className="serif" style={{ fontSize: '48px', fontWeight: 300, color: '#487A7B', lineHeight: 1.15 }}>
              Simple as
              <span style={{ color: '#D4A5A5', fontStyle: 'italic', display: 'block' }}>one, two, three</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {[
              { n: '01', title: 'Create your space', desc: 'Sign up in seconds. Add your baby\'s name if you\'d like. We keep it simple.', color: '#D4A5A5' },
              { n: '02', title: 'Show a gesture', desc: 'Thumbs up for feeding, fist for sleep. It\'s that easy — no tapping required.', color: '#9CAF88' },
              { n: '03', title: 'Breathe easy', desc: 'We\'ll track the rest and check in on you gently throughout the day.', color: '#487A7B' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div className="step-number">{s.n}</div>
                <div style={{ width: '48px', height: '3px', background: s.color, borderRadius: '2px', margin: '0 auto 24px' }} />
                <h3 className="serif" style={{ fontSize: '24px', fontWeight: 400, color: '#487A7B', marginBottom: '12px' }}>{s.title}</h3>
                <p className="sans" style={{ color: '#8BA8A9', fontSize: '15px', lineHeight: 1.75, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ backgroundColor: '#F6F3EE', padding: '80px 32px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <FaHeart style={{ color: '#D4A5A5', fontSize: '24px', marginBottom: '32px', display: 'block', margin: '0 auto 32px' }} />
          <blockquote className="serif" style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, color: '#487A7B', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '36px' }}>
            "MediMom understood what I needed before I even knew it. The gesture logging at 3AM, the gentle check-ins when I was feeling low — it's like having a wise friend who's been there."
          </blockquote>
          <div className="divider-rose" style={{ margin: '0 auto 24px' }} />
          <p className="sans" style={{ color: '#487A7B', fontSize: '15px', fontWeight: 400 }}>Priya, mother of 3-month-old</p>
          <p className="sans" style={{ color: '#9CAF88', fontSize: '14px', fontWeight: 300 }}>Kerala, India</p>
        </div>
      </section>

      {/* Trust & Safety */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Privacy & safety</p>
            <h2 className="serif" style={{ fontSize: '40px', fontWeight: 300, color: '#487A7B' }}>Built with care, kept with trust</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: <FaShieldAlt />, title: 'Not a diagnostic tool', desc: 'MediMom is a wellness companion, not a medical service. Always consult your healthcare provider.' },
              { icon: <FaLock />, title: 'Data stays private', desc: 'Your personal data and health logs are yours alone. We never sell or share your information.' },
              { icon: <FaHeart />, title: 'Maternal health aware', desc: 'Designed with awareness of postpartum mental health. We take your emotional wellbeing seriously.' },
            ].map((t, i) => (
              <div key={i} className="trust-badge">
                <div style={{ minWidth: '36px', height: '36px', borderRadius: '10px', background: 'rgba(72,122,123,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#487A7B', fontSize: '14px' }}>{t.icon}</span>
                </div>
                <div>
                  <h4 className="sans" style={{ color: '#487A7B', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>{t.title}</h4>
                  <p className="sans" style={{ color: '#9CAF88', fontSize: '13px', lineHeight: 1.65, fontWeight: 300 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ backgroundColor: '#487A7B', padding: '80px 32px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="serif" style={{ fontSize: '52px', fontWeight: 300, color: '#F6F3EE', lineHeight: 1.15, marginBottom: '20px' }}>
            Ready to feel
            <span style={{ color: '#D4A5A5', fontStyle: 'italic', display: 'block' }}>supported?</span>
          </h2>
          <p className="sans" style={{ color: 'rgba(246,243,238,0.75)', fontSize: '17px', marginBottom: '44px', lineHeight: 1.75, fontWeight: 300 }}>
            Join thousands of mothers who never have to mother alone.
          </p>
          {!currentUser && (
            <Link to="/signup" style={{ background: '#D4A5A5', color: '#487A7B', padding: '18px 48px', borderRadius: '60px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '16px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s', letterSpacing: '0.02em' }}>
              Start your journey ✨
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="sans" style={{ backgroundColor: '#F6F3EE', padding: '60px 32px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FaHeart style={{ color: '#D4A5A5', fontSize: '14px' }} />
                <span className="serif" style={{ fontSize: '20px', color: '#487A7B' }}>MediMom</span>
              </div>
              <p style={{ color: '#9CAF88', fontSize: '14px', lineHeight: 1.75, fontWeight: 300, maxWidth: '260px' }}>Gentle support for new mothers, right when you need it most.</p>
            </div>
            {[
              { title: 'Features', items: ['Gesture Logging', 'Mood Tracking', 'Baby Tracker', 'Emergency Help'] },
              { title: 'Support', items: ['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Use'] },
              { title: 'Contact', items: ['Kerala Helpline: 0471-2552056', 'Ambulance: 108', '24/7 Available'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ color: '#487A7B', fontSize: '13px', fontWeight: 500, marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.items.map((item, j) => (
                    <li key={j} style={{ color: '#9CAF88', fontSize: '14px', marginBottom: '10px', fontWeight: 300 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(212,165,165,0.3)', paddingTop: '28px', textAlign: 'center' }}>
            <p style={{ color: '#B8C9C9', fontSize: '13px', fontWeight: 300 }}>© 2026 MediMom. Made with 💕 for mothers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;