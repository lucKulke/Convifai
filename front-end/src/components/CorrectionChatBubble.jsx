import { PiSpeakerNoneLight } from "react-icons/pi";
import { PiSpeakerHighLight } from "react-icons/pi";
function CorrectionChatBubble(props) {
  const handleListenToCorrectionButton = async (text) => {
    props.onclick(text);
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <>
      <div className="border-2 border-gray-300 bg-blue-100 rounded-2xl shadow-xl flex">
        <div className="p-3">
          <p className="font-mono">{props.text}</p>
        </div>
      </div>
      <button
        disabled={props.aiSpeaking}
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
