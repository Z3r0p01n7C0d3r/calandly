import { useState, useEffect } from "react";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);

  useEffect(() => {
    const sampleData = [
      {
        title: "Design Sync",
        duration: "30 min",
        location: "Google Meet",
        startDate: "2026-03-28",
        endDate: "2026-03-28",
        availability: "11:00 AM - 11:30 AM",
        link: "https://meet.google.com/design-sync",
      },
      {
        title: "Product Review",
        duration: "45 min",
        location: "Zoom",
        startDate: "2026-03-29",
        endDate: "2026-03-29",
        availability: "2:00 PM - 2:45 PM",
        link: "https://zoom.us/j/board-review",
      },
    ];

    setMeetings(sampleData);
  }, []);

  const normalizeDate = (dateString) => {
    if (!dateString) return "";

    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString;

    let [day, month, year] = parts;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    if (year.length === 3) year = `0${year}`;
    else if (year.length === 2) year = `20${year}`;
    else if (year.length === 1) year = `200${year}`;
    else if (year.length > 4) year = year.slice(-4);

    return `${day}/${month}/${year}`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "";
    const normalizedStart = normalizeDate(startDate || "");
    const normalizedEnd = normalizeDate(endDate || "");
    if (normalizedStart && normalizedEnd)
      return `${normalizedStart} - ${normalizedEnd}`;
    return normalizedStart || normalizedEnd || "";
  };

  return (
    <div className="flex flex-col gap-4">
      {meetings.map((meeting, index) => (
        <div
          key={index}
          onClick={() =>
            setActiveMeeting(activeMeeting === index ? null : index)
          }
          className={`group flex flex-col gap-1 px-4 py-3 rounded-lg transition-all duration-300 ease-out border-l-8 border border-green-500 transform animate-in slide-in-from-top-4 fade-in hover:scale-[.98]
            ${
              activeMeeting === index
                ? "bg-green-500 text-white shadow-md hover:scale-[1]"
                : "text-gray-700 hover:bg-green-200/70"
            }
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
            <h2
              className={`font-bold transition-colors duration-200 ${activeMeeting === index ? "text-white" : "text-gray-800"}`}
            >
              {meeting.title}
            </h2>
            {meeting.link && (
              <a
                href={meeting.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-bold rounded-full py-1 px-4 cursor-pointer border-2 transition-colors duration-200 ${
                  activeMeeting === index
                    ? "text-white border-white"
                    : "text-green-700 border-green-700"
                }`}
              >
                Join Meeting
              </a>
            )}
          </div>
          <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
            <div
              className={`text-sm transition-colors duration-200 ${activeMeeting === index ? "text-green-50" : "text-gray-600"}`}
            >
              {meeting.location}
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-200 ${activeMeeting === index ? "text-white" : "text-green-600"}`}
            >
              {meeting.duration}
            </span>
          </div>
          <div className="flex flex-col gap-1 md:flex-row justify-between items-start">
            <div
              className={`text-sm transition-colors duration-200 ${activeMeeting === index ? "text-green-50" : "text-gray-500"}`}
            >
              📅 {formatDateRange(meeting.startDate, meeting.endDate)}
            </div>
            <div
              className={`text-sm transition-colors duration-200 ${activeMeeting === index ? "text-green-50" : "text-gray-600"}`}
            >
              {meeting.availability}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
