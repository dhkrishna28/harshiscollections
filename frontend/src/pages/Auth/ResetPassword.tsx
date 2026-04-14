import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.new_password === d.confirm, { path: ['confirm'], message: 'Passwords do not match' });
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ new_password }: FormData) => {
    try {
      await authService.resetPassword(token!, new_password);
      toast.success('Password reset successfully. Please log in.');
      navigate('/auth/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Could not reset password.');
    }
  };

  return (
    <>
  <Helmet><title>Reset Password – Harshis Collections</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Set new password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">New Password</label>
          <input {...register('new_password')} type="password" className="input" />
          {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>}
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input {...register('confirm')} type="password" className="input" />
          {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
          {isSubmitting ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}
