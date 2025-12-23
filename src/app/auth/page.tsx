'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners'; // Import for spinner
// import axiosInstance from '../../lib/axiosInstance';
import useStore from '../../lib/Zustand';
import axios from 'axios';

export default function Login() {
  const { login } = useStore();
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [allValidationsCompleted, setAllValidationsCompleted] =
    useState<boolean>(false);
  const [touchedEmail, setTouchedEmail] = useState<boolean>(false);
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const router = useRouter();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8 && password.length <= 12, // Updated to 8 characters
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[\W_]/.test(password),
    };

    setPasswordValidations(validations);
    setAllValidationsCompleted(Object.values(validations).every((v) => v));
  };

  // Event handlers
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

  //  const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true); // Start loading indicator

  //   try {
  //     const response = await axios.post('/api/auth/login', { email, password });

  //     if (response.status === 200) {
  //       // ✅ Normal login success
  //       toast.success('Login successful!');
  //       const token = response.data.data.token;;
  //       login(token);
  //       router.push('/dashboard'); // Redirect after login
  //     }
  //     else if (response.status === 202) {
  //       // ✅ Default password case
  //       toast.info('Login successful. Please reset your password.');
  //       router.push(`/resetpassword?emailaddress=${encodeURIComponent(email)}`);
  //     }
  //     else if (response.status === 401) {
  //       const errorMessage = response.data.data.detail || 'Invalid credentials.';
  //       toast.error(errorMessage);
  //     }
  //     else {
  //       toast.error('Unexpected status code: ' + response.status);
  //     }
  //   } catch (error: any) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response) {
  //         const errorMessage = error.response.data.data.data.detail || 'An error occurred.';
  //         toast.error(errorMessage);
  //       } else if (error.request) {
  //         toast.error('No response from server. Please try again later.');
  //       } else {
  //         toast.error('Request setup error: ' + error.message);
  //       }
  //     } else {
  //       toast.error('An unexpected error occurred: ' + error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator

    try {
      const response = await axios.post('/api/proxy/user-login/', { email, password });

      if (response.status === 200) {
        // ✅ Normal login success
        toast.success('Login successful!');
        const { token, role, userId } = response.data.data;

        // Save token and role
        login(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);

        // Redirect based on role
        if (role === 'role_1') {
          router.push('/admindashboard'); // Admin Dashboard
        } else {
          router.push('/dashboard'); // User Dashboard
        }
      } else if (response.status === 202) {
        // ✅ Default password case
        toast.info('Login successful. Please reset your password.');
        router.push(`/resetpassword?emailaddress=${encodeURIComponent(email)}`);
      } else if (response.status === 401) {
        const errorMessage =
          response.data.data.detail || 'Invalid credentials.';
        toast.error(errorMessage);
      } else {
        toast.error('Unexpected status code: ' + response.status);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data?.data?.detail || 'An error occurred.';
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error('Request setup error: ' + error.message);
        }
      } else {
        toast.error('An unexpected error occurred: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
        <form
          onSubmit={handleLogin}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-24 items-center justify-center"
        >
          {/* Column One - Welcome Message */}
          <div className="text-center sm:text-left hidden sm:block">
            <Image
              src="/image/Niraapadh.jpg"
              width={500}
              height={500}
              alt="Picture of the author"
            />
            <h1 className="font-bold text-2xl">Welcome to Nirāpadh</h1>
            <p className="mt-4">
              Cybersecurity suite with our single sign-in portal. Your gateway
              to advanced protection and threat management starts here.
            </p>
            <p className="mt-4">Let’s begin!</p>
          </div>

          {/* Column Two - Login Form */}
          <div className="text-center sm:text-left">
            <div className="relative input-container mb-4">
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
                  <span className="validation-tick">&#x2714;</span>
                ) : (
                  <span className="validation-cross">&#x2716;</span>
                ))}
            </div>
            <div className="relative input-container mb-4">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`pr-10 ${allValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {touchedPassword &&
                (allValidationsCompleted ? (
                  <span className="validation-tick">&#x2714;</span>
                ) : (
                  <span className="validation-cross">&#x2716;</span>
                ))}
            </div>

            <div className="flex justify-end mt-2">
              <Link href="/forgotpassword" className="hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full mt-4 flex items-center justify-center"
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : 'Sign in'}
            </Button>
            <p className="pt-4">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
}
