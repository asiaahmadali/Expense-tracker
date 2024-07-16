import { useContext } from "react";
import { MyContext } from "./context/Context";
import { Db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

function ExpenseSelection() {
  const { amount, setAmount } = useContext(MyContext);
  const { description, setDescription } = useContext(MyContext);
  const { selectedOption, setSelectedOption } = useContext(MyContext);
  const { date, setDate } = useContext(MyContext);
  const { balance, setBalance } = useContext(MyContext);
  const { income, setIncome } = useContext(MyContext);
  const { expenses, setExpenses } = useContext(MyContext);
  const { fetchdata } = useContext(MyContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedOption === "") {
      document.getElementById("selectionError").innerText =
        "Please select expense or income";
      return;
    } else {
      document.getElementById("selectionError").innerText = "";
    }

    if (selectedOption === "Expense" && amount > balance) {
      alert("You have insufficient balance to add this expense.");
      return;
    }

    let newIncome = income;
    let newExpenses = expenses;
    let newBalance = balance;

    if (selectedOption === "Income") {
      newIncome = income + amount;
      newBalance = balance + amount;
    } else if (selectedOption === "Expense") {
      newExpenses = expenses + amount;
      newBalance = balance - amount;
    }

    setIncome(newIncome);
    setExpenses(newExpenses);
    setBalance(newBalance);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const userStatsRef = doc(Db, "BalanceStats", userId);
      const userDocRef = doc(Db, "records", userId);

      try {
        const userDocSnap = await getDoc(userDocRef);
        const existingRecords = userDocSnap.exists()
          ? userDocSnap.data().records || []
          : [];

        const newRecordId = uuidv4();

        const updatedRecords = [
          ...existingRecords,
          {
            id: newRecordId,
            Amount: amount,
            Description: description,
            Date: date,
            Type: selectedOption,
            Balance: newBalance,
            Expenses: newExpenses,
            Income: newIncome,
          },
        ];

        await setDoc(userDocRef, { records: updatedRecords });
        await setDoc(
          userStatsRef,
          { balance: newBalance, income: newIncome, expenses: newExpenses },
          { merge: true }
        );

        fetchdata();
      } catch (error) {
        console.error("Error updating user records:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <div className=" w-[270px] md:w-[400px] flex flex-col mt-4">
      <div className="w-[250px] md:w-[350px] border-2 border-purple-300 rounded p-3 shadow-md shadow-purple-300">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="number"
            placeholder="Amount"
            className="p-1 w-[220px] md:w-[320px] border my-2"
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <input
            type="text"
            placeholder="Description"
            className="p-1 w-[220px] md:w-[320px] border my-2"
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="date"
            placeholder="Date"
            className="p-1 w-[220px] md:w-[320px] border my-2"
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex space-x-3">
            <input
              type="radio"
              value="Expense"
              onChange={(e) => setSelectedOption(e.target.value)}
              checked={selectedOption === "Expense"}
              required
            />
            <label htmlFor="">Expense</label>

            <input
              type="radio"
              value="Income"
              onChange={(e) => setSelectedOption(e.target.value)}
              checked={selectedOption === "Income"}
              required
            />
            <label htmlFor="">Income</label>
          </div>

          <div className="my-2 text-red-700 " id="selectionError"></div>

          <div className="flex flex-col items-center my-3">
            <button
              className="text-white bg-black p-2 hover:text-[15px]"
              type="submit"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseSelection;
