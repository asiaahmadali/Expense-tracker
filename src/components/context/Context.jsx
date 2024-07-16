import { createContext, useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Db } from "../../config/firebase";

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    fetchdata();
    fetchAmountDetails();
  }, []);

  const fetchdata = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(Db, "records", userId);
      try {
        const userDocSnap = await getDoc(userDocRef);
        const existingRecords = userDocSnap.exists() ? userDocSnap.data().records || [] : [];
        setRecord(existingRecords);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  const fetchAmountDetails = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(Db, "BalanceStats", userId);
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setBalance(data.balance || 0);
          setExpenses(data.expenses || 0);
          setIncome(data.income || 0);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <MyContext.Provider value={{
      amount, setAmount,
      description, setDescription,
      date, setDate,
      selectedOption, setSelectedOption,
      balance, setBalance,
      expenses, setExpenses,
      income, setIncome,
      record, fetchdata,
      fetchAmountDetails
    }}>
      {children}
    </MyContext.Provider>
  );
};
