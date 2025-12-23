'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { CardContent, CardHeader } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import axiosInstance from '../../lib/axiosInstance';
import useWebSocket from '../../hooks/useWebSocket';
import useStore from '../../lib/Zustand';

export type User = {
  user_id: string;
  username: string;
};

export type Message = {
  message_id: string;
  user_ref_id: string;
  username: string;
  description: string;
  tstamp: string;
};

/* ------------------- ChatSidebar ------------------- */
const ChatSidebar = ({
  onChatSelect,
}: {
  onChatSelect: (user: User) => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/admin-user-details/');
        console.log('API Response:', response.data); // Debugging

        // Remove status_code check if it's not present in API response
        if (response.data.user_details) {
          const fetchedUsers = response.data.user_details.map(
            (user: { user_id: string; username: string }) => ({
              user_id: user.user_id,
              username: user.username,
            })
          );
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-r rounded-lg border-gray-300 dark:bg-gray-800 bg-white p-4 h-full">
      <h2 className="text-lg font-bold mb-3">All Chats</h2>
      <Input
        placeholder="Search ..."
        className="max-w-sm mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h3 className="font-semibold mb-2">Users</h3>
      <div className="flex flex-col space-y-2 overflow-y-auto h-[65vh] scrollbar-hide">
        {filteredUsers.map((user) => (
          <div
            key={user.user_id}
            className="flex justify-between items-center p-2 border-b border-gray-200 cursor-pointer"
            onClick={() => onChatSelect(user)}
          >
            <div className="flex items-center">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={user.username}
                />
              </Avatar>
              <div>
                <span className="font-medium">{user.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------- ChatArea ------------------- */
const ChatArea = ({
  selectedChat,
  onBack,
}: {
  selectedChat: User;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const userId = useStore((state) => state.userId);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const fetchChatId = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const response = await axiosInstance.get(
        `/chat/api/v1/get_chat_id/?sender=${userId}&receiver=${selectedChat.user_id}`
      );
      if (response.data.status_code === 200) {
        setChatId(response.data.chat_id);
      }
    } catch (error) {
      console.error('Error fetching chat ID:', error);
    }
  }, [selectedChat]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;

    try {
      const response = await axiosInstance.get(
        `/chat/api/v1/get_messages/${chatId}`
      );
      if (response.data.status_code === 200) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChatId();
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const { sendMessage } = useWebSocket(chatId ?? '', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  const handleSendMessage = async () => {
    if (!chatId || !newMessage.trim()) return;

    const messageData = {
      sender_id: userId,
      receiver_id: selectedChat.user_id,
      description: newMessage,
    };

    try {
      const response = await axiosInstance.post(
        '/chat/api/v1/send_message/',
        messageData
      );
      if (response.data.status_code === 200) {
        sendMessage({
          chat_id: response.data.chat_id,
          user_ref_id: selectedChat.user_id,
          description: newMessage,
          username: selectedChat.username,
        });
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Button variant="outline" className="mb-2" onClick={onBack}>
        Back
      </Button>
      <div className="flex-1 flex flex-col p-2 dark:bg-gray-800 bg-white rounded-lg h-full">
        <div className="flex-grow flex flex-col overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-bold flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User Avatar"
                  />
                </Avatar>
                <div>{selectedChat.username}</div>
              </h2>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="flex-grow overflow-hidden">
            <div className="overflow-y-auto h-full">
              {messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`my-2 ${msg.user_ref_id === selectedChat.user_id ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.user_ref_id === selectedChat.user_id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <p>{msg.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {formatTime(msg.tstamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          />
          <Button onClick={handleSendMessage} className="ml-2">
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

/* ------------------- ChatComponent ------------------- */
const ChatComponent = () => {
  const [selectedChat, setSelectedChat] = useState<User | null>(null);

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-4 h-full">
        <ChatSidebar onChatSelect={setSelectedChat} />
      </div>
      <div className="col-span-8 h-full flex flex-col">
        {selectedChat ? (
          <ChatArea
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex items-center justify-center text-gray-500 h-full">
            <p>Select a chat to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
