import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <ShieldAlert className="w-24 h-24 text-red-400 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-2xl text-gray-600 mb-4">Access Denied</p>
        <p className="text-gray-500 mb-8">You don't have permission to access this page</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
