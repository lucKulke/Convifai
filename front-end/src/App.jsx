import { useState } from "react";
import Home from "./sections/Home";
import Navbar from "./components/Navbar";
import ConversationList from "./sections/ConversationList";
import Conversation from "./sections/Conversation";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <main className="relative max-container">
      <Navbar />
      {/* <Conversation /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversation/:id" element={<Conversation />} />
        <Route path="/conversations" element={<ConversationList />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </main>
  );
}

export default App;
