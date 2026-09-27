import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./EventConfirmation.css";

function EventConfirmation() {

    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [qrCode, setQrCode] = useState("");

    const qrRef = useRef(null);


    // ==========================================
    // LOAD BOOKING
    // ==========================================

    useEffect(() => {

        const savedBooking =
            sessionStorage.getItem("eventBooking");


        if (!savedBooking) {

            alert(
                "Event booking details not found."
            );

            navigate("/events");

            return;
        }


        try {

            const bookingData =
                JSON.parse(savedBooking);

            setBooking(bookingData);


            // ==========================================
            // SAVE EVENT BOOKING FOR LOGGED-IN USER
            // ==========================================

            const savedUser =
                localStorage.getItem("user");

            if (savedUser) {

                const user =
                    JSON.parse(savedUser);

                if (user.email) {

                    const storageKey =
                        `eventBookings_${user.email}`;

                    const existingBookings =
                        JSON.parse(
                            localStorage.getItem(storageKey) || "[]"
                        );


                    // Avoid duplicate booking
                    const alreadyExists =
                        existingBookings.some(
                            (item) =>
                                item.bookingId ===
                                bookingData.bookingId
                        );


                    if (!alreadyExists) {

                        const updatedBookings = [
                            ...existingBookings,
                            bookingData
                        ];

                        localStorage.setItem(
                            storageKey,
                            JSON.stringify(updatedBookings)
                        );
                    }
                }
            }


            generateQRCode(
                bookingData
            );

        } catch (error) {

            console.error(
                "Error reading booking:",
                error
            );

            navigate("/events");
        }

    }, [navigate]);


    // ==========================================
    // GENERATE QR CODE
    // ==========================================

    const generateQRCode = async (
        bookingData
    ) => {

        try {

            const qrData = JSON.stringify({

                bookingId:
                    bookingData.bookingId,

                event:
                    bookingData.eventTitle,

                date:
                    bookingData.eventDate,

                location:
                    bookingData.location,

                tickets:
                    bookingData.tickets,

                amount:
                    bookingData.totalAmount,

                status:
                    bookingData.status

            });


            const qr =
                await QRCode.toDataURL(
                    qrData,
                    {
                        width: 220,
                        margin: 2
                    }
                );


            setQrCode(qr);

        } catch (error) {

            console.error(
                "QR generation error:",
                error
            );
        }
    };


    // ==========================================
    // DOWNLOAD PDF
    // ==========================================

    const downloadPDF = () => {

        if (!booking) {
            return;
        }


        const doc =
            new jsPDF();


        // ======================================
        // HEADER
        // ======================================

        doc.setFontSize(24);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Event Booking Confirmation",
            105,
            25,
            {
                align: "center"
            }
        );


        doc.setFontSize(12);

        doc.setFont("helvetica", "normal");

        doc.text(
            "HB Stay & Event",
            105,
            34,
            {
                align: "center"
            }
        );


        // ======================================
        // BOOKING ID
        // ======================================

        doc.setFontSize(15);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Booking ID",
            20,
            55
        );


        doc.setFont("helvetica", "normal");

        doc.text(
            booking.bookingId,
            65,
            55
        );


        // ======================================
        // EVENT DETAILS
        // ======================================

        doc.setFontSize(16);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Event Details",
            20,
            75
        );


        doc.setFontSize(12);

        doc.setFont("helvetica", "normal");

        doc.text(
            `Event: ${booking.eventTitle}`,
            20,
            88
        );

        doc.text(
            `Category: ${booking.category}`,
            20,
            98
        );

        doc.text(
            `Location: ${booking.location}`,
            20,
            108
        );

        doc.text(
            `Date: ${booking.eventDate}`,
            20,
            118
        );

        doc.text(
            `Time: ${booking.eventTime}`,
            20,
            128
        );


        // ======================================
        // GUEST DETAILS
        // ======================================

        doc.setFontSize(16);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Guest Details",
            20,
            150
        );


        doc.setFontSize(12);

        doc.setFont("helvetica", "normal");

        doc.text(
            `Primary Guest: ${booking.guestName}`,
            20,
            163
        );

        doc.text(
            `Email: ${booking.email}`,
            20,
            173
        );

        doc.text(
            `Phone: ${booking.phone}`,
            20,
            183
        );

        doc.text(
            `Number of Tickets: ${booking.tickets}`,
            20,
            193
        );


        // ======================================
        // PAYMENT
        // ======================================

        doc.setFontSize(16);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Payment Details",
            20,
            215
        );


        doc.setFontSize(12);

        doc.setFont("helvetica", "normal");

        doc.text(
            `Ticket Price: Rs. ${Number(
                booking.ticketPrice
            ).toLocaleString("en-IN")}`,
            20,
            228
        );

        doc.text(
            `Ticket Total: Rs. ${Number(
                booking.ticketTotal
            ).toLocaleString("en-IN")}`,
            20,
            238
        );

        doc.text(
            `Taxes: Rs. ${Number(
                booking.taxes
            ).toLocaleString("en-IN")}`,
            20,
            248
        );

        doc.text(
            `Service Fee: Rs. ${Number(
                booking.serviceFee
            ).toLocaleString("en-IN")}`,
            20,
            258
        );

        doc.setFont("helvetica", "bold");

        doc.text(
            `Total Amount: Rs. ${Number(
                booking.totalAmount
            ).toLocaleString("en-IN")}`,
            20,
            271
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `Payment Method: ${booking.paymentMethod}`,
            20,
            281
        );

        doc.text(
            `Status: ${booking.status}`,
            20,
            291
        );


        // ======================================
        // QR CODE PAGE
        // ======================================

        if (qrCode) {

            doc.addPage();


            doc.setFontSize(20);

            doc.setFont("helvetica", "bold");

            doc.text(
                "Event Entry QR Code",
                105,
                35,
                {
                    align: "center"
                }
            );


            doc.setFontSize(13);

            doc.setFont("helvetica", "normal");

            doc.text(
                "Show this QR code at the event entrance.",
                105,
                48,
                {
                    align: "center"
                }
            );


            doc.addImage(
                qrCode,
                "PNG",
                55,
                70,
                100,
                100
            );


            doc.setFontSize(14);

            doc.setFont("helvetica", "bold");

            doc.text(
                booking.bookingId,
                105,
                185,
                {
                    align: "center"
                }
            );

        }


        // ======================================
        // SAVE PDF
        // ======================================

        doc.save(
            `${booking.bookingId}.pdf`
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!booking) {

        return (

            <div className="event-confirm-loading">

                <h2>
                    Loading confirmation...
                </h2>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="event-confirmation-page">


            {/* SUCCESS HEADER */}

            <div className="event-success">

                <div className="event-success-icon">
                    ✓
                </div>

                <h1>
                    Event Booking Confirmed!
                </h1>

                <p>
                    Your event ticket has been booked successfully.
                </p>

            </div>


            <div className="event-confirmation-container">


                {/* BOOKING ID */}

                <div className="event-booking-id-card">

                    <span>
                        Booking ID
                    </span>

                    <strong>
                        {booking.bookingId}
                    </strong>

                </div>


                {/* EVENT DETAILS */}

                <div className="event-confirmation-card">

                    <h2>
                        🎫 Event Details
                    </h2>


                    <div className="event-confirmation-details">

                        <div>

                            <span>
                                Event
                            </span>

                            <strong>
                                {booking.eventTitle}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Category
                            </span>

                            <strong>
                                {booking.category}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Location
                            </span>

                            <strong>
                                {booking.location}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Date
                            </span>

                            <strong>
                                {booking.eventDate}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Time
                            </span>

                            <strong>
                                {booking.eventTime}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Tickets
                            </span>

                            <strong>
                                {booking.tickets}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* GUEST DETAILS */}

                <div className="event-confirmation-card">

                    <h2>
                        👥 Guest Details
                    </h2>


                    <div className="event-confirmation-details">

                        <div>

                            <span>
                                Primary Guest
                            </span>

                            <strong>
                                {booking.guestName}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {booking.email}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {booking.phone}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* QR CODE */}

                <div className="event-confirmation-card qr-card">

                    <h2>
                        📱 Event QR Code
                    </h2>

                    <p>
                        Show this QR code at the event entrance.
                    </p>


                    {qrCode && (

                        <img
                            ref={qrRef}
                            src={qrCode}
                            alt="Event Booking QR Code"
                            className="event-qr-code"
                        />

                    )}


                    <strong className="qr-booking-id">
                        {booking.bookingId}
                    </strong>

                </div>


                {/* PAYMENT SUMMARY */}

                <div className="event-confirmation-card">

                    <h2>
                        💰 Payment Summary
                    </h2>


                    <div className="event-payment-summary-row">

                        <span>
                            Ticket Total
                        </span>

                        <strong>
                            ₹
                            {Number(
                                booking.ticketTotal
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="event-payment-summary-row">

                        <span>
                            Taxes
                        </span>

                        <strong>
                            ₹
                            {Number(
                                booking.taxes
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="event-payment-summary-row">

                        <span>
                            Service Fee
                        </span>

                        <strong>
                            ₹
                            {Number(
                                booking.serviceFee
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="event-payment-summary-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹
                            {Number(
                                booking.totalAmount
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="event-payment-method">

                        Payment Method:
                        {" "}
                        <strong>
                            {booking.paymentMethod}
                        </strong>

                    </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="event-confirmation-actions">

                    <button
                        className="event-download-btn"
                        onClick={downloadPDF}
                    >
                        📄 Download PDF
                    </button>


                    <button
                        className="event-home-btn"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        🏠 Back to Home
                    </button>


                    <button
                        className="event-bookings-btn"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        📋 My Bookings
                    </button>

                </div>


                <p className="event-confirmation-note">

                    🔒 Keep your booking ID and QR code safe
                    for event entry.

                </p>

            </div>

        </div>
    );
}

export default EventConfirmation;