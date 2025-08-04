import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Homepage from './pages/homepage';
import ImportPage from './pages/importPage';
import ExportPage from './pages/exportPage';
import Table from './pages/tabularView';
import GetCircle from './pages/GetCircle';
import Login from './pages/Login';
import ActivityLogs from './pages/ActivityLogs';
import Active from './pages/Active';
import Failed from './pages/Failed'
import UploadSummaryPage from './pages/UploadSummary';
// ✅ MODULAR Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
function App() {
  const [user, setUser] = useState(null);
const [checkingAuth, setCheckingAuth] = useState(true); // NEW

  // Firebase config from environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
  };

  // 🟩 Initialize Firebase app (once)
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    setUser(u);
    setCheckingAuth(false); // 👈 Only after auth state is known
  });
  return () => unsubscribe();
}, []);


  return (
    <BrowserRouter>
      <ToastContainer position='top-center' autoClose={3000} />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/import' element={<ImportPage />} />
        <Route path='/export' element={<ExportPage />} />
        <Route path='/table' element={<Table />} />
        <Route path='/getCircle' element={<GetCircle />} />
        <Route path='/activity' element={<ActivityLogs/>}/>
        <Route path='/active' element={<Active />} />
        <Route path='/failed' element={<Failed />} />
        <Route path='/uploadsummary' element={<UploadSummaryPage />} />
        <Route
  path="/login"
  element={
    checkingAuth
      ? <div className="text-white p-10 text-xl">Loading auth state...</div>
      : user
      ? <Navigate to="/" />
      : <Login />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
