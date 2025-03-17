import React from "react";
import { Form, useFormState } from "informed";
import { FaUser, FaLock } from "react-icons/fa";
import CustomPassword from "../customFields/CustomPassword";
import CustomLoginInput from "../customFields/CustomLoginInput";
import { validateEmail, validatePassword } from "../../utils/loginValidation";
import useAuth from "../customHooks/useAuth";

const Login = () => {
  const { error, loading, loginUser, setError } = useAuth();
  const formState = useFormState();

  const handleSubmit = ({ values }) => {
    const { email, password } = values;
    loginUser(email, password).catch((err) => setError(err.message));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {(error || Object.keys(formState.errors || {}).length > 0) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error && <div>{error}</div>}
            {formState.errors?.email && <div>{formState.errors.email}</div>}
            {formState.errors?.password && <div>{formState.errors.password}</div>}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-4">
          <CustomLoginInput
            name="email"
            type="email"
            validate={validateEmail}
            placeholder="Enter email"
            autoComplete="email"
            icon={FaUser}
            label="Email address"
          />

          <CustomPassword
            name="password"
            validate={validatePassword}
            placeholder="Password"
            autoComplete="current-password"
            icon={FaLock}
            label="Password"
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-300 disabled:bg-gray-400"
              disabled={loading || formState.invalid}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
