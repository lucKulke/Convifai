import { AiOutlineCheckCircle } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import SelectLanguage from "./SelectLanguage";
import { useState } from "react";

function AddNewConversationButton(props) {
  const [languageListVisible, setLanguageListVisible] = useState(false);

  const handleAddNewConversation = () => {
    setLanguageListVisible(true);
  };

  return (
    <ul className="h-[548px] mb-10 justify-center">
      <li className="w-full flex items-center justify-center h-1/2 p-2">
        {languageListVisible && (
          <SelectLanguage
            listVisible={setLanguageListVisible}
            languages={props.languages}
            select={props.selectLanguage}
          />
        )}
      </li>
      <li className="w-full flex justify-center">
        <button
          disabled={languageListVisible}
          onClick={() => handleAddNewConversation()}
          className="bg-yellow-500 disabled:bg-gray-400 hover:bg-yellow-400 flex active:bg-yellow-500 shadow-xl rounded-full h-16 w-16 justify-center items-center"
        >
          <GrAdd className="h-10 w-10" />
        </button>
      </li>
    </ul>
  );
}

export default AddNewConversationButton;
