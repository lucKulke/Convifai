import Card from "../components/Card";
import AddNewConversationButton from "../components/AddNewConversationButton";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import DataProvider from "../functions/DataProvider";
import { Navigate } from "react-router-dom";

function ConversationList(props) {
  useEffect(() => {
    if (props.loggedIn) {
      setConversations(DataProvider.fetch_conversation_data());
      setLanguages(DataProvider.fetch_available_languages());
    }
  }, []);

  const [alert, setAlert] = useState(false);
  const [conversationsChanged, setConversationsChanged] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (conversationsChanged) {
      setAlert(true);

      setTimeout(() => {
        setAlert(false);
        setConversationsChanged(null);
      }, 5000);
    }
  }, [conversationsChanged]);

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
    setConversationsChanged("created");
  };

  const deleteConversation = (id) => {
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
    <>
      {!props.loggedIn && <Navigate to="/login" />}
      <section className="max-container">
        <div className="flex justify-center w-full">
          <div
            className={`${
              alert ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 ease-in-out fixed top-0 z-50 p-4`}
          >
            <Alert
              text={`Conversation was ${conversationsChanged} successfully!`}
            ></Alert>
          </div>
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
    </>
  );
}

export default ConversationList;
