import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authService.verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });

  return (
    <>
  <Helmet><title>Verify Email – Harshis Collections</title></Helmet>
      <div className="text-center">
        {isLoading && <p className="text-gray-500">Verifying your email…</p>}
        {isSuccess && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">You can now log in to your account.</p>
            <Link to="/auth/login" className="btn-primary">Go to Login</Link>
          </>
        )}
        {isError && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-500 mb-6">Please request a new verification email.</p>
            <Link to="/auth/login" className="btn-primary">Go to Login</Link>
          </>
        )}
      </div>
    </>
  );
}
