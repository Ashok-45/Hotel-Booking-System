import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import "./Booking.css";

function Booking() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        hotel,
        room,
        checkIn,
        checkOut,
        guestCount,
        nights
    } = location.state || {};


    // ==========================================
    // PRIMARY GUEST
    // ==========================================

    const [primaryGuest, setPrimaryGuest] = useState({
        name: "",
        email: "",
        phone: ""
    });


    // ==========================================
    // ADDITIONAL GUESTS
    // ==========================================

    const [guests, setGuests] = useState([]);


    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    const [paymentMethod, setPaymentMethod] =
        useState("Pay at Hotel");


    // ==========================================
    // UPI QR
    // ==========================================

    const [upiQr, setUpiQr] = useState("");


    // ==========================================
    // MERCHANT DETAILS
    // ==========================================

    const merchantUpiId = "8247447660@ybl";
    const merchantName = "HB Stay&Event";


    // ==========================================
    // INITIALIZE GUESTS
    // ==========================================

    useEffect(() => {

        const count = Number(guestCount) || 1;

        /*
         * Guest 1 is the PRIMARY GUEST.
         *
         * Therefore:
         * 1 guest  -> no additional guest form
         * 2 guests -> Guest 2 form
         * 3 guests -> Guest 2 + Guest 3 forms
         */

        const additionalGuestCount =
            Math.max(count - 1, 0);

        const initialGuests = [];

        for (let i = 0; i < additionalGuestCount; i++) {

            initialGuests.push({
                name: "",
                age: "",
                gender: ""
            });

        }

        setGuests(initialGuests);

    }, [guestCount]);


    // ==========================================
    // GENERATE UPI QR
    // ==========================================

    useEffect(() => {

        if (
            paymentMethod !== "Online Payment" ||
            !room ||
            !nights
        ) {
            setUpiQr("");
            return;
        }


        const roomTotal =
            Number(room.price) * Number(nights);


        const taxes =
            Math.round(roomTotal * 0.12);


        const serviceFee = 200;


        const totalAmount =
            roomTotal +
            taxes +
            serviceFee;


        const upiUrl =
            `upi://pay?pa=${merchantUpiId}` +
            `&pn=${encodeURIComponent(merchantName)}` +
            `&am=${totalAmount}` +
            `&cu=INR`;


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
            console.log("QR generation error:", error);
        });

    }, [
        paymentMethod,
        room,
        nights
    ]);


    // ==========================================
    // IF BOOKING DATA IS MISSING
    // ==========================================

    if (!hotel || !room) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Booking details not found
                </h2>

                <button
                    onClick={() => navigate("/hotels")}
                >
                    Back to Hotels
                </button>

            </div>

        );

    }


    // ==========================================
    // HANDLE PRIMARY GUEST
    // ==========================================

    const handlePrimaryGuestChange = (
        field,
        value
    ) => {

        if (field === "phone") {

            value = value
                .replace(/\D/g, "")
                .slice(0, 10);

        }


        setPrimaryGuest({
            ...primaryGuest,
            [field]: value
        });

    };


    // ==========================================
    // HANDLE ADDITIONAL GUEST CHANGE
    // ==========================================

    const handleGuestChange = (
        index,
        field,
        value
    ) => {

        const updatedGuests = [
            ...guests
        ];


        updatedGuests[index] = {
            ...updatedGuests[index],
            [field]: value
        };


        setGuests(updatedGuests);

    };


    // ==========================================
    // BILLING
    // ==========================================

    const roomTotal =
        Number(room.price) * Number(nights);


    const taxes =
        Math.round(roomTotal * 0.12);


    const serviceFee = 200;


    const totalAmount =
        roomTotal +
        taxes +
        serviceFee;


    // ==========================================
    // CONFIRM BOOKING
    // ==========================================

    const handleConfirmBooking = () => {

        const count =
            Number(guestCount) || 1;


        // --------------------------------------
        // PRIMARY GUEST NAME
        // --------------------------------------

        if (!primaryGuest.name.trim()) {

            alert(
                "Please enter the guest name."
            );

            return;

        }


        // --------------------------------------
        // EMAIL
        // --------------------------------------

        if (!primaryGuest.email.trim()) {

            alert(
                "Please enter the guest email."
            );

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(primaryGuest.email)) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        // --------------------------------------
        // PHONE
        // --------------------------------------

        if (!/^\d{10}$/.test(primaryGuest.phone)) {

            alert(
                "Phone number must contain exactly 10 digits."
            );

            return;

        }


        // --------------------------------------
        // CHECK DATES
        // --------------------------------------

        if (!checkIn || !checkOut) {

            alert(
                "Please select check-in and check-out dates."
            );

            return;

        }


        if (checkOut <= checkIn) {

            alert(
                "Check-out date must be after check-in date."
            );

            return;

        }


        // --------------------------------------
        // ADDITIONAL GUEST VALIDATION
        // --------------------------------------

        /*
         * Only Guest 2, Guest 3, etc.
         * are stored in the guests array.
         *
         * Guest 1 is the primary guest.
         */

        for (
            let i = 0;
            i < guests.length;
            i++
        ) {

            const guest = guests[i];


            if (!guest.name.trim()) {

                alert(
                    `Please enter the name for Guest ${i + 2}.`
                );

                return;

            }


            if (!guest.age) {

                alert(
                    `Please enter the age for Guest ${i + 2}.`
                );

                return;

            }


            if (!guest.gender) {

                alert(
                    `Please select the gender for Guest ${i + 2}.`
                );

                return;

            }

        }


        // --------------------------------------
        // FINAL GUEST LIST
        // --------------------------------------

        /*
         * Guest 1 = Primary Guest
         *
         * Guest 2 onwards = Additional Guests
         */

        const finalGuests = [

            {
                name: primaryGuest.name.trim(),
                age: "",
                gender: ""
            },

            ...guests.map((guest) => ({
                name: guest.name.trim(),
                age: guest.age,
                gender: guest.gender
            }))

        ];


        // --------------------------------------
        // BOOKING DATA
        // --------------------------------------

        const bookingData = {

            hotel,

            room,

            checkIn,

            checkOut,

            guestCount: count,

            nights,

            primaryGuest: {
                name: primaryGuest.name.trim(),
                email: primaryGuest.email.trim(),
                phone: primaryGuest.phone
            },

            guests: finalGuests,

            paymentMethod,

            roomTotal,

            taxes,

            serviceFee,

            totalAmount

        };


        // --------------------------------------
        // GO TO CONFIRMATION
        // --------------------------------------

        navigate(
            `/hotel/${hotel.id}/confirmation`,
            {
                state: bookingData
            }
        );

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="booking-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="booking-header">

                <button
                    className="booking-back"
                    onClick={() =>
                        navigate(
                            `/hotel/${hotel.id}/rooms`
                        )
                    }
                >
                    ← Back to Rooms
                </button>


                <h1>
                    Complete Your Booking
                </h1>


                <p>
                    {hotel.name}
                </p>

            </div>


            {/* =================================
                MAIN CONTAINER
            ================================= */}

            <div className="booking-container">


                {/* =================================
                    HOTEL / ROOM SUMMARY
                ================================= */}

                <div className="booking-summary-card">

                    <div>

                        <h2>
                            {hotel.name}
                        </h2>

                        <p>
                            📍 {hotel.location}
                        </p>

                    </div>


                    <div className="booking-room-info">

                        <strong>
                            {room.type}
                        </strong>

                        <span>
                            {room.beds}
                        </span>

                        <span>
                            ₹{room.price.toLocaleString()} / night
                        </span>

                    </div>

                </div>


                {/* =================================
                    STAY DETAILS
                ================================= */}

                <div className="booking-section-card">

                    <h2>
                        📅 Stay Details
                    </h2>


                    <div className="booking-detail-grid">

                        <div>

                            <label>
                                Check-in
                            </label>

                            <input
                                type="date"
                                value={checkIn || ""}
                                readOnly
                            />

                        </div>


                        <div>

                            <label>
                                Check-out
                            </label>

                            <input
                                type="date"
                                value={checkOut || ""}
                                readOnly
                            />

                        </div>


                        <div>

                            <label>
                                Guests
                            </label>

                            <input
                                type="text"
                                value={`${guestCount} Guest${Number(guestCount) > 1 ? "s" : ""}`}
                                readOnly
                            />

                        </div>


                        <div>

                            <label>
                                Nights
                            </label>

                            <input
                                type="text"
                                value={nights}
                                readOnly
                            />

                        </div>

                    </div>

                </div>


                {/* =================================
                    PRIMARY GUEST
                ================================= */}

                <div className="booking-section-card">

                    <h2>
                        👤 Guest Information
                    </h2>


                    <p className="booking-section-note">

                        {Number(guestCount) === 1
                            ? "Enter your details"
                            : "Enter the primary guest details"}

                    </p>


                    <div className="booking-detail-grid">


                        {/* NAME */}

                        <div>

                            <label>
                                Full Name *
                            </label>

                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={primaryGuest.name}
                                onChange={(e) =>
                                    handlePrimaryGuestChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label>
                                Email *
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={primaryGuest.email}
                                onChange={(e) =>
                                    handlePrimaryGuestChange(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* PHONE */}

                        <div>

                            <label>
                                Phone Number *
                            </label>

                            <input
                                type="tel"
                                placeholder="Enter 10-digit phone number"
                                value={primaryGuest.phone}
                                maxLength={10}
                                inputMode="numeric"
                                onChange={(e) =>
                                    handlePrimaryGuestChange(
                                        "phone",
                                        e.target.value
                                    )
                                }
                            />

                            <small className="phone-help">
                                Enter exactly 10 digits
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================
                    ADDITIONAL GUEST DETAILS
                ================================= */}

                {Number(guestCount) > 1 && (

                    <div className="booking-section-card">

                        <h2>
                            👥 Other Guest Details
                        </h2>


                        <p className="booking-section-note">
                            Enter details for all other guests.
                        </p>


                        {guests.map(
                            (guest, index) => (

                                <div
                                    className="guest-form"
                                    key={index}
                                >

                                    <h3>
                                        Guest {index + 2}
                                    </h3>


                                    <div className="booking-detail-grid">


                                        <div>

                                            <label>
                                                Name *
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Guest name"
                                                value={guest.name}
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div>

                                            <label>
                                                Age *
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                placeholder="Age"
                                                value={guest.age}
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        "age",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div>

                                            <label>
                                                Gender *
                                            </label>

                                            <select
                                                value={guest.gender}
                                                onChange={(e) =>
                                                    handleGuestChange(
                                                        index,
                                                        "gender",
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select Gender
                                                </option>

                                                <option value="Male">
                                                    Male
                                                </option>

                                                <option value="Female">
                                                    Female
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================
                    PAYMENT
                ================================= */}

                <div className="booking-section-card">

                    <h2>
                        💳 Payment Method
                    </h2>


                    <div className="payment-options">


                        {/* PAY AT HOTEL */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="Pay at Hotel"
                                checked={
                                    paymentMethod ===
                                    "Pay at Hotel"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <div>

                                <strong>
                                    🏨 Pay at Hotel
                                </strong>

                                <span>
                                    Pay when you arrive at the hotel
                                </span>

                            </div>

                        </label>


                        {/* ONLINE PAYMENT */}

                        <label className="payment-option">

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
                                    Pay using UPI
                                </span>

                            </div>

                        </label>

                    </div>


                    {/* UPI QR */}

                    {paymentMethod === "Online Payment" &&
                        upiQr && (

                        <div className="upi-payment">

                            <h3>
                                Scan to Pay
                            </h3>

                            <img
                                src={upiQr}
                                alt="UPI Payment QR"
                            />

                            <p>
                                UPI ID:
                                <strong>
                                    {" "}
                                    {merchantUpiId}
                                </strong>
                            </p>

                            <p>
                                Amount:
                                <strong>
                                    {" "}
                                    ₹{totalAmount.toLocaleString()}
                                </strong>
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================
                    BILLING
                ================================= */}

                <div className="booking-section-card">

                    <h2>
                        💰 Billing Summary
                    </h2>


                    <div className="billing-row">

                        <span>
                            Room
                        </span>

                        <span>
                            ₹{room.price.toLocaleString()} × {nights}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Room Total
                        </span>

                        <span>
                            ₹{roomTotal.toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Taxes (12%)
                        </span>

                        <span>
                            ₹{taxes.toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-row">

                        <span>
                            Service Fee
                        </span>

                        <span>
                            ₹{serviceFee.toLocaleString()}
                        </span>

                    </div>


                    <div className="billing-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{totalAmount.toLocaleString()}
                        </strong>

                    </div>

                </div>


                {/* =================================
                    CONFIRM
                ================================= */}

                <button
                    className="confirm-booking-button"
                    onClick={handleConfirmBooking}
                >
                    Confirm Booking
                </button>


                <p className="booking-security-note">
                    🔒 Your booking information is secure.
                </p>

            </div>

        </div>

    );

}

export default Booking;