export default function TableRow({ row }) {
  return (
    <div className="grid grid-cols-12 h-[5vh] transition duration-200 text-white">
      <div className="col-span-1 flex justify-center items-center text-sm">{row.id}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.category}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.mobile}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.delivery_date}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.status}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.city}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.operator}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.state}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.circle}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.created_at}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.updated_at}</div>
      <div className="col-span-1 flex justify-center items-center text-sm">{row.user_id}</div>
    </div>
  );
}
