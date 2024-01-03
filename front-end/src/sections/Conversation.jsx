import InputOutputFields from "../components/InputOutputFields";
import ChatHistory from "../components/ChatHistory";
import Actions from "../components/Steps";
import RecordingButton from "../components/RecordingButton";
import Steps from "../components/Steps";
import HistoryButton from "../components/HistoryButton";
import { useEffect, useState, useRef } from "react";
import DataProvider from "../functions/DataProvider";
import { Navigate, useParams } from "react-router-dom";
import { AiFillSound, AiFillWarning } from "react-icons/ai";
import VoiceAnimation from "../components/VoiceAnimation";
import Alert from "../components/Alert";

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
  const audioRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingError, setRecordingError] = useState(false);

  const [historyVisible, sethistoryVisible] = useState(false);

  const handleHistoryButton = () => {
    sethistoryVisible((prev) => !prev);
  };

  useEffect(() => {
    if (recordingError) {
      setTimeout(() => {
        setRecordingError(false);
      }, 5000);
    }
  }, [recordingError]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const audioChunks = [];

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        console.log("AudioBlob size: ", audioBlob.size);
        if (audioBlob.size < 5000) {
          setRecordingError(true);
          setRecording(false);
          setRecordingStoped(false);
        } else {
          setUserText(" ");
          setAiInterlocutorText(" ");

          startIteration(audioBlob);

          audioChunks.length = 0;
        }
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecordingStoped(true);
      setRecording(false);
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const startIteration = async (audioBlob) => {
    console.log("audio size", audioBlob.size);
    setProcessing(true);
    const textFromUser = await convertVoiceToText(audioBlob);
    setUserText(textFromUser);
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
      audioRef.current = audio;

      audio.play();
      audio.addEventListener("ended", () => {
        setAiSpeaking(false);
        setRecordingStoped(false);

        setAiCorrectorText("");
      });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const cancelAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAiSpeaking(false);
      setRecordingStoped(false);

      setAiCorrectorText("");
    }
  };

  const handleListenToCorrection = (text) => {
    convertTextToVoice(text, language);
  };

  return (
    <>
      {recordingError && (
        <Alert
          text={
            "Audiofile empty! Press the recordbutton and hold it down to record your voice."
          }
          type={"fail"}
        />
      )}
      {loggedIn ? (
        <>
          <Steps step1={recording} step2={processing} step3={aiSpeaking} />
          <InputOutputFields
            userInput={userText}
            aiOutput={aiInterlocutorText}
          />
          {aiSpeaking ? (
            <VoiceAnimation
              pause_audio={pauseAudio}
              start_audio={startAudio}
              cancel_audio={cancelAudio}
            />
          ) : (
            <RecordingButton
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording} // Handle touch events on mobile devices
              onTouchEnd={stopRecording}
              disabled={recordingStoped}
            />
          )}

          <div>
            <HistoryButton
              historyVisible={historyVisible}
              onclick={handleHistoryButton}
            />
            {historyVisible && (
              <ChatHistory
                listenToCorrection={handleListenToCorrection}
                aiSpeaking={aiSpeaking}
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
