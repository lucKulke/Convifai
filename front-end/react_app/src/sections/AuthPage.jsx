import React, { useEffect, useState } from "react";
import DataProvider from "../functions/DataProvider";
import Alert from "../components/Alert";

const AuthPage = (props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    DataProvider.global_authentication(password)
      .then((auth_status) => {
        if (auth_status === true) {
          props.setGlobalAuth(true);
        } else if (auth_status === false) {
          setError("Wrong Password! Please try again.");
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
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
      <div className="flex items-center justify-center h-screen">
        <div>
          <ul className="space-x-3">
            <li>
              <h1 className="text-center navbarLink text-1xl mb-10">
                This is a private project.
              </h1>
            </li>
            <li>
              <form onSubmit={handleSubmit}>
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
