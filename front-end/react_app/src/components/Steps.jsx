import React from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { FaAssistiveListeningSystems } from "react-icons/fa";

function Steps(props) {
  const step1 = props.step1;
  const step2 = props.step2;
  const step3 = props.step3;

  const handleStep1 = () => {
    if (step1 && step2) {
      return "bg-black";
    } else if (step1) {
      return "bg-red-700 animate-pulse";
    } else {
      return "bg-gray-200";
    }
  };

  const handleStep2 = () => {
    if (step2 && step3) {
      return "border-current";
    } else if (step2) {
      return "animate-spin border-current text-warning";
    } else {
      return "fill-gray-200";
    }
  };

  return (
    <div className="2xl:m-7 xl:m-3 lg:m-2 sm:m-0 flex justify-around items-center">
      <div
        className={`flex h-10 w-20 items-center justify-evenly rounded-xl border-2 ${
          step1 ? "border-black shadow-md" : "border-gray-200"
        } `}
      >
        <div className={`h-1/2 w-1/4 rounded-full ${handleStep1()}`}></div>
        <h1 className={`text-xl ${step1 ? "" : "text-gray-200"}`}>Rec</h1>
      </div>
      <div>
        <HiArrowLongRight
          className={`h-14 w-14 ${step2 ? "" : "fill-gray-200"}`}
        />
      </div>
      <div
        className={`flex h-10 w-36 items-center justify-evenly rounded-xl border-2 ${
          step2 ? "border-black shadow-md" : "fill-gray-200"
        }`}
      >
        <div
          className={`inline-block h-6 w-6 ${handleStep2()} rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <h1 className={`text-xl ml-1 ${step2 ? "" : "text-gray-200"}`}>
          Processing
        </h1>
      </div>
      <div>
        <HiArrowLongRight
          className={`h-14 w-14 ${step3 ? "" : "fill-gray-200"}`}
        />
      </div>

      <div>
        <FaAssistiveListeningSystems
          className={`h-12 w-12 ${
            step3 ? "animate-pulse " : " fill-gray-200 "
          } `}
        />
      </div>
    </div>
  );
}

export default Steps;
