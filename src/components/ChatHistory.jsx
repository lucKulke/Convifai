import UserChatBubble from "./UserChatBubble";
import AiChatBubble from "./AiChatBubble";
function ChatHistory(props) {
  return (
    <div className="flex justify-center rounded-xl h-screen p-5 m-3 mt-[50px]">
      <ul className="space-y-20 lg:w-3/4 max-lg:w-full border-2 rounded-xl p-3">
        {props.history.map((section) => (
          <li className="flex bg-white justify-center">
            <div className="bg-white w-full">
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-accent font-mono  shadow-xl">
                  {section.user} <br />
                  {section.corrector}
                </div>
              </div>
              <div className="h-[10px] w-full"></div>
              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-accent font-mono shadow-xl">
                  {section.interlocutor}
                </div>
              </div>
              <UserChatBubble
                userText={section.user}
                correctorText={section.corrector}
              ></UserChatBubble>
              <AiChatBubble></AiChatBubble>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
