import { useState } from "react";
import { isMobile } from "react-device-detect";
import { IoIosArrowRoundDown } from "react-icons/io";

function InputOutputFields(props) {
  return (
    <div className="w-full flex flex-col justify-between 2xl:h-[500px] lg:h-[330px] sm:h-[310px] max-sm:h-[350px]">
      <div className="flex w-full justify-center">
        <ul className="space-y-2 max-md:w-3/4 md:w-2/3 m-5 mt-10">
          <div className="border-2 border-gray-300 flex w-full p-3 rounded-xl shadow-lg min-h-[50px] max-h-">
            <div className="overflow-y-auto max-sm:max-h-24 sm:max-h-20 lg:max-h-24 2xl:max-h-28 ">
              <p className="userInput">{props.userInput}</p>
            </div>
          </div>
          <div className="border-2 flex border-gray-300 w-full p-3 rounded-xl shadow-lg min-h-[50px]">
            <div className="overflow-y-auto max-sm:max-h-28 sm:max-h-24 lg:max-h-28 2xl:max-h-32 ">
              <p className="aiOutput">{props.aiOutput}</p>
            </div>
          </div>
        </ul>
      </div>
      {props.operationInstruction && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col justify-between">
            <p className="my-3 text-slate-700 text-sm">
              {isMobile
                ? "Press to start and again to stop the recording."
                : "Hold the button to record your voice."}
            </p>
            <div className="flex justify-center">
              <IoIosArrowRoundDown className="h-8 w-8 animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputOutputFields;
