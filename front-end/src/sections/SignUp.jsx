import React, { useEffect, useState } from "react";
import DataProvider from "../functions/DataProvider";
import { Navigate } from "react-router";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

function SignUp(props) {
  const [username, setUsername] = useState(""); // State to hold the input value
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    console.log(username);
    console.log(password);

    DataProvider.sign_up(username, password)
      .then((loggedIn) => {
        if (loggedIn === "account exists already") {
          setError(loggedIn);
        } else if (loggedIn === true) {
          props.setLoggedIn(loggedIn);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {props.loggedIn && <Navigate to="/conversations" />}
      {error && (
        <div
          className={`${
            alert ? "opacity-100 visible" : "opacity-0 invisible"
          } transition-opacity duration-300 ease-in-out fixed top-0 z-50 p-4`}
        >
          <Alert text={`Error,${error}`} type={"fail"}></Alert>
        </div>
      )}
      <div className="h-screen flex justify-center mt-[200px]">
        <div className="bg-white h-1/3 w-1/3 max-md:w-1/2 rounded-xl shadow-2xl border-2 border-gray-400 flex justify-center p-2">
          <ul className="space-y-[30px]">
            <li className="">
              <h1 className="navbarLink flex justify-center">
                Sign up to Convifai
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

                <div className="mt-3 mb-3">
                  <input
                    value={password}
                    onChange={handlePasswordChange}
                    type="text"
                    placeholder="Password"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
                <div className="flex mt-3 justify-center p-2">
                  <button
                    type="submit"
                    className="bg-yellow-500 active:bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-full ml-2 py-2 px-6 mt-6 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </li>
            <li>
              <div className="flex justify-center">
                <Link to="/login">
                  <p className="text-blue-700">Login</p>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SignUp;
