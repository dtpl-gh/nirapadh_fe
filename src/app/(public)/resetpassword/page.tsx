'use client';

import { ChangeEvent, useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import SuspenseSearchParamsWrapper from '@/components/SuspenseSearchParamsWrapper';

interface PasswordValidations {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

const VALIDATION_RULES = {
  length: { test: (pwd: string) => pwd.length >= 8 && pwd.length <= 12, label: 'Minimum 8 characters' },
  uppercase: { test: (pwd: string) => /[A-Z]/.test(pwd), label: 'At least one uppercase letter' },
  lowercase: { test: (pwd: string) => /[a-z]/.test(pwd), label: 'At least one lowercase letter' },
  number: { test: (pwd: string) => /[0-9]/.test(pwd), label: 'At least one number' },
  special: { test: (pwd: string) => /[\W_]/.test(pwd), label: 'At least one special character' },
};

export default function ResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [validations, setValidations] = useState<PasswordValidations>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const isAllValid = Object.values(validations).every((v) => v);

  useEffect(() => {
    const newValidations: PasswordValidations = {
      length: VALIDATION_RULES.length.test(password),
      uppercase: VALIDATION_RULES.uppercase.test(password),
      lowercase: VALIDATION_RULES.lowercase.test(password),
      number: VALIDATION_RULES.number.test(password),
      special: VALIDATION_RULES.special.test(password),
    };
    setValidations(newValidations);
  }, [password]);

  const handleParamsFetch = (params: Record<string, string>) => {
    setEmail(params.email || '');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!touchedPassword) setTouchedPassword(true);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/admin-reset-password/?email=${encodeURIComponent(email)}`,
        {
          new_password: password,
          confirm_new_password: confirmPassword,
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Reset successful! Please login.',
          variant: 'default',
        });
        router.push('/org/auth');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseSearchParamsWrapper onParamsFetch={handleParamsFetch}>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-24 items-center justify-center">
              <div className="text-center sm:text-left hidden sm:block">
                <Image
                  src="/image/Niraapadh.jpg"
                  width={500}
                  height={500}
                  alt="Nirapadh Logo"
                />
                <h1 className="font-bold text-2xl">Reset Your Password</h1>
                <p className="mt-4">
                  Secure your account by choosing a strong password.
                  Our suite ensures your gate to protection remains solid.
                </p>
                <p className="mt-4">Set your new password below!</p>
              </div>

              <div className="text-center sm:text-left">
                <p className="mb-6 text-xl font-semibold sm:hidden">Reset your password</p>

                <form onSubmit={handlePasswordReset} className="w-full max-w-md">
                  <div className="mb-4 text-left">
                    <Label htmlFor="password" title="password" className="block mb-2 text-black">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className={isAllValid ? 'border-green-500' : 'border-gray-300'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600 text-sm"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 text-left">
                    <Label htmlFor="confirm-password" title="confirm-password" className="block mb-2 text-black">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      className={isAllValid ? 'border-green-500' : 'border-gray-300'}
                    />
                  </div>

                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                  {touchedPassword && (
                    <div className="mt-4 space-y-1 text-left">
                      {Object.entries(VALIDATION_RULES).map(([key, { label }]) => (
                        <div
                          key={key}
                          className={`flex items-center text-sm ${validations[key as keyof PasswordValidations] ? 'text-green-500' : 'text-red-500'}`}
                        >
                          <span className="mr-2">{validations[key as keyof PasswordValidations] ? '✓' : '✗'}</span>
                          {label}
                        </div>
                      ))}
                    </div>
                  )}

                  {isAllValid && touchedPassword && (
                    <div className="mt-4 text-green-500 flex items-center text-sm justify-start">
                      <span className="mr-2">✓</span>
                      All validations completed
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="mt-6 w-full"
                    disabled={loading || !isAllValid}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </SuspenseSearchParamsWrapper>
    </Suspense>
  );
}

