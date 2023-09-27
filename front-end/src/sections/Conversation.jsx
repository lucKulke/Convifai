import InputOutputFields from "../components/InputOutputFields";
import ChatHistory from "../components/ChatHistory";
import Actions from "../components/Steps";
import RecordingButton from "../components/RecordingButton";
import Steps from "../components/Steps";
import HistoryButton from "../components/HistoryButton";
import { useEffect, useState } from "react";
import DataProvider from "../functions/DataProvider";
import { Navigate } from "react-router-dom";

function Conversation(props) {
  useEffect(() => {
    if (props.loggedIn) {
      console.log("logged in");
      setChatHistory([
        {
          user: "Hi how are you be",
          interlocutor: "Hello im fine ",
          corrector: "Hi, how are you?",
        },
        {
          user: "Lets talk about something interesting.",
          interlocutor: "Ok lets talk about cars",
          corrector: "Lets talk about something interesting.",
        },
      ]);
    }
  }, []);

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [recordingStoped, setRecordingStoped] = useState(false);

  const [userText, setUserText] = useState("User Text");
  const [aiText, setAiText] = useState("AI Text");

  const [chatHistory, setChatHistory] = useState(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const [historyVisible, sethistoryVisible] = useState(false);

  const handleHistoryButton = () => {
    sethistoryVisible((prev) => !prev);
  };

  const startRecording = async () => {
    console.log("startRecording function");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks([...audioChunks, e.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL:", audioUrl);
        setAudioChunks([]);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      console.log("stopRecording function");
      mediaRecorder.stop();
      setRecordingStoped(true);
    }
  };

  const convertTextToVoice = (text) => {
    console.log(text);
  };

  const handleListenToCorrection = (text) => {
    convertTextToVoice(text);
  };

  return (
    <div className="max-container">
      {!props.loggedIn && <Navigate to="/conversations" />}
      <Steps step1={recording} step2={processing} step3={aiSpeaking} />
      <InputOutputFields userInput={userText} aiOutput={aiText} />
      <RecordingButton
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording} // Handle release when the mouse leaves the button
        onTouchStart={startRecording} // Handle touch events on mobile devices
        onTouchEnd={stopRecording}
        disabled={recordingStoped}
      />

      <div>
        <HistoryButton
          historyVisible={historyVisible}
          onclick={handleHistoryButton}
        />
        {historyVisible && (
          <ChatHistory
            listenToCorrection={handleListenToCorrection}
            history={chatHistory}
          />
        )}
      </div>
    </div>
  );
}

export default Conversation;
