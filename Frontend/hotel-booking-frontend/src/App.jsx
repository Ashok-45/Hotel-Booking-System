import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import RoomSelection from "./pages/RoomSelection";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import BookingDetails from "./pages/BookingDetails";
import EventBooking from "./pages/EventBooking";
import EventConfirmation from "./pages/EventConfirmation";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/hotels" element={<Hotels />} />

                <Route
                    path="/hotel/:id"
                    element={<HotelDetails />}
                />

                <Route
                    path="/hotel/:id/rooms"
                    element={<RoomSelection />}
                />

                <Route
                    path="/hotel/:id/booking"
                    element={<Booking />}
                />

                <Route
                    path="/hotel/:id/confirmation"
                    element={<Confirmation />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/events"
                    element={<Events />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/booking/:bookingId"
                     element={<BookingDetails />}
                 />

                 <Route
                    path="/event/:id/booking"
                    element={<EventBooking />}
                />
                <Route
                    path="/event/:id/confirmation"
                    element={<EventConfirmation />}
                />



            </Routes>

        </BrowserRouter>

    );
}

export default App;