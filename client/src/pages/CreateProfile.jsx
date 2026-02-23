import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { updateProfile } from "../store/slices/authSlice";
import { UserCircle, Plus, X } from "lucide-react";

/**
 * Create Profile Page with Formik & Yup Validation
 * - Form to complete user profile after signup
 * - Add skills to teach and learn
 * - Redirects to Skill Board on completion
 */

// Yup validation schema
const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
  skillsToTeach: Yup.array().of(Yup.string()),
  skillsToLearn: Yup.array().of(Yup.string()),
});

// Custom validation
const validateProfile = (values) => {
  const errors = {};
  if (values.skillsToTeach.length === 0 && values.skillsToLearn.length === 0) {
    errors.skillsToTeach = "Please add at least one skill to teach or learn";
    errors.skillsToLearn = "Please add at least one skill to teach or learn";
  }
  return errors;
};
const CreateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If profile is already complete, redirect
    if (user?.isProfileComplete) {
      navigate("/board");
    }
  }, [user, navigate]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const result = await dispatch(updateProfile(values));

    if (updateProfile.fulfilled.match(result)) {
      navigate("/board", { replace: true });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600">
            Tell us about yourself and what skills you want to exchange
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            name: user?.name || "",
            bio: user?.bio || "",
            skillsToTeach: user?.skillsToTeach || [],
            skillsToLearn: user?.skillsToLearn || [],
          }}
          validationSchema={profileSchema}
          validate={validateProfile}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="card p-8 space-y-6">
              {/* Backend Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Validation error for skills */}
              {errors.skillsToTeach && touched.skillsToTeach && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.skillsToTeach}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`input-field ${
                    errors.name && touched.name ? "border-red-500" : ""
                  }`}
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio
                </label>
                <Field
                  as="textarea"
                  id="bio"
                  name="bio"
                  rows="4"
                  className={`input-field resize-none ${
                    errors.bio && touched.bio ? "border-red-500" : ""
                  }`}
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {values.bio.length}/500 characters
                </p>
                <ErrorMessage
                  name="bio"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Skills to Teach */}
              <FieldArray name="skillsToTeach">
                {({ push, remove }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills I Can Teach
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="newTeachSkill"
                        className="input-field"
                        placeholder="e.g., React.js, Guitar, Photography"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.target;
                            if (input.value.trim()) {
                              push(input.value.trim());
                              input.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input =
                            document.getElementById("newTeachSkill");
                          if (input.value.trim()) {
                            push(input.value.trim());
                            input.value = "";
                          }
                        }}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.skillsToTeach.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="hover:text-green-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </FieldArray>

              {/* Skills to Learn */}
              <FieldArray name="skillsToLearn">
                {({ push, remove }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills I Want to Learn
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="newLearnSkill"
                        className="input-field"
                        placeholder="e.g., Python, Cooking, Spanish"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.target;
                            if (input.value.trim()) {
                              push(input.value.trim());
                              input.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input =
                            document.getElementById("newLearnSkill");
                          if (input.value.trim()) {
                            push(input.value.trim());
                            input.value = "";
                          }
                        }}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.skillsToLearn.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </FieldArray>

              {/* Submit button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/board")}
                  className="btn-ghost flex-1"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn-primary flex-1"
                >
                  {isSubmitting || loading ? "Saving..." : "Complete Profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProfile;
