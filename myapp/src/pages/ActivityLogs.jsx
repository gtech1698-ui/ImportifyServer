import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import TableRow from '../components/ActivityRow';
import Navbar from '../components/navbar';

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalCount, setTotalCount] = useState(0);
  const [currentRows, setCurrentRows] = useState([]);
  const [nextRows, setNextRows] = useState([]);
  const [prefetchedPage, setPrefetchedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [success, setSuccess] = useState(false);

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

  const fetchLogs = async (targetPage) => {
    const offset = (targetPage - 1) * pageSize;
    setLoading(true);
    setStartTime(Date.now());
    setElapsed(0);
    setSuccess(false);

    try {
      const res = await axios.post('http://localhost:3000/activity', {
        limit: pageSize,
        offset,
        preload: true,
      });
      setCurrentRows(res.data.currentPage || []);
      setNextRows(res.data.nextPage || []);
      setPrefetchedPage(targetPage + 1);
      setTotalCount(res.data.totalCount);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handlePageClick = (targetPage) => {
    setPage(targetPage);
    if (prefetchedPage === targetPage) {
      setCurrentRows(nextRows);
      fetchLogs(targetPage + 1);
      setPrefetchedPage(targetPage + 1);
    } else {
      fetchLogs(targetPage);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const formatTime = (ms) => `${(ms / 1000).toFixed(2)} sec`;

  return (
    <div className="bg-gradient-to-r bg-[#00000000] text-white rounded-xl shadow-xl xl:h-[100vh] w-[100vw] flex flex-col gap-5 justify-start items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Navbar />

      <div className="bg-[#00000081] h-[85vh] w-[90%] overflow-y-scroll flex flex-col rounded-md">
        <div className="grid grid-cols-6 h-[5vh] bg-green-200 sticky top-0 z-10">
          {['Activity', 'Performed At', 'Field Count', 'Filename', 'ID', 'Filesize'].map((label, index) => (
            <div key={index} className="col-span-1 bg-black text-white text-sm font-bold ring-1 ring-white flex justify-center items-center">
              {label}
            </div>
          ))}
        </div>
        {currentRows.map((row, idx) => (
          <TableRow key={idx} row={row} />
        ))}
      </div>

      <div className="flex justify-between items-center px-5 py-3 font-bold text-xl w-[90%]">
        <div className="text-white bg-[#00000050] px-4 py-2 rounded-2xl">
          Showing Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => {
            const halfWindow = 2;
            let startPage = page - halfWindow;
            if (startPage < 1) startPage = 1;
            if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4);
            const pageNum = startPage + i;
            if (pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`px-4 py-2 font-bold rounded-md shadow-md transition duration-200 ${pageNum === page ? 'bg-white text-black ring-2 ring-black' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
