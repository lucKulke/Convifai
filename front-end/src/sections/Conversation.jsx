import InputOutputFields from "../components/InputOutputFields";
import ChatHistory from "../components/ChatHistory";
import Actions from "../components/Steps";
import RecordingButton from "../components/RecordingButton";
import Steps from "../components/Steps";
import HistoryButton from "../components/HistoryButton";
import { useEffect, useState } from "react";
import DataProvider from "../functions/DataProvider";
import { Navigate, useParams } from "react-router-dom";
import { AiFillWarning } from "react-icons/ai";
import VoiceAnimation from "../components/VoiceAnimation";

function Conversation(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatHistory, setChatHistory] = useState(null);

  useEffect(() => {
    const response = DataProvider.check_login_status()
      .then((loggedIn) => {
        setLoggedIn(loggedIn);
        get_conversation_data();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (response == true) {
    }
  }, []);

  const get_conversation_data = () => {
    console.log(id);
    DataProvider.fetch_conversation_data(id)
      .then((data) => {
        setChatHistory(data.history);
        setLanguage(data.language);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [language, setLanguage] = useState("");
  const [userText, setUserText] = useState("User Text");
  const [aiInterlocutorText, setAiInterlocutorText] = useState("AI Text");
  const [aiCorrectorText, setAiCorrectorText] = useState("");

  const { id } = useParams();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [recordingStoped, setRecordingStoped] = useState(false);

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
        startIteration(audioBlob);
        setAudioChunks([]);
      };

      recorder.start();
      setRecording(true);
      setUserText(" ");
      setAiInterlocutorText(" ");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      console.log("stopRecording function");
      mediaRecorder.stop();
      setRecordingStoped(true);
      setRecording(false);
    }
  };

  const startIteration = async (audioBlob) => {
    setProcessing(true);
    const textFromUser = await convertVoiceToText(audioBlob);
    setUserText(textFromUser);
    console.log("text from user:", textFromUser);
    const languageProccessingResponse = await languageProccessing(
      textFromUser,
      id
    );
    const textFromCorrector = languageProccessingResponse.corrector;
    const textFromInterlocutor = languageProccessingResponse.interlocutor;

    await endIteration(textFromUser, textFromInterlocutor, textFromCorrector);

    await convertTextToVoice(textFromInterlocutor, language);
  };

  const endIteration = async (
    textFromUser,
    textFromInterlocutor,
    textFromCorrector
  ) => {
    const iterationData = {
      user: textFromUser,
      interlocutor: textFromInterlocutor,
      corrector: textFromCorrector,
    };

    console.log(iterationData);
    await DataProvider.save_iteration_data(iterationData, id);
    const newArray = [...chatHistory, iterationData];
    setChatHistory(newArray);
  };

  const convertVoiceToText = async (audioBlob) => {
    const text = await DataProvider.voice_to_text(audioBlob);

    return text;
  };

  const convertTextToVoice = async (text, language) => {
    const audioUrl = await DataProvider.text_to_voice(text, language);
    playAudioBlob(audioUrl);
    console.log("Audio wird abgespielt");
  };

  const languageProccessing = async (textFromUser, conversation_id) => {
    const data = await DataProvider.language_processing(
      textFromUser,
      conversation_id
    );
    setAiCorrectorText(data.corrector);
    setAiInterlocutorText(data.interlocutor);
    return { interlocutor: data.interlocutor, corrector: data.corrector };
  };

  const playAudioBlob = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setAiSpeaking(true);
      setProcessing(false);
      audio.play();
      audio.addEventListener("ended", () => {
        setAiSpeaking(false);
        setRecordingStoped(false);

        setAiCorrectorText("");
      });
    }
  };
  const [audioSrc, setAudioSrc] = useState(null);

  const handleListenToCorrection = (text) => {
    convertTextToVoice(text);
  };

  return (
    <>
      {loggedIn ? (
        <>
          <Steps step1={recording} step2={processing} step3={aiSpeaking} />
          <InputOutputFields
            userInput={userText}
            aiOutput={aiInterlocutorText}
          />
          {aiSpeaking && <VoiceAnimation />}
          <RecordingButton
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
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
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </>
  );
}

export default Conversation;
