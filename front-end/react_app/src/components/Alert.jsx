import React from "react";

function Alert(props) {
  const handleAlertType = () => {
    if (props.type == "fail") {
      return "alert-error";
    }
    return "alert-success";
  };
  return (
    <div className={`fadeOut alert ${handleAlertType()}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={
            props.type == "fail"
              ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          }
        />
      </svg>
      <span>
        <b>{props.text}</b>
      </span>
    </div>
  );
}

export default Alert;
