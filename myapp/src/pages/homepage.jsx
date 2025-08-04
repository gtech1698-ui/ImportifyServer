import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function Homepage() {
  const navigate = useNavigate();

  const handleDelivery = () => {
    navigate('/table');
  };
  const handleCircle = () => {
    navigate('/getCircle');
  };

  return (
    <div
      className="min-h-screen w-[100vw] bg-gradient-to-br from-[#f1f5f9] via-[#e0e7ef] to-[#cbd5e1] flex flex-col items-center"
      style={{ fontFamily: 'Montserrat, sans-serif', overflow: 'hidden' }}
    >
      <Navbar />
      <div className="mt-10 text-4xl xl:text-6xl font-extrabold bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-lg">
        <Typewriter
          words={['Importify - DB Handler']}
          loop={1}
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </div>

      {/* Card Container */}
      <div
        className="
          w-[100vw]
          flex flex-col items-center gap-10
          xl:flex-row xl:flex-wrap xl:justify-center
          xl:gap-10 xl:min-h-[80vh]
          xl:overflow-x-hidden xl:overflow-y-auto 2xl:overflow-x-hidden overflow-y-auto
        "
      >
        {/* Import Card */}
        <div className="bg-white/80 border border-[#cbd5e1] w-[90%] mb-5 xl:w-[22vw] 2xl:w-[22vw] xl:min-h-[50vh] rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#2563eb] gap-5">
          <h2 className="text-3xl font-bold text-[#2563eb] flex items-center gap-2 mb-2">
            <i className="fas fa-cloud-upload-alt text-[#60a5fa]"></i> Import Data
          </h2>
          <p className="text-[#334155] text-base font-medium mb-4 text-center leading-relaxed">
            Upload massive datasets effortlessly. Supports CSV, SQL dumps, and real-time validation.
          </p>
          <ul className="text-[#64748b] font-semibold text-sm mb-6 space-y-4">
            <li>Optimized for bulk imports</li>
            <li>Instant schema checks</li>
            <li>Error previews & rollback support</li>
          </ul>
          <button
            className="mt-auto w-[80%] h-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition"
            onClick={() => navigate('/import')}
          >
            Start Import
          </button>
        </div>

        {/* Export Card */}
        <div className="bg-white/80 border border-[#cbd5e1] w-[90%] mb-5 xl:w-[22vw] xl:min-h-[50vh] rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#2563eb] gap-5">
          <h2 className="text-3xl font-bold text-[#2563eb] flex items-center gap-2 mb-2">
            <i className="fas fa-cloud-download-alt text-[#38bdf8]"></i> Export Records
          </h2>
          <p className="text-[#334155] text-base font-medium mb-4 text-center leading-relaxed">
            Download filtered data securely in CSV format. Custom ranges, status filters, and more.
          </p>
          <ul className="text-[#64748b] font-semibold text-sm mb-6 space-y-4">
            <li>One-click CSV download</li>
            <li>Region + status based filters</li>
            <li>Secure export with auth validation</li>
          </ul>
          <button
            className="mt-auto w-[80%] h-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]  text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition"
            onClick={() => navigate('/export')}
          >
            Export Now
          </button>
        </div>

        {/* Tabular View Card */}
        <div className="bg-white/80 border border-[#cbd5e1] w-[90%] mb-5 xl:w-[22vw] xl:h-full xl:min-h-[50vh]
 rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#2563eb] gap-5">
          <h2 className="text-3xl font-bold text-[#2563eb] flex items-center gap-2 mb-2">
            <i className="fas fa-table text-[#22d3ee]"></i> Get Tabular View
          </h2>
          <p className="text-[#334155] text-base font-medium mb-4 text-center leading-relaxed">
            Add your desired filters and get started...
          </p>
          <ul className="text-[#64748b] font-semibold text-sm mb-6 space-y-4">
            <li>Fetch data from Google Cloud</li>
            <li>Apply categories and filters of your choice</li>
            <li>Get Fast visuals</li>
          </ul>
          <button
            className="mt-auto w-[80%] h-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]  text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition"
            onClick={handleDelivery}
          >
            Begin Now
          </button>
        </div>

        {/* Convert CSV Card */}
        <div className="bg-white/80 border border-[#cbd5e1] w-[90%] mb-5 xl:w-[22vw] xl:h-full xl:min-h-[50vh]
 rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#2563eb] gap-5">
          <h2 className="text-3xl font-bold text-[#2563eb] flex items-center gap-2 mb-2">
            <i className="fas fa-file-csv text-[#facc15]"></i> Convert CSV File
          </h2>
          <p className="text-[#334155] text-base font-medium mb-4 text-center leading-relaxed">
            Import a file containing series mobile code and get instant downloadable file with mapped circle codes of city...
          </p>
          <ul className="text-[#64748b] font-semibold text-sm mb-6 space-y-4">
            <li>Add a CSV file with series code</li>
            <li>Get Instant csv download with suitable circle codes</li>
            <li>Instant results</li>
          </ul>
          <button
            className="mt-auto w-[80%] h-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition"
            onClick={handleCircle}
          >
            Start Process
          </button>
        </div>
      </div>
    </div>
  );
}