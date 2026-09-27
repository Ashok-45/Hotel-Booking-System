import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./HotelDetails.css";

function HotelDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get(`http://localhost:8080/api/hotels/${id}`)
            .then((response) => {
                setHotel(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error fetching hotel:", error);
                setHotel(null);
                setLoading(false);
            });

    }, [id]);

    if (loading) {
        return (
            <div className="not-found">
                <h2>Loading hotel...</h2>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="not-found">
                <h1>Hotel Not Found</h1>

                <button onClick={() => navigate("/hotels")}>
                    Back to Hotels
                </button>
            </div>
        );
    }

    return (
        <div className="hotel-details-page">

            {/* BACK BUTTON */}

            <button
                className="back-button"
                onClick={() => navigate("/hotels")}
            >
                ← Back to Hotels
            </button>


            {/* HOTEL IMAGE */}

            <div className="hotel-details-image">

                <img
                    src={`/images/${hotel.image}`}
                    alt={hotel.name}
                />

            </div>


            {/* HOTEL CONTENT */}

            <div className="hotel-details-content">

                <div className="hotel-main-info">

                    <div>

                        <h1>{hotel.name}</h1>

                        <div className="hotel-rating">
                            ⭐ {hotel.rating}

                            <span>
                                ({hotel.reviews} reviews)
                            </span>
                        </div>

                        <div className="hotel-location">
                            📍 {hotel.location}
                        </div>

                    </div>


                    <div className="hotel-price-box">

                        <strong>
                            ₹{hotel.price}
                        </strong>

                        <span>
                            / night
                        </span>

                    </div>

                </div>


                {/* AMENITIES */}

                <div className="amenities">

                    <div className="amenity">
                        🛏️
                        <span>Comfortable Rooms</span>
                    </div>

                    <div className="amenity">
                        📶
                        <span>Free Wi-Fi</span>
                    </div>

                    <div className="amenity">
                        🍽️
                        <span>Restaurant</span>
                    </div>

                    <div className="amenity">
                        🏊
                        <span>Swimming Pool</span>
                    </div>

                </div>


                {/* ABOUT */}

                <div className="about-hotel">

                    <h2>About the Hotel</h2>

                    <p>
                        {hotel.description}
                    </p>

                </div>


                {/* BOOKING */}

                <div className="booking-section">

                    <div>

                        <h3>
                            ₹{hotel.price}
                            <span> / night</span>
                        </h3>

                        <p>
                            ✓ Available for booking
                        </p>

                    </div>


                    <button
                        className="book-now-button"
                        onClick={() =>
                            navigate(`/hotel/${hotel.id}/rooms`, {
                                state: { hotel }
                            })
                        }
                    >
                        Book Now
                    </button>

                </div>

            </div>

        </div>
    );
}

export default HotelDetails;