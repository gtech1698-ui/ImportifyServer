import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import logo from '../assets/gtech-logo.png'
export default function Navbar() {
  const hasShownToast = useRef(false);

  const [user, setUser] = useState({})
    const [userLoaded, setUserLoaded] = useState(false);
    const [istrue,setTrue]=useState(false)
  const navigate = useNavigate()
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User logged out');
      toast.success('User Logout Successful')
      navigate('/login')
    } catch (error) {
      toast.error('User logout failed ! try again')
      console.error('Error:', error);
    }
  };
  useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      setUserLoaded(true);

      if (!hasShownToast.current) {
        console.log('🔥 Logged-in user:', user);
        hasShownToast.current = true;
      }
    } else {
      toast.error('Log in first to access this section');
      console.log('⚠️ No user is currently signed in.');
      navigate('/login');
    }
  });

  return () => unsubscribe();
}, []);

useEffect(()=>{
  setTimeout(() => {
    setTrue(true)
  }, 2000);

})
  return (
      <div className=' h-[10vh] w-full flex items-center  xl:p-5 bg-[#15151575] gap-[25vw] md:gap-0 lg:gap-0 xl:gap-[30vw] 2xl:gap-[30vw] text-white '>
    <Link to='/'><div className='w-16 text-lg md:text-2xl xl:text-3xl font-bold h-full p-2 mx-5 md:p-0 md:mx-0 xl:p-0 xl:mx-0 xl:w-[20vw] flex justify-center items-center'></div><img src={logo} alt="No Image Available" className="w-12" /></Link>
        <div className='flex justify-evenly w-full items-center gap-10'>
          <div className='text-sm hidden md:text-2xl xl:text-2xl font-bold xl:w-auto h-[10vh] md:flex lg:flex xl:flex justify-center items-center'>{`Greetings!! ${user.email}`}</div>
          <div className=' w-[75px] h-[45px]  lg:w-[100px] lg:h-[100px] xl:w-[70px] xl:h-[70px] rounded-full flex justify-center items-center gap-5'>
            <img width="96" height="96" src="https://img.icons8.com/color/96/user-male-circle--v5.png" alt="user-male-circle--v5"/>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className=" w-[50px] h-[50px] text-2xl lg:w-[100px] lg:h-[100px] xl:w-[70px] xl:h-[70px] btn bg-gray-800  rounded-full xl:m-1 lg:text-4xl">📂</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl text-xl font-bold ">
              <Link to='/import'><li><a>Import a file 📂</a></li></Link>
              <Link to='/export'><li><a>Export a file 🥸</a></li></Link>
              <Link to='/table'><li><a>Tabular view👌</a></li></Link>
              <Link to='/getCircle'><li><a>Add Circle©️</a></li></Link>
              <Link to='/activity'><li><a>Activity Log📝</a></li></Link>
              <Link to='/active'><li><a>Active Data✅</a></li></Link>
              <Link to='/failed'><li><a>Failed Data🚫</a></li></Link>
              <Link to='/uploadSummary'><li><a>Upload Summary🗒️</a></li></Link>
              <Link to=''><li onClick={handleLogout}><a>Logout 👋</a></li></Link>
            </ul>
          </div>
          </div>
          </div>
        </div>
    )
}
