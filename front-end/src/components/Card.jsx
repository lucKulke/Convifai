import robot from "../assets/images/robot.png";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoMdChatboxes } from "react-icons/io";
import { Link } from "react-router-dom";
import Conversation from "../sections/Conversation";
import { useEffect, useState } from "react";
import picture_loading from "../assets/images/picture_loading.gif";
export default function Card(props) {
  const [picture, setPicture] = useState(props.picture);
  const [pictureUpdateable, setPictureUpdateable] = useState(
    props.picture_updateable
  );
  const [titleUpdateable, setTitleUpdateable] = useState(
    props.title_updateable
  );
  const [title, setTitle] = useState(props.title);

  const newPicture = async (conversation_id, text) => {
    setPictureUpdateable(2);
    const newUrl = await props.refreshPicture(conversation_id, text);
    setPicture(newUrl);
    console.log("picture updated");
    setPictureUpdateable(0);
  };

  const creatingNewTitle = async (conversation_id) => {
    setTitleUpdateable(2);

    const title = await props.update_title(conversation_id);
    setTitle(title);
    console.log("title updated", title);
    setTitleUpdateable(0);
  };

  useEffect(() => {
    if (titleUpdateable === 1) {
      creatingNewTitle(props.id);
    }
  }, [titleUpdateable]);

  return (
    <div className="flex justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          {pictureUpdateable == 2 ? (
            <img src={picture_loading} alt="gif" />
          ) : (
            <img
              src={`${import.meta.env.VITE_BACKEND_URI}/images/${picture}`}
              alt="picture"
            />
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title">{props.language}</h2>
          {titleUpdateable == 2 && (
            <div className="flex justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {titleUpdateable == 0 && <p className="mb-10">{title}</p>}
          <div className="flex justify-between">
            <div className="w-1/3  h-10 flex justify-start">
              <Link to={`/conversation/${props.id}`}>
                <button>
                  <IoMdChatboxes className="h-8 w-8 hover:w-9 hover:h-9" />
                </button>
              </Link>
            </div>
            {pictureUpdateable == 1 && (
              <div className="w-1/3 h-10 flex justify-center">
                <button onClick={() => newPicture(props.id, props.title)}>
                  <HiOutlineRefresh className="h-8 w-8 hover:w-9 hover:h-9" />
                </button>
              </div>
            )}
            <div className="w-1/3 h-10 flex justify-end">
              <button onClick={() => props.delete(props.id)}>
                <AiFillDelete className="h-8 w-8 hover:w-9 hover:h-9" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
