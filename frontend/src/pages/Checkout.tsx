import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { orderService, type PlaceOrderPayload } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  shipping_name: z.string().min(2, 'Name is required'),
  shipping_phone: z.string().optional(),
  shipping_address: z.string().min(5, 'Address is required'),
  shipping_city: z.string().min(2, 'City is required'),
  shipping_state: z.string().min(2, 'State is required'),
  shipping_postal: z.string().min(4, 'Postal code is required'),
  shipping_country: z.string().default('India'),
  payment_method: z.enum(['cod', 'online']),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      shipping_name: user ? `${user.first_name} ${user.last_name}` : '',
      shipping_country: 'India',
      payment_method: 'cod',
    },
  });

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await orderService.placeOrder(data as PlaceOrderPayload);
      if (res.success) {
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${res.data.order_id}`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
  <Helmet><title>Checkout – Harshis Collections</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800">Shipping Details</h2>

            {[
              { name: 'shipping_name', label: 'Full Name', placeholder: 'John Doe' },
              { name: 'shipping_phone', label: 'Phone', placeholder: '+91 9876543210' },
              { name: 'shipping_address', label: 'Address', placeholder: '123, Street Name' },
              { name: 'shipping_city', label: 'City', placeholder: 'Mumbai' },
              { name: 'shipping_state', label: 'State', placeholder: 'Maharashtra' },
              { name: 'shipping_postal', label: 'Postal Code', placeholder: '400001' },
              { name: 'shipping_country', label: 'Country', placeholder: 'India' },
            ].map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input {...register(f.name as keyof FormData)} placeholder={f.placeholder} className="input" />
                {errors[f.name as keyof FormData] && (
                  <p className="text-red-500 text-xs mt-1">{errors[f.name as keyof FormData]?.message as string}</p>
                )}
              </div>
            ))}

            <div>
              <label className="label">Payment Method</label>
              <select {...register('payment_method')} className="input">
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="label">Order Notes (optional)</label>
              <textarea {...register('notes')} rows={3} className="input" placeholder="Any special instructions..." />
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h2>
            <div className="bg-gray-50 border rounded-xl p-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-700">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button type="submit" disabled={submitting || items.length === 0} className="btn-primary w-full py-3 mt-2">
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
