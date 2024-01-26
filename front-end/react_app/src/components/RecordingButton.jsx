import { useEffect, useRef, useState } from "react";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
function RecordingButton(props) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const buttonRef = useRef(null);

  const handleRecordingPermissionStatus = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone",
    });
    if (permissionStatus.state === "granted") {
      setPermissionGranted(true);
    } else {
      setPermissionGranted(false);
    }
  };

  const handleRequestRecordingPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      console.log("Recording permission granted");
      setPermissionGranted(true);
    } catch (error) {
      console.error("Recording permission denied");
      setPermissionGranted(false);
    }
  };

  useEffect(() => {
    handleRecordingPermissionStatus();
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const button = buttonRef.current;

    if (button) {
      const onTouchStart = (e) => {
        e.preventDefault();
        props.onTouchStart(e);
      };

      const onTouchEnd = (e) => {
        e.preventDefault();
        props.onTouchEnd(e);
      };

      const onTouchMove = (e) => {
        e.preventDefault();
      };

      button.addEventListener("touchstart", onTouchStart, { passive: false });
      button.addEventListener("touchend", onTouchEnd, { passive: false });
      button.addEventListener("touchmove", onTouchMove, { passive: false });

      return () => {
        button.removeEventListener("touchstart", onTouchStart);
        button.removeEventListener("touchend", onTouchEnd);
        button.removeEventListener("touchmove", onTouchMove);
      };
    }
  }, [props, buttonRef.current]);

  return (
    <div className="w-full flex justify-center mt-2 mb-2 items-center">
      {permissionGranted ? (
        <button
          ref={buttonRef}
          id={"recordingButton"}
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          onContextMenu={handleContextMenu} // Handle touch events (context menu) on chrome dev mobile view
          disabled={props.disabled}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-400 rounded-full h-20 w-20 flex items-center justify-center active:animate-pulse active:ring-8 active:ring-white shadow-xl"
        >
          <MdOutlineRecordVoiceOver className="h-8 w-8" />
        </button>
      ) : (
        <button
          onClick={handleRequestRecordingPermission} // Request permission on button
          click
          disabled={permissionGranted}
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
