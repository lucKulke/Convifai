import aiPicture from "../assets/images/ai_profile_pic.png";
function AiChatBubble(props) {
  return (
    <div className="w-full flex justify-end">
      <button className="border-2 max-w-3/4 border-gray-300 shadow-xl rounded-2xl p-3">
        <p className="font-mono text-left">{props.text}</p>
      </button>
      <div className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-xl ml-3">
        <img className="p-2" src={aiPicture} alt="" />
      </div>
    </div>
  );
}

export default AiChatBubble;
