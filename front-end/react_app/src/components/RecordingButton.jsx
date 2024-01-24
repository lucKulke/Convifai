import { MdOutlineRecordVoiceOver } from "react-icons/md";
function RecordingButton(props) {
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the context menu from appearing
  };
  return (
    <div className="w-full flex justify-center mt-2 mb-2 items-center">
      <button
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onTouchStart={props.onTouchStart}
        onContextMenu={handleContextMenu} // Handle touch events on mobile devices
        onTouchEnd={props.onTouchEnd}
        disabled={props.disabled}
        className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-400 rounded-full h-20 w-20 flex items-center justify-center active:animate-pulse active:ring-8 active:ring-white shadow-xl"
      >
        <MdOutlineRecordVoiceOver className="h-8 w-8" />
      </button>
    </div>
  );
}

export default RecordingButton;
