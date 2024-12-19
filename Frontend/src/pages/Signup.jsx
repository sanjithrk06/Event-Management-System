import { useState } from "react";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);

  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailValid(validateEmail(email));
    setPasswordValid(password.length >= 6);
    setNameValid(validateName(name));

    if (validateEmail(email) && password.length >= 6 && validateName(name)) {
      try {
        await signup(name, email, password);
        navigate("/"); // Redirect to home after signup
      } catch (error) {
        console.error(error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Sign Up</h1>
          <p className="text-sm text-gray-600">
            Create an account to get started.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={`block w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:outline-none ${
                isNameValid
                  ? "border-gray-300 focus:ring-primary"
                  : "border-red-500 focus:ring-red-500"
              }`}
              aria-invalid={!isNameValid}
            />
            {!isNameValid && (
              <p className="text-xs text-red-600 mt-1">Name is required.</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`block w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:outline-none ${
                isEmailValid
                  ? "border-gray-300 focus:ring-primary"
                  : "border-red-500 focus:ring-red-500"
              }`}
              aria-invalid={!isEmailValid}
            />
            {!isEmailValid && (
              <p className="text-xs text-red-600 mt-1">
                Invalid email address.
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`block w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:outline-none ${
                  isPasswordValid
                    ? "border-gray-300 focus:ring-primary"
                    : "border-red-500 focus:ring-red-500"
                }`}
                aria-invalid={!isPasswordValid}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {isPasswordVisible ? (
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7.305 4.5 3.028 7.61 1.005 12c2.023 4.39 6.3 7.5 10.995 7.5s8.972-3.11 10.995-7.5C20.972 7.61 16.695 4.5 12 4.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7.305 4.5 3.028 7.61 1.005 12c2.023 4.39 6.3 7.5 10.995 7.5s8.972-3.11 10.995-7.5C20.972 7.61 16.695 4.5 12 4.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
            {!isPasswordValid && (
              <p className="text-xs text-red-600 mt-1">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-orange-600 text-white rounded-md py-2 font-semibold hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center mt-4 text-sm text-gray-600">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="ml-1 text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
