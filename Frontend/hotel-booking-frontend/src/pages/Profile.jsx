import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import "./Profile.css";


function Profile() {

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [user, setUser] = useState(null);

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [qrCode, setQrCode] = useState("");

    const [showQr, setShowQr] = useState(false);

    const [selectedBooking, setSelectedBooking] =
        useState(null);


    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            navigate("/login");

            return;
        }


        try {

            const loggedUser =
                JSON.parse(savedUser);

            setUser(loggedUser);

        } catch (error) {

            console.error(
                "Error reading user:",
                error
            );

            localStorage.removeItem("user");

            navigate("/login");
        }

    }, [navigate]);


    // ==========================================
    // LOAD HOTEL + EVENT BOOKINGS
    // ==========================================

    useEffect(() => {

        if (!user || !user.email) {
            return;
        }


        const fetchBookings = async () => {

            try {

                setLoading(true);


                // ==================================
                // GET HOTEL BOOKINGS
                // ==================================

                const hotelResponse =
                    await axios.get(
                        `http://localhost:8080/api/bookings/user/${encodeURIComponent(
                            user.email
                        )}`
                    );


                const hotelBookings =
                    Array.isArray(
                        hotelResponse.data
                    )
                        ? hotelResponse.data.map(
                              (booking) => ({
                                  ...booking,
                                  bookingType:
                                      "hotel"
                              })
                          )
                        : [];


                // ==================================
                // GET EVENT BOOKINGS
                // ==================================

                let eventBookings = [];


                try {

                    const eventResponse =
                        await axios.get(
                            `http://localhost:8080/api/event-bookings/user/${encodeURIComponent(
                                user.email
                            )}`
                        );


                    eventBookings =
                        Array.isArray(
                            eventResponse.data
                        )
                            ? eventResponse.data.map(
                                  (booking) => ({
                                      ...booking,
                                      bookingType:
                                          "event"
                                  })
                              )
                            : [];

                } catch (eventError) {

                    console.error(
                        "Error fetching event bookings:",
                        eventError
                    );

                    /*
                     * Hotel bookings should still
                     * appear even if the event API
                     * temporarily fails.
                     */
                }


                // ==================================
                // COMBINE BOTH BOOKINGS
                // ==================================

                const allBookings = [
                    ...hotelBookings,
                    ...eventBookings
                ];


                // Newest booking first
                allBookings.sort(
                    (a, b) => {

                        const dateA =
                            a.id || 0;

                        const dateB =
                            b.id || 0;

                        return dateB - dateA;
                    }
                );


                console.log(
                    "Hotel bookings:",
                    hotelBookings
                );


                console.log(
                    "Event bookings:",
                    eventBookings
                );


                console.log(
                    "All bookings:",
                    allBookings
                );


                setBookings(
                    allBookings
                );


            } catch (error) {

                console.error(
                    "Error fetching bookings:",
                    error
                );


                console.error(
                    "Backend response:",
                    error.response?.data
                );


                setBookings([]);


                alert(
                    "Unable to load bookings from server."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchBookings();

    }, [user]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("user");

        navigate("/");

    };


    // ==========================================
    // GENERATE QR CODE
    // ==========================================

    const handleViewQR = async (booking) => {

        try {

            const qrData =
                JSON.stringify({

                    bookingId:
                        booking.bookingId,

                    type:
                        booking.bookingType ===
                        "event"
                            ? "Event Booking"
                            : "Hotel Booking",

                    name:
                        booking.bookingType ===
                        "event"
                            ? booking.eventTitle
                            : booking.hotelName,

                    status:
                        booking.status

                });


            const qr =
                await QRCode.toDataURL(
                    qrData,
                    {
                        width: 300,
                        margin: 2
                    }
                );


            setQrCode(qr);

            setSelectedBooking(
                booking
            );

            setShowQr(true);


        } catch (error) {

            console.error(
                "QR generation error:",
                error
            );


            alert(
                "Unable to generate QR code."
            );

        }

    };


    // ==========================================
    // CLOSE QR
    // ==========================================

    const closeQR = () => {

        setShowQr(false);

        setQrCode("");

        setSelectedBooking(null);

    };


    // ==========================================
    // DOWNLOAD HOTEL PDF
    // ==========================================

    const downloadHotelPDF = (booking) => {

        try {

            const doc =
                new jsPDF();


            // HEADER
            doc.setFontSize(22);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "HB Stay & Event",
                20,
                25
            );


            doc.setFontSize(18);

            doc.text(
                "Hotel Booking Confirmation",
                20,
                38
            );


            // BOOKING ID
            doc.setFontSize(12);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `Booking ID: ${booking.bookingId}`,
                20,
                52
            );


            doc.text(
                `Status: ${booking.status}`,
                20,
                61
            );


            // HOTEL DETAILS
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Hotel Details",
                20,
                78
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Hotel: ${booking.hotelName || ""}`,
                20,
                90
            );


            doc.text(
                `Room: ${booking.roomType || ""}`,
                20,
                99
            );


            // STAY DETAILS
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Stay Details",
                20,
                118
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Check-in: ${booking.checkIn || ""}`,
                20,
                130
            );


            doc.text(
                `Check-out: ${booking.checkOut || ""}`,
                20,
                139
            );


            doc.text(
                `Guests: ${booking.guests || ""}`,
                20,
                148
            );


            doc.text(
                `Nights: ${booking.nights || ""}`,
                20,
                157
            );


            // PAYMENT
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Payment Details",
                20,
                176
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Room Total: Rs.${Number(
                    booking.roomTotal || 0
                ).toLocaleString("en-IN")}`,
                20,
                188
            );


            doc.text(
                `Taxes: Rs.${Number(
                    booking.taxes || 0
                ).toLocaleString("en-IN")}`,
                20,
                197
            );


            doc.text(
                `Service Fee: Rs.${Number(
                    booking.serviceFee || 0
                ).toLocaleString("en-IN")}`,
                20,
                206
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                `Total Amount: Rs.${Number(
                    booking.totalAmount || 0
                ).toLocaleString("en-IN")}`,
                20,
                218
            );


            doc.save(
                `Hotel-Booking-${booking.bookingId}.pdf`
            );


        } catch (error) {

            console.error(
                "Hotel PDF error:",
                error
            );


            alert(
                "Unable to download PDF."
            );

        }

    };


    // ==========================================
    // DOWNLOAD EVENT PDF
    // ==========================================

    const downloadEventPDF = (booking) => {

        try {

            const doc =
                new jsPDF();


            // HEADER
            doc.setFontSize(22);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "HB Stay & Event",
                20,
                25
            );


            doc.setFontSize(18);

            doc.text(
                "Event Booking Confirmation",
                20,
                38
            );


            // BOOKING ID
            doc.setFontSize(12);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `Booking ID: ${booking.bookingId}`,
                20,
                52
            );


            doc.text(
                `Status: ${booking.status}`,
                20,
                61
            );


            // EVENT DETAILS
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Event Details",
                20,
                78
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Event: ${booking.eventTitle || ""}`,
                20,
                90
            );


            doc.text(
                `Category: ${booking.category || ""}`,
                20,
                99
            );


            doc.text(
                `Location: ${booking.location || ""}`,
                20,
                108
            );


            doc.text(
                `Date: ${booking.eventDate || ""}`,
                20,
                117
            );


            doc.text(
                `Time: ${booking.eventTime || ""}`,
                20,
                126
            );


            doc.text(
                `Tickets: ${booking.tickets || ""}`,
                20,
                135
            );


            // GUEST
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Guest Details",
                20,
                154
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Guest: ${booking.guestName || ""}`,
                20,
                166
            );


            doc.text(
                `Email: ${booking.email || ""}`,
                20,
                175
            );


            doc.text(
                `Phone: ${booking.phone || ""}`,
                20,
                184
            );


            // PAYMENT
            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Payment Details",
                20,
                203
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Ticket Total: Rs.${Number(
                    booking.ticketTotal || 0
                ).toLocaleString("en-IN")}`,
                20,
                215
            );


            doc.text(
                `Taxes: Rs.${Number(
                    booking.taxes || 0
                ).toLocaleString("en-IN")}`,
                20,
                224
            );


            doc.text(
                `Service Fee: Rs.${Number(
                    booking.serviceFee || 0
                ).toLocaleString("en-IN")}`,
                20,
                233
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                `Total Amount: Rs.${Number(
                    booking.totalAmount || 0
                ).toLocaleString("en-IN")}`,
                20,
                245
            );


            doc.save(
                `Event-Booking-${booking.bookingId}.pdf`
            );


        } catch (error) {

            console.error(
                "Event PDF error:",
                error
            );


            alert(
                "Unable to download PDF."
            );

        }

    };


    // ==========================================
    // DOWNLOAD PDF
    // ==========================================

    const handleDownloadPDF = (booking) => {

        if (
            booking.bookingType ===
            "event"
        ) {

            downloadEventPDF(
                booking
            );

        } else {

            downloadHotelPDF(
                booking
            );

        }

    };


    // ==========================================
    // CANCEL / DELETE BOOKING
    // ==========================================

    const handleCancelBooking = async (
        booking
    ) => {


        // ======================================
        // CANCEL CONFIRMED BOOKING
        // ======================================

        if (
            booking.status ===
            "Confirmed"
        ) {

            const confirmed =
                window.confirm(
                    `Are you sure you want to cancel booking ${booking.bookingId}?`
                );


            if (!confirmed) {
                return;
            }


            try {

                // ==================================
                // HOTEL
                // ==================================

                if (
                    booking.bookingType ===
                    "hotel"
                ) {

                    await axios.put(
                        `http://localhost:8080/api/bookings/${booking.id}/cancel`
                    );

                }


                // ==================================
                // EVENT
                // ==================================

                else {

                    await axios.put(
                        `http://localhost:8080/api/event-bookings/${booking.id}/cancel`
                    );

                }


                // ==================================
                // UPDATE SCREEN
                // ==================================

                setBookings(
                    (previousBookings) =>
                        previousBookings.map(
                            (item) => {

                                if (
                                    item.bookingId ===
                                    booking.bookingId
                                ) {

                                    return {
                                        ...item,
                                        status:
                                            "Cancelled"
                                    };

                                }


                                return item;

                            }
                        )
                );


                alert(
                    "Booking cancelled successfully."
                );


            } catch (error) {

                console.error(
                    "Cancellation error:",
                    error
                );


                console.error(
                    "Backend response:",
                    error.response?.data
                );


                alert(
                    error.response?.data ||
                    "Unable to cancel booking. Please make sure the backend cancellation API is available."
                );

            }


            return;
        }


        // ======================================
        // DELETE CANCELLED BOOKING
        // ======================================

        if (
            booking.status ===
            "Cancelled"
        ) {

            const confirmed =
                window.confirm(
                    `Are you sure you want to permanently delete booking ${booking.bookingId}?`
                );


            if (!confirmed) {
                return;
            }


            try {

                // ==================================
                // HOTEL
                // ==================================

                if (
                    booking.bookingType ===
                    "hotel"
                ) {

                    await axios.delete(
                        `http://localhost:8080/api/bookings/${booking.id}`
                    );

                }


                // ==================================
                // EVENT
                // ==================================

                else {

                    await axios.delete(
                        `http://localhost:8080/api/event-bookings/${booking.id}`
                    );

                }


                // ==================================
                // REMOVE FROM SCREEN
                // ==================================

                setBookings(
                    (previousBookings) =>
                        previousBookings.filter(
                            (item) =>
                                item.bookingId !==
                                booking.bookingId
                        )
                );


                // ==================================
                // REMOVE OLD EVENT LOCAL STORAGE
                // ==================================

                if (
                    booking.bookingType ===
                    "event"
                ) {

                    const storageKey =
                        `eventBookings_${user.email}`;


                    const savedBookings =
                        JSON.parse(
                            localStorage.getItem(
                                storageKey
                            ) || "[]"
                        );


                    const updatedBookings =
                        savedBookings.filter(
                            (item) =>
                                item.bookingId !==
                                booking.bookingId
                        );


                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(
                            updatedBookings
                        )
                    );

                }


                alert(
                    "Cancelled booking deleted successfully."
                );


            } catch (error) {

                console.error(
                    "Delete booking error:",
                    error
                );


                console.error(
                    "Backend response:",
                    error.response?.data
                );


                alert(
                    error.response?.data ||
                    "Unable to delete booking."
                );

            }

        }

    };


    // ==========================================
    // WAIT FOR USER
    // ==========================================

    if (!user) {
        return null;
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="profile-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="profile-header">

                <button
                    className="profile-back"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ← Home
                </button>


                <h1>
                    My Profile
                </h1>

            </div>


            {/* =================================
                PROFILE CARD
            ================================= */}

            <div className="profile-card">


                {/* AVATAR */}

                <div className="profile-avatar">

                    {user.name
                        ? user.name
                              .charAt(0)
                              .toUpperCase()
                        : "U"}

                </div>


                <h2>
                    {user.name}
                </h2>


                <p className="profile-role">
                    Stay&Event User
                </p>


                {/* =================================
                    USER DETAILS
                ================================= */}

                <div className="profile-details">


                    {/* FULL NAME */}

                    <div className="profile-detail">

                        <span>
                            👤
                        </span>

                        <div>

                            <small>
                                Full Name
                            </small>

                            <strong>
                                {user.name}
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="profile-detail">

                        <span>
                            📧
                        </span>

                        <div>

                            <small>
                                Email
                            </small>

                            <strong>
                                {user.email}
                            </strong>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="profile-detail">

                        <span>
                            📱
                        </span>

                        <div>

                            <small>
                                Phone
                            </small>

                            <strong>
                                {user.phone ||
                                    "Not provided"}
                            </strong>

                        </div>

                    </div>


                </div>


                {/* =================================
                    MY BOOKINGS
                ================================= */}

                <div className="profile-section">


                    <div
                        className="booking-heading"
                    >

                        <h3>
                            My Bookings
                        </h3>

                        <span>
                            {bookings.length}{" "}
                            {bookings.length ===
                            1
                                ? "Booking"
                                : "Bookings"}
                        </span>

                    </div>


                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading ? (

                        <div className="no-bookings">

                            <div>
                                ⏳
                            </div>

                            <p>
                                Loading bookings...
                            </p>

                            <span>
                                Please wait while we load
                                your bookings.
                            </span>

                        </div>

                    ) : bookings.length ===
                      0 ? (

                        /* =================================
                            NO BOOKINGS
                        ================================= */

                        <div className="no-bookings">

                            <div>
                                🏨
                            </div>

                            <p>
                                No bookings yet
                            </p>

                            <span>
                                Your hotel and event
                                bookings will appear here.
                            </span>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/hotels"
                                    )
                                }
                            >
                                Explore Hotels
                            </button>

                        </div>

                    ) : (

                        /* =================================
                            BOOKINGS LIST
                        ================================= */

                        <div className="bookings-list">

                            {bookings.map(
                                (booking) => (

                                    <div
                                        className="booking-card"
                                        key={`${booking.bookingType}-${booking.bookingId}`}
                                    >


                                        {/* ===============================
                                            BOOKING HEADER
                                        =============================== */}

                                        <div className="booking-card-header">

                                            <div>

                                                <h3>

                                                    {booking.bookingType ===
                                                    "event"
                                                        ? "🎫 "
                                                        : "🏨 "}

                                                    {booking.bookingType ===
                                                    "event"
                                                        ? booking.eventTitle
                                                        : booking.hotelName}

                                                </h3>

                                                <p>

                                                    {booking.bookingType ===
                                                    "event"
                                                        ? `📍 ${booking.location || ""}`
                                                        : "Hotel Booking"}

                                                </p>

                                            </div>


                                            <span
                                                className={`booking-status ${
                                                    booking.status ===
                                                    "Confirmed"
                                                        ? "confirmed"
                                                        : "cancelled"
                                                }`}
                                            >

                                                {booking.status ===
                                                "Confirmed"
                                                    ? "✓ Confirmed"
                                                    : "✕ Cancelled"}

                                            </span>

                                        </div>


                                        {/* ===============================
                                            BOOKING ID
                                        =============================== */}

                                        <div className="booking-id">

                                            Booking ID

                                            <strong>
                                                {booking.bookingId}
                                            </strong>

                                        </div>


                                        {/* ===============================
                                            HOTEL DETAILS
                                        =============================== */}

                                        {booking.bookingType ===
                                        "hotel" ? (

                                            <div className="booking-details">


                                                <div>

                                                    <span>
                                                        Room
                                                    </span>

                                                    <strong>
                                                        {booking.roomType ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Check-in
                                                    </span>

                                                    <strong>
                                                        {booking.checkIn ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Check-out
                                                    </span>

                                                    <strong>
                                                        {booking.checkOut ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Guests
                                                    </span>

                                                    <strong>
                                                        {booking.guests ||
                                                            0}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Nights
                                                    </span>

                                                    <strong>
                                                        {booking.nights ||
                                                            0}
                                                    </strong>

                                                </div>


                                            </div>

                                        ) : (

                                            /* ===============================
                                                EVENT DETAILS
                                            =============================== */

                                            <div className="booking-details">


                                                <div>

                                                    <span>
                                                        Category
                                                    </span>

                                                    <strong>
                                                        {booking.category ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Location
                                                    </span>

                                                    <strong>
                                                        {booking.location ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Event Date
                                                    </span>

                                                    <strong>
                                                        {booking.eventDate ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Event Time
                                                    </span>

                                                    <strong>
                                                        {booking.eventTime ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Tickets
                                                    </span>

                                                    <strong>
                                                        {booking.tickets ||
                                                            0}
                                                    </strong>

                                                </div>


                                            </div>

                                        )}


                                        {/* ===============================
                                            BOOKING FOOTER
                                        =============================== */}

                                        <div className="booking-card-footer">


                                            <div>

                                                <span>
                                                    Total Amount
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        booking.totalAmount ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            {/* ==========================
                                                ACTION BUTTONS
                                            ========================== */}

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "row",
                                                    gap:
                                                        "10px",
                                                    alignItems:
                                                        "center",
                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >


                                                {/* VIEW QR */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewQR(
                                                            booking
                                                        )
                                                    }
                                                    style={{
                                                        border:
                                                            "none",
                                                        background:
                                                            "#ede9fe",
                                                        color:
                                                            "#5b21b6",
                                                        padding:
                                                            "10px 14px",
                                                        borderRadius:
                                                            "8px",
                                                        fontWeight:
                                                            "600",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    📱 View QR
                                                </button>


                                                {/* DOWNLOAD PDF */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownloadPDF(
                                                            booking
                                                        )
                                                    }
                                                    style={{
                                                        border:
                                                            "none",
                                                        background:
                                                            "#dbeafe",
                                                        color:
                                                            "#1d4ed8",
                                                        padding:
                                                            "10px 14px",
                                                        borderRadius:
                                                            "8px",
                                                        fontWeight:
                                                            "600",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    📄 Download PDF
                                                </button>


                                                {/* CANCEL */}

                                                {booking.status ===
                                                "Confirmed" ? (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelBooking(
                                                                booking
                                                            )
                                                        }
                                                        style={{
                                                            border:
                                                                "none",
                                                            background:
                                                                "#fee2e2",
                                                            color:
                                                                "#b91c1c",
                                                            padding:
                                                                "10px 14px",
                                                            borderRadius:
                                                                "8px",
                                                            fontWeight:
                                                                "600",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        ❌ Cancel Booking
                                                    </button>

                                                ) : (

                                                    /* DELETE */

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelBooking(
                                                                booking
                                                            )
                                                        }
                                                        style={{
                                                            border:
                                                                "none",
                                                            background:
                                                                "#111827",
                                                            color:
                                                                "#ffffff",
                                                            padding:
                                                                "10px 14px",
                                                            borderRadius:
                                                                "8px",
                                                            fontWeight:
                                                                "600",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        🗑 Delete
                                                    </button>

                                                )}

                                            </div>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================
                    LOGOUT
                ================================= */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>


            </div>


            {/* ==========================================
                QR MODAL
            ========================================== */}

            {showQr && qrCode && (

                <div
                    onClick={closeQR}
                    style={{
                        position:
                            "fixed",
                        top: 0,
                        left: 0,
                        width:
                            "100%",
                        height:
                            "100%",
                        background:
                            "rgba(0,0,0,0.65)",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        zIndex:
                            9999,
                        padding:
                            "20px",
                        boxSizing:
                            "border-box"
                    }}
                >

                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            background:
                                "#ffffff",
                            borderRadius:
                                "18px",
                            padding:
                                "30px",
                            textAlign:
                                "center",
                            maxWidth:
                                "420px",
                            width:
                                "100%",
                            boxShadow:
                                "0 20px 50px rgba(0,0,0,0.25)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop:
                                    0,
                                color:
                                    "#111827"
                            }}
                        >
                            📱 Booking QR Code
                        </h2>


                        <p
                            style={{
                                color:
                                    "#6b7280"
                            }}
                        >
                            Show this QR code when required.
                        </p>


                        <img
                            src={qrCode}
                            alt="Booking QR Code"
                            style={{
                                width:
                                    "280px",
                                height:
                                    "280px",
                                maxWidth:
                                    "100%"
                            }}
                        />


                        <h3
                            style={{
                                color:
                                    "#2563eb",
                                marginBottom:
                                    "20px"
                            }}
                        >
                            {selectedBooking?.bookingId}
                        </h3>


                        <button
                            type="button"
                            onClick={closeQR}
                            style={{
                                border:
                                    "none",
                                background:
                                    "#2563eb",
                                color:
                                    "#ffffff",
                                padding:
                                    "12px 25px",
                                borderRadius:
                                    "8px",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer"
                            }}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Profile;