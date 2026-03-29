import { useNavigate } from "react-router-dom";
import Schedules from "../components/Schedules.jsx";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-blue-200/50 via-white to-transparent shadow-md flex flex-col p-6">
      <div className="h-28 max-h-28 w-full flex flex-wrap md:flex-nowrap items-end justify-between p-2 border-b-2 border-white">
        <h1 className="w-full min-w-max text-2xl md:text-3xl font-bold text-blue-600 tracking-wide">
          Your Schedules
        </h1>
        <div className="w-full flex items-center justify-end gap-2">
          <button
            onClick={() => navigate("/event/creates")}
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            + Add Schedule
          </button>
        </div>
      </div>

      <div className="h-full pr-2 overflow-y-auto custom-scrollbar mt-5">
        <Schedules />
      </div>
    </div>
  );
}
