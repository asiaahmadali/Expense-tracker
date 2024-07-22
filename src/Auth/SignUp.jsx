import { useState } from "react";
import { Auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { Provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Db } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore";

function SignUp() {
  const [username, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const navigate = useNavigate();

  const SignUpHandler = async () => {
    try {
      console.log(username, email, password);
      const result = await createUserWithEmailAndPassword(
        Auth,
        email,
        password
      );
      navigate("/expense-tracker");

      await setDoc(doc(Db, "users", result.user.uid), {
        name: username,
        email: email,
        userid: result.user.uid,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const LoginGoogle = async () => {
    try {
      const result = await signInWithPopup(Auth, Provider);

      const user = result.user;
      if (!user) {
        throw new Error("No user information received from Google.");
      }
      await setDoc(doc(Db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        userid: user.uid,
      });

      navigate("/expense-tracker");
      console.log("log in with google");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center w-screen h-screen bg-gray-100"
        style={{
          backgroundImage: "url('/images/signup.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-md w-full bg-white p-6 rounded-md shadow-lg m-4 sm:m-auto hover:shadow-md shadow-gray-500 transition-shadow duration-300 ease-in-out">
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-900">
            Sign Up
          </h1>
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
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
                className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 font-medium"
              >
                Sign Up
              </button>
            </div>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline font-medium">
                Login
              </Link>
            </p>
            {/* <p className="mt-2 text-center text-purple-700">OR</p>
            <div className="mt-2">
              <button
                type="button"
                onClick={LoginGoogle}
                className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                Login with Google
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
