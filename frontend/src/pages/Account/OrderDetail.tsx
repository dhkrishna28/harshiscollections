import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => orderService.getOrderDetail(parseInt(id!)),
    enabled: !!id,
  });
  const order = data?.data;

  if (isLoading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-32 text-gray-500">Order not found.</div>;

  return (
    <>
  <Helmet><title>Order {order.order_number} – Harshis Collections</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/account/orders" className="text-sm text-primary-600 hover:underline mb-6 block">← Back to Orders</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
        <p className="text-gray-500 text-sm mb-8">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

        <div className="bg-white border rounded-xl overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-gray-600">Product</th>
                <th className="px-4 py-3 text-gray-600">Qty</th>
                <th className="px-4 py-3 text-gray-600 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-gray-800">{item.product_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium text-right">₹{item.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 flex justify-between font-bold text-gray-900 mb-6">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>

        <div className="bg-white border rounded-xl p-5 text-sm text-gray-700 space-y-1">
          <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
          <p>{order.shipping_name}</p>
          <p>{order.shipping_address}</p>
          <p>{order.shipping_city}, {order.shipping_state} – {order.shipping_postal}</p>
          <p>{order.shipping_country}</p>
        </div>
      </div>
    </>
  );
}
