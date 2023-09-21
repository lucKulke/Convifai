import { useState } from "react";
import Home from "./sections/Home";
import Navbar from "./components/Navbar";
import ConversationList from "./sections/ConversationList";
import Conversation from "./sections/Conversation";
import Login from "./sections/Login";

function App() {
  return (
    <main className="relative max-container">
      <Navbar />
      {/* <Conversation /> */}
      <Login></Login>
    </main>
  );
}

export default App;
