import { useEffect, useState } from "react";
import Home from "./sections/Home";
import Navbar from "./components/Navbar";
import ConversationList from "./sections/ConversationList";
import Conversation from "./sections/Conversation";
import Login from "./sections/Login";
import { Routes, Route } from "react-router-dom";
import DataProvider from "./functions/DataProvider";
import SignUp from "./sections/SignUp";
import About from "./sections/About";

function App() {
  useEffect(() => {
    DataProvider.check_login_status()
      .then((loggedIn) => {
        setLoggedIn(loggedIn);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="bg-white">
      <main className="relative max-container">
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/conversation/:id"
            element={<Conversation loggedIn={loggedIn} />}
          />
          <Route
            path="/conversations"
            element={<ConversationList loggedIn={loggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
          />
          <Route
            path="/sign_up"
            element={<SignUp setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
          />
          <Route path="/about-me" element={<About />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
