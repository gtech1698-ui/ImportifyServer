import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/gtech-logo.png';
import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  // Auto-logout logic: check on mount
  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const now = Date.now();
      const diff = now - parseInt(loginTime, 10);
      const oneDay = 24 * 60 * 60 * 1000;
      if (diff > oneDay) {
        auth.signOut();
        localStorage.removeItem('loginTime');
        navigate('/login');
        toast.info('Session expired. Please log in again.');
      }
    }
    // eslint-disable-next-line
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(
        collection(db, 'authorizedUsers'),
        where('email', '==', form.email.trim().toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error('❌ Access denied: Email not authorized');
        return;
      }

      const userDoc = snapshot.docs[0].data();
      const enteredPass = form.password.trim();

      if (userDoc.password !== enteredPass) {
        toast.error('⚠️ Incorrect password');
        return;
      }

      await signInWithEmailAndPassword(
        auth,
        form.email.trim().toLowerCase(),
        enteredPass
      );

      // Store login time for auto-logout
      localStorage.setItem('loginTime', Date.now().toString());

      toast.success(`✅ Welcome ${userDoc.name || 'User'}!`);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] w-[100vw] h-[100vh] flex justify-center items-center"
      style={{ fontFamily: 'Montserrat,sans-serif' }}
    >
      <div className="bg-white/90 backdrop-blur-lg w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[30vw] h-[75vh] shadow-2xl rounded-3xl border border-[#e5e7eb] flex flex-col justify-center">
        <form onSubmit={handleLogin} className="h-full flex flex-col p-10 gap-10 items-center justify-center">
          <img src={logo} alt="No image available" className='w-24'/>
          <h2 className="text-3xl xl:text-4xl font-extrabold text-[#1e293b] tracking-tight">
            Sign in to <span className="text-[#2563eb]">Importify</span>
          </h2>

          <div className="flex flex-col items-start w-full">
            <label htmlFor="email" className="text-lg font-semibold mb-2 text-[#334155]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="bg-[#f1f5f9] border border-[#cbd5e1] w-full h-14 text-base font-medium text-[#334155] px-5 shadow focus:shadow-lg focus:border-[#2563eb] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              name="email"
              id="email"
              required
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col items-start w-full">
            <label htmlFor="password" className="text-lg font-semibold mb-2 text-[#334155]">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="bg-[#f1f5f9] border border-[#cbd5e1] w-full h-14 text-base font-medium text-[#334155] px-5 shadow focus:shadow-lg focus:border-[#2563eb] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition"
              value={form.password}
              name="password"
              id="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#2563eb] to-[#60a5fa] w-[60%] h-12 rounded-full text-lg font-bold shadow-lg text-white hover:scale-105 hover:shadow-xl transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;