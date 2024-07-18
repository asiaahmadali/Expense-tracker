import Header from "./Header";
import Balance from "./Balance";
import ExpenseSelection from "./ExpenseSelection";
import ExpenseList from "./ExpenseList";
import { ContextProvider } from "./context/Context";
import { useState } from "react";

function ExpenseTracker() {
  const [showExpenseSelection, setShowExpenseSelection] = useState(false);

  const handleButtonClick = () => {
    setShowExpenseSelection((prevState) => !prevState);
  };

  return (
    <div
      className="bg-blue-200 min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/images/income2-new.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      <ContextProvider>
        <div className="bg-gradient-to-r from-purple-300 via-purple-800 to-purple-300 m-auto align-center w-[300px] md:w-[400px] p-4 my-5 rounded-lg shadow-2xl">
          <h1 className="text-center my-3 font-bold text-white  text-2xl md:text-3xl drop-shadow-lg">
            Expense Tracker 💸
          </h1>
          <Balance
            onButtonClick={handleButtonClick}
            showExpenseSelection={showExpenseSelection}
          />
          {showExpenseSelection && <ExpenseSelection />}
        </div>
        <ExpenseList />
      </ContextProvider>
    </div>
  );
}

export default ExpenseTracker;
