import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn, clearError } from "../store/slices/authSlice";
import { Loader2, LogIn } from "lucide-react";

/**
 * Sign In Page with Formik & Yup Validation
 * - Authentication form with email/mobile and password
 * - Redirects to Skill Board on success
 * - Can redirect to intended destination after login
 */

// Yup validation schema (email + password)
const signInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Get the page they were trying to access
  const from = location.state?.from?.pathname || "/board";

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const credentials = {
      email: values.email,
      password: values.password,
    };

    await dispatch(signIn(credentials));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to continue to SkillSwap</p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInSchema}
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

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`input-field ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                  placeholder="john@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`input-field ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
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
                {(isSubmitting || loading) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isSubmitting || loading ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
