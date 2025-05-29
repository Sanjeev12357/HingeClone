import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket';

let socket;

const Chat = () => {
  const { connectionId } = useParams();
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
      room: connectionId,
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
    <div className="w-screen h-screen flex flex-col bg-[#0b0b0f] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111113] to-[#1a1a1d] text-white text-center py-4 font-semibold text-xl tracking-wide shadow-md border-b border-[#222]">
        💬 Chat
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#0f0f14]">
        {messages.map((msg, index) => {
          const isUser = msg.sender?.toString() === userId?.toString();
          return (
            <div
              key={index}
              className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                isUser
                  ? 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white self-end ml-auto'
                  : msg.sender === 'system'
                  ? 'bg-[#1e1e22] text-gray-400 italic self-center text-center'
                  : 'bg-[#22242a] text-white self-start'
              }`}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#0b0b0f] border-t border-[#1a1a1d] flex items-center gap-3">
        <input
          type="text"
          className="flex-1 bg-[#1a1a1d] text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-2 rounded-full transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
