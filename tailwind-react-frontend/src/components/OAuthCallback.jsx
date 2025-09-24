import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const user = params.get('user'); // backend can also send user as base64/json if needed

    if (token) {
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', user); 
      }
      navigate('/home'); // or role-based redirect
    } else {
      navigate('/login');
    }
  }, [params, navigate]);

  return <div className="p-8 text-center">Completing login…</div>;
}
