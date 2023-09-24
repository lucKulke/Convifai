import React from "react";

function SelectLanguage(props) {
  const handleSelectLanguage = (language) => {
    props.select(language);
    props.listVisible(false);
  };

  return (
    <div className="overflow-y-auto h-40 w-1/2 shadow-2xl rounded-lg ">
      <ul className="text-center space-y-3 pt-2">
        {props.languages.map((language) => (
          <li className="text-2xl font-mono">
            <button
              onClick={() => handleSelectLanguage(language)}
              className="hover:shadow-md hover:bg-blue-100 hover:rounded-xl hover:p-1 active:bg-blue-300 active:rounded-xl active:p-1"
            >
              {language}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectLanguage;
