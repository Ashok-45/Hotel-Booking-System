import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login response:", response.data);

            const user = response.data;

            // Store logged-in user
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");

            navigate("/");

        } catch (error) {

            console.error("Login error:", error);

            if (error.response && error.response.status === 401) {
                alert("Invalid email or password.");
            } else {
                alert(
                    "Login failed. Please check whether the backend is running."
                );
            }
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                <h1>Welcome Back</h1>

                <p className="login-subtitle">
                    Login to continue booking hotels and events
                </p>

                <form onSubmit={handleLogin}>

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
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>

                </form>

                <p className="signup-link">

                    Don't have an account?{" "}

                    <span onClick={() => navigate("/signup")}>
                        Sign Up
                    </span>

                </p>

            </div>

        </div>
    );
}

export default Login;