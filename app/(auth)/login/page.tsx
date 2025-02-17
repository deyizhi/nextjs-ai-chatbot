'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';

import AuthButtons from "@/components/auth-buttons";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  const privacyPolicyLink = process.env.NEXT_PUBLIC_PRIVACY_POLICY_LINK || '#';
  const termsOfServiceLink = process.env.NEXT_PUBLIC_TERM_OF_SERVICE_LINK || '#';
  
  const handleGoogleLogin = () => {
    // Open Google authentication popup with the correct Google OAuth URL
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?';
    const googleAuthWindow = window.open(
      googleAuthUrl,
      'Google Login',
      'width=500,height=600'
    );

    if (googleAuthWindow) {
      const interval = setInterval(() => {
        if (googleAuthWindow.closed) {
          clearInterval(interval);
          router.refresh(); // Refresh the page after the popup is closed
        }
      }, 500);
    } else {
      toast.error('Failed to open Google login popup.');
    }
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In 登錄</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Please use the email account and password you signed up.
          </p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            如未註冊請先註冊
          </p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
          We will support Google account authentication sign in
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>Sign in 登錄</SubmitButton>
          
          <AuthButtons/>
          
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up 註冊
            </Link>
            {' for free.'}
          </p>
        </AuthForm>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        By signing in, you agree to our{' '}
        <a
          href={privacyPolicyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-800 dark:text-gray-200"
        >
          Privacy Policy 隱私政策
        </a>{' '}
        and{' '}
        <a
          href={termsOfServiceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-800 dark:text-gray-200"
        >
          Terms of Service 服務條款
        </a>.
      </div>
      </div>
    </div>
  );
}
