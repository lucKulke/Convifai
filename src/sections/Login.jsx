import { useState } from "react";

function Login() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    console.log("Submitted value:", inputValue);
  };
  return (
    <div className="h-screen flex justify-center mt-[200px]">
      <div className="bg-white h-1/3 w-1/3 max-md:w-1/2 rounded-xl shadow-2xl border-2 border-gray-400 flex justify-center p-2">
        <ul className="space-y-[50px]">
          <li className="">
            <h1 className="navbarLink flex justify-center">
              Login to Tandem AI
            </h1>
          </li>
          <li>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="flex justify-center p-2">
                <button
                  className="hover:bg-gray-300 hover:rounded-xl active:bg-gray-400 active:rounded-xl p-2"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
