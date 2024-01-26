import { useEffect, useState } from "react";
import DataProvider from "../functions/DataProvider";
import { Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

function Login(props) {
  const [username, setUsername] = useState(""); // State to hold the input value
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    DataProvider.login(username, password)
      .then((loggedIn) => {
        if (loggedIn === "wrong password") {
          setError("Wrong password!");
        } else if (loggedIn === "no registerd account") {
          setError("No such accout registerd, need to sign up first!");
        } else if (loggedIn === true) {
          props.setLoggedIn(loggedIn);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleButtonTouchStart = (event) => {
    event.preventDefault();
    handleSubmit(event);
  };
  return (
    <>
      {props.loggedIn && <Navigate to="/conversations" />}
      {error && (
        <div className="flex justify-center w-full">
          <div
            className={`${
              alert ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 ease-in-out fixed top-0 z-50 p-4`}
          >
            <Alert text={`Error,${error}`} type={"fail"}></Alert>
          </div>
        </div>
      )}
      <div className="h-screen flex justify-center mt-[200px]">
        <div className="h-[350px] w-1/3 max-md:w-1/2 rounded-xl shadow-2xl border-2 border-gray-400 flex justify-center p-2">
          <ul className="space-y-[20px]">
            <li className="">
              <h1 className="navbarLink flex justify-center">
                Login to Convifai
              </h1>
            </li>
            <li>
              <form onSubmit={handleSubmit}>
                <div className="mt-3 mb-3">
                  <input
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                    placeholder="Username"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>

                <div className="mt-3">
                  <input
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
                <div className="flex mt-3 justify-center p-2">
                  <button
                    type="submit"
                    onTouchStart={handleButtonTouchStart}
                    className="bg-yellow-500 active:bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-full ml-2 py-2 px-6 mt-6 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </li>
            <li>
              <div className="flex justify-center">
                <Link to="/sign_up">
                  <p className="text-blue-700">Sign up</p>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Login;
