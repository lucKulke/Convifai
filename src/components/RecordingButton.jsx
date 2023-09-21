import { MdOutlineRecordVoiceOver } from "react-icons/md";
function RecordingButton() {
  return (
    <div className="w-full flex justify-center mt-10 mb-10 items-center">
      <button className="bg-yellow-500 hover:bg-yellow-400 rounded-full h-20 w-20 flex items-center justify-center active:animate-pulse active:ring-8 active:ring-white active:ring-of">
        <MdOutlineRecordVoiceOver className="h-8 w-8" />
      </button>
    </div>
  );
}

export default RecordingButton;
