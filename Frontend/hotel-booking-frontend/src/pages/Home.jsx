import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {

  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-box">
            HB
          </div>

          <span>
            Stay&Event
          </span>

        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#hotels">
            Hotels
          </a>

          <a href="#events">
            Events
          </a>

          <a href="#about">
            About
          </a>

        </div>


        {/* ================= LOGIN / USER ================= */}

        <div className="nav-buttons">

          {user ? (

            <button
              className="profile-nav-btn"
              onClick={() => navigate("/profile")}
            >
              👤 {user.name}
            </button>

          ) : (

            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="signup-btn"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>

          )}

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-overlay">

          <div className="hero-content">

            <h1>
              Book Hotels
              <br />
              Discover Events
              <br />
              Create Memories
            </h1>

            <p>
              Best stays, best events. All in one place.
            </p>

          </div>


          {/* ================= SEARCH BOX ================= */}

          <div className="search-container">

            <div className="search-tabs">

              <button className="active-tab">
                Hotels
              </button>

              <button
                onClick={() => navigate("/events")}
              >
                Events
              </button>

            </div>


            <div className="search-form">

              <div className="search-input">

                <span>
                  📍
                </span>

                <input
                  type="text"
                  placeholder="Enter location or event name"
                />

              </div>


              <div className="date-input">

                <span>
                  📅
                </span>

                <input type="date" />

              </div>


              <div className="date-input">

                <span>
                  📅
                </span>

                <input type="date" />

              </div>


              <button
                className="search-btn"
                onClick={() => navigate("/hotels")}
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            🏨
          </div>

          <h3>
            Wide Selection
          </h3>

          <p>
            1000+ hotels & events
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🔒
          </div>

          <h3>
            Secure Booking
          </h3>

          <p>
            Safe & easy payments
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ⭐
          </div>

          <h3>
            Best Prices
          </h3>

          <p>
            Great deals always
          </p>

        </div>

      </section>


      {/* ================= POPULAR HOTELS ================= */}

      <section
        className="section"
        id="hotels"
      >

        <div className="section-header">

          <div>

            <h2>
              Popular Hotels
            </h2>

            <p>
              Find comfortable places to stay
            </p>

          </div>


          <button
            className="view-btn"
            onClick={() => navigate("/hotels")}
          >
            View All
          </button>

        </div>


        <div className="cards">

          {/* TAJ DECCAN */}

          <div className="hotel-card">

            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
              alt="Taj Deccan"
            />

            <div className="card-content">

              <h3>
                Taj Deccan
              </h3>

              <div className="rating">
                ⭐ 4.8
                <span>
                  (1.2K reviews)
                </span>
              </div>

              <p>
                📍 Hyderabad, Telangana
              </p>

              <div className="card-bottom">

                <strong>
                  ₹8,000
                </strong>

                <span>
                  / night
                </span>

                <button
                  onClick={() => navigate("/hotel/1")}
                >
                  View
                </button>

              </div>

            </div>

          </div>


          {/* NOVOTEL */}

          <div className="hotel-card">

            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
              alt="Novotel Hyderabad"
            />

            <div className="card-content">

              <h3>
                Novotel Hyderabad
              </h3>

              <div className="rating">
                ⭐ 4.6
                <span>
                  (980 reviews)
                </span>
              </div>

              <p>
                📍 Hyderabad, Telangana
              </p>

              <div className="card-bottom">

                <strong>
                  ₹5,000
                </strong>

                <span>
                  / night
                </span>

                <button
                  onClick={() => navigate("/hotel/2")}
                >
                  View
                </button>

              </div>

            </div>

          </div>


          {/* HYATT PLACE */}

          <div className="hotel-card">

            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
              alt="Hyatt Place"
            />

            <div className="card-content">

              <h3>
                Hyatt Place
              </h3>

              <div className="rating">
                ⭐ 4.5
                <span>
                  (760 reviews)
                </span>
              </div>

              <p>
                📍 Hyderabad, Telangana
              </p>

              <div className="card-bottom">

                <strong>
                  ₹4,200
                </strong>

                <span>
                  / night
                </span>

                <button
                  onClick={() => navigate("/hotel/4")}
                >
                  View
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= EVENTS ================= */}

      <section
        className="section events-section"
        id="events"
      >

        <div className="section-header">

          <div>

            <h2>
              Upcoming Events
            </h2>

            <p>
              Discover exciting events near you
            </p>

          </div>


          <button
            className="view-btn"
            onClick={() => navigate("/events")}
          >
            View All
          </button>

        </div>


        <div className="event-cards">

          {/* SUNBURN */}

          <div className="event-card">

            <img
              src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80"
              alt="Music Event"
            />

            <div className="event-content">

              <span className="event-category">
                Music
              </span>

              <h3>
                Sunburn Festival 2026
              </h3>

              <p>
                📍 Hyderabad
              </p>

              <p>
                📅 20 Nov 2026
              </p>

              <div className="event-bottom">

                <strong>
                  ₹1,999
                </strong>

                <button
                  onClick={() => navigate("/events")}
                >
                  View
                </button>

              </div>

            </div>

          </div>


          {/* TECH SUMMIT */}

          <div className="event-card">

            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
              alt="Conference"
            />

            <div className="event-content">

              <span className="event-category">
                Conference
              </span>

              <h3>
                Tech Summit 2026
              </h3>

              <p>
                📍 Bangalore
              </p>

              <p>
                📅 05 Dec 2026
              </p>

              <div className="event-bottom">

                <strong>
                  ₹2,500
                </strong>

                <button
                  onClick={() => navigate("/events")}
                >
                  View
                </button>

              </div>

            </div>

          </div>


          {/* COMEDY */}

          <div className="event-card">

            <img
              src="https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80"
              alt="Comedy Event"
            />

            <div className="event-content">

              <span className="event-category">
                Comedy
              </span>

              <h3>
                Stand-Up Comedy
              </h3>

              <p>
                📍 Hyderabad
              </p>

              <p>
                📅 12 Oct 2026
              </p>

              <div className="event-bottom">

                <strong>
                  ₹799
                </strong>

                <button
                  onClick={() => navigate("/events")}
                >
                  View
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer id="about">

        <div className="footer-logo">

          <div className="logo-box">
            HB
          </div>

          <span>
            Stay&Event
          </span>

        </div>

        <p>
          Book hotels. Discover events. Create memories.
        </p>

        <p className="copyright">
          © 2026 Stay&Event. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;