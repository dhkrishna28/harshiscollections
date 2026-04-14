import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 – Page Not Found</title></Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-8xl font-extrabold text-primary-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  );
}
