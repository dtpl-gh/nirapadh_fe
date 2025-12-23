'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../../lib/axiosInstance';
import 'react-toastify/dist/ReactToastify.css'; // Ensure this import is present
import { ClipLoader } from 'react-spinners'; // Loader spinner

function Register() {
  const router = useRouter(); // Initialize the router

  // State for input values and validation
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [touchedFullName, setTouchedFullName] = useState<boolean>(false);
  const [touchedEmail, setTouchedEmail] = useState<boolean>(false);
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

  // Validate password
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[\W_]/.test(password),
    };

    setPasswordValidations(validations);
  };

  // Handle input changes
  const handleFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
    setTouchedFullName(true);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
    setTouchedEmail(true);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    setTouchedPassword(true);
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailValid) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const allPasswordValidationsCompleted =
      Object.values(passwordValidations).every(Boolean);
    if (!allPasswordValidationsCompleted) {
      toast.error('Please ensure your password meets all requirements.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.post('/create-user/', {
        user_fullname: fullName,
        user_email: email,
        password,
      });

      if (response.status === 200) {
        toast.success(
          'Registration successful! Please check your email to verify your account.'
        );
        setTimeout(() => {
          router.push('/auth'); // Redirect to login page after a short delay
        }, 2000);
      }
    } catch (error: any) {
      // Extract error message properly
      const errorMessage =
        error.response?.data?.detail || // ✅ Extracts custom backend message
        error.response?.data?.message ||
        'Something went wrong. Please try again.';

      toast.error(errorMessage); // ✅ Show custom message from backend
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const allPasswordValidationsCompleted =
    Object.values(passwordValidations).every(Boolean);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* Full Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={handleFullNameChange}
                  required
                  className={`pr-10 ${touchedFullName && fullName ? 'border-green-500' : 'border-gray-300'}`}
                />
              </div>

              {/* Email Field */}
              <div className="relative grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`pr-10 ${emailValid ? 'border-green-500' : 'border-gray-300'}`}
                />
                {touchedEmail &&
                  (emailValid ? (
                    <span className="absolute right-3 top-3 text-green-500">
                      &#x2714;
                    </span> // Tick mark character
                  ) : (
                    <span className="absolute right-3 top-3 text-red-500">
                      &#x2716;
                    </span> // Cross mark character
                  ))}
              </div>

              {/* Password Field */}
              <div className="relative grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`pr-10 ${allPasswordValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {touchedPassword &&
                  (allPasswordValidationsCompleted ? (
                    <span className="absolute right-3 top-3 text-green-500">
                      &#x2714;
                    </span> // Tick mark character
                  ) : (
                    <span className="absolute right-3 top-3 text-red-500">
                      &#x2716;
                    </span> // Cross mark character
                  ))}
              </div>

              {/* Password Validation Messages */}
              {touchedPassword && !allPasswordValidationsCompleted && (
                <div className="mt-4">
                  <div
                    className={`flex items-center ${passwordValidations.length ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordValidations.length ? (
                      <span className="mr-2">&#x2714;</span>
                    ) : (
                      <span className="mr-2">&#x2716;</span>
                    )}
                    Minimum 8- 12 characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidations.uppercase ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordValidations.uppercase ? (
                      <span className="mr-2">&#x2714;</span>
                    ) : (
                      <span className="mr-2">&#x2716;</span>
                    )}
                    At least one uppercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidations.lowercase ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordValidations.lowercase ? (
                      <span className="mr-2">&#x2714;</span>
                    ) : (
                      <span className="mr-2">&#x2716;</span>
                    )}
                    At least one lowercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidations.number ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordValidations.number ? (
                      <span className="mr-2">&#x2714;</span>
                    ) : (
                      <span className="mr-2">&#x2716;</span>
                    )}
                    At least one number
                  </div>
                  <div
                    className={`flex items-center ${passwordValidations.special ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordValidations.special ? (
                      <span className="mr-2">&#x2714;</span>
                    ) : (
                      <span className="mr-2">&#x2716;</span>
                    )}
                    At least one special character
                  </div>
                </div>
              )}
              {allPasswordValidationsCompleted && touchedPassword && (
                <div className="mt-4 text-green-500 flex items-center">
                  <span className="mr-2">&#x2714;</span>
                  All validations completed
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-4 flex items-center justify-center"
              >
                {loading ? <ClipLoader size={24} color="#fff" /> : 'Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default Register;
