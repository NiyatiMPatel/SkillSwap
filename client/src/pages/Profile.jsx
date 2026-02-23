import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { updateProfile } from "../store/slices/authSlice";
import { User, Plus, X } from "lucide-react";
import { useNavigate } from "react-router";

// Yup validation schema
const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
  skillsToTeach: Yup.array().of(Yup.string()),
  skillsToLearn: Yup.array().of(Yup.string()),
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

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
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
          <p className="mt-2 text-gray-600">Update your profile information</p>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            name: user?.name || "",
            bio: user?.bio || "",
            skillsToTeach: user?.skillsToTeach || [],
            skillsToLearn: user?.skillsToLearn || [],
          }}
          validationSchema={profileSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="card p-8 space-y-6">
              {/* Backend error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Field
                  name="name"
                  type="text"
                  className={`input-field ${
                    errors.name && touched.name ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Field
                  as="textarea"
                  name="bio"
                  rows="4"
                  className={`input-field resize-none ${
                    errors.bio && touched.bio ? "border-red-500" : ""
                  }`}
                  placeholder="Tell us about yourself..."
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
                        id="profileTeachSkill"
                        className="input-field"
                        placeholder="Add a skill..."
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
                            document.getElementById("profileTeachSkill");
                          if (input.value.trim()) {
                            push(input.value.trim());
                            input.value = "";
                          }
                        }}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.skillsToTeach.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {skill}
                          <button type="button" onClick={() => remove(index)}>
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
                        id="profileLearnSkill"
                        className="input-field"
                        placeholder="Add a skill..."
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
                            document.getElementById("profileLearnSkill");
                          if (input.value.trim()) {
                            push(input.value.trim());
                            input.value = "";
                          }
                        }}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.skillsToLearn.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                          <button type="button" onClick={() => remove(index)}>
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </FieldArray>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary w-full"
              >
                {isSubmitting || loading ? "Saving..." : "Save Changes"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
