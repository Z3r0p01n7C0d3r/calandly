import { Routes, Route } from "react-router-dom";
import SideBar from "./components/Sidebar";
import Index from "./pages/index";
import CreateSchedulePage from "./pages/CreateSchedulePage";
import MeetingsPage from "./pages/MeetingsPage";
import MookingPage from "./pages/ShowBooking";

export default function App() {
  return (
    <div className="w-full h-screen flex">
      <SideBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/creates" element={<CreateSchedulePage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/booking/show/:id" element={<MookingPage />} />
      </Routes>
    </div>
  );
}
