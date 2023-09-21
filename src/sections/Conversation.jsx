import InputOutputFields from "../components/InputOutputFields";
import ChatHistory from "../components/ChatHistory";
import Actions from "../components/Steps";
import RecordingButton from "../components/RecordingButton";
import Steps from "../components/Steps";
import HistoryButton from "../components/HistoryButton";
import { useState } from "react";

function Conversation() {
  const [historyVisibility, setHistoryVisibility] = useState(false);
  const handleHistoryButton = () => {
    setHistoryVisibility((prev) => !prev);
  };

  return (
    <div className="max-container">
      <Steps />
      <InputOutputFields />
      <RecordingButton />
      <div className="max-md:hidden">
        <ChatHistory />
      </div>
      <div className="md:hidden">
        <HistoryButton onclick={handleHistoryButton} />
        {historyVisibility && <ChatHistory />}
      </div>
    </div>
  );
}

export default Conversation;
