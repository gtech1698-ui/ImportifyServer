import { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import Navbar from '../components/navbar';
export default function ExportPage() {
  const navigate = useNavigate();
  const [formData, setForm] = useState({
    type: '',
    limit: '',
    category: '',
    status: '',
    circle: '',
  });
  const [loading, setloading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [success, setSuccess] = useState(false);

  // 🕒 Timer that runs during loading
  useEffect(() => {
    let timer;
    if (loading && startTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;
        setElapsed(diff);
      }, 50);
    }

    return () => clearInterval(timer);
  }, [loading, startTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setStartTime(Date.now());
    setElapsed(0);
    setSuccess(false);

    try {

      const response = await axios.post(`http://localhost:3000/export/getFiles`, formData, {
        responseType: 'blob'
      });

      const fileType = formData.type.toLowerCase();
      const fileName = `export.${fileType}`;
      saveAs(response.data, fileName);

      setSuccess(true);
      toast.success(`${fileType.toUpperCase()} file is being downloaded!`);
    } catch (error) {
      console.error(error);
      const serverMessage = error.response?.data?.message || error.message;
toast.error(`🚨 ${serverMessage}`);
    } finally {
      setloading(false);
    }
  };

  const formatTime = (ms) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds} sec`;
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-[#334155] rounded-xl shadow-xl w-[100vw] md:h-[100vh] lg:h-[100vh] flex flex-col justify-start items-center gap-10" style={{ fontFamily: 'Montserrat , sans-serif' }}>
      <Navbar />
      <div className='text-[40px] md:text-[50px] lg:text-[60px] font-bold text-center text-[#1e293b]'>
        <Typewriter
          words={['Database Handler']}
          loop={1}
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </div>

      <div className='flex flex-col lg:flex-col xl:flex-row 2xl:flex-row justify-center items-center w-full gap-10'>
        <div className='mb-5 w-[90%] xl:w-[90vw] h-full rounded-3xl shadow-2xl p-6 bg-white/90 backdrop-blur-lg border border-[#e5e7eb] transition-all duration-500 ease-out flex flex-col items-center'>
          <h2 className="text-[30px] md:text-[40px] xl:text-[50px] font-bold flex items-center gap-2 text-center text-[#2563eb]">
            <i className="fas fa-cloud-download-alt text-[#60a5fa]"></i> Export your desired data 
          </h2>

          <form onSubmit={handleSubmit} className='w-full'>
            <p className="mt-2 text-[#334155] text-xl md:text-2xl font-semibold text-center">Choose a format JSON or CSV and start exporting 🎉</p>

            <div className="mt-6 text-[#334155] space-y-4 font-semibold w-full flex flex-col items-center">
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={(e) => setForm({ ...formData, type: e.target.value })}
                className='w-full h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
              >
                <option value="" disabled hidden>Select File Type</option>
                <option value="csv" className='bg-[#f1f5f9]'>CSV</option>
                <option value="json" className='bg-[#f1f5f9]'>JSON</option>
              </select>

              <div className='flex flex-col xl:flex-row 2xl:flex-row lg:flex-col md:flex-col sm:flex-col w-full gap-5 items-center justify-center mt-4'>
                <div className='flex flex-col w-full'>
                  <label htmlFor="limit" className="text-[#334155]"> Select Limit:</label>
                  <input
                    type="number"
                    name="limit"
                    id="limit"
                    className='p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
                    placeholder='Enter limit'
                    value={formData.limit}
                    onChange={(e) => setForm({ ...formData, limit: e.target.value })}
                    required
                  />
                </div>

                <div className='flex flex-col w-full'>
                  <label htmlFor="category" className="text-[#334155]">Select Category:</label>
                  <select
                    name="category"
                    id="category"
                    className='p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
                    value={formData.category}
                    onChange={(e) => setForm({ ...formData, category: e.target.value })}
                  >
                    <option value="" disabled hidden>Select Category</option>
                    {[
                      "automobile", "Banking and Finance", "Education", "Electronic",
                      "Electronics", "fashion", "Food", "HR", "IT", "Otp", "real estate",
                      "Retail", "Transport", "Washroom and fittings", "washroom fittings", "Washroom fittingsmumbai"
                    ].map((cat) => (
                      <option key={cat} value={cat} className='bg-[#f1f5f9]'>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col w-full'>
                  <label htmlFor="circle" className="text-[#334155]">Select Circle:</label>
                  <select
                    name="circle"
                    id="circle"
                    className='p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
                    value={formData.circle}
                    onChange={(e) => setForm({ ...formData, circle: e.target.value })}
                    required
                  >
                    <option value="" disabled hidden>Select Circle</option>
                    {[
                      "AP", "AS", "BR", "CH", "CT", "DL", "GJ", "HP", "HR", "JK", "KA",
                      "KL", "KO", "MH", "MP", "MU", "NE", "OR", "PB", "RJ", "TC", "TN",
                      "UE", "UW", "WB"
                    ].map((cir) => (
                        <option key={cir} value={cir} className='bg-[#f1f5f9]'>{cir}</option>
                      ))}
                  </select>
                </div>

                <div className='flex flex-col w-full'>
                  <label htmlFor="status" className="text-[#334155]">Select Status:</label>
                  <select
                    name="status"
                    id="status"
                    className='p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
                    value={formData.status}
                    onChange={(e) => setForm({ ...formData, status: e.target.value })}
                  >
                    <option value="" disabled hidden>Select Status</option>
                    <option value="DELIVRD" className='bg-[#f1f5f9]'>DELIVRD</option>
                    <option value="DLT Preference Filter" className='bg-[#f1f5f9]'>DLT Preference Filter</option>
                    <option value="Pending" className='bg-[#f1f5f9]'>Pending</option>
                    <option value="Delivered" className='bg-[#f1f5f9]'>Delivered</option>
                    <option value="Failed" className='bg-[#f1f5f9]'>Failed</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] hover:scale-105 hover:shadow-xl text-white font-bold transition xl:w-[50%] text-xl shadow-lg duration-150 ease-in-out">
              {loading ? (
                <Typewriter
                  words={[
                    'Matching filters...',
                    'Preparing export ',
                    'Cooking format ',
                    'Loading...',
                    'Magic in progress...'
                  ]}
                  loop={0}
                  cursorStyle="|"
                  key={loading ? 'loading' : 'idle'}
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              ) : success ? (
                'Download File '
              ) : (
                'Apply filters and find 🔍'
              )}
            </button>

            <div className='m-2 text-center text-xl font-semibold'>
              {loading ? (
                <span className='text-[#ef4444]'>{`Time taken: ${formatTime(elapsed)}`}</span>
              ) : success ? (
                <span className='text-[#334155]'>{`File loaded in ${formatTime(elapsed)}`}</span>
              ) : (
                ''
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
