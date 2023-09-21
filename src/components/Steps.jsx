import React from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { FaAssistiveListeningSystems } from "react-icons/fa";

function Steps() {
  return (
    <div class="mt m-10 flex justify-around items-center">
      <div class="flex h-10 w-20 items-center justify-evenly rounded-xl border-2 border-black bg-white">
        <div class="ring-of h-1/2 w-1/4 animate-pulse rounded-full bg-red-700 ring-2 ring-red-600"></div>
        <h1 class="text-xl">Rec</h1>
      </div>
      <div>
        <HiArrowLongRight className="h-14 w-14" />
      </div>
      <div class="flex h-10 w-36 items-center justify-evenly rounded-xl border-2 border-black bg-white">
        <div
          class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <h1 class="text-xl">Processing</h1>
      </div>
      <div>
        <HiArrowLongRight className="h-14 w-14 fill-gray-200" />
      </div>

      <div className="">
        <FaAssistiveListeningSystems className="h-12 w-12 animate-pulse fill-gray-200" />
      </div>
    </div>
  );
}

export default Steps;
