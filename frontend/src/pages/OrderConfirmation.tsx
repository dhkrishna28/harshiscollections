import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderDetail(parseInt(orderId!)),
    enabled: !!orderId,
  });
  const order = data?.data;

  return (
    <>
  <Helmet><title>Order Confirmed – Harshis Collections</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        {isLoading ? (
          <p className="text-gray-500">Loading order details…</p>
        ) : order ? (
          <>
            <p className="text-gray-600 mb-2">Order Number: <strong>{order.order_number}</strong></p>
            <p className="text-gray-600 mb-6">Total: <strong>₹{order.total}</strong></p>
          </>
        ) : null}
        <p className="text-gray-500 mb-8">Thank you for your purchase! We'll notify you when your order ships.</p>
        <div className="flex justify-center gap-4">
          <Link to="/account/orders" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </>
  );
}
