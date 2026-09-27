import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./Confirmation.css";

function Confirmation() {

    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    const [bookingId, setBookingId] = useState("");
    const [bookingSaved, setBookingSaved] = useState(false);

    const qrCanvasRef = useRef(null);


    // ==========================================
    // CHECK BOOKING DATA
    // ==========================================

    if (!bookingData) {

        return (
            <div className="confirmation-not-found">

                <h1>
                    Booking Not Found
                </h1>

                <button
                    onClick={() => navigate("/hotels")}
                >
                    Back to Hotels
                </button>

            </div>
        );
    }


    const {
        hotel,
        room,
        checkIn,
        checkOut,
        guestCount,
        nights,
        primaryGuest,
        guests,
        roomTotal,
        taxes,
        serviceFee,
        totalAmount,
        paymentMethod
    } = bookingData;


    // ==========================================
    // GENERATE UNIQUE BOOKING ID
    // ==========================================

    useEffect(() => {

        const randomPart =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        const newBookingId =
            `HB-${new Date().getFullYear()}-${randomPart}`;

        setBookingId(newBookingId);

    }, []);


    // ==========================================
    // SAVE BOOKING TO BACKEND + LOCAL STORAGE
    // ==========================================

    useEffect(() => {

        if (!bookingId || bookingSaved) {
            return;
        }

        const saveBooking = async () => {

            try {

                // ======================================
                // GET LOGGED-IN USER
                // ======================================

                const savedUser =
                    localStorage.getItem("user");

                if (!savedUser) {

                    alert(
                        "Please login before confirming your booking."
                    );

                    navigate("/login");

                    return;
                }


                const user =
                    JSON.parse(savedUser);


                // ======================================
                // VALIDATE ACCOUNT EMAIL
                // ======================================

                if (!user.email) {

                    alert(
                        "User account email not found. Please login again."
                    );

                    navigate("/login");

                    return;
                }


                // ======================================
                // PREPARE BACKEND BOOKING DATA
                // ======================================

                const backendBooking = {

                    // Unique booking ID
                    bookingId: bookingId,

                    // Logged-in account email
                    accountEmail: user.email,

                    // Primary guest details
                    guestName: primaryGuest.name,

                    email: primaryGuest.email,

                    phone: primaryGuest.phone,

                    // Hotel details
                    hotelName: hotel.name,

                    roomType: room.type,

                    // Stay details
                    checkIn: checkIn,

                    checkOut: checkOut,

                    guests: Number(guestCount),

                    nights: Number(nights),

                    // Billing
                    roomTotal: Number(roomTotal),

                    taxes: Number(taxes),

                    serviceFee: Number(serviceFee),

                    totalAmount: Number(totalAmount),

                    // Payment
                    paymentMethod:
                        paymentMethod || "Pay at Hotel",

                    // Status
                    status: "Confirmed"
                };


                console.log(
                    "Sending booking to backend:",
                    backendBooking
                );


                // ======================================
                // SEND BOOKING TO SPRING BOOT
                // ======================================

                const response =
                    await axios.post(
                        "http://localhost:8080/api/bookings",
                        backendBooking
                    );


                console.log(
                    "Booking saved to MySQL:",
                    response.data
                );


                // ======================================
                // SAVE BOOKING TO LOCAL STORAGE
                // FOR PROFILE CACHE
                // ======================================

                const newBooking = {

                    bookingId: bookingId,

                    status: "Confirmed",

                    accountEmail: user.email,

                    hotel: {
                        id: hotel.id,
                        name: hotel.name,
                        location: hotel.location
                    },

                    room: {
                        id: room.id,
                        type: room.type,
                        beds: room.beds,
                        price: room.price
                    },

                    checkIn: checkIn,

                    checkOut: checkOut,

                    guestCount: guestCount,

                    nights: nights,

                    primaryGuest: primaryGuest,

                    guests: guests,

                    roomTotal: roomTotal,

                    taxes: taxes,

                    serviceFee: serviceFee,

                    totalAmount: totalAmount,

                    paymentMethod:
                        paymentMethod || "Pay at Hotel",

                    bookedAt:
                        new Date().toISOString()
                };


                const storageKey =
                    `bookings_${user.email}`;


                const existingBookings =
                    JSON.parse(
                        localStorage.getItem(storageKey) || "[]"
                    );


                // ======================================
                // PREVENT DUPLICATE BOOKING
                // ======================================

                const alreadyExists =
                    existingBookings.some(
                        (booking) =>
                            booking.bookingId === bookingId
                    );


                if (!alreadyExists) {

                    existingBookings.push(newBooking);

                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(existingBookings)
                    );
                }


                setBookingSaved(true);

            } catch (error) {

                console.error(
                    "Error saving booking:",
                    error
                );

                console.error(
                    "Backend response:",
                    error.response?.data
                );

                alert(
                    "Booking could not be saved to the server. Please try again."
                );
            }
        };


        saveBooking();

    }, [
        bookingId,
        bookingSaved,
        hotel,
        room,
        checkIn,
        checkOut,
        guestCount,
        nights,
        primaryGuest,
        guests,
        roomTotal,
        taxes,
        serviceFee,
        totalAmount,
        paymentMethod,
        navigate
    ]);


    // ==========================================
    // GENERATE QR CODE
    // ==========================================

    useEffect(() => {

        if (!bookingId || !qrCanvasRef.current) {
            return;
        }

        QRCode.toCanvas(
            qrCanvasRef.current,
            bookingId,
            {
                width: 220,
                margin: 2
            }
        );

    }, [bookingId]);


    // ==========================================
    // DOWNLOAD PDF
    // ==========================================

    const downloadPDF = async () => {

        if (!bookingId) {
            return;
        }


        const pdf = new jsPDF();


        // ======================================
        // PAGE 1
        // ======================================

        pdf.setFontSize(24);

        pdf.text(
            "HB Stay&Event",
            20,
            25
        );


        pdf.setFontSize(18);

        pdf.text(
            "Hotel Booking Confirmation",
            20,
            38
        );


        // BOOKING ID

        pdf.setFontSize(12);

        pdf.text(
            `Booking ID: ${bookingId}`,
            20,
            52
        );


        // QR CODE

        if (qrCanvasRef.current) {

            const qrImage =
                qrCanvasRef.current.toDataURL(
                    "image/png"
                );


            pdf.addImage(
                qrImage,
                "PNG",
                145,
                55,
                45,
                45
            );
        }


        // HOTEL DETAILS

        pdf.setFontSize(15);

        pdf.text(
            "Hotel Details",
            20,
            70
        );


        pdf.setFontSize(11);

        pdf.text(
            `Hotel: ${hotel.name}`,
            20,
            82
        );

        pdf.text(
            `Location: ${hotel.location}`,
            20,
            91
        );

        pdf.text(
            `Room: ${room.type}`,
            20,
            100
        );

        pdf.text(
            `Beds: ${room.beds}`,
            20,
            109
        );


        // STAY DETAILS

        pdf.setFontSize(15);

        pdf.text(
            "Stay Details",
            20,
            128
        );


        pdf.setFontSize(11);

        pdf.text(
            `Check-in: ${checkIn}`,
            20,
            140
        );

        pdf.text(
            `Check-out: ${checkOut}`,
            20,
            149
        );

        pdf.text(
            `Guests: ${guestCount}`,
            20,
            158
        );

        pdf.text(
            `Nights: ${nights}`,
            20,
            167
        );


        // PRIMARY GUEST

        if (Number(guestCount) > 1) {

            pdf.setFontSize(15);

            pdf.text(
                "Primary Guest",
                20,
                187
            );


            pdf.setFontSize(11);

            pdf.text(
                `Name: ${primaryGuest.name}`,
                20,
                199
            );

            pdf.text(
                `Email: ${primaryGuest.email}`,
                20,
                208
            );

            pdf.text(
                `Phone: ${primaryGuest.phone}`,
                20,
                217
            );
        }


        // GUEST DETAILS

        pdf.setFontSize(15);

        const guestHeadingY =
            Number(guestCount) > 1 ? 237 : 187;

        pdf.text(
            "Guest Details",
            20,
            guestHeadingY
        );


        pdf.setFontSize(10);

        let guestY =
            Number(guestCount) > 1 ? 248 : 198;


        guests.forEach((guest, index) => {

            pdf.text(
                `Guest ${index + 1}: ${guest.name}`,
                20,
                guestY
            );

            pdf.text(
                `Age: ${guest.age}`,
                105,
                guestY
            );

            pdf.text(
                `Gender: ${guest.gender}`,
                145,
                guestY
            );


            if (Number(guestCount) === 1) {

                pdf.text(
                    `Email: ${primaryGuest.email}`,
                    20,
                    guestY + 9
                );

                pdf.text(
                    `Phone: ${primaryGuest.phone}`,
                    105,
                    guestY + 9
                );

                guestY += 18;

            } else {

                guestY += 9;
            }

        });


        // FOOTER PAGE 1

        pdf.setFontSize(9);

        pdf.text(
            "HB Stay&Event - Booking Confirmation",
            20,
            285
        );


        // ======================================
        // PAGE 2 - PAYMENT DETAILS
        // ======================================

        pdf.addPage();


        pdf.setFontSize(24);

        pdf.text(
            "HB Stay&Event",
            20,
            25
        );


        pdf.setFontSize(18);

        pdf.text(
            "Payment Details",
            20,
            40
        );


        // BOOKING ID

        pdf.setFontSize(12);

        pdf.text(
            `Booking ID: ${bookingId}`,
            20,
            55
        );


        // BOOKING INFORMATION

        pdf.setFontSize(15);

        pdf.text(
            "Booking Information",
            20,
            78
        );


        pdf.setFontSize(11);

        pdf.text(
            `Hotel: ${hotel.name}`,
            20,
            91
        );

        pdf.text(
            `Room: ${room.type}`,
            20,
            100
        );

        pdf.text(
            `Check-in: ${checkIn}`,
            20,
            109
        );

        pdf.text(
            `Check-out: ${checkOut}`,
            20,
            118
        );

        pdf.text(
            `Guests: ${guestCount}`,
            20,
            127
        );

        pdf.text(
            `Nights: ${nights}`,
            20,
            136
        );


        // PAYMENT

        pdf.setFontSize(17);

        pdf.text(
            "Payment Summary",
            20,
            165
        );


        pdf.setFontSize(12);

        pdf.text(
            `Room Price: Rs.${Number(room.price).toLocaleString()} / night`,
            20,
            180
        );

        pdf.text(
            `Number of Nights: ${nights}`,
            20,
            191
        );

        pdf.text(
            `Room Total: Rs.${Number(roomTotal).toLocaleString()}`,
            20,
            202
        );

        pdf.text(
            `Taxes (12%): Rs.${Number(taxes).toLocaleString()}`,
            20,
            213
        );

        pdf.text(
            `Service Fee: Rs.${Number(serviceFee).toLocaleString()}`,
            20,
            224
        );


        // LINE

        pdf.line(
            20,
            235,
            190,
            235
        );


        // FINAL TOTAL

        pdf.setFontSize(17);

        pdf.text(
            "Total Amount",
            20,
            252
        );


        pdf.setFontSize(20);

        pdf.text(
            `Rs.${Number(totalAmount).toLocaleString()}`,
            20,
            265
        );


        // PAYMENT STATUS

        pdf.setFontSize(12);

        pdf.text(
            `Payment Method: ${paymentMethod || "Pay at Hotel"}`,
            20,
            280
        );


        // FOOTER

        pdf.setFontSize(9);

        pdf.text(
            "Thank you for booking with HB Stay&Event.",
            20,
            290
        );


        // SAVE PDF

        pdf.save(
            `${bookingId}-Booking.pdf`
        );

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="confirmation-page">


            {/* SUCCESS HEADER */}

            <div className="confirmation-header">

                <div className="success-icon">
                    ✓
                </div>

                <h1>
                    Booking Confirmed!
                </h1>

                <p>
                    Your hotel booking has been successfully confirmed.
                </p>

            </div>


            {/* MAIN CARD */}

            <div className="confirmation-container">


                {/* BOOKING ID */}

                <div className="booking-id-card">

                    <span>
                        Booking ID
                    </span>

                    <strong>
                        {bookingId}
                    </strong>

                </div>


                {/* QR CODE */}

                <div className="qr-section">

                    <h2>
                        Your Booking QR Code
                    </h2>

                    <p>
                        Show this QR code at the hotel.
                    </p>

                    <canvas
                        ref={qrCanvasRef}
                    />

                </div>


                {/* HOTEL DETAILS */}

                <div className="confirmation-section">

                    <h2>
                        🏨 Hotel Details
                    </h2>

                    <div className="detail-grid">

                        <div>

                            <span>
                                Hotel
                            </span>

                            <strong>
                                {hotel.name}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Location
                            </span>

                            <strong>
                                {hotel.location}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Room
                            </span>

                            <strong>
                                {room.type}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Beds
                            </span>

                            <strong>
                                {room.beds}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* STAY DETAILS */}

                <div className="confirmation-section">

                    <h2>
                        📅 Stay Details
                    </h2>

                    <div className="detail-grid">

                        <div>

                            <span>
                                Check-in
                            </span>

                            <strong>
                                {checkIn}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Check-out
                            </span>

                            <strong>
                                {checkOut}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Guests
                            </span>

                            <strong>
                                {guestCount}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Nights
                            </span>

                            <strong>
                                {nights}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* PRIMARY GUEST */}

                {Number(guestCount) > 1 && (

                    <div className="confirmation-section">

                        <h2>
                            👤 Primary Guest
                        </h2>

                        <div className="guest-info">

                            <p>
                                <strong>Name:</strong>{" "}
                                {primaryGuest.name}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {primaryGuest.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {primaryGuest.phone}
                            </p>

                        </div>

                    </div>

                )}


                {/* GUEST DETAILS */}

                <div className="confirmation-section">

                    <h2>
                        👥 Guest Details
                    </h2>

                    <div className="confirmed-guests">

                        {guests.map((guest, index) => (

                            <div
                                className="confirmed-guest"
                                key={index}
                            >

                                <strong>
                                    Guest {index + 1}
                                </strong>

                                <span>
                                    {guest.name}
                                </span>

                                <span>
                                    Age: {guest.age}
                                </span>

                                <span>
                                    Gender: {guest.gender}
                                </span>

                                {Number(guestCount) === 1 && (

                                    <>
                                        <span>
                                            Email: {primaryGuest.email}
                                        </span>

                                        <span>
                                            Phone: {primaryGuest.phone}
                                        </span>
                                    </>

                                )}

                            </div>

                        ))}

                    </div>

                </div>


                {/* BILLING */}

                <div className="confirmation-section">

                    <h2>
                        💰 Payment Details
                    </h2>


                    <div className="billing-row">

                        <span>
                            Room
                        </span>

                        <span>
                            ₹{Number(room.price).toLocaleString()} × {nights}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Room Total
                        </span>

                        <span>
                            ₹{Number(roomTotal).toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Taxes
                        </span>

                        <span>
                            ₹{Number(taxes).toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Service Fee
                        </span>

                        <span>
                            ₹{Number(serviceFee).toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{Number(totalAmount).toLocaleString()}
                        </strong>

                    </div>

                </div>


                {/* DOWNLOAD PDF */}

                <button
                    className="download-pdf-button"
                    onClick={downloadPDF}
                >
                    📄 Download Booking PDF
                </button>


                {/* HOME */}

                <button
                    className="home-button"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

            </div>

        </div>
    );
}

export default Confirmation;