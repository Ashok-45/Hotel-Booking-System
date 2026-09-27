import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./BookingDetails.css";

function BookingDetails() {

    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCode, setQrCode] = useState("");


    // ==========================================
    // LOAD BOOKING
    // ==========================================

    useEffect(() => {

        const fetchBooking = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:8080/api/bookings/${bookingId}`
                );

                console.log(
                    "Booking details:",
                    response.data
                );

                setBooking(response.data);

            } catch (error) {

                console.error(
                    "Error loading booking:",
                    error
                );

                alert("Booking not found.");

                navigate("/profile");

            } finally {

                setLoading(false);

            }
        };

        fetchBooking();

    }, [bookingId, navigate]);


    // ==========================================
    // GENERATE QR CODE
    // ==========================================

    useEffect(() => {

        if (!booking) {
            return;
        }

        const generateQR = async () => {

            try {

                const qrData =
                    `Booking ID: ${booking.bookingId}\n` +
                    `Hotel: ${booking.hotelName}\n` +
                    `Room: ${booking.roomType}\n` +
                    `Check-in: ${booking.checkIn}\n` +
                    `Check-out: ${booking.checkOut}\n` +
                    `Guests: ${booking.guests}\n` +
                    `Total: ₹${booking.totalAmount}\n` +
                    `Status: ${booking.status}`;

                const qr =
                    await QRCode.toDataURL(qrData, {
                        width: 250,
                        margin: 2
                    });

                setQrCode(qr);

            } catch (error) {

                console.error(
                    "QR generation error:",
                    error
                );

            }
        };

        generateQR();

    }, [booking]);


    // ==========================================
    // DOWNLOAD PDF
    // ==========================================

    const downloadPDF = () => {

        if (!booking) {
            return;
        }

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        let y = 20;


        // ======================================
        // TITLE
        // ======================================

        doc.setFontSize(22);

        doc.text(
            "HB Stay&Event",
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );

        y += 12;

        doc.setFontSize(16);

        doc.text(
            "Booking Confirmation",
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );

        y += 15;


        // ======================================
        // BOOKING STATUS
        // ======================================

        doc.setFontSize(11);

        doc.text(
            `Booking ID: ${booking.bookingId}`,
            20,
            y
        );

        y += 8;

        doc.text(
            `Status: ${booking.status}`,
            20,
            y
        );

        y += 15;


        // ======================================
        // HOTEL
        // ======================================

        doc.setFontSize(14);

        doc.text(
            "Hotel Information",
            20,
            y
        );

        y += 9;

        doc.setFontSize(11);

        doc.text(
            `Hotel: ${booking.hotelName}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Room: ${booking.roomType}`,
            20,
            y
        );

        y += 15;


        // ======================================
        // STAY
        // ======================================

        doc.setFontSize(14);

        doc.text(
            "Stay Information",
            20,
            y
        );

        y += 9;

        doc.setFontSize(11);

        doc.text(
            `Check-in: ${booking.checkIn}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Check-out: ${booking.checkOut}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Guests: ${booking.guests}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Nights: ${booking.nights}`,
            20,
            y
        );

        y += 15;


        // ======================================
        // GUEST
        // ======================================

        doc.setFontSize(14);

        doc.text(
            "Guest Information",
            20,
            y
        );

        y += 9;

        doc.setFontSize(11);

        doc.text(
            `Name: ${booking.guestName}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Email: ${booking.email}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Phone: ${booking.phone}`,
            20,
            y
        );

        y += 15;


        // ======================================
        // PAYMENT
        // ======================================

        doc.setFontSize(14);

        doc.text(
            "Payment Information",
            20,
            y
        );

        y += 9;

        doc.setFontSize(11);

        doc.text(
            `Payment Method: ${booking.paymentMethod}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Room Amount: ₹${Number(
                booking.roomTotal
            ).toLocaleString()}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Taxes: ₹${Number(
                booking.taxes
            ).toLocaleString()}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Service Fee: ₹${Number(
                booking.serviceFee
            ).toLocaleString()}`,
            20,
            y
        );

        y += 10;


        // ======================================
        // TOTAL
        // ======================================

        doc.setFontSize(15);

        doc.text(
            `Total Amount: ₹${Number(
                booking.totalAmount
            ).toLocaleString()}`,
            20,
            y
        );


        // ======================================
        // QR CODE - PAGE 2
        // ======================================

        doc.addPage();

        doc.setFontSize(20);

        doc.text(
            "Booking QR Code",
            pageWidth / 2,
            30,
            {
                align: "center"
            }
        );


        if (qrCode) {

            doc.addImage(
                qrCode,
                "PNG",
                (pageWidth - 100) / 2,
                50,
                100,
                100
            );

        }


        doc.setFontSize(12);

        doc.text(
            "Show this QR code at the hotel.",
            pageWidth / 2,
            165,
            {
                align: "center"
            }
        );

        doc.setFontSize(11);

        doc.text(
            `Booking ID: ${booking.bookingId}`,
            pageWidth / 2,
            180,
            {
                align: "center"
            }
        );


        doc.save(
            `Booking-${booking.bookingId}.pdf`
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="booking-details-page">

                <div className="booking-details-loading">

                    <h2>
                        Loading booking...
                    </h2>

                </div>

            </div>
        );
    }


    // ==========================================
    // NO BOOKING
    // ==========================================

    if (!booking) {

        return (
            <div className="booking-details-page">

                <div className="booking-details-not-found">

                    <h2>
                        Booking not found
                    </h2>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        ← Back to My Bookings
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="booking-details-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="booking-details-header">

                <button
                    className="booking-details-back"
                    onClick={() => navigate("/profile")}
                >
                    ← My Bookings
                </button>

                <h1>
                    Booking Details
                </h1>

            </div>


            {/* =================================
                MAIN CONTAINER
            ================================= */}

            <div className="booking-details-container">


                {/* =================================
                    BOOKING HEADER
                ================================= */}

                <div className="booking-details-top">

                    <div>

                        <p className="booking-details-label">
                            Booking ID
                        </p>

                        <h2>
                            {booking.bookingId}
                        </h2>

                    </div>


                    <span
                        className={
                            booking.status === "Cancelled"
                                ? "details-status cancelled"
                                : "details-status confirmed"
                        }
                    >

                        {booking.status === "Cancelled"
                            ? "✕ Cancelled"
                            : "✓ Confirmed"}

                    </span>

                </div>


                {/* =================================
                    HOTEL INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        🏨 Hotel Information
                    </h3>

                    <div className="details-grid">

                        <div className="detail-item">

                            <small>
                                Hotel
                            </small>

                            <strong>
                                {booking.hotelName}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Room Type
                            </small>

                            <strong>
                                {booking.roomType}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    STAY INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        📅 Stay Information
                    </h3>

                    <div className="details-grid">

                        <div className="detail-item">

                            <small>
                                Check-in
                            </small>

                            <strong>
                                {booking.checkIn}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Check-out
                            </small>

                            <strong>
                                {booking.checkOut}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Guests
                            </small>

                            <strong>
                                {booking.guests}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Nights
                            </small>

                            <strong>
                                {booking.nights}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    GUEST INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        👤 Guest Information
                    </h3>

                    <div className="details-grid">

                        <div className="detail-item">

                            <small>
                                Name
                            </small>

                            <strong>
                                {booking.guestName}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Email
                            </small>

                            <strong>
                                {booking.email}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Phone
                            </small>

                            <strong>
                                {booking.phone}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    PAYMENT INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        💳 Payment Information
                    </h3>

                    <div className="details-grid">

                        <div className="detail-item">

                            <small>
                                Payment Method
                            </small>

                            <strong>
                                {booking.paymentMethod}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Room Amount
                            </small>

                            <strong>
                                ₹{Number(
                                    booking.roomTotal
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Taxes
                            </small>

                            <strong>
                                ₹{Number(
                                    booking.taxes
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <small>
                                Service Fee
                            </small>

                            <strong>
                                ₹{Number(
                                    booking.serviceFee
                                ).toLocaleString()}
                            </strong>

                        </div>

                    </div>


                    <div className="details-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{Number(
                                booking.totalAmount
                            ).toLocaleString()}
                        </strong>

                    </div>

                </div>


                {/* =================================
                    QR CODE
                ================================= */}

                {qrCode && (

                    <div className="booking-qr-section">

                        <h3>
                            📱 Booking QR Code
                        </h3>

                        <img
                            src={qrCode}
                            alt="Booking QR Code"
                            className="booking-qr-image"
                        />

                        <p>
                            Show this QR code at the hotel.
                        </p>

                    </div>

                )}


                {/* =================================
                    ACTIONS
                ================================= */}

                <div className="booking-details-actions">

                    <button
                        className="download-pdf-button"
                        onClick={downloadPDF}
                    >
                        📄 Download PDF
                    </button>

                    <button
                        className="back-bookings-button"
                        onClick={() => navigate("/profile")}
                    >
                        ← Back to My Bookings
                    </button>

                </div>


            </div>

        </div>

    );
}

export default BookingDetails;