import CreateSchedule from "../components/CreateSchedule.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateSchedulePage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-blue-200/50 via-white to-transparent border-l-2 border-blue-200/60 shadow-md flex flex-col p-6">
      {/* Header */}
      <div className="h-28 max-h-28 w-full flex flex-wrap md:flex-nowrap items-end justify-between p-2 border-b-2 border-white">
        <h1 className="w-full min-w-max text-2xl md:text-3xl font-bold text-blue-600 tracking-wide">
          Create Schedule
        </h1>

        <div className="w-full flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
      {/* Divider */}

      <div className="h-full pr-2 overflow-y-auto custom-scrollbar mt-5">
        <CreateSchedule onCancel={handleCancel} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
