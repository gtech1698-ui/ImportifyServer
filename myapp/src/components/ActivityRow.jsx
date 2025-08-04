export default function ActivityRow({ row }) {
  return (
    <div className="grid grid-cols-6 h-[5vh] text-sm text-white font-semibold">
      <div className="col-span-1 flex items-center justify-center">{row.activity}</div>
      <div className="col-span-1 flex items-center justify-center">{row.performed_at}</div>
      <div className="col-span-1 flex items-center justify-center">{row.fieldnumber}</div>
      <div className="col-span-1 flex items-center justify-center">{row.filename || 'N/A'}</div>
      <div className="col-span-1 flex items-center justify-center">{row.id}</div>
      <div className="col-span-1 flex items-center justify-center">{row.filesize !== null ? `${row.filesize} bytes` : '-'}</div>
    </div>
  );
}