import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAuth,
  EmailAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'; // ✅ UI styles

function Signup() {
 const uiConfig = {
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: async (authResult) => {
      const user = authResult.user;
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          providerId: user.providerData[0]?.providerId || '',
          createdAt: serverTimestamp()
        });
        console.log('New user registered');
      } else {
        console.log('User already exists');
      }
      toast.success(`User signup successful`)
      window.location.href = '/'; // redirect post signup
      return false;
    }
  },
  signInFlow: 'popup'
};

  useEffect(() => {
    const auth = getAuth();
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#signup-ui-container', uiConfig);
  }, []);

  return (
    <div className="bg-[#151515] w-[100vw] h-[100vh] flex justify-center items-center" style={{ fontFamily: "Montserrat,sans-serif" }}>
      <div className="bg-[#222222] w-[30vw] h-[70vh] shadow-2xl">
        <div className='h-full flex flex-col p-10 gap-10 items-center'>
          <h2 className='text-4xl xl:text-[35px] font-bold'>Create Account</h2>
          <div id="signup-ui-container" className='bg-[#2b2b2b] w-full h-full flex justify-center items-center' />

          {/* 👇 Added login redirect text */}
          <div className='text-white text-sm'>
            Already signed up?{' '}
            <a href="/Login" className='text-blue-400 underline hover:text-blue-500'>
              Login
            </a>
          </div>

          <button className='bg-blue-600 w-[60%] h-[20%] text-2xl font-semibold shadow-2xl hover:scale-110 transition duration-100 ease-in-out'>
            Cancel Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;