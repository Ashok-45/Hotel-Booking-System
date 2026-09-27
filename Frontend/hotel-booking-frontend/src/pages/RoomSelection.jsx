import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./RoomSelection.css";

function RoomSelection() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestCount, setGuestCount] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            try {

                const hotelResponse = await axios.get(
                    `http://localhost:8080/api/hotels/${id}`
                );

                const roomResponse = await axios.get(
                    `http://localhost:8080/api/rooms/hotel/${id}`
                );

                setHotel(hotelResponse.data);
                setRooms(roomResponse.data);
                setLoading(false);

            } catch (err) {

                console.log("Error fetching hotel/rooms:", err);
                setError("Unable to load hotel rooms.");
                setLoading(false);

            }

        };

        fetchData();

    }, [id]);


    const calculateNights = () => {

        if (!checkIn || !checkOut) {
            return 0;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const difference = end - start;

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    };


    const handleBookRoom = (room) => {

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates.");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        if (guestCount > room.guests) {
            alert(
                `This room can accommodate maximum ${room.guests} guests.`
            );
            return;
        }

        const nights = calculateNights();

        navigate(`/hotel/${id}/booking`, {

            state: {
                hotel,
                room,
                checkIn,
                checkOut,
                guestCount,
                nights
            }

        });

    };


    if (loading) {

        return (
            <div className="room-selection-page">
                <h2>Loading rooms...</h2>
            </div>
        );

    }


    if (error || !hotel) {

        return (
            <div className="room-selection-page">

                <h1>Hotel Not Found</h1>

                <button
                    onClick={() => navigate("/hotels")}
                >
                    Back to Hotels
                </button>

            </div>
        );

    }


    return (

        <div className="room-selection-page">

            <button
                className="back-button"
                onClick={() => navigate(`/hotel/${id}`)}
            >
                ← Back to Hotel
            </button>


            <div className="room-selection-header">

                <h1>{hotel.name}</h1>

                <p>
                    📍 {hotel.location}
                </p>

            </div>


            {/* DATE AND GUEST SELECTION */}

            <div className="booking-details">

                <div className="input-group">

                    <label>
                        Check-in
                    </label>

                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) =>
                            setCheckIn(e.target.value)
                        }
                    />

                </div>


                <div className="input-group">

                    <label>
                        Check-out
                    </label>

                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) =>
                            setCheckOut(e.target.value)
                        }
                    />

                </div>


                <div className="input-group">

                    <label>
                        Guests
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) =>
                            setGuestCount(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

            </div>


            {/* ROOMS */}

            <h2 className="rooms-title">
                Available Rooms
            </h2>


            <div className="rooms-container">

                {rooms.map((room) => (

                    <div
                        className="room-card"
                        key={room.id}
                    >

                        <img
                            src={`/images/${room.image}`}
                            alt={room.type}
                        />


                        <div className="room-info">

                            <h2>
                                {room.type}
                            </h2>

                            <p>
                                👥 Up to {room.guests} guests
                            </p>

                            <p>
                                🛏️ {room.beds}
                            </p>


                            <h3>
                                ₹{room.price}
                                <span> / night</span>
                            </h3>


                            {guestCount > room.guests && (

                                <p className="capacity-warning">
                                    Maximum {room.guests} guests
                                </p>

                            )}


                            <button
                                onClick={() =>
                                    handleBookRoom(room)
                                }
                            >
                                Book This Room
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {rooms.length === 0 && (

                <div className="no-rooms">

                    <h2>
                        No rooms available
                    </h2>

                    <p>
                        No rooms have been added for this hotel yet.
                    </p>

                </div>

            )}

        </div>

    );

}

export default RoomSelection;