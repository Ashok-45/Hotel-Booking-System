import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Hotels.css";


function Hotels() {

    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/hotels")
            .then((response) => {
                setHotels(response.data);
            })
            .catch((error) => {
                console.log("Error fetching hotels:", error);
            });
    }, []);

    return (
        
        <div className="hotels-page">
            
            <button
                className="hotels-home-btn"
                onClick={() => navigate("/")}>
                ← Home
            </button>

            <h1>Available Hotels</h1>

            <div className="hotel-container">

                {hotels.map((hotel) => (

                    <div className="hotel-card" key={hotel.id}>

                        <img
                            src={`/images/${hotel.image}`}
                            alt={hotel.name}
                        />

                        <div className="hotel-info">

                            <h2>{hotel.name}</h2>

                            <p>📍 {hotel.location}</p>

                            <p>⭐ {hotel.rating}</p>

                            <p>
                                {hotel.reviews} reviews
                            </p>

                            <h3>
                                ₹{hotel.price} / night
                            </h3>

                            <button
                                onClick={() =>
                                    navigate(`/hotel/${hotel.id}`)
                                }
                            >
                                View Hotel
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Hotels;