import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import "./EventBooking.css";

function EventBooking() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [tickets, setTickets] = useState(1);

    // One guest object for every ticket
    const [guests, setGuests] = useState([
        {
            name: "",
            email: "",
            phone: ""
        }
    ]);

    const [paymentMethod, setPaymentMethod] =
        useState("Pay at Event");


    // ==========================================
    // UPI QR
    // ==========================================

    const [upiQr, setUpiQr] = useState("");


    // ==========================================
    // MERCHANT DETAILS
    // ==========================================

    const merchantUpiId =
        "8247447660@ybl";

    const merchantName =
        "HB Stay&Event";


    // ==========================================
    // LOAD EVENT
    // ==========================================

    useEffect(() => {

        fetchEvent();

    }, [id]);


    const fetchEvent = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `http://localhost:8080/api/events/${id}`
            );

            setEvent(response.data);

        } catch (error) {

            console.error(
                "Error loading event:",
                error
            );

            alert("Unable to load event.");

            navigate("/events");

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // CHANGE NUMBER OF TICKETS
    // ==========================================

    const handleTicketChange = (e) => {

        const newTicketCount =
            Number(e.target.value);

        setTickets(newTicketCount);


        // Create guest forms according
        // to number of tickets

        setGuests((previousGuests) => {

            const updatedGuests = [];

            for (
                let i = 0;
                i < newTicketCount;
                i++
            ) {

                updatedGuests.push(
                    previousGuests[i] || {
                        name: "",
                        email: "",
                        phone: ""
                    }
                );

            }

            return updatedGuests;

        });

    };


    // ==========================================
    // CHANGE GUEST DETAILS
    // ==========================================

    const handleGuestChange = (
        index,
        e
    ) => {

        const { name, value } = e.target;


        setGuests((previousGuests) => {

            const updatedGuests =
                [...previousGuests];


            updatedGuests[index] = {
                ...updatedGuests[index],
                [name]: value
            };


            return updatedGuests;

        });

    };


    // ==========================================
    // TICKET CALCULATION
    // ==========================================

    const ticketTotal =
        Number(event?.price || 0) *
        Number(tickets);


    const taxes =
        Math.round(ticketTotal * 0.12);


    const serviceFee = 100;


    const totalAmount =
        ticketTotal +
        taxes +
        serviceFee;


    // ==========================================
    // GENERATE UPI QR
    // ==========================================

    useEffect(() => {

        if (
            paymentMethod !==
            "Online Payment"
        ) {

            setUpiQr("");

            return;
        }


        if (!event) {

            setUpiQr("");

            return;
        }


        // ======================================
        // CREATE UPI PAYMENT URL
        // ======================================

        const upiUrl =
            `upi://pay?pa=${merchantUpiId}` +
            `&pn=${encodeURIComponent(
                merchantName
            )}` +
            `&am=${totalAmount}` +
            `&cu=INR`;


        // ======================================
        // GENERATE QR
        // ======================================

        QRCode.toDataURL(
            upiUrl,
            {
                width: 250,
                margin: 2
            }
        )
        .then((url) => {

            setUpiQr(url);

        })
        .catch((error) => {

            console.error(
                "QR generation error:",
                error
            );

            setUpiQr("");

        });

    }, [
        paymentMethod,
        event,
        tickets,
        totalAmount
    ]);


    // ==========================================
    // CONFIRM BOOKING
    // ==========================================

    const handleConfirmBooking = async (e) => {

        e.preventDefault();


        // Get logged-in user

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            alert(
                "Please login before booking an event."
            );

            navigate("/login");

            return;
        }


        const user =
            JSON.parse(savedUser);


        // ======================================
        // VALIDATE ALL GUESTS
        // ======================================

        for (
            let i = 0;
            i < guests.length;
            i++
        ) {

            const guest =
                guests[i];


            if (!guest.name.trim()) {

                alert(
                    `Please enter the name of Guest ${i + 1}.`
                );

                return;
            }


            if (!guest.email.trim()) {

                alert(
                    `Please enter the email of Guest ${i + 1}.`
                );

                return;
            }


            if (!guest.phone.trim()) {

                alert(
                    `Please enter the phone number of Guest ${i + 1}.`
                );

                return;
            }


            if (
                !/^\d{10}$/.test(
                    guest.phone
                )
            ) {

                alert(
                    `Phone number of Guest ${i + 1} must contain exactly 10 digits.`
                );

                return;
            }

        }


        // ======================================
        // GENERATE BOOKING ID
        // ======================================

        const year =
            new Date().getFullYear();


        const randomNumber =
            Math.floor(
                10000 +
                Math.random() * 90000
            );


        const bookingId =
            `EB-${year}-${randomNumber}`;


        // ======================================
        // PRIMARY GUEST = GUEST 1
        // ======================================

        const primaryGuest =
            guests[0];


        // ======================================
        // BOOKING OBJECT
        // ======================================

        const booking = {

            bookingId: bookingId,

            accountEmail: user.email,

            guestName:
                primaryGuest.name,

            email:
                primaryGuest.email,

            phone:
                primaryGuest.phone,

            // Store all guest information
            // so every ticket guest is preserved
            guestDetails:
                JSON.stringify(guests),

            eventTitle:
                event.title,

            category:
                event.category,

            location:
                event.location,

            eventDate:
                event.eventDate,

            eventTime:
                event.eventTime,

            tickets:
                Number(tickets),

            ticketPrice:
                Number(event.price),

            ticketTotal:
                ticketTotal,

            taxes:
                taxes,

            serviceFee:
                serviceFee,

            totalAmount:
                totalAmount,

            paymentMethod:
                paymentMethod,

            status:
                "Confirmed"

        };


        // ======================================
        // SAVE BOOKING
        // ======================================

        try {

            const response =
                await axios.post(
                    "http://localhost:8080/api/event-bookings",
                    booking
                );


            sessionStorage.setItem(
                "eventBooking",
                JSON.stringify(
                    response.data
                )
            );


            navigate(
                `/event/${event.id}/confirmation`
            );


        } catch (error) {

            console.error(
                "Event booking error:",
                error
            );


            console.error(
                "Backend response:",
                error.response?.data
            );


            alert(
                "Unable to confirm event booking. Please try again."
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="event-booking-message">

                <h2>
                    Loading event...
                </h2>

            </div>

        );

    }


    // ==========================================
    // EVENT NOT FOUND
    // ==========================================

    if (!event) {

        return (

            <div className="event-booking-message">

                <h2>
                    Event not found
                </h2>


                <button
                    onClick={() =>
                        navigate("/events")
                    }
                >
                    Back to Events
                </button>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="event-booking-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="event-booking-header">

                <button
                    className="event-back-btn"
                    onClick={() =>
                        navigate("/events")
                    }
                >
                    ← Back to Events
                </button>


                <h1>
                    Complete Your Event Booking
                </h1>


                <p>
                    {event.title}
                </p>

            </div>


            <div className="event-booking-container">


                {/* =================================
                    EVENT SUMMARY
                ================================= */}

                <div className="event-booking-summary">

                    <div className="event-booking-image">

                        <img
                            src={`/images/${event.image}`}
                            alt={event.title}
                        />

                    </div>


                    <div className="event-booking-summary-content">

                        <h2>
                            {event.title}
                        </h2>


                        <p>
                            📍 {event.location}
                        </p>


                        <p>
                            📅 {event.eventDate}
                        </p>


                        <p>
                            🕐 {event.eventTime}
                        </p>


                        <p>
                            🎫 ₹
                            {Number(
                                event.price
                            ).toLocaleString("en-IN")}
                            {" "}per ticket
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={
                        handleConfirmBooking
                    }
                >


                    {/* =================================
                        TICKET DETAILS
                    ================================= */}

                    <div className="event-booking-card">

                        <h2>
                            🎫 Ticket Details
                        </h2>


                        <div className="event-form-grid">

                            <div>

                                <label>
                                    Number of Tickets
                                </label>


                                <select
                                    value={tickets}
                                    onChange={
                                        handleTicketChange
                                    }
                                >

                                    <option value={1}>
                                        1 Ticket
                                    </option>

                                    <option value={2}>
                                        2 Tickets
                                    </option>

                                    <option value={3}>
                                        3 Tickets
                                    </option>

                                    <option value={4}>
                                        4 Tickets
                                    </option>

                                    <option value={5}>
                                        5 Tickets
                                    </option>

                                    <option value={6}>
                                        6 Tickets
                                    </option>

                                    <option value={7}>
                                        7 Tickets
                                    </option>

                                    <option value={8}>
                                        8 Tickets
                                    </option>

                                    <option value={9}>
                                        9 Tickets
                                    </option>

                                    <option value={10}>
                                        10 Tickets
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        GUEST INFORMATION
                    ================================= */}

                    <div className="event-booking-card">

                        <h2>
                            👥 Guest Information
                        </h2>


                        <p className="event-section-note">
                            Enter details for all ticket holders.
                        </p>


                        {guests.map(
                            (guest, index) => (

                                <div
                                    className="event-guest-card"
                                    key={index}
                                >

                                    <h3>
                                        Guest {index + 1}
                                    </h3>


                                    <div className="event-form-grid">


                                        {/* NAME */}

                                        <div>

                                            <label>
                                                Full Name *
                                            </label>


                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    guest.name
                                                }
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                placeholder="Enter full name"
                                            />

                                        </div>


                                        {/* EMAIL */}

                                        <div>

                                            <label>
                                                Email *
                                            </label>


                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    guest.email
                                                }
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                placeholder="Enter email"
                                            />

                                        </div>


                                        {/* PHONE */}

                                        <div>

                                            <label>
                                                Phone Number *
                                            </label>


                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    guest.phone
                                                }
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                placeholder="Enter 10-digit phone number"
                                                maxLength="10"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================
                        PAYMENT
                    ================================= */}

                    <div className="event-booking-card">

                        <h2>
                            💳 Payment Method
                        </h2>


                        <div className="event-payment-options">


                            {/* PAY AT EVENT */}

                            <label
                                className={
                                    paymentMethod ===
                                    "Pay at Event"
                                        ? "event-payment-option selected"
                                        : "event-payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="Pay at Event"
                                    checked={
                                        paymentMethod ===
                                        "Pay at Event"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />


                                <div>

                                    <strong>
                                        🎟️ Pay at Event
                                    </strong>


                                    <span>
                                        Pay when you arrive
                                        at the event.
                                    </span>

                                </div>

                            </label>


                            {/* ONLINE PAYMENT */}

                            <label
                                className={
                                    paymentMethod ===
                                    "Online Payment"
                                        ? "event-payment-option selected"
                                        : "event-payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="Online Payment"
                                    checked={
                                        paymentMethod ===
                                        "Online Payment"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />


                                <div>

                                    <strong>
                                        📱 Online Payment
                                    </strong>


                                    <span>
                                        Pay using UPI.
                                    </span>

                                </div>

                            </label>

                        </div>


                        {/* =================================
                            UPI PAYMENT QR
                        ================================= */}

                        {paymentMethod ===
                            "Online Payment" &&
                            upiQr && (

                            <div
                                className="upi-payment"
                                style={{
                                    marginTop:
                                        "25px",
                                    padding:
                                        "25px",
                                    background:
                                        "#f8fafc",
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius:
                                        "12px",
                                    textAlign:
                                        "center"
                                }}
                            >

                                <h3
                                    style={{
                                        marginBottom:
                                            "10px",
                                        color:
                                            "#111827"
                                    }}
                                >
                                    📱 Scan to Pay
                                </h3>


                                <p
                                    style={{
                                        color:
                                            "#6b7280",
                                        marginBottom:
                                            "18px"
                                    }}
                                >
                                    Scan this QR code
                                    using any UPI app
                                    to make the payment.
                                </p>


                                <img
                                    src={upiQr}
                                    alt="UPI Payment QR"
                                    style={{
                                        width:
                                            "250px",
                                        height:
                                            "250px",
                                        border:
                                            "8px solid white",
                                        borderRadius:
                                            "8px",
                                        boxShadow:
                                            "0 5px 20px rgba(0,0,0,0.12)"
                                    }}
                                />


                                <p
                                    style={{
                                        marginTop:
                                            "18px",
                                        color:
                                            "#374151"
                                    }}
                                >
                                    UPI ID:
                                    {" "}

                                    <strong>
                                        {merchantUpiId}
                                    </strong>
                                </p>


                                <p
                                    style={{
                                        color:
                                            "#374151",
                                        fontSize:
                                            "17px"
                                    }}
                                >
                                    Amount:
                                    {" "}

                                    <strong
                                        style={{
                                            color:
                                                "#2563eb"
                                        }}
                                    >
                                        ₹
                                        {totalAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </p>


                                <p
                                    style={{
                                        color:
                                            "#16a34a",
                                        fontWeight:
                                            "600",
                                        marginTop:
                                            "15px"
                                    }}
                                >
                                    ✓ Scan and complete
                                    your payment
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        BILLING
                    ================================= */}

                    <div className="event-booking-card">

                        <h2>
                            💰 Billing Summary
                        </h2>


                        <div className="event-billing-row">

                            <span>
                                Ticket
                            </span>


                            <span>
                                ₹
                                {Number(
                                    event.price
                                ).toLocaleString(
                                    "en-IN"
                                )}
                                {" "}× {tickets}
                            </span>

                        </div>


                        <div className="event-billing-row">

                            <span>
                                Ticket Total
                            </span>


                            <span>
                                ₹
                                {ticketTotal.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>


                        <div className="event-billing-row">

                            <span>
                                Taxes (12%)
                            </span>


                            <span>
                                ₹
                                {taxes.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>


                        <div className="event-billing-row">

                            <span>
                                Service Fee
                            </span>


                            <span>
                                ₹
                                {serviceFee.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>


                        <div className="event-billing-total">

                            <span>
                                Total Amount
                            </span>


                            <strong>
                                ₹
                                {totalAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* =================================
                        CONFIRM
                    ================================= */}

                    <button
                        type="submit"
                        className="event-confirm-btn"
                    >
                        Confirm Event Booking
                    </button>


                    <p className="event-security-note">
                        🔒 Your booking information is secure.
                    </p>

                </form>

            </div>

        </div>
    );
}

export default EventBooking;