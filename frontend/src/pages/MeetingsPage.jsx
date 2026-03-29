import Meetings from "../components/Meetings";

export default function MeetingsPage() {
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-blue-200/50 via-white to-transparent border-l-2 border-blue-200/60 shadow-md flex flex-col p-6">
      {/* Header */}
      <div className="h-28 max-h-28 w-full flex flex-wrap md:flex-nowrap items-end justify-between p-2 border-b-2 border-blue-200/60">
        <h1 className="w-full min-w-max text-2xl md:text-3xl font-bold text-blue-600 tracking-wide">
          Meetings
        </h1>
      </div>
      {/* Divider */}

      <div className="h-full pr-2 overflow-y-auto custom-scrollbar mt-5">
        <Meetings />
      </div>
    </div>
  );
}
