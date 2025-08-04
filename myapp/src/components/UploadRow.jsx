import { useState } from 'react';

export default function UploadRow({ row }) {
    const [showError, setShowError] = useState(false);

    // Defensive fallback for error field
    const isError = row.error && row.error !== 'N/A' && row.error !== '';

    return (
        <>
            <div className="grid grid-cols-7 h-[5vh] transition duration-200 text-white">
                <div className="col-span-1 flex justify-center items-center text-sm break-all">{row.file_name}</div>
                <div className="col-span-1 flex justify-center items-center text-sm break-all">{row.user}</div>
                <div className="col-span-1 flex justify-center items-center text-sm">{row.upload_count}</div>
                <div className="col-span-1 flex justify-center items-center text-sm">{row.records_inserted}</div>
                <div className="col-span-1 flex justify-center items-center text-sm">
                    {row.status === 'completed'
                        ? <span className="text-green-400 font-bold">Completed</span>
                        : <span className="text-red-400 font-bold capitalize">{row.status}</span>
                    }
                </div>
                <div className="col-span-1 flex justify-center items-center text-sm">
                    {isError ? (
                        <>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                onClick={() => setShowError(true)}
                            >
                                View
                            </button>
                        </>
                    ) : (
                        <span className="text-green-500 font-bold">No error</span>
                    )}
                </div>
                <div className="col-span-1 flex justify-center items-center text-sm">{new Date(row.uploaded_at).toLocaleString()}</div>
            </div>
            {/* Error Popup */}
            {showError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-xl flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Occurred</h2>
                        <pre className="bg-red-100 text-red-700 p-4 rounded w-full overflow-x-auto max-h-60 mb-4 text-xs">
                            {row.error}
                        </pre>
                        <button
                            className="mt-2 px-6 py-2 bg-[#2563eb] text-white rounded-full font-bold hover:bg-[#1e40af] transition"
                            onClick={() => setShowError(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}