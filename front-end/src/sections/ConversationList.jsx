import Card from "../components/Card";
import AddNewConversationButton from "../components/AddNewConversationButton";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import DataProvider from "../functions/DataProvider";
import { Navigate } from "react-router-dom";

function ConversationList(props) {
  useEffect(() => {
    if (props.loggedIn) {
      DataProvider.fetch_conversations_data()
        .then((data) => {
          setConversations(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      DataProvider.fetch_available_languages()
        .then((data) => {
          setLanguages(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
    const title = "New Conversation";
    const picture = "/images/robot.png";
    DataProvider.create_conversation(language, title, picture)
      .then((id) => {
        const newConversation = {
          language: language,
          title: title,
          picture: picture,
          id: id,
        };
        const newArray = [...conversations, newConversation];
        setConversations(newArray);
        setConversationsChanged("created");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteConversation = (conversation_id) => {
    DataProvider.delete_conversation(conversation_id)
      .then((response) => {
        if (response === true) {
          console.log("delete");
          const newArray = arrayRemoveElementById(
            [...conversations],
            conversation_id
          );
          setConversations(newArray);
          setConversationsChanged("deleted");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
