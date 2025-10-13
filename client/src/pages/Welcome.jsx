import { Link } from 'react-router-dom';
import { ArrowRight, Users, Sparkles, Heart } from 'lucide-react';

/**
 * Welcome Page
 * - Landing page with headline and CTA
 * - Links to Sign Up and Sign In
 * - Brief feature highlights
 */
const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              Welcome to SkillSwap
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Exchange Skills,
            <br />
            <span className="text-primary-600">Grow Together</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect with peers who share your passion for learning. 
            Teach what you know, learn what you want, and build meaningful connections.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/signin"
              className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>

          <Link
            to="/about"
            className="inline-block mt-6 text-primary-600 hover:text-primary-700 font-medium"
          >
            Learn more about SkillSwap →
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect with Peers
            </h3>
            <p className="text-gray-600">
              Find like-minded individuals who want to exchange skills and knowledge.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Learn & Teach
            </h3>
            <p className="text-gray-600">
              Share your expertise and gain new skills in a collaborative environment.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Build Community
            </h3>
            <p className="text-gray-600">
              Join a supportive community where everyone grows together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
