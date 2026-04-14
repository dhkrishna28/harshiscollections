import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { cmsService } from '../../services/cmsService';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Please enter at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await cmsService.submitContact(data);
      toast.success('Message sent! We ll get back to you soon.');
      reset();
    } catch {
      toast.error('Could not send message. Please try again.');
    }
  };

  return (
    <>
  <Helmet><title>Contact Us – Harshis Collections</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">Have a question? We'd love to hear from you.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input {...register('name')} className="input" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input {...register('phone')} className="input" />
          </div>
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} className="input" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea {...register('message')} rows={5} className="input" />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </>
  );
}
