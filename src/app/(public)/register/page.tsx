'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailInput } from '@/components/ui/email-input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';



export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailValid) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/clients/register`, {
        fullname: fullName,
        email: email,
      });

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: 'Success',
          description: 'Registration successful! Please check your email to verify your account.',
          variant: 'default',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Something went wrong. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={handleFullNameChange}
                  required
                  className={fullName ? 'border-green-500' : 'border-gray-300'}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <EmailInput
                  id="email"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onValidationChange={setEmailValid}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <ClipLoader size={24} color="#fff" /> : 'Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

