import { useEffect, useState } from "react";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { IoPlayOutline } from "react-icons/io5";
import { isMobile } from "react-device-detect";
function RecordingButton(props) {
  const [mobileDevice, setMobileDevice] = useState(isMobile);
  const [recording, setRecording] = useState(false);
  const checkRecordingPermissionStatus = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone",
    });
    if (permissionStatus.state === "granted") {
      props.setPermissionGranted(true);
    } else {
      props.setPermissionGranted(false);
    }
  };

  const handleRequestRecordingPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      console.log("Recording permission granted");
      props.setPermissionGranted(true);
    } catch (error) {
      console.error("Recording permission denied");
      props.setPermissionGranted(false);
    }
  };

  const handleRecordButtonOnMobile = () => {
    setRecording(!recording);
    if (recording) {
      props.onMouseUp();
    } else {
      props.onMouseDown();
    }
  };

  useEffect(() => {
    checkRecordingPermissionStatus();
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    // Prevent the context menu from appearing
  };
  const playAudio = () => {
    props.playAudio(props.audioReady);
  };

  return (
    <div className="w-full flex justify-center mt-2 mb-2 items-center">
      {props.permissionGranted ? (
        <>
          {mobileDevice ? (
            <>
              {props.audioReady ? (
                <button
                  onTouchEnd={playAudio}
                  onContextMenu={handleContextMenu} // Handle touch events on mobile devices
                  className={`bg-green-600 rounded-full h-20 w-20 flex items-center justify-center shadow-xl active:ring-white active:ring-8 border-2`}
                >
                  <IoPlayOutline className="h-10 w-10" />
                </button>
              ) : (
                <button
                  onTouchStart={handleRecordButtonOnMobile}
                  onContextMenu={handleContextMenu} // Handle touch events on mobile devices
                  disabled={props.disabled}
                  className={`${
                    recording ? "bg-red-500 animate-pulse" : "bg-yellow-500"
                  } disabled:bg-gray-400 rounded-full h-20 w-20 flex items-center justify-center shadow-xl`}
                >
                  <MdOutlineRecordVoiceOver className="h-8 w-8" />
                </button>
              )}
            </>
          ) : (
            <button
              onMouseDown={props.onMouseDown}
              onMouseUp={props.onMouseUp}
              onContextMenu={handleContextMenu} // Handle touch events on mobile devices
              disabled={props.disabled}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-400 rounded-full h-20 w-20 flex items-center justify-center active:animate-pulse active:ring-8 active:bg-red-500 active:ring-white shadow-xl"
            >
              <MdOutlineRecordVoiceOver className="h-8 w-8" />
            </button>
          )}
        </>
      ) : (
        <button
          onClick={handleRequestRecordingPermission} // Request permission on button
          className=" border-black border-2 bg-blue-300 hover:bg-blue-200 animate-pulse
          px-4 py-2 rounded-xl"
        >
          Click me to grant mic permissions!
        </button>
      )}
    </div>
  );
}

export default RecordingButton;
