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
      console.log("true");
      return "bg-gray-200";
    }
  };

  const handleStep2 = () => {
    if (step2 && step3) {
      return "border-current";
    } else if (step2) {
      return "animate-spin border-current";
    } else {
      return "fill-gray-200";
    }
  };

  return (
    <div class="mt m-10 flex justify-around items-center">
      <div
        class={`flex h-10 w-20 items-center justify-evenly rounded-xl border-2 ${
          step1 ? "border-black" : "border-gray-200"
        }  bg-white`}
      >
        <div class={`h-1/2 w-1/4 rounded-full ${handleStep1()}`}></div>
        <h1 class={`text-xl ${step1 ? "" : "text-gray-200"}`}>Rec</h1>
      </div>
      <div>
        <HiArrowLongRight
          className={`h-14 w-14 ${step2 ? "" : "fill-gray-200"}`}
        />
      </div>
      <div
        class={`flex h-10 w-36 items-center justify-evenly rounded-xl border-2 ${
          step2 ? "border-black" : "fill-gray-200"
        }`}
      >
        <div
          class={`inline-block h-6 w-6 ${handleStep2()} rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
          role="status"
        >
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <h1 class={`text-xl ${step2 ? "" : "text-gray-200"}`}>Processing</h1>
      </div>
      <div>
        <HiArrowLongRight
          className={`h-14 w-14 ${step3 ? "" : "fill-gray-200"}`}
        />
      </div>

      <div>
        <FaAssistiveListeningSystems
          className={`h-12 w-12  ${
            step3 ? "animate-pulse" : " fill-gray-200 "
          } `}
        />
      </div>
    </div>
  );
}

export default Steps;
