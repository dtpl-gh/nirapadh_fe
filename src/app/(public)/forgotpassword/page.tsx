'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailInput } from '@/components/ui/email-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/forgot-password`, { email });

      if (response.status === 200) {
        setSent(true);
        toast({
          title: 'Success',
          description: 'Password reset link sent to your email!',
          variant: 'default',
        });
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
        <div className="text-center sm:text-left">
          <Image
            src="/image/Niraapadh.jpg"
            width={250}
            height={250}
            alt="Logo"
          />
          <p className="mb-6 text-center">Forgot your password?</p>

          {!sent ? (
            <form onSubmit={handleForgotPassword} className="w-full max-w-md">
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              <EmailInput
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                className="mb-4"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center text-green-600">
              <p>✓ Reset link sent! Check your email.</p>
              <p className="text-sm text-gray-600 mt-2">Redirecting to login...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

