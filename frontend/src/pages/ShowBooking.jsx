import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import API from "../_services/api";

function BookingPage() {
  const { id } = useParams();

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    API.get(`/booking/show/${id}`)
      .then((res) => {
        setEventData(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to load booking data", err);
      });
  }, [id]);

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [popup, setPopup] = useState({ open: false, text: "", type: "info" });

  const activeDates = (() => {
    const dates = eventData?.date;
    if (Array.isArray(dates)) return dates;
    if (typeof dates === "string") return [dates];
    if (dates && typeof dates === "object" && typeof dates.length === "number") return Array.from(dates);
    return [];
  })();

  const [date, setDate] = useState(() => {
    return activeDates.length ? new Date(activeDates[0]) : new Date();
  });

  useEffect(() => {
    if (activeDates.length) {
      setDate(new Date(activeDates[0]));
    }
  }, [activeDates]);

  const formatDate = (calendarDate) => {
    const d = calendarDate instanceof Date ? calendarDate : new Date(calendarDate);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!eventData?.slot_data) {
      setTimeSlots([]);
      setSelectedSlotId(null);
      setSelectedTime(null);
      return;
    }

    const selectedDate = formatDate(date);

    const availableSlots = eventData.slot_data.filter((slot) => {
      const slotDate = slot.date ? formatDate(new Date(slot.date)) : null;
      const isBooked = slot.is_booked === 1 || slot.is_booked === "1" || slot.is_booked === true;
      return slotDate === selectedDate && !isBooked;
    });

    setTimeSlots(availableSlots);

    if (availableSlots.length > 0) {
      const matched = availableSlots.find((slot) => slot.id === selectedSlotId);
      const first = availableSlots[0];

      const picked = matched || first;
      setSelectedSlotId(picked.id);
      setSelectedTime(`${picked.start_time} - ${picked.end_time}`);
    } else {
      setSelectedSlotId(null);
      setSelectedTime(null);
    }
  }, [eventData, date, selectedSlotId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    if (!selectedSlotId) {
      alert("Please choose a time slot before booking.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      slot_id: selectedSlotId,
    };

    API.post("/booking/create", payload)
      .then((res) => {
        if (res.data?.success) {
          setPopup({ open: true, text: "Booking successful!", type: "success" });
          API.get(`/booking/show/${id}`).then((resp) => setEventData(resp.data.data));
        } else {
          setPopup({ open: true, text: `Booking failed: ${res.data?.message || "unknown error"}`, type: "error" });
        }
      })
      .catch((error) => {
        console.error("Booking error", error);
        setPopup({ open: true, text: "Booking request failed. Please try again.", type: "error" });
      });
  };

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 w-[100%]">
        <div className="text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-[100%] relative">
      {popup.open && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-5">
            <h3 className={`text-lg font-semibold ${popup.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {popup.type === "success" ? "Success" : "Error"}
            </h3>
            <p className="mt-3 text-gray-700">{popup.text}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setPopup({ ...popup, open: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="w-[1100px] bg-white rounded-2xl shadow-lg flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-1/4 p-6 border-r">

          <h2 className="text-2xl font-semibold mt-2">{eventData.event_name}</h2>

          <div className="mt-6 space-y-3 text-gray-600">
            <p>⏱ {eventData.duration} min</p>
            <p>📹 {eventData.location}</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 p-6">
          <h3 className="text-lg font-semibold mb-4">Select a Date & Time</h3>

          <div className="flex gap-6">
            {/* CALENDAR */}
            <div className="w-1/2">
              <Calendar
                onChange={setDate}
                value={date}
                tileDisabled={({ date }) => {
                    !activeDates.includes(formatDate(date))
                }}
                className="w-full border-none"
              />
            </div>

            {/* TIME SLOTS */}
            <div className="w-1/2 max-h-[400px] overflow-y-auto">
              {/* <h4 className="mb-3 font-medium">{date.toDateString()}</h4> */}

              <div className="space-y-2">
                {timeSlots.length === 0 && (
                  <div className="text-center text-gray-500 rounded-lg border border-dashed p-6">
                    No slots available for this date.
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot) => {
                    const label = `${slot.start_time} - ${slot.end_time}`;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                          setSelectedTime(label);
                        }}
                        className={`text-left w-full py-2 px-3 rounded-lg border transition ${
                          selectedSlotId === slot.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 hover:border-blue-500 text-blue-600"
                        }`}
                      >
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs text-gray-500">Slot ID: {slot.id}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-2/3 max-h-[400px] overflow-y-auto">
              <h4 className="mb-3 font-medium">User Details</h4>

              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Selected Date: <strong>{formatDate(date)}</strong></p>
                <p className="text-sm text-gray-600">Selected Time: <strong>{selectedTime || "None"}</strong></p>
              </div>

              <div className="space-y-2">
                <form onSubmit={handleSubmit} className="p-4"> 
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mt-2">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-3 bg-blue-500 text-white px-4 py-2"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
