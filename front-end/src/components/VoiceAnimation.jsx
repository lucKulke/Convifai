import React, { useState } from "react";
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";

function VoiceAnimation(props) {
  const [paused, setPaused] = useState(false);
  const numberOfBars = 11; // max 11
  const bars = [];
  for (let i = 0; i < numberOfBars; i++) {
    bars.push(
      <div className="bar" style={paused ? { animation: "none" } : {}}></div>
    );
  }

  const handlePause = () => {
    setPaused(true);
    props.pause_audio();
  };

  const handleStart = () => {
    setPaused(false);
    props.start_audio();
  };

  const handleCancel = () => {
    props.cancel_audio();
  };

  return (
    <div className="flex justify-center items-center h-[150px]">
      {!paused ? (
        <button className="mr-20 max-sm:mr-5 " onClick={() => handlePause()}>
          <AiOutlinePauseCircle className="h-10 w-10" />
        </button>
      ) : (
        <button className="mr-20 max-sm:mr-5 " onClick={() => handleStart()}>
          <AiOutlinePlayCircle className="h-10 w-10" />
        </button>
      )}
      {bars}
      <button className="ml-20 max-sm:ml-5" onClick={() => handleCancel()}>
        <FcCancel className="h-10 w-10" />
      </button>
    </div>
  );
}

export default VoiceAnimation;
