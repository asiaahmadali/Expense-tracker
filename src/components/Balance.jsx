import { useContext } from "react";
import { MyContext } from "./context/Context";

function Balance(Props) {
  const { balance } = useContext(MyContext);
  const { income } = useContext(MyContext);
  const { expenses } = useContext(MyContext);

  return (
    <>
      <div className="flex justify-between p-2">
        <h2 className="font-medium text-xl">Balance: $ {balance}</h2>
        <button
          className="text-white bg-black p-2 rounded"
          onClick={Props.onButtonClick}
        >
          {Props.showExpenseSelection ? "Cross" : "Add"}
        </button>
      </div>

      <div className="flex justify-between">
        <div className="border-purple-400 border-2  w-[120px] md:w-[160px] p-3 m-2 shadow-md shadow-purple-200">
          <h3>Expenses</h3>
          <p className="text-red-600 font-medium">${expenses}</p>
        </div>

        <div className="border-purple-400 border-2 w-[120px] p-3 m-2 md:w-[160px] shadow-lg shadow-purple-300">
          <h3>Income</h3>
          <p className="text-green-600 font-medium">${income}</p>
        </div>
      </div>
    </>
  );
}

export default Balance;
