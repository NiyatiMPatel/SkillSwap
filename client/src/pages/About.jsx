import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Zap, Shield } from 'lucide-react';

/**
 * About Page
 * - Explains the purpose and vision of SkillSwap
 * - Information about how the platform works
 */
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 page-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About SkillSwap
          </h1>
          <p className="text-xl text-gray-600">
            A peer-to-peer platform for exchanging knowledge and skills
          </p>
        </div>

        {/* Main content */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            SkillSwap was created to democratize learning and make skill exchange 
            accessible to everyone. We believe that everyone has something valuable 
            to teach and something new to learn. By connecting people who complement 
            each other's skills, we create a collaborative learning environment where 
            everyone benefits.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
            <li><strong>Sign Up:</strong> Create your free account in seconds</li>
            <li><strong>Create Your Profile:</strong> List skills you can teach and skills you want to learn</li>
            <li><strong>Browse the Skill Board:</strong> Discover opportunities to connect with others</li>
            <li><strong>Connect & Exchange:</strong> Start learning and teaching!</li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Focused</h3>
              <p className="text-sm text-gray-600">
                Dedicated to peer-to-peer skill exchange, not commercial courses
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Simple</h3>
              <p className="text-sm text-gray-600">
                Clean, intuitive interface that gets out of your way
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe</h3>
              <p className="text-sm text-gray-600">
                Secure authentication and data protection
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to start exchanging skills?</p>
          <Link to="/signup" className="btn-primary inline-block">
            Join SkillSwap Today
          </Link>
        </div>

        {/* Phase 2 note */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Coming Soon</h3>
          <p className="text-blue-700 text-sm">
            We're working on exciting new features including direct messaging, 
            session scheduling, skill ratings, and more. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
