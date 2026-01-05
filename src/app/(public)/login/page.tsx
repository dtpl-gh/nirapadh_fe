'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmailInput } from '@/components/ui/email-input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/auth/login`, { username: email, password });
      if (response.status === 200) {
        const token = response.data.token || response.data.access_token;
        // Set token in cookie so middleware and server components can read it
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        toast.success('Login successful!');
        router.push('/dashboard');
      } else if (response.status === 202) {
        toast.info('Login successful. Please reset your password.');
        router.push(`/resetpassword?emailaddress=${encodeURIComponent(email)}`);
      } else if (response.status === 401) {
        const errorMessage = response.data.data.detail || 'Invalid credentials.';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error(error.response.data?.data?.detail || 'Invalid credentials.');
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error(error.message || 'An error occurred.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
        <form
          onSubmit={handleLogin}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-24 items-center justify-center"
        >
          <div className="text-center sm:text-left hidden sm:block">
            <Image
              src="/image/Niraapadh.jpg"
              width={500}
              height={500}
              alt="Nirapadh Logo"
            />
            <h1 className="font-bold text-2xl">Welcome to Nirāpadh</h1>
            <p className="mt-4">
              Cybersecurity suite with our single sign-in portal. Your gateway
              to advanced protection and threat management starts here.
            </p>
            <p className="mt-4">Let's begin!</p>
          </div>

          <div className="text-center sm:text-left">
            <div className="mb-4">
              <EmailInput
                id="email"
                placeholder="mail@example.com"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            <div className="mb-4">
              <PasswordInput
                id="password"
                placeholder="password"
                value={password}
                onChange={setPassword}
                required
              />
            </div>

            <div className="flex justify-end mb-4">
              <Link href="/forgotpassword" className="hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : 'Sign in'}
            </Button>

            <p className="pt-4">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="hover:underline">
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

