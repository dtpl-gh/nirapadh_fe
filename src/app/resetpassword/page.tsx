// 'use client';

// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';
// import React, { ChangeEvent, useState, useEffect, Suspense } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '../../components/ui/button';
// import axiosInstance from '../../lib/axiosInstance';
// import { useToast } from '../../components/ui/use-toast';
// import Image from 'next/image';
// import { Card } from '../../components/ui/card';
// import SuspenseSearchParamsWrapper from '../../components/SuspenseSearchParamsWrapper';

// export default function ResetPassword() {
//   const router = useRouter();

//   const { toast } = useToast();
//   const [token, setEmailToken] = useState<string>('');

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleParamsFetch = (params: Record<string, string>) => {
//     setEmailToken(params.token || '');
//   };

//   const [passwordValidations, setPasswordValidations] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });

//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [allValidationsCompleted, setAllValidationsCompleted] =
//     useState<boolean>(false);
//   const [touchedPassword, setTouchedPassword] = useState<boolean>(false);

//   // Password validation function
//   const validatePassword = (password: string) => {
//     const validations = {
//       length: password.length >= 8 && password.length <= 12,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[\W_]/.test(password),
//     };

//     setPasswordValidations(validations);
//     setAllValidationsCompleted(Object.values(validations).every((v) => v));
//   };

//   useEffect(() => {
//     validatePassword(password);
//   }, [password]); // Trigger validation when password changes

//   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//     if (!touchedPassword) setTouchedPassword(true);
//   };

//   const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setConfirmPassword(e.target.value);
//   };

//   const handlePasswordReset = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//         setLoading(true);
//         setError(null); // Clear any previous errors

//         const response = await axiosInstance.put(
//           `/forgot-password/?email_token=${token}`,
//           {
//             new_password: password,
//             confirm_new_password: confirmPassword,
//           }
//         );

//         if (response.status === 200) {
//           toast({
//             title: 'Success',
//             description: 'Reset successful! Please login.',
//             variant: 'default',
//           });
//           router.push('/auth');
//         } else {
//           toast({
//             title: 'Info',
//             description: `Unexpected status code: ${response.status}`,
//             variant: 'default',
//           });
//         }
//       } catch (error: any) {
//         if (error.response?.status === 404) {
//           toast({
//             title: 'Error',
//             description: 'The password reset link is invalid or expired. Please request a new one.',
//             variant: 'destructive',
//           });
//           router.push('/auth'); // Redirect user to request a new token
//         } else {
//           toast({
//             title: 'Error',
//             description: `An error occurred: ${error.response?.data?.message || error.message}`,
//             variant: 'destructive',
//           });
//         }
//       } finally {
//         setLoading(false);
//       }

//     };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SuspenseSearchParamsWrapper onParamsFetch={handleParamsFetch}>
//         <div className="flex min-h-screen items-center justify-center">
//           <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
//             <div className="text-center sm:text-left">
//               <Image
//                 src="/image/Niraapadh.jpg"
//                 width={250}
//                 height={250}
//                 alt="Logo"
//               />
//               <p className="mb-6 text-center">Reset your password</p>

//               <div className="w-full max-w-md">
//                 <Label htmlFor="password" className="block mb-2 text-black">
//                   New Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={handlePasswordChange}
//                     required
//                     className={`pr-10 ${allValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute inset-y-0 right-3 flex items-center text-gray-600"
//                   >
//                     {showPassword ? 'Hide' : 'Show'}
//                   </button>
//                 </div>

//                 <Label
//                   htmlFor="confirm-password"
//                   className="block mb-2 text-black mt-4"
//                 >
//                   Confirm Password
//                 </Label>
//                 <Input
//                   id="confirm-password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={handleConfirmPasswordChange}
//                   required
//                   className={`pr-10 ${allValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
//                 />

//                 {error && (
//                   <div className="text-red-500 text-sm mt-2">{error}</div>
//                 )}
//               </div>

//               {touchedPassword && (
//                 <div className="mt-4">
//                   {Object.entries(passwordValidations).map(([key, value]) => (
//                     <div
//                       key={key}
//                       className={`flex items-center ${value ? 'text-green-500' : 'text-red-500'}`}
//                     >
//                       {value ? (
//                         <span className="mr-2">&#x2714;</span>
//                       ) : (
//                         <span className="mr-2">&#x2716;</span>
//                       )}
//                       {key === 'length' && 'Minimum 8 characters'}
//                       {key === 'uppercase' && 'At least one uppercase letter'}
//                       {key === 'lowercase' && 'At least one lowercase letter'}
//                       {key === 'number' && 'At least one number'}
//                       {key === 'special' && 'At least one special character'}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {allValidationsCompleted && touchedPassword && (
//                 <div className="mt-4 text-green-500 flex items-center">
//                   <span className="mr-2">&#x2714;</span>
//                   All validations completed
//                 </div>
//               )}

//               <Button
//                 className="mt-5"
//                 onClick={handlePasswordReset}
//                 disabled={loading || !allValidationsCompleted}
//               >
//                 {loading ? 'Resetting...' : 'Reset Password'}
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </SuspenseSearchParamsWrapper>
//     </Suspense>
//   );
// }

'use client';

import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import React, { ChangeEvent, useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import axiosInstance from '../../lib/axiosInstance';
import { useToast } from '../../components/ui/use-toast';
import Image from 'next/image';
import { Card } from '../../components/ui/card';
import SuspenseSearchParamsWrapper from '../../components/SuspenseSearchParamsWrapper';

export default function ResetPassword() {
  const router = useRouter();

  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');

  // const emailFromQuery = searchParams.get("email") || ""; // Default to empty string
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParamsFetch = (params: Record<string, string>) => {
    setEmail(params.email || '');
  };

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
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);

  // Password validation function
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[\W_]/.test(password),
    };

    setPasswordValidations(validations);
    setAllValidationsCompleted(Object.values(validations).every((v) => v));
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]); // Trigger validation when password changes

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!touchedPassword) setTouchedPassword(true);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const response = await axiosInstance.put(
        `admin-reset-password/?email=${encodeURIComponent(email)}`,
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
      } else {
        toast({
          title: 'Info',
          description: `Unexpected status code: ${response.status}`,
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `An error occurred: ${error.response?.data?.message || error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseSearchParamsWrapper onParamsFetch={handleParamsFetch}>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="sm:max-w-[800px] p-8 flex flex-col justify-center rounded-lg shadow-lg">
            <div className="text-center sm:text-left">
              <Image
                src="/image/Niraapadh.jpg"
                width={250}
                height={250}
                alt="Logo"
              />
              <p className="mb-6 text-center">Reset your password</p>

              <div className="w-full max-w-md">
                <Label htmlFor="password" className="block mb-2 text-black">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={`pr-10 ${allValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <Label
                  htmlFor="confirm-password"
                  className="block mb-2 text-black mt-4"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`pr-10 ${allValidationsCompleted ? 'border-green-500' : 'border-gray-300'}`}
                />

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>

              {touchedPassword && (
                <div className="mt-4">
                  {Object.entries(passwordValidations).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center ${value ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {value ? (
                        <span className="mr-2">&#x2714;</span>
                      ) : (
                        <span className="mr-2">&#x2716;</span>
                      )}
                      {key === 'length' && 'Minimum 8 characters'}
                      {key === 'uppercase' && 'At least one uppercase letter'}
                      {key === 'lowercase' && 'At least one lowercase letter'}
                      {key === 'number' && 'At least one number'}
                      {key === 'special' && 'At least one special character'}
                    </div>
                  ))}
                </div>
              )}

              {allValidationsCompleted && touchedPassword && (
                <div className="mt-4 text-green-500 flex items-center">
                  <span className="mr-2">&#x2714;</span>
                  All validations completed
                </div>
              )}

              <Button
                className="mt-5"
                onClick={handlePasswordReset}
                disabled={loading || !allValidationsCompleted}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </Card>
        </div>
      </SuspenseSearchParamsWrapper>
    </Suspense>
  );
}
