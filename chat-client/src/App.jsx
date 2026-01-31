import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import "./App.css"

const socket = io("http://localhost:3000")

function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, { text: message, self: false }])
    })

    return () => socket.off("receive-message")
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    socket.emit("send-message", newMessage)
    setMessages((prev) => [...prev, { text: newMessage, self: true }])
    setNewMessage("")
  }

  return (
    <div className="chat-container">
      <h2 className="title">💬 Real-Time Chat App</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.self ? "my-message" : "other-message"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App
