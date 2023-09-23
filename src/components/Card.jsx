import robot from "../assets/images/robot.png";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { ImEnter } from "react-icons/im";

export default function Card() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={robot} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
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
