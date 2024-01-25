import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

function HistoryButton(props) {
  const handleHistoryButtonClick = () => {
    props.onclick();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the context menu from appearing
  };

  return (
    <div className="flex justify-center mb-10 mt-[100px]">
      <button
        className="border-2 border-black rounded-xl p-2 flex justify-evenly items-center hover:bg-gray-100"
        onContextMenu={handleContextMenu}
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
