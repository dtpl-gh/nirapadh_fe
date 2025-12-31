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
import { PasswordInput } from '@/components/ui/password-input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

interface PasswordValidations {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

const VALIDATION_RULES = {
  length: { test: (pwd: string) => pwd.length >= 8 && pwd.length <= 12, label: 'Minimum 8-12 characters' },
  uppercase: { test: (pwd: string) => /[A-Z]/.test(pwd), label: 'At least one uppercase letter' },
  lowercase: { test: (pwd: string) => /[a-z]/.test(pwd), label: 'At least one lowercase letter' },
  number: { test: (pwd: string) => /[0-9]/.test(pwd), label: 'At least one number' },
  special: { test: (pwd: string) => /[\W_]/.test(pwd), label: 'At least one special character' },
};

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState<PasswordValidations>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const allPasswordValidationsCompleted = Object.values(passwordValidations).every(Boolean);


  const validatePassword = (password: string) => {
    const validations: PasswordValidations = {
      length: VALIDATION_RULES.length.test(password),
      uppercase: VALIDATION_RULES.uppercase.test(password),
      lowercase: VALIDATION_RULES.lowercase.test(password),
      number: VALIDATION_RULES.number.test(password),
      special: VALIDATION_RULES.special.test(password),
    };
    setPasswordValidations(validations);
  };

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    validatePassword(newPassword);
    setTouchedPassword(true);
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

    if (!allPasswordValidationsCompleted) {
      toast({
        title: 'Error',
        description: 'Please ensure your password meets all requirements.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/create-user/`, {
        user_fullname: fullName,
        user_email: email,
        password,
      });

      if (response.status === 200) {
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

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={allPasswordValidationsCompleted ? 'border-green-500' : 'border-gray-300'}
                />
              </div>

              {touchedPassword && (
                <div className="mt-2 space-y-1">
                  {Object.entries(VALIDATION_RULES).map(([key, { label }]) => (
                    <div
                      key={key}
                      className={`flex items-center text-sm ${passwordValidations[key as keyof PasswordValidations] ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      <span className="mr-2">
                        {passwordValidations[key as keyof PasswordValidations] ? '✓' : '✗'}
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {allPasswordValidationsCompleted && touchedPassword && (
                <div className="mt-2 text-green-500 flex items-center text-sm">
                  <span className="mr-2">✓</span>
                  All validations completed
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-4 flex items-center justify-center"
                disabled={loading || !allPasswordValidationsCompleted}
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

