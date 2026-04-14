import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('If that email exists, a reset link has been sent.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
  <Helmet><title>Forgot Password – Harshis Collections</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
      <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
          {isSubmitting ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        <Link to="/auth/login" className="text-primary-600 hover:underline">Back to Login</Link>
      </p>
    </>
  );
}
