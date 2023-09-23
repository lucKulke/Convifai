import Card from "../components/Card";
import { GrAdd } from "react-icons/gr";
function ConversationList() {
  return (
    <section className="max-container">
      <ul className="my-[150px] grid grid-cols-3 gap-10 m-3 max-middle:grid-cols-2 max-sm:grid-cols-1">
        <Card />
        <Card />
        <Card />
        <Card />
      </ul>
      <div className="flex justify-center items-center mb-10">
        <button className="bg-yellow-500 hover:bg-yellow-400 flex active:bg-yellow-500 shadow-xl rounded-full h-16 w-16 justify-center items-center">
          <GrAdd className="h-10 w-10" />
        </button>
      </div>
    </section>
  );
}

export default ConversationList;
