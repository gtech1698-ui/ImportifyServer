import { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { toast } from 'react-toastify';
import axios from 'axios';
import TableRow from '../components/tableRow';
import Navbar from '../components/navbar';
export default function Table() {
    const [filters, setFilters] = useState({ category: '', status: '' ,circle:''});
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [currentRows, setCurrentRows] = useState([]);
    const [nextRows, setNextRows] = useState([]);
    const [prefetchedPage, setPrefetchedPage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [success, setSuccess] = useState(false);

    // Timer logic
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

    // Main data fetch
    const fetchData = async (targetPage) => {
        const offset = (targetPage - 1) * pageSize;
        setLoading(true);
        setStartTime(Date.now());
        setElapsed(0);
        setSuccess(false);

        try {
            const res = await axios.post('http://localhost:3000/data/query', {
                ...filters,
                limit: pageSize,
                offset,
                preload: true
            });
            console.log(res.data.currentPage)
            setCurrentRows(res.data.currentPage || []);
            setNextRows(res.data.nextPage || []);
            setPrefetchedPage(targetPage + 1);
            setTotalCount(res.data.totalCount);
            setSuccess(true);
        } catch (error) {
            console.error(error);
            const serverMessage = error.response?.data?.message || error.message;
            toast.error(`🚨 ${serverMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // On form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData(1);
    };

    // Page click logic
    const handlePageClick = (targetPage) => {
        setPage(targetPage);

        if (prefetchedPage === targetPage) {
            setCurrentRows(nextRows);
            fetchData(targetPage + 1);
            setPrefetchedPage(targetPage + 1);
        } else {
            fetchData(targetPage);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const formatTime = (ms) => `${(ms / 1000).toFixed(2)} sec`;

    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-[#334155] rounded-xl shadow-xl xl:h-[100vh] w-[100vw] flex flex-col gap-5 justify-start items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {/* Filters */}
            <Navbar />
            <div className="bg-white/90 backdrop-blur-lg xl:h-[40vh] w-[90vw] rounded-3xl flex justify-center items-center m-5 border border-[#e5e7eb]" >
                <form onSubmit={handleSubmit} className="w-full">
                    <p className="mt-2 text-[#334155] xl:text-2xl font-bold text-center">Choose your filters and start exploring 🎉</p>

                    <div className="text-[#334155] xl:space-y-4 font-bold text-xl xl:w-full">
                        <label htmlFor="limit"> Select Field Size:</label>
                        <select
                            id="limit"
                            className="p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition m-2"
                            value={pageSize}
                            onChange={(e) => setPageSize(parseInt(e.target.value))}
                        >
                            <option value="" disabled hidden>Select Page Size</option>
                            {[10, 20, 30, 50, 100].map(size => (
                                <option key={size} value={size} className="bg-[#f1f5f9]">{size}</option>
                            ))}
                        </select>

                        <div className="flex gap-4 flex-col xl:flex-row xl:gap-5 items-center justify-center">
                            <div className="flex flex-col w-[60%] xl:w-[20%]">
                                <label htmlFor="category">Select Category:</label>
                                <select
                                    name="category"
                                    id="category"
                                    className="p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition"
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                >
                                    <option value="" disabled hidden>Select Category</option>
                                    {[
                                        "automobile", "Banking and Finance", "Education", "Electronic",
                                        "Electronics", "fashion", "Food", "HR", "IT", "Otp", "real estate",
                                        "Retail", "Transport", "Washroom and fittings", "washroom fittings", "Washroom fittingsmumbai"
                                    ].map(cat => (
                                        <option key={cat} value={cat} className="bg-[#f1f5f9]">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col w-[60%] xl:w-[30%]'>
                                <label htmlFor="circle"> Select Circle:</label>
                                <select
                                    name="circle"
                                    id="circle"
                                    className='p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition'
                                    value={filters.circle}
                                    onChange={(e) => setFilters({ ...filters, circle: e.target.value })}
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
                            <div className="flex flex-col w-[60%] xl:w-[20%]">
                                <label htmlFor="status"> Select Status:</label>
                                <select
                                    name="status"
                                    id="status"
                                    className="p-2 h-16 bg-[#f1f5f9] border border-[#cbd5e1] text-xl font-medium shadow focus:shadow-lg focus:border-[#2563eb] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none rounded-xl transition"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="" disabled hidden>Select Status</option>
                                    <option value="DELIVRD" className="bg-[#f1f5f9]">DELIVRD</option>
                                    <option value="DLT Preference Filter" className="bg-[#f1f5f9]">DLT Preference Filter</option>
                                    <option value="Pending" className="bg-[#f1f5f9]">Pending</option>
                                    <option value="Delivered" className="bg-[#f1f5f9]">Delivered</option>
                                    <option value="Failed" className="bg-[#f1f5f9]">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] hover:scale-105 hover:shadow-xl text-white font-bold w-[90%] xl:w-[50%] text-xl shadow-lg mb-2 transition duration-150 ease-in-out">
                        {loading ? (
                            <Typewriter
                                words={[
                                    'Matching filters...',
                                    'Preparing results ',
                                    'Processing request ',
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
                        ) : success ? 'Data Loaded ' : 'Apply filters and find 🔍'}
                    </button>

                    <div className="m-2 text-center text-xl font-bold">
                        {loading && <span className="text-[#ef4444]">Time taken: {formatTime(elapsed)}</span>}
                        {success && !loading && <span className="text-[#334155]">Loaded in {formatTime(elapsed)}</span>}
                    </div>
                </form>
            </div>

            {/* Table Display */}
            <div className="bg-[#00000081] h-[55vh] w-[90%] overflow-y-scroll flex flex-col rounded-md">
                <div className="grid grid-cols-12 h-[5vh] bg-green-200 sticky top-0 z-10">
                    {[
                        'Id', 'Category', 'Mobile', 'Delivery Date', 'Status',
                        'City', 'Operator', 'State', 'Circle',
                        'Created At', 'Updated At', 'User Id'
                    ].map((label, index) => (
                        <div key={index} className="col-span-1 bg-black text-white text-sm font-bold ring-1 ring-white flex justify-center items-center">
                            {label}
                        </div>
                    ))}
                </div>
                {currentRows.map((row, idx) => (
                    <TableRow key={idx} row={row} />
                ))}
            </div>
            {/* Pagination Bar */}
            <div className="flex justify-between items-center px-5 py-3 font-bold text-xl w-[90%]">
                <div className="text-[#334155] bg-white/90 px-4 py-2 rounded-2xl border border-[#e5e7eb]">
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
                                className={`px-4 py-2 font-bold rounded-md shadow-md transition duration-200 ${pageNum === page
                                        ? 'bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white ring-2 ring-[#2563eb]'
                                        : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e0e7ef]'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
