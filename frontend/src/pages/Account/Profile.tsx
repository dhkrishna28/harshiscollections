import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { accountService, type UpdateProfilePayload } from '../../services/accountService';

export default function Profile() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['profile'], queryFn: () => accountService.getProfile() });
  const profile = data?.data;

  const { register, handleSubmit } = useForm<UpdateProfilePayload>();
  
  const mutation = useMutation({
    mutationFn: accountService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated.');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Could not update profile.'),
  });

  return (
    <>
  <Helmet><title>My Profile – Harshis Collections</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        {profile && (
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            {[
              { name: 'first_name', label: 'First Name', defaultValue: profile.first_name },
              { name: 'last_name', label: 'Last Name', defaultValue: profile.last_name },
              { name: 'phone', label: 'Phone', defaultValue: profile.phone },
              { name: 'address_line1', label: 'Address Line 1', defaultValue: profile.address_line1 },
              { name: 'address_line2', label: 'Address Line 2', defaultValue: profile.address_line2 },
              { name: 'city', label: 'City', defaultValue: profile.city },
              { name: 'state', label: 'State', defaultValue: profile.state },
              { name: 'postal_code', label: 'Postal Code', defaultValue: profile.postal_code },
              { name: 'country', label: 'Country', defaultValue: profile.country },
            ].map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input {...register(f.name as keyof UpdateProfilePayload)} defaultValue={f.defaultValue || ''} className="input" />
              </div>
            ))}
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
