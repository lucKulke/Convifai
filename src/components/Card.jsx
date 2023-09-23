import robot from "../assets/images/robot.png";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { ImEnter } from "react-icons/im";

export default function Card(props) {
  return (
    <div className="flex justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src={robot} alt="picture" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{props.language}</h2>
          <p className="mb-10">{props.title}</p>
          <div className="flex justify-between">
            <button>
              <ImEnter className="h-6 w-6" />
            </button>
            <button>
              <HiOutlineRefresh className="h-6 w-6" />
            </button>
            <button onClick={() => props.delete(props.id)}>
              <AiFillDelete className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
