import UserChatBubble from "./UserChatBubble";
import AiChatBubble from "./AiChatBubble";
function ChatHistory(props) {
  return (
    <div className="flex justify-center rounded-xl h-screen p-5 m-3 mt-[50px]">
      <ul className="space-y-20 max-md:w-full w-3/4 border-2 rounded-xl max-lg:p-3 p-10">
        {props.history.map((section) => (
          <li className="flex bg-white justify-center">
            <div className="bg-white w-full">
              <UserChatBubble
                listenToCorrection={props.listenToCorrection}
                userText={section.user}
                correctorText={section.corrector}
              ></UserChatBubble>
              <AiChatBubble text={section.interlocutor}></AiChatBubble>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
