function Login() {
  return (
    <div className="h-screen flex justify-center mt-[200px]">
      <div className="bg-white h-1/3 w-1/3 max-md:w-1/2 rounded-xl shadow-2xl border-2 border-gray-400 flex justify-center p-2">
        <ul className="space-y-[50px]">
          <li className="">
            <h1 className="navbarLink flex justify-center">Login</h1>
          </li>
          <li>
            <button className="rounded-lg hover:bg-gray-300 active:bg-gray-500 p-2 border-2 h-12 w-30 border-black mt-[30px]">
              Google anmelden
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
