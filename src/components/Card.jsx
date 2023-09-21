import robot from "../assets/images/robot.png";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { ImEnter } from "react-icons/im";

export default function Card() {
  return (
    <div className="flex justify-center items-center">
      <div className="h-[400px] w-[300px] rounded-md border-2 bg-white p-3 shadow-xl ring-1 ring-slate-900/5 dark:bg-primary">
        <div className="m-3 h-[200px] flex justify-center border-2 rounded-md">
          <img src={robot} alt="image" className="object-fill h-47 w-98" />
        </div>
        <div className="m-3 h-[100px]">
          <h1 className="m-3 mt-2 text-2xl text-slate-700 underline">
            Hier steht ein title der sehr kurz ist.
          </h1>
        </div>
        <div className="flex justify-between">
          <button>
            <ImEnter className="h-6 w-6" />
          </button>
          <button>
            <HiOutlineRefresh className="h-6 w-6" />
          </button>
          <button>
            <AiFillDelete className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
