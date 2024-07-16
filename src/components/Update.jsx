import { useContext, useState, useEffect } from "react";
import { MyContext } from "./context/Context";
import { Db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setDoc } from "firebase/firestore";

function UpdateRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordId } = location.state;

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const { selectedOption, setSelectedOption } = useContext(MyContext);
  const { setBalance } = useContext(MyContext);
  const { setIncome } = useContext(MyContext);
  const { setExpenses } = useContext(MyContext);
  const { fetchdata } = useContext(MyContext);

  useEffect(() => {
    const fetchRecord = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(Db, "records", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const existingRecords = userDocSnap.data().records || [];
          const record = existingRecords.find((r) => r.id === recordId);
          if (record) {
            setAmount(record.Amount);
            setDescription(record.Description);
            setDate(record.Date);
            setSelectedOption(record.Type);
          } else {
            console.error("Record not found");
          }
        } else {
          console.error("User document not found");
        }
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchRecord();
  }, [recordId, setSelectedOption]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedOption === "") {
      document.getElementById("selectionError").innerText =
        "Please select the expense or income";
      return;
    } else {
      document.getElementById("selectionError").innerText = "";
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(Db, "records", userId);
      const userStatsRef = doc(Db, "BalanceStats", userId);
      try {
        const userDocSnap = await getDoc(userDocRef);
        const userStatsSnap = await getDoc(userStatsRef);
        if (userDocSnap.exists()) {
          const existingRecords = userDocSnap.data().records || [];
          const originalRecord = existingRecords.find(
            (record) => record.id === recordId
          );

          if (!originalRecord) {
            console.error("Original record not found");
            return;
          }

          // Calculate the amount difference
          const amountDifference = amount - originalRecord.Amount;

          // Fetch the current stats
          let newIncome = userStatsSnap.exists()
            ? userStatsSnap.data().income
            : 0;
          let newExpenses = userStatsSnap.exists()
            ? userStatsSnap.data().expenses
            : 0;
          let newBalance = userStatsSnap.exists()
            ? userStatsSnap.data().balance
            : 0;

          // Remove the impact of the original record
          if (originalRecord.Type === "Income") {
            newIncome -= originalRecord.Amount;
            newBalance -= originalRecord.Amount;
          } else if (originalRecord.Type === "Expense") {
            newExpenses -= originalRecord.Amount;
            newBalance += originalRecord.Amount;
          }

          // Apply the impact of the updated record
          if (selectedOption === "Income") {
            newIncome += amount;
            newBalance += amount;
          } else if (selectedOption === "Expense") {
            newExpenses += amount;
            newBalance -= amount;
          }

          // Update the record in Firestore
          const updatedRecords = existingRecords.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  Amount: amount,
                  Description: description,
                  Date: date,
                  Type: selectedOption,
                }
              : record
          );

          await setDoc(userDocRef, { records: updatedRecords });

          // Update BalanceStats document
          await setDoc(
            userStatsRef,
            { balance: newBalance, income: newIncome, expenses: newExpenses },
            { merge: true }
          );

          // Update local context state
          setIncome(newIncome);
          setExpenses(newExpenses);
          setBalance(newBalance);

          fetchdata();
          navigate("/expense-tracker");
        } else {
          console.error("User document not found");
        }
      } catch (error) {
        console.error("Error updating record:", error.message);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/images/login-final.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg bg-gradient-to-r from-purple-300 via-purple-800 to-purple-300 p-6 rounded-lg shadow-lg mx-4">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Update Record
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="number"
              value={amount}
              placeholder="Amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-md shadow-white transition-shadow duration-300 ease-in-out"
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={description}
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-md shadow-white transition-shadow duration-300 ease-in-out"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="date"
              value={date}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-md shadow-white transition-shadow duration-300 ease-in-out"
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                value="Expense"
                onChange={(e) => setSelectedOption(e.target.value)}
                checked={selectedOption === "Expense"}
                className="mr-2"
                required
              />
              <label>Expense</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                value="Income"
                onChange={(e) => setSelectedOption(e.target.value)}
                checked={selectedOption === "Income"}
                className="mr-2"
                required
              />
              <label>Income</label>
            </div>
          </div>
          <div id="selectionError" className="text-red-600 text-sm"></div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full max-w-xs p-3 bg-purple-900 font-medium text-white rounded-lg hover:bg-purple-800 transition  shadow-md hover:shadow-md shadow-purple-950   duration-300 ease-in-out"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRecord;
