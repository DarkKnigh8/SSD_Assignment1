// import { useState } from 'react';
// import { authAPI } from '../services/api';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await authAPI.post('/login', form); // send login form

//       // Store token and user
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));

//       const user = res.data.user;

//       if (user?.role === 'restaurant') {
//         navigate('/restaurantDashboard');
//       } else if (user?.role === 'admin') {
//         navigate('/adminDashboard');
//       } else if (user?.role === 'customer') {
//         navigate('/home');
//       } else if (user?.role === 'delivery') {
//         navigate('/driver'); // Adjust as needed for delivery role
//       } else {
//         alert('Unknown user role');
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border px-3 py-2 rounded"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           required
//         />
//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Password"
//             className="w-full border px-3 py-2 rounded pr-10"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-2 top-2 text-sm text-blue-600"
//           >
//             {showPassword ? 'Hide' : 'Show'}
//           </button>
//         </div>
//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
//           Login
//         </button>
//       </form>
//       <p className="mt-4 text-sm text-center">
//         Don't have an account?{' '}
//         <Link to="/register" className="text-blue-600 hover:underline">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// }

import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.post('/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user?.role === 'restaurant') navigate('/restaurantDashboard');
      else if (user?.role === 'admin') navigate('/adminDashboard');
      else if (user?.role === 'customer') navigate('/home');
      else if (user?.role === 'delivery') navigate('/driver');
      else alert('Unknown user role');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

   // ✅ Google OAuth login
  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    window.location.href = `${apiBase}/auth/oauth/login/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {/* Normal email/password login */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-blue-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>

      {/* ✅ OAuth login button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Continue with Google
        </button>
      </div>

      <p className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
