import robot from "../assets/images/robot.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className=" md:mt-20 text-black py-16 max-container">
      <div className="flex flex-col md:flex-row mr-3 ml-3 items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0 ">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-md:flex max-md:justify-center">
            Welcome to Convifai
          </h1>
          <p className="text-lg md:text-xl mt-4 max-md:flex max-md:justify-center">
            Learn new languages with Convifai by speaking to an language
            processing model!
          </p>
          <div className="max-md:flex max-md:justify-center">
            <Link to="/login">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-full ml-2 py-2 px-6 mt-6 transition duration-300">
                Try it Out
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src={robot} alt="App Hero" className="rounded-lg shadow-md" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
