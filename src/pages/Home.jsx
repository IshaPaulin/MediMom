import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaHandPaper, FaBaby, FaPhoneAlt, FaChartLine, FaLeaf } from 'react-icons/fa';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EE' }}>
      {/* Navigation */}
      <nav className="py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaHeart style={{ color: '#D4A5A5' }} className="text-2xl" />
            <span className="text-2xl font-light" style={{ color: '#487A7B' }}>MediMom</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}>2.1</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 rounded-full transition"
                style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full transition"
                  style={{ color: '#487A7B', border: '2px solid #487A7B' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-full transition"
                  style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: '#D4A5A5' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20" style={{ backgroundColor: '#9CAF88' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light mb-6" style={{ color: '#487A7B' }}>
              You're never
              <span className="block font-medium" style={{ color: '#D4A5A5' }}>alone in motherhood</span>
            </h1>
            <p className="text-xl mb-12" style={{ color: '#487A7B' }}>
              Your gentle companion for the beautiful, messy, wonderful journey of early motherhood
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-full text-lg font-medium transition transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
              >
                Start your free journey
              </Link>
              <Link
                to="#features"
                className="px-8 py-4 rounded-full text-lg font-medium transition"
                style={{ backgroundColor: '#F6F3EE', color: '#487A7B', border: '2px solid #487A7B' }}
              >
                See how it works
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold" style={{ color: '#487A7B' }}>10K+</div>
                <div style={{ color: '#9CAF88' }}>Moms helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#487A7B' }}>24/7</div>
                <div style={{ color: '#9CAF88' }}>Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#487A7B' }}>100%</div>
                <div style={{ color: '#9CAF88' }}>Free</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#487A7B' }}>5★</div>
                <div style={{ color: '#9CAF88' }}>Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#487A7B' }}>
              Gentle support for
              <span className="block font-medium" style={{ color: '#D4A5A5' }}>every step</span>
            </h2>
            <p className="text-xl" style={{ color: '#9CAF88' }}>Designed with love for the early weeks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#D4A5A5' }}>
                <FaHandPaper className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Hands-Free Logging</h3>
              <p style={{ color: '#9CAF88' }}>Log feeds and sleep with simple hand gestures. Perfect for those 3 AM feeds when you're holding your baby.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#9CAF88' }}>
                <FaHeart className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Mood Care</h3>
              <p style={{ color: '#9CAF88' }}>Gentle check-ins that notice when you need extra support. Because your mental health matters too.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#487A7B' }}>
                <FaBaby className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Baby Tracker</h3>
              <p style={{ color: '#9CAF88' }}>Keep track of feeds, sleep, and diapers. Generate beautiful PDFs for your pediatrician visits.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#D4A5A5' }}>
                <FaPhoneAlt className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Quick Help</h3>
              <p style={{ color: '#9CAF88' }}>Emergency guidelines and helplines at your fingertips. One gesture away when you need it most.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#9CAF88' }}>
                <FaChartLine className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Health Insights</h3>
              <p style={{ color: '#9CAF88' }}>See patterns in your baby's routine and your mood. Knowledge brings peace of mind.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl transition transform hover:scale-105" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(72, 122, 123, 0.1)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#487A7B' }}>
                <FaLeaf className="text-2xl" style={{ color: '#F6F3EE' }} />
              </div>
              <h3 className="text-2xl font-medium mb-4" style={{ color: '#487A7B' }}>Gentle Reminders</h3>
              <p style={{ color: '#9CAF88' }}>Kind nudges to drink water, rest, and breathe. Because taking care of you matters too.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaHeart className="text-4xl mx-auto mb-6" style={{ color: '#D4A5A5' }} />
          <p className="text-2xl md:text-3xl italic mb-8" style={{ color: '#487A7B' }}>
            "MediMom understood what I needed before I even knew it. The gesture logging at 3AM, 
            the gentle check-ins when I was feeling low — it's like having a wise friend who's been there."
          </p>
          <div>
            <p className="font-medium" style={{ color: '#487A7B' }}>— Priya, mother of 3-month-old</p>
            <p style={{ color: '#9CAF88' }}>Kerala, India</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#487A7B' }}>
              Simple as
              <span className="block font-medium" style={{ color: '#D4A5A5' }}>one, two, three</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
                1
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: '#487A7B' }}>Create your space</h3>
              <p style={{ color: '#9CAF88' }}>Sign up in seconds. Add your baby's name if you'd like.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold" style={{ backgroundColor: '#9CAF88', color: '#F6F3EE' }}>
                2
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: '#487A7B' }}>Show a gesture</h3>
              <p style={{ color: '#9CAF88' }}>Thumbs up for feeding, fist for sleep. It's that easy.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold" style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}>
                3
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: '#487A7B' }}>Breathe easy</h3>
              <p style={{ color: '#9CAF88' }}>We'll track the rest and check in on you gently.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20" style={{ backgroundColor: '#487A7B' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-6" style={{ color: '#F6F3EE' }}>
            Ready to feel
            <span className="block font-medium" style={{ color: '#D4A5A5' }}>supported?</span>
          </h2>
          <p className="text-xl mb-10" style={{ color: '#F6F3EE' }}>
            Join thousands of mothers who never have to mother alone.
          </p>
          {!currentUser && (
            <Link
              to="/signup"
              className="inline-block px-10 py-5 rounded-full text-xl font-medium transition transform hover:scale-105 shadow-xl"
              style={{ backgroundColor: '#D4A5A5', color: '#487A7B' }}
            >
              Start your journey ✨
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaHeart style={{ color: '#D4A5A5' }} />
              <span className="text-xl" style={{ color: '#487A7B' }}>MediMom</span>
            </div>
            <p style={{ color: '#9CAF88' }}>Gentle support for new mothers, right when you need it most.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: '#487A7B' }}>Features</h4>
            <ul className="space-y-2" style={{ color: '#9CAF88' }}>
              <li>Gesture Logging</li>
              <li>Mood Tracking</li>
              <li>Baby Tracker</li>
              <li>Emergency Help</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: '#487A7B' }}>Support</h4>
            <ul className="space-y-2" style={{ color: '#9CAF88' }}>
              <li>FAQ</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: '#487A7B' }}>Contact</h4>
            <ul className="space-y-2" style={{ color: '#9CAF88' }}>
              <li>Kerala Helpline: 0471-2552056</li>
              <li>Ambulance: 108</li>
              <li>24/7 Available</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: '#D4A5A5' }}>
          <p style={{ color: '#9CAF88' }}>© 2026 MediMom. Made with 💕 for mothers everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;