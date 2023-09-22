import { useState } from "react";
import UserPicture from "../assets/images/user.png";
import InfoPing from "./InfoPing";

import CorrectionChatBubble from "./CorrectionChatBubble";

function UserChatBubble(props) {
  const [correctionVisible, setCorrectionVisible] = useState(false);
  const [correctionNoticed, setCorrectionNoticed] = useState(false);
  const [listenCorrection, setListenCorrection] = useState(false);

  const handleCorrectorChatBubble = () => {
    setCorrectionVisible((prev) => !prev);
    setCorrectionNoticed(true);
  };

  return (
    <div className="w-full flex justify-start mb-5">
      <div className="w-10 h-10 rounded-full border-2 border-gray-300 mr-3 shadow-xl">
        <img className="p-2" src={UserPicture} alt="" />
      </div>
      <ul className="space-y-2">
        <li>
          <button
            onClick={handleCorrectorChatBubble}
            className="border-2 border-gray-300 rounded-2xl shadow-xl flex"
          >
            <div className="p-3">
              <p className="font-mono">{props.userText}</p>
            </div>
            <div className="relative">
              <InfoPing noticed={correctionNoticed}></InfoPing>
            </div>
          </button>
        </li>
        {correctionVisible && (
          <li className="flex items-center">
            <CorrectionChatBubble
              onclick={props.listenToCorrection}
              text={props.correctorText}
              listenCorrection={listenCorrection}
              setListenCorrection={setListenCorrection}
            />
          </li>
        )}
      </ul>
    </div>
  );
}

export default UserChatBubble;
