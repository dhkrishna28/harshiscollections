import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  path: ['confirm_password'],
  message: 'Passwords do not match',
});
type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ confirm_password: _, ...data }: FormData) => {
    try {
      const res = await authService.register(data);
      if (res.success) {
        toast.success(res.message || 'Account created! Please check your email to verify.');
        navigate('/auth/login');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Registration failed.');
    }
  };

  return (
    <>
  <Helmet><title>Sign Up – Harshis Collections</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">First Name</label>
            <input {...register('first_name')} className="input" placeholder="John" />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="label">Last Name</label>
            <input {...register('last_name')} className="input" placeholder="Doe" />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Phone (optional)</label>
          <input {...register('phone')} className="input" placeholder="+91 9876543210" />
        </div>
        <div>
          <label className="label">Password</label>
          <input {...register('password')} type="password" className="input" placeholder="Min. 8 characters" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input {...register('confirm_password')} type="password" className="input" placeholder="••••••••" />
          {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
          {isSubmitting ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
      </p>
    </>
  );
}
