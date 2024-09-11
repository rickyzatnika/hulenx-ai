"use client";

import React, { createContext, useContext, useState } from "react";

const ChatListContext = createContext();

export const ChatListProvider = ({ children }) => {
  const [isChatListVisible, setChatListVisible] = useState(false);

  const toggleChatList = () => {
    setChatListVisible((prev) => !prev);
  };

  return (
    <ChatListContext.Provider
      value={{ isChatListVisible, toggleChatList, setChatListVisible }}
    >
      {children}
    </ChatListContext.Provider>
  );
};

export const useChatList = () => useContext(ChatListContext);
