import React from "react";

function InfoPing(props) {
  return (
    <div className="absolute right-[-5px] top-[-5px]">
      <span className="relative flex h-4 w-4">
        <span
          className={`${
            props.noticed ? "" : "animate-ping"
          } absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-4 w-4 ${
            props.noticed ? "bg-gray-400" : " bg-sky-500"
          }`}
        ></span>
      </span>
    </div>
  );
}

export default InfoPing;
