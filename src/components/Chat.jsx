import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket';

let socket;

const Chat = () => {
  const { connectionId } = useParams(); // ✅ connection._id from URL
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([
    {
      text: 'Welcome to the chat! How can I assist you today?',
      sender: 'system',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!userId || !connectionId) return;

    socket = createSocketConnection();

    socket.emit('joinChat', {
      room: connectionId, // ✅ use connection._id as room
      userId,
      firstName: user?.firstName,
    });

    socket.on('messageReceived', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userJoined', ({ firstName }) => {
      setMessages((prev) => [
        ...prev,
        {
          text: `${firstName} joined the chat.`,
          sender: 'system',
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, connectionId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: userId,
      text: newMessage,
    };

    socket.emit('sendMessage', {
      room: connectionId,
      message,
    });

    setNewMessage('');
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900">
      <div className="bg-indigo-600 text-white text-center py-4 font-semibold text-lg shadow-md">
        💬 Chat
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-800 text-white">
        {messages.map((msg, index) => {
          const isUser = msg.sender?.toString() === userId?.toString();
          return (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-2 rounded-xl break-words ${
                isUser
                  ? 'bg-blue-600 self-end ml-auto'
                  : 'bg-gray-700 self-start'
              }`}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
