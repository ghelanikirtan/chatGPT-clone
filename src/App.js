import chatgpt from "./chatgpt.png";
import "./normal.css";
import "./App.css";
import { useState } from "react";

function App() {
  // adding state for input and chat log
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you Today?",
    },
    {
      user: "me",
      message: "I want to use chatGPT today",
    },
  ]);

  // clear chats
  function clearChats() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log("submit");
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    // await setChatLog([...chatLog, { user: "me", message: `${input}` }]);
    await setInput("");
    setChatLog(chatLogNew);

    // Fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3000 as a post
    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    console.log(data.message);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChats}>
          <span>+</span>
          New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user == "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user == "gpt" && "chatgpt"}`}>
          {message.user == "gpt" && <img src={chatgpt} alt="chatgpt" />}
        </div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};
