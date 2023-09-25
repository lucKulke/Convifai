import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

function HistoryButton(props) {
  const handleHistoryButtonClick = () => {
    props.onclick();
  };

  return (
    <div className="flex justify-center mt-[100px]">
      <button
        className="border-2 border-black rounded-xl p-2 flex justify-evenly items-center hover:bg-gray-100"
        onClick={() => handleHistoryButtonClick()}
      >
        Chat History
        {props.historyVisible ? (
          <GoTriangleUp className="ml-1" />
        ) : (
          <GoTriangleDown className="ml-1" />
        )}
      </button>
    </div>
  );
}

export default HistoryButton;
