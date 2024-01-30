import Card from "../components/Card";
import AddNewConversationButton from "../components/AddNewConversationButton";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import DataProvider from "../functions/DataProvider";

import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ConversationList(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.loggedIn) {
      DataProvider.fetch_conversations_data()
        .then((data) => {
          setConversations(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          return redirect("/login");
        });

      DataProvider.fetch_available_languages()
        .then((data) => {
          setLanguages(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          return redirect("/login");
        });
    } else {
      return redirect("/login");
    }
  }, [props.loggedIn, navigate]);

  if (!props.loggedIn) {
    return <p>Redirecting to login page...</p>;
  }

  const [alert, setAlert] = useState(false);
  const [conversationListChanged, setConversationListChanged] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (conversationListChanged) {
      setAlert(true);

      setTimeout(() => {
        setAlert(false);
        setConversationListChanged(null);
      }, 5000);
    }
  }, [conversationListChanged]);

  const handleSelectLanguage = (language) => {
    addConversation(language);
  };

  const addConversation = (language) => {
    const title = "New Conversation";
    const picture = "conversation_default.png";
    DataProvider.create_conversation(language, title, picture)
      .then((id) => {
        const newConversation = {
          language: language,
          title: title,
          title_updateable: 0,
          picture: picture,
          picture_updateable: 0,
          id: id,
        };
        const newArray = [...conversations, newConversation];
        setConversations(newArray);

        setConversationListChanged("created");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteConversation = (conversation_id) => {
    DataProvider.delete_conversation(conversation_id)
      .then((response) => {
        if (response === true) {
          const newArray = arrayRemoveElementById(
            conversations,
            conversation_id
          );
          setConversations(newArray);

          setConversationListChanged("deleted");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function arrayRemoveElementById(arr, id) {
    return arr.filter(function (conversation) {
      return conversation.id != id;
    });
  }

  const refreshConversationPicture = async (conversation_id) => {
    const newUrl = await DataProvider.update_conversation_picture(
      conversation_id
    );

    return newUrl;
  };
  const updateTitle = async (conversation_id) => {
    const newTitle = await DataProvider.update_conversation_title(
      conversation_id
    );
    return newTitle;
  };

  return (
    <>
      <section className="max-container">
        <div className="flex justify-center w-full">
          <div
            className={`${
              alert ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-300 ease-in-out fixed top-0 z-50 p-4`}
          >
            <Alert
              text={`Conversation was ${conversationListChanged} successfully!`}
            ></Alert>
          </div>
        </div>

        <ul className="my-[150px] grid grid-cols-3 content-center gap-10 m-3 max-middle:grid-cols-2 max-sm:grid-cols-1">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              id={conversation.id}
              delete={deleteConversation}
              title={conversation.title}
              title_updateable={conversation.title_updateable}
              language={conversation.language}
              picture={conversation.picture}
              picture_updateable={conversation.picture_updateable}
              refreshPicture={refreshConversationPicture}
              update_title={updateTitle}
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
