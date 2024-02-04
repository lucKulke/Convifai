import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { IoIosArrowRoundDown } from "react-icons/io";
import InfoPing from "./InfoPing";
import { PiSpeakerNoneLight, PiSpeakerHighLight } from "react-icons/pi";

function InputOutputFields(props) {
  const [correctionNoticed, setCorrectionNoticed] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [listenToCorrection, setListenToCorrection] = useState(false);

  useEffect(() => {
    if (props.aiSpeaking) {
      setListenToCorrection(true);
    } else {
      setListenToCorrection(false);
    }
  }, [props.aiSpeaking]);

  const handleListenCorrectorText = () => {
    setListenToCorrection(true);
    props.handleListenToCorrection(props.correctorText);
  };

  const handleCorrectionRequest = () => {
    setCorrectionNoticed(true);
    setShowCorrection((prev) => !prev);
  };

  const correctionRequired = () => {
    const normalizeString = (str) =>
      str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    if (props.correctorText === "") {
      return false;
    }
    return (
      normalizeString(props.correctorText) != normalizeString(props.userInput)
    );
  };

  useEffect(() => {
    if (correctionRequired()) {
      setCorrectionNoticed(false);
      props.setCorrectionAvailable(true);
    } else {
      props.setCorrectionAvailable(false);
    }
  }, [props.correctorText]);

  return (
    <div className="w-full flex flex-col justify-between 2xl:h-[500px] lg:h-[330px] sm:h-[310px] max-sm:h-[350px]">
      <div className="flex w-full justify-center">
        <ul className="space-y-2 max-md:w-3/4 md:w-2/3 m-5 mt-10">
          <li>
            {props.correctionAvailable ? (
              <>
                <div className="relative">
                  <InfoPing
                    component={"InputField"}
                    noticed={correctionNoticed}
                  ></InfoPing>
                </div>
                <button
                  className={`border-2 border-gray-300 flex w-full p-3 rounded-xl shadow-lg min-h-[50px] ${
                    showCorrection && "bg-red-300"
                  }`}
                  onClick={handleCorrectionRequest}
                >
                  <div className="overflow-y-auto max-sm:max-h-24 sm:max-h-20 lg:max-h-24 2xl:max-h-28 ">
                    <p className="userInput">{props.userInput}</p>
                  </div>
                </button>
              </>
            ) : (
              <div className="border-2 border-gray-300 flex w-full p-3 rounded-xl shadow-lg min-h-[50px]">
                <div className="overflow-y-auto max-sm:max-h-24 sm:max-h-20 lg:max-h-24 2xl:max-h-28 ">
                  <p className="userInput">{props.userInput}</p>
                </div>
              </div>
            )}
          </li>
          <li>
            {showCorrection ? (
              <>
                <div className="relative">
                  <div className="absolute right-[-40px] top-[5px]">
                    <button
                      onClick={handleListenCorrectorText}
                      disabled={listenToCorrection}
                    >
                      {props.aiSpeaking ? (
                        <PiSpeakerHighLight className="h-10 w-10" />
                      ) : (
                        <PiSpeakerNoneLight className="h-10 w-10" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="border-2 flex border-gray-300 w-full p-3 rounded-xl shadow-lg min-h-[50px] bg-green-300 ">
                  <div className="overflow-y-auto max-sm:max-h-28 sm:max-h-24 lg:max-h-28 2xl:max-h-32">
                    <p className="aiOutput">{props.correctorText}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-2 flex border-gray-300 w-full p-3 rounded-xl shadow-lg min-h-[50px]">
                <div className="overflow-y-auto max-sm:max-h-28 sm:max-h-24 lg:max-h-28 2xl:max-h-32">
                  <p className="aiOutput">{props.aiOutput}</p>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
      {props.operationInstruction && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col justify-between">
            <p className="my-3 text-slate-700 text-sm">
              {isMobile
                ? "Press to start and again to stop the recording."
                : "Hold the button to record your voice."}
            </p>
            <div className="flex justify-center">
              <IoIosArrowRoundDown className="h-8 w-8 animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputOutputFields;
