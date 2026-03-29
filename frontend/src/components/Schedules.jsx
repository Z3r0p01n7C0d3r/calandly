import { useState, useEffect } from "react";
import API from "../_services/api";

export default function Schedules() {
  const [schudules, setSchedules] = useState([]);
  const [activeSchedules, setActiveSchedules] = useState(null);

  useEffect(() => {
    const backendData = API.get("/event/list").then((res) => setSchedules(res.data.data));
  }, []);

  const normalizeDate = (dateString) => {
    if (!dateString) return "";

    // Handle YYYY-MM-DD format from database
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    // Handle DD/MM/YYYY format (fallback)
    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString;

    let [day, month, year] = parts;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    if (year.length === 3) {
      year = `0${year}`;
    } else if (year.length === 2) {
      year = `20${year}`;
    } else if (year.length === 1) {
      year = `200${year}`;
    } else if (year.length > 4) {
      year = year.slice(-4);
    }

    return `${day}/${month}/${year}`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "";

    const normalizedStart = normalizeDate(startDate || "");
    const normalizedEnd = normalizeDate(endDate || "");

    if (normalizedStart && normalizedEnd) {
      return `${normalizedStart} - ${normalizedEnd}`;
    }

    return normalizedStart || normalizedEnd || "";
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {schudules.map((meeting, index) => (
          <div
            key={index}
            onClick={() =>
              setActiveSchedules(activeSchedules === index ? null : index)
            }
            className={`group flex flex-col gap-1 px-4 py-3 rounded-lg transition-all duration-300 ease-out border-l-8 border border-blue-500 transform animate-in slide-in-from-top-4 fade-in hover:scale-[.98]
        ${
          activeSchedules === index
            ? "bg-blue-400 text-white shadow-md hover:scale-[1]"
            : "text-gray-700 hover:bg-blue-200/70"
        }
      `}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
              <h2
                className={`font-bold transition-colors duration-200 ${activeSchedules === index ? "text-white" : "text-gray-800"}`}
              >
                {meeting.name}
              </h2>

              {meeting.id && (
                <a
                  href={`/booking/show/${meeting.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors font-bold duration-200 rounded-full py-1 px-4 cursor-pointer border-2 ${activeSchedules === index ? "text-white border-white" : "text-blue-500 border-blue-500"} `}
                >
                  Join Meeting
                </a>
              )}
            </div>

            <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
              <div
                className={`text-sm transition-colors duration-200 ${activeSchedules === index ? "text-blue-50" : "text-gray-600"}`}
              >
                {meeting.location}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${activeSchedules === index ? "text-white" : "text-blue-600"}`}
              >
                {meeting.duration}
              </span>
            </div>

            <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
              <div
                className={`text-sm transition-colors duration-200 ${activeSchedules === index ? "text-blue-50" : "text-gray-500"}`}
              >
                📅 {formatDateRange(meeting.from_date, meeting.to_date)}
              </div>
              <div
                className={`text-sm transition-colors duration-200 ${activeSchedules === index ? "text-blue-50" : "text-gray-600"}`}
              >
                {meeting.from_time} {meeting.to_time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
