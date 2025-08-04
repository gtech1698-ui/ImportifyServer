import { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar';
// Import Firebase auth
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ImportPage() {
    const navigate = useNavigate()
    const [formData, setForm] = useState({
        type: '',
        file: null
    });
    const [loading, setloading] = useState(false)
    const [user, setUser] = useState(null);

    // Get Firebase user info on mount
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // You can add more fields if needed
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || '',
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        const allowedFormats = ['.sql', '.json', '.csv'];
        const fileName = formData.file?.name || '';
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        const selectedType = formData.type.toLowerCase();

        // Check if the file extension is allowed
        if (!allowedFormats.includes(fileExtension)) {
            setloading(false);
            return toast.error('File must be a SQL, CSV, or JSON');
        }

        // Match type selected with actual file extension
        if (
            (selectedType === 'csv' && fileExtension !== '.csv') ||
            (selectedType === 'json' && fileExtension !== '.json') ||
            (selectedType === 'sql' && fileExtension !== '.sql')
        ) {
            setloading(false);
            return toast.error('Selected file type and uploaded file format do not match');
        }

        // Check if user is available
        if (!user) {
            setloading(false);
            return toast.error('User not authenticated. Please login again.');
        }

        // Continue with backend upload
        try {
            const data = new FormData();
            data.append('type', formData.type);
            data.append('datafile', formData.file);
            // Send user object as JSON string
            data.append('user', JSON.stringify(user));

            const response = await axios.post(`http://localhost:3000/import/addFiles`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(`${formData.type.toUpperCase()} file uploaded successfully to cloud`);
            navigate('/')
        } catch (error) {
            console.error(error);
            const serverMessage = error.response?.data?.message || error.message;
            toast.error(`🚨 ${serverMessage}`);
        } finally {
            setloading(false);
        }
    };
    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-[#334155] rounded-xl shadow-xl w-[100vw] h-[100vh] flex flex-col justify-start items-center gap-10" style={{ fontFamily: 'Montserrat , sans-serif' }}>
            <Navbar />
            <div className='text-4xl xl:text-[60px] font-bold text-[#1e293b]'>
                <Typewriter
                    words={['Importify -Your DB Handler ']}
                    loop={1}
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                />
            </div>
            <div className=' flex justify-center items-center h-[70vh] md:h-[60vh] lg:h-[65vh] w-[90vw] xl:h-[70vh] xl:w-full gap-14'>
                {/* Export Card */}
                <div className=' w-[100%] xl:w-[70vw] h-full rounded-3xl shadow-2xl p-6 
                    bg-white/90 backdrop-blur-lg border border-[#e5e7eb]
                  transition-all duration-500 ease-out cursor-pointer hover:mx-5 flex flex-col justify-start items-center'>
                    <h2 className="text-4xl xl:text-[50px] h-[10vh] font-bold flex items-center gap-2 text-[#2563eb]">
                        <i className="fas fa-cloud-download-alt text-[#60a5fa]"></i> Import New Record 
                    </h2>
                    <form action="" method='post' onSubmit={handleSubmit} className='w-[100%] flex flex-col justify-center items-center xl:w-auto'>

                        <p className="mt-2 text-[#334155] text-sm md:text-lg lg:text-xl text-center xl:text-2xl h-[10vh] flex items-center font-semibold">
                            Upload a JSON , CSV or a SQL File to start importing 
                        </p>
                        <div className="mt-4 space-y-1 text-lg flex flex-col gap-5 justify-evenly font-semibold h-[20vh] w-[90%] mb-10">
                            <select
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={(e) => setForm({ ...formData, type: e.target.value })}
                                className='bg-[#f1f5f9] border border-[#cbd5e1] h-16 text-2xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition' required
                            >
                                <option value="" disabled selected hidden>Select File Type</option>
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                                <option value="sql">SQL</option>
                            </select>
                            <input type="file" onChange={(e) =>
                                setForm({ ...formData, file: e.target.files[0] })} className='h-16 flex justify-center items-center bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition' required />
                        </div>
                        <button type="submit" className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] hover:scale-105 hover:shadow-xl text-white font-bold transition xl:w-[50%] h-[15%] text-xl shadow-lg duration-150 ease-in-out">
                            {loading === true ?
                                <Typewriter
                                    words={['Taking your files to cloud...', 'Loading your file ....', 'Preparing uploads....', 'Cooking new uploads...', 'Loading...', 'Please Wait a few moments....', 'Magic is happening....']}
                                    loop={0}
                                    cursorStyle="|"
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1500}
                                />
                                : 'Import Now '
                            }
                        </button>
                        {loading === true ? <div className='m-2 text-[#ef4444]'>Please wait a few moments file is being loaded on server!</div> : ''}
                    </form>
                </div>

            </div>
        </div>
    )
}