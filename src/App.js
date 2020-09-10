import React, { useEffect, useState } from "react";
import SideBar from "./Components/SideBar/SideBar";
import ChatWindow from "./Components/ChatWindow/ChatWindow";
import Pusher from "pusher-js";
import axios from "./axios";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      console.log(response.data);
      setMessages(response.data);
    });
  }, []);
  useEffect(() => {
    const pusher = new Pusher("51971f6645c528acd3d2", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="app">
      <div className="whatsapp-body">
        <SideBar />
        <ChatWindow messages={messages} />
      </div>
    </div>
  );
}

export default App;
