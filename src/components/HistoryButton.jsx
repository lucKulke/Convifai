import React from "react";
import { GoTriangleDown } from "react-icons/go";

function HistoryButton(props) {
  return (
    <div className="flex justify-center mt-[100px]">
      <button
        className="border-2 border-black rounded-xl p-2 flex justify-evenly items-center hover:bg-gray-100"
        onClick={props.onclick}
      >
        Chat History
        <GoTriangleDown />
      </button>
    </div>
  );
}

export default HistoryButton;
