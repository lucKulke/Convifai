function InputOutputFields(props) {
  return (
    <div className="flex w-full justify-center min-h-[450px] max-xl:min-h-[400] max-sm:min-h-[300px] ">
      <ul className="space-y-2 max-md:w-3/4 md:w-2/3 m-5 mt-10">
        <div className="border-2 border-gray-300 w-full p-3 rounded-xl shadow-lg min-h-[50px]">
          <p className="userInput">{props.userInput}</p>
        </div>
        <div className="border-2 border-gray-300 w-full p-3 rounded-xl shadow-lg min-h-[50px]">
          <p className="aiOutput">{props.aiOutput}</p>
        </div>
      </ul>
    </div>
  );
}

export default InputOutputFields;
