import { useEffect, useState } from "react";
import { PiSpeakerNoneLight } from "react-icons/pi";
import { PiSpeakerHighLight } from "react-icons/pi";
function CorrectionChatBubble(props) {
  const [listenToCorrection, setListenToCorrection] = useState(false);

  const handleListenToCorrectionButton = async (text) => {
    setListenToCorrection(true);
    props.onclick(text);
  };

  useEffect(() => {
    if (props.aiSpeaking) {
      setListenToCorrection(true);
    } else {
      setListenToCorrection(false);
    }
  }, [props.aiSpeaking]);

  return (
    <>
      <div className="border-2 border-gray-300 bg-blue-100 rounded-2xl shadow-xl flex">
        <div className="p-3">
          <p className="font-mono">{props.text}</p>
        </div>
      </div>
      <button
        disabled={listenToCorrection}
        className="p-2"
        onClick={() => handleListenToCorrectionButton(props.text)}
      >
        {props.aiSpeaking ? (
          <PiSpeakerHighLight className="h-7 w-7" />
        ) : (
          <PiSpeakerNoneLight className="h-7 w-7" />
        )}
      </button>
    </>
  );
}

export default CorrectionChatBubble;
