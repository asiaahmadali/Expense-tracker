import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleList = () => {
    navigate("/list");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-500 via-green-300 to-purple-500 p-4 w-full shadow-lg">
        <ul className="flex justify-between md:justify-around text-white font-semibold">
          <li className="hover:underline">💰 Budget</li>
          <li onClick={handleList} className="hover:underline cursor-pointer">
            Transaction List
          </li>
          <li onClick={handleLogout} className="hover:underline cursor-pointer">
            LogOut
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
