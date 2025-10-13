import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signUp, clearError } from '../store/slices/authSlice';
import { UserPlus, Loader2 } from 'lucide-react';

/**
 * Sign Up Page with Formik & Yup Validation
 * - Registration form with email/mobile and password
 * - Validation for duplicate users
 * - Redirects to Create Profile on success
 */

// Yup validation schema
const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email format'),
  mobile: Yup.string().matches(/^[+]?[\d\s-()]+$/, 'Invalid mobile number format'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

// Custom validation to ensure either email or mobile is provided
const validateSignUp = (values) => {
  const errors = {};
  if (!values.email && !values.mobile) {
    errors.email = 'Please provide either email or mobile number';
    errors.mobile = 'Please provide either email or mobile number';
  }
  return errors;
};
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Get prefilled data from location state (if redirected from SignIn)
  const prefilledEmail = location.state?.prefillEmail || '';
  const prefilledMobile = location.state?.prefillMobile || '';

  useEffect(() => {
    // Clear errors on mount
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated && user) {
      if (user.isProfileComplete) {
        navigate('/board');
      } else {
        navigate('/create-profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const userData = {
      name: values.name,
      email: values.email || undefined,
      mobile: values.mobile || undefined,
      password: values.password,
    };

    await dispatch(signUp(userData));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">
            Join SkillSwap and start exchanging skills
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            name: '',
            email: prefilledEmail,
            mobile: prefilledMobile,
            password: '',
            confirmPassword: '',
          }}
          validationSchema={signUpSchema}
          validate={validateSignUp}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="card p-8 space-y-6">
              {/* Backend Error messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`input-field ${
                    errors.name && touched.name ? 'border-red-500' : ''
                  }`}
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`input-field ${
                    errors.email && touched.email ? 'border-red-500' : ''
                  }`}
                  placeholder="john@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <Field
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className={`input-field ${
                    errors.mobile && touched.mobile ? 'border-red-500' : ''
                  }`}
                  placeholder="+1234567890"
                />
                <ErrorMessage
                  name="mobile"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide either email or mobile number
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`input-field ${
                    errors.password && touched.password ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`input-field ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {(isSubmitting || loading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting || loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
