import UserChatBubble from "./UserChatBubble";
import AiChatBubble from "./AiChatBubble";
function ChatHistory(props) {
  return (
    <div className="flex justify-center rounded-xl h-screen p-5 m-3 mt-[50px]">
      <ol className="space-y-20 max-md:w-full overflow-y-auto w-3/4 border-2 rounded-xl max-lg:p-3 p-10">
        {props.history.map((section, index) => (
          <li className="flex bg-white justify-center" key={index}>
            <div className="bg-white w-full">
              <UserChatBubble
                listenToCorrection={props.listenToCorrection}
                userText={section.user}
                aiSpeaking={props.aiSpeaking}
                correctorText={section.corrector}
              ></UserChatBubble>
              <AiChatBubble text={section.interlocutor}></AiChatBubble>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ChatHistory;
