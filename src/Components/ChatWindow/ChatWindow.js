import React, { useState } from "react";
import "./ChatWindow.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  MoreVert,
  SearchOutlined,
  InsertEmoticon,
} from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import axios from "../../axios";

const ChatWindow = ({ messages }) => {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post("/messages/new", {
      message: input,
      name: "Usha",
      timeStamp: new Date().toUTCString(),
      received: true,
    });
    setInput("");
  };
  return (
    <div className="chatWindow">
      <div className="chatwindow_header">
        <Avatar />
        <div className="chatwindow_headerInfo">
          <h3>Room Name</h3>
          <p>Last Seen at....</p>
        </div>
        <div className="chatwindow_hearderRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chartwindow_body">
        {messages.map((message, key) => (
          <p
            key={key}
            className={`chat_message ${message.received && "chat_reciever"}`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_time">{message.timeStamp}</span>
          </p>
        ))}
      </div>

      <div className="chat_footer">
        <InsertEmoticon />
        <form>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage} type="submit">
            Send Message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default ChatWindow;
