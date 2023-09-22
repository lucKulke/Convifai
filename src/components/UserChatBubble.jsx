import UserPicture from "../assets/images/user.png";
function UserChatBubble(props) {
  return (
    <div class="chat chat-start">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src={UserPicture} />
        </div>
      </div>
      <div class="chat-bubble font-mono">
        {props.userText} <br />
        {props.correctorText}
      </div>
    </div>
  );
}

export default UserChatBubble;
