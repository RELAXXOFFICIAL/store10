import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    login(data.email, data.password);
    navigate('/dashboard');
    toast.success('Signed in successfully');
  };

  const handleRegister = async (data: { email: string; password: string, full_name: string }) => {
    console.log('register', data);
    navigate('/dashboard');
    toast.success('Account created successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <AuthForm onLogin={handleLogin} onRegister={handleRegister}/>
    </div>
  );
}
