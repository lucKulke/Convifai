import Card from "../components/Card";
import AddNewConversationButton from "../components/AddNewConversationButton";
import { useState } from "react";

function ConversationList() {
  const languages = [
    "English",
    "Spain",
    "German",
    "France",
    "Ruski",
    "test",
    "dasdf",
    "dasfdfd",
  ];

  const [conversations, setConversations] = useState([
    {
      title: "Talk about cars",
      language: languages[0],
      id: getRandomInt(1, 1000),
    },
    {
      title: "Ai techonlogy",
      language: languages[0],
      id: getRandomInt(1, 1000),
    },
    {
      title: "Nächster Urlaub",
      language: languages[2],
      id: getRandomInt(1, 1000),
    },
  ]);

  const handleSelectLanguage = (language) => {
    addConversation(language);
    console.log(language);
  };

  const addConversation = (language) => {
    const newConversation = {
      title: "New Conversation",
      language: language,
      id: getRandomInt(1, 1000),
    };
    const newArray = [...conversations, newConversation];
    setConversations(newArray);
  };

  const deleteConversation = (id) => {
    console.log("in delete");
    const newArray = arrayRemoveElementById([...conversations], id);
    setConversations(newArray);
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function arrayRemoveElementById(arr, id) {
    return arr.filter(function (conversation) {
      return conversation.id != id;
    });
  }

  return (
    <section className="max-container">
      <ul className="my-[150px] grid grid-cols-3 content-center gap-10 m-3 max-middle:grid-cols-2 max-sm:grid-cols-1">
        {conversations.map((conversation) => (
          <Card
            id={conversation.id}
            delete={deleteConversation}
            title={conversation.title}
            language={conversation.language}
          />
        ))}
        <AddNewConversationButton
          selectLanguage={handleSelectLanguage}
          languages={languages}
        />
      </ul>
    </section>
  );
}

export default ConversationList;
