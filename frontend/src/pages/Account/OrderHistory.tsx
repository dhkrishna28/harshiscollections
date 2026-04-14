import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function OrderHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: () => orderService.myOrders(page),
  });

  return (
    <>
  <Helmet><title>My Orders – Harshis Collections</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : data?.data?.length ? (
          <div className="space-y-4">
            {data.data.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.id}`}
                className="flex items-center justify-between bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="font-bold text-gray-900">₹{order.total}</p>
                </div>
              </Link>
            ))}
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-1.5 px-4 text-sm">Previous</button>
              <button onClick={() => setPage(p => p + 1)} disabled={(data?.data?.length ?? 0) < 10} className="btn-secondary py-1.5 px-4 text-sm">Next</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        )}
      </div>
    </>
  );
}
