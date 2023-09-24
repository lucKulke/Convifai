import Card from "../components/Card";
import AddNewConversationButton from "../components/AddNewConversationButton";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";

function ConversationList() {
  const [alert, setAlert] = useState(false);
  const [conversationsChanged, setConversationsChanged] = useState(null);

  useEffect(() => {
    if (conversationsChanged) {
      setAlert(true);

      setTimeout(() => {
        setAlert(false);
        setConversationsChanged(null);
      }, 5000);
    }
  }, [conversationsChanged]);

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

  const addConversation = async (language) => {
    const newConversation = {
      title: "New Conversation",
      language: language,
      id: getRandomInt(1, 1000),
    };
    const newArray = [...conversations, newConversation];
    setConversations(newArray);
    setConversationsChanged("created");
  };

  const deleteConversation = (id) => {
    console.log("in delete");
    const newArray = arrayRemoveElementById([...conversations], id);
    setConversations(newArray);
    setConversationsChanged("deleted");
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
      <div
        className={`${
          alert ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-300 ease-in-out fixed top-0 z-50 w-3/4 p-4`}
      >
        <Alert
          text={`Conversation was ${conversationsChanged} successfully!`}
        ></Alert>
      </div>

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
