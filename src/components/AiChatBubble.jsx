import aiPicture from "../assets/images/robot.png";
function AiChatBubble(props) {
  return (
    <div class="chat chat-end">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src={aiPicture} alt="ai" />
        </div>
      </div>
      <div class="chat-bubble font-mono">{props.aiText}</div>
    </div>
  );
}

export default AiChatBubble;
