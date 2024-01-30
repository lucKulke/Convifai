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
import CookieConsent from "react-cookie-consent";
import Impressum from "./sections/Impressum";
import AuthPage from "./sections/AuthPage";

function App() {
  const [globalAuth, setGlobalAuth] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    DataProvider.global_authentication_status()
      .then((auth_status) => {
        setGlobalAuth(auth_status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    if (globalAuth) {
      DataProvider.check_login_status()
        .then((loggedIn) => {
          setLoggedIn(loggedIn);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [globalAuth]);

  return (
    <>
      {globalAuth ? (
        <main className="relative max-container">
          <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            {loggedIn && (
              <>
                <Route
                  path="/conversation/:id"
                  element={<Conversation loggedIn={loggedIn} />}
                />
                <Route
                  path="/conversations"
                  element={<ConversationList loggedIn={loggedIn} />}
                />
              </>
            )}
            <Route path="/about-me" element={<About />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route
              path="/login"
              element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
            />
            <Route
              path="/sign_up"
              element={<SignUp setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
            />
            <Route
              path="*"
              element={
                <h1 className="mt-10 ml-10">
                  Not Found. Please ensure that you are logged in.
                </h1>
              }
            />
          </Routes>
          <CookieConsent>
            This website only uses technically necessary cookies.
          </CookieConsent>
        </main>
      ) : (
        <AuthPage setGlobalAuth={setGlobalAuth} />
      )}
    </>
  );
}

export default App;
