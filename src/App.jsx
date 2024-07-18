import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import ExpenseTracker from "./components/expense-tracker";
import UpdateRecord from "./components/Update";
import { ContextProvider } from "./components/context/Context";
import { ContextAuth } from "./components/context/Contextauth";
import ExpenseList from "./components/ExpenseList";

function App() {
  const { user } = useContext(ContextAuth);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/expense-tracker" /> : <Navigate to="/login" />
          }
        />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />

        <Route
          path="expense-tracker"
          element={
            <ProtectedRoute>
              <ExpenseTracker />
            </ProtectedRoute>
          }
        />
        <Route path="editrecord" element={<UpdateRecord />} />
        <Route
          path="list"
          element={
            <ProtectedRoute>
              <div
                className="bg-blue-200 min-h-screen flex flex-col"
                style={{
                  backgroundImage: "url('/images/new1.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <ExpenseList />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ContextProvider>
  );
}

export default App;
