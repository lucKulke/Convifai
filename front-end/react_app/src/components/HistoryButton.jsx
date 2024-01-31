import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { IoIosArrowRoundDown } from "react-icons/io";

function HistoryButton(props) {
  const handleHistoryButtonClick = () => {
    props.onclick();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the context menu from appearing
  };

  return (
    <div className="w-full flex flex-col justify-between 2xl:mt-10 h-[190px]">
      {props.operationInstruction ? (
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <p className="my-3 text-slate-700 text-sm text-center">
              Open chat history and whatch out for blue ping.<br></br> It
              indicates a correction.
            </p>
          </div>
          <div className="flex justify-center">
            <IoIosArrowRoundDown className="h-8 w-8 animate-bounce" />
          </div>
        </div>
      ) : (
        <div className="grow"></div>
      )}
      <div className="flex justify-center mb-10 mt-2">
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
    </div>
  );
}

export default HistoryButton;
