import { useState, useEffect } from "react";
import API from "../_services/api";

export default function CreateSchedule({ onCancel, onSuccess }) {
  const [form, setForm] = useState({
    schuduleTitle: "",
    timeDuration: "30 min",
    location: "Zoom",
    customLocation: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "21:00",
  });

  const [errors, setErrors] = useState({});

  const locationOptions = [
    { value: "Meeting", label: "Meeting" },
    { value: "Zoom", label: "Zoom" },
    { value: "Teams", label: "Teams" },
    { value: "In phone", label: "In phone" },
    { value: "Offline Meeting", label: "Offline Meeting" },
  ];

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ];

  // Set default start date to today
  useEffect(() => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format for HTML date input
    setForm((prev) => ({
      ...prev,
      startDate: isoDate,
      endDate: isoDate,
    }));
    
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

  const validateDate = (dateString) => {
    if (!dateString) return false;

    // Handle YYYY-MM-DD format from HTML date input
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() == year &&
        date.getMonth() == month - 1 &&
        date.getDate() == day
      );
    }

    // Handle DD/MM/YYYY format
    const parts = dateString.split("/");
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2]);

    const date = new Date(year, month, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  };

  const isDateAfterOrEqual = (date1, date2) => {
    let d1, d2;

    // Convert YYYY-MM-DD to comparable format
    if (date1.includes("-")) {
      d1 = new Date(date1);
    } else {
      d1 = new Date(date1.split("/").reverse().join("-"));
    }

    if (date2.includes("-")) {
      d2 = new Date(date2);
    } else {
      d2 = new Date(date2.split("/").reverse().join("-"));
    }

    return d1 >= d2;
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));

    // Clear errors when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // Auto-set end date when start date changes
    if (key === "startDate" && !form.endDate) {
      setForm((prev) => ({ ...prev, endDate: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.schuduleTitle.trim()) {
      newErrors.schuduleTitle = "Schedule title is required";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      if (!isDateAfterOrEqual(form.startDate, todayStr)) {
        newErrors.startDate = "Start date must be today or later";
      }
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    } else if (!isDateAfterOrEqual(form.endDate, form.startDate)) {
      newErrors.endDate = "End date must be on or after start date";
    }

    if (form.location === "Offline Meeting" && !form.customLocation.trim()) {
      newErrors.customLocation =
        "Location details required for offline meetings";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const item = {
      event_name: form.schuduleTitle,
      duration: form.timeDuration,
      location:
        form.location === "Offline Meeting"
          ? form.customLocation
          : form.location,
      from_date: form.startDate, // Send as YYYY-MM-DD format for database
      to_date: form.endDate, // Send as YYYY-MM-DD format for database
      from_time: form.startTime,
      to_time: form.endTime,
    };

    // Here you would typically send to backend or update parent state
    console.log("Schedule created (database format):", item);

     try {
      const response = await API.post(
        "/event/create",
        item
      );

      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
    
    // Reset form
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format for HTML date input
    setForm({
      schuduleTitle: "",
      timeDuration: "30 min",
      location: "Zoom",
      customLocation: "",
      startDate: isoDate,
      endDate: isoDate,
      startTime: "09:00",
      endTime: "21:00",
    });
    setErrors({});

    // Call success callback to navigate back to home
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Schedule Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Title *
          </label>
          <input
            type="text"
            value={form.schuduleTitle}
            onChange={handleChange("schuduleTitle")}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.schuduleTitle ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter schedule title"
          />
          {errors.schuduleTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.schuduleTitle}</p>
          )}
        </div>

        {/* Time Duration and Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={form.timeDuration}
              onChange={handleChange("timeDuration")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={form.location}
              onChange={handleChange("location")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Location for Offline Meeting */}
        {form.location === "Offline Meeting" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Location Details *
            </label>
            <input
              type="text"
              value={form.customLocation}
              onChange={handleChange("customLocation")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.customLocation ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter meeting location (e.g., Conference Room A)"
            />
            {errors.customLocation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customLocation}
              </p>
            )}
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={handleChange("startDate")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={handleChange("endDate")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
              min={form.startDate}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Availability Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Time Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={form.startTime}
              onChange={handleChange("startTime")}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <span className="text-gray-500">to</span>
            <input
              type="time"
              value={form.endTime}
              onChange={handleChange("endTime")}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Default: 9:00 AM - 9:00 PM (24-hour format)
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Create Schedule
          </button>
          <button
            type="button"
            onClick={() => typeof onCancel === "function" && onCancel()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
