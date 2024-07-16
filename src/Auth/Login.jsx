import { useState } from "react";
import { Auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const SignUpHandler = async () => {
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      navigate("/expense-tracker");
      console.log("login");
    } catch (error) {
      alert("incorrect email or password");
      console.log("invalid email or password");
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center w-screen h-screen bg-gray-100"
        style={{
          backgroundImage: "url('/images/lg3.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg m-4 sm:m-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
            Login
          </h1>
          <div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="mt-6">
              <button
                onClick={SignUpHandler}
                className="w-full p-3 bg-gradient-to-r from-purple-400 via-purple-800 to-purple-400   text-white rounded-md hover:bg-purple-600 transition duration-200 font-medium"
              >
                Login
              </button>
            </div>
            <p className="mt-4">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-700 font-medium underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
