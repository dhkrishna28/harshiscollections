import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-primary-600">
            Harshis Collections
          </a>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
