import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Events.css";

function Events() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {

        fetchEvents();

    }, []);


    const fetchEvents = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "http://localhost:8080/api/events"
            );

            setEvents(response.data);

        } catch (error) {

            console.error(
                "Error fetching events:",
                error
            );

            alert(
                "Unable to load events. Please check the backend."
            );

        } finally {

            setLoading(false);

        }
    };


    const categories = [
        "All",
        ...new Set(
            events.map((event) => event.category)
        )
    ];


    const filteredEvents =
        selectedCategory === "All"
            ? events
            : events.filter(
                (event) =>
                    event.category === selectedCategory
            );


    return (

        <div className="events-page">
            <button
                className="hotels-home-btn"
                onClick={() => navigate("/")}>
                ← Home
            </button>
            {/* =========================
                HEADER
            ========================= */}

            <div className="events-header">

                <h1>
                    Upcoming Events
                </h1>

                <p>
                    Discover exciting events and
                    create unforgettable memories
                </p>

            </div>


            {/* =========================
                CATEGORY FILTER
            ========================= */}

            <div className="events-categories">

                {categories.map((category) => (

                    <button
                        key={category}
                        className={
                            selectedCategory === category
                                ? "category-btn active"
                                : "category-btn"
                        }
                        onClick={() =>
                            setSelectedCategory(category)
                        }
                    >
                        {category}
                    </button>

                ))}

            </div>


            {/* =========================
                EVENTS
            ========================= */}

            <div className="events-container">

                {loading ? (

                    <div className="events-message">

                        <h2>
                            Loading events...
                        </h2>

                    </div>

                ) : filteredEvents.length === 0 ? (

                    <div className="events-message">

                        <h2>
                            No events found
                        </h2>

                        <p>
                            There are no events in
                            this category.
                        </p>

                    </div>

                ) : (

                    <div className="events-grid">

                        {filteredEvents.map((event) => (

                            <div
                                className="event-card"
                                key={event.id}
                            >

                                {/* EVENT IMAGE */}

                                <div className="event-image-container">

                                    <img
                                        src={`/images/${event.image}`}
                                        alt={event.title}
                                        className="event-image"
                                    />

                                    <span className="event-category">
                                        {event.category}
                                    </span>

                                </div>


                                {/* EVENT DETAILS */}

                                <div className="event-content">

                                    <h2>
                                        {event.title}
                                    </h2>


                                    <div className="event-info">

                                        <p>
                                            📍 {event.location}
                                        </p>

                                        <p>
                                            📅 {event.eventDate}
                                        </p>

                                        <p>
                                            🕐 {event.eventTime}
                                        </p>

                                    </div>


                                    <p className="event-description">

                                        {event.description}

                                    </p>


                                    <div className="event-footer">

                                        <div className="event-price">

                                            <span>
                                                Starting from
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    event.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>


                                        <button
                                            className="event-book-btn"
                                            onClick={() =>
                                                navigate(`/event/${event.id}/booking`)
                                            }
                                        >
                                            Book Now
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Events;