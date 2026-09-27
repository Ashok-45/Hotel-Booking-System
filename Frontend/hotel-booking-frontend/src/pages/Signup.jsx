import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        if (!name || !email || !phone || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/signup",
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: password
                }
            );

            console.log("Signup response:", response.data);

            alert("Account created successfully!");

            navigate("/login");

        } catch (error) {

            console.error("Signup error:", error);

            if (error.response && error.response.status === 409) {
                alert("Email already registered.");
            } else {
                alert("Signup failed. Please check whether the backend is running.");
            }
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-container">

                <h1>Create Account</h1>

                <p className="signup-subtitle">
                    Create your account to book hotels and events
                </p>

                <form onSubmit={handleSignup}>

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>

                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />
                    </div>

                    <button type="submit" className="signup-btn">
                        Create Account
                    </button>

                </form>

                <p className="login-link">

                    Already have an account?{" "}

                    <span onClick={() => navigate("/login")}>
                        Login
                    </span>

                </p>

            </div>

        </div>
    );
}

export default Signup;