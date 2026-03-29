# Cartrabbit Full-Stack Setup

This document captures the working front-end and back-end flow for the booking system. It is intended as a quick reference for developers to run and maintain the app.

## 🧩 Backend

### Project + server launch
- Path: `backend`
- Run `composer install`
- Run `php artisan migrate`
- Run `php artisan serve` (default on `http://127.0.0.1:8000`)

### Key routes (`routes/api.php`)
- GET `/api/v1/booking/show/{event_id}`
  - Returns event details with slot list.
  - Response shape:
    - `data.event_name`
    - `data.duration`
    - `data.location`
    - `data.date` (array of available dates)
    - `data.slot_data` (list of objects with `id`, `date`, `start_time`, `end_time`, `is_booked`)
- POST `/api/v1/booking/create`
  - Request body: `{ name, email, slot_id }`
  - Requires `slot_id` reference to `slots.id`.
  - Validation via `BookingRequest`.

### Models
- `App\Models\Events` with relation `slots()`
- `App\Models\Slot` used for available/booked slot logic
- `App\Models\Booking` to store user booking row

## 🧩 Frontend

### Project + server launch
- Path: `frontend`
- Run `npm install`
- Run `npm run dev` (Vite dev server)

### API client
- `src/_services/api.js`:
  ```js
  import axios from "axios";
  const API = axios.create({ baseURL: "http://localhost:8000/api/v1" });
  export default API;
  ```

### Booking flow (`src/pages/ShowBooking.jsx`)
- Load event data:
  - GET `/booking/show/${id}` on mount
  - Store in `eventData`
- `activeDates` derived from `eventData.date`
- Display calendar with allowed dates
- Filter `slot_data` by selected date + `is_booked` false
- Display slot options
- Form fields: `name`, `email`
- On submit:
  - Validate slot selection
  - POST `/booking/create` with `{ name, email, slot_id }`
  - On success: refresh event data and show popup

## 🔍 Notes
- Ensure timezone/date formatting is consistent in `formatDate`.
- UI warnings are provided in a popup component state; no browser `alert` usage is required.
- If slot list is empty, text is displayed.

## 📌 Troubleshooting
- `activeDates.includes is not a function`: ensure `activeDates` array conversion is done before `tileDisabled` run.
- Validate the API response shape exactly: `res.data.data`.

## 📘 Extra detailed section (front + back)

### `backend/app/Http/Controllers/BookingController.php`
- `showBooking($event_id)`
  - Eager load slots with `Events::with('slots')->findOrFail($event_id)`
  - Response `data` contains event info and slot list.
- `doBooking(BookingRequest $request)`
  - Validates { name, email, slot_id }
  - Checks `is_booked` on slot
  - Creates a booking, sets slot as booked, sends mail

### `frontend/src/pages/ShowBooking.jsx` full logic:
- Fetch endpoint in `useEffect`:
  - `API.get(`/booking/show/${id}`)`
  - `setEventData(res.data.data)`
- Date initialization with safe fallback:
  - uses `activeDates = eventData?.date ?? []`
  - set first valid date or today
- `Calendar`:
  - `tileDisabled` compares `formatDate(date)` to allowed set
- Slot list:
  - use `eventData.slot_data` filter by selected date and `!is_booked`
  - default message for no slot
  - set selected slot / time on click
- Submit:
  - payload = `{ name, email, slot_id }`
  - `API.post("/booking/create", payload)`
  - success handler sets popup + refreshes event data
  - error handler sets popup with error

### Validation details
- Slot must be selected (popup error if not)
- Form fields available and can be validated inside `handleSubmit` and inputs

## 🚀 Quick guide (end user test)
1. Open `/booking/:eventId` page.
2. Select blue date in calendar.
3. Choose from visible slot cards.
4. Fill `Name` + `Email`.
5. Click Submit; observe popup.

## 🧹 Styling notes
- Slot style: card/button cluster via Tailwind.
- popup overlay is absolutely centered with backdrop.
- Keep `react-calendar` default CSS (imported at top).
 
