import { useContext, useEffect } from "react";
import { MyContext } from "./context/Context";
import { Db } from "../config/firebase";
import { FaTrash, FaEdit } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function ExpenseList() {
  const { fetchdata } = useContext(MyContext);
  const { record } = useContext(MyContext);
  const { setBalance, setIncome, setExpenses } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const handleDelete = async (transactionId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(Db, "records", userId);
      const userStatsRef = doc(Db, "BalanceStats", userId);

      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const existingRecords = userDocSnap.data().records || [];
          const recordToDelete = existingRecords.find(
            (record) => record.id === transactionId
          );

          if (!recordToDelete) {
            console.error("Record not found");
            return;
          }

          const updatedRecords = existingRecords.filter(
            (record) => record.id !== transactionId
          );
          await setDoc(userDocRef, { records: updatedRecords });

          const userStatsSnap = await getDoc(userStatsRef);
          if (userStatsSnap.exists()) {
            const { balance, income, expenses } = userStatsSnap.data();

            let newIncome = income;
            let newExpenses = expenses;
            let newBalance = balance;

            if (recordToDelete.Type === "Income") {
              newIncome -= recordToDelete.Amount;
              newBalance -= recordToDelete.Amount;
            } else if (recordToDelete.Type === "Expense") {
              newExpenses -= recordToDelete.Amount;
              newBalance += recordToDelete.Amount;
            }

            await setDoc(
              userStatsRef,
              { balance: newBalance, income: newIncome, expenses: newExpenses },
              { merge: true }
            );

            setIncome(newIncome);
            setExpenses(newExpenses);
            setBalance(newBalance);
          }

          fetchdata();
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <div className="w-[290px] md:w-[400px] p-5 bg-gradient-to-r from-purple-500 via-blue-800 to-purple-300 text-white m-auto rounded-lg shadow-lg my-5">
      <h1 className="text-center font-medium text-2xl md:text-3xl mb-4 drop-shadow-md">
        Transactions
      </h1>

      {record.map((da) => (
        <div
          key={da.id}
          className="flex justify-between items-center bg-white text-black border rounded-lg p-3 my-3 shadow-lg hover:shadow-md shadow-purple-800 transition-shadow duration-300 ease-in-out"
        >
          <div className="flex gap-6 items-center">
            <p
              style={{ color: da.Type === "Income" ? "green" : "red" }}
              className="w-[80px]"
            >
              {da.Description}
            </p>
            <p className="hidden md:block">{da.Date}</p>
            <p className="font-bold">${da.Amount}</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <FaEdit
              className="cursor-pointer text-green-600 hover:text-green-800"
              onClick={() => {
                navigate("/editrecord", { state: { recordId: da.id } });
              }}
            />
            <FaTrash
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => handleDelete(da.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
