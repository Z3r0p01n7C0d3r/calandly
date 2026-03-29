import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menu = [
    { id: "schedule", label: "My Schedules", path: "/" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`
        ${isOpen ? "w-64" : "w-14"} 
        h-screen 
        bg-linear-to-br from-blue-200/50 via-white to-transparent
        border-r border-blue-200/60
        shadow-md
        transition-all duration-300
        flex flex-col
      `}
    >
      <div className="h-28">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-blue-100/50 transition-all text-blue-600 duration-300 ease-in-out
        "
        >
          <span
            className={`
            font-bold tracking-wide
            transition-all duration-300
            ${isOpen ? "opacity-100 text-lg px-2" : "opacity-0 w-0"}
          `}
          >
            Calendly
          </span>

          <span className="p-1 flex items-center justify-center">
            {" "}
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <polyline points="19 6 13 12 19 18"></polyline>{" "}
                <polyline points="13 6 7 12 13 18"></polyline>{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <polyline points="5 6 11 12 5 18"></polyline>{" "}
                <polyline points="11 6 17 12 11 18"></polyline>{" "}
              </svg>
            )}{" "}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 mt-6">
        {menu.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                group flex items-center gap-3
                px-2 py-2
                rounded-lg
                cursor-pointer
                transition-all duration-200
                no-underline
                ${
                  active
                    ? "bg-blue-400 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-100"
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center
                  ${active ? "scale-110" : "group-hover:scale-105"}
                  transition-transform
                `}
              >
                {item.id === "schedule" ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="8" cy="15" r="1"></circle>
                    <circle cx="12" cy="15" r="1"></circle>
                    <circle cx="16" cy="15" r="1"></circle>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <line x1="7" y1="14" x2="17" y2="14"></line>
                    <line x1="7" y1="17" x2="14" y2="17"></line>
                  </svg>
                )}
              </span>

              <span
                className={`
                  text-sm font-medium
                  whitespace-nowrap
                  transition-all duration-300
                  ${
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden"
                  }
                `}
              >
                {item.label}
              </span>

              {active && isOpen && (
                <div className="ml-auto w-1.5 h-5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
