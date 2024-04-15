import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState();
  const history = useHistory();




  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    const profileInfo = JSON.parse(localStorage.getItem("profile"));
    setProfile(profileInfo);



    if (!userInfo){
      history.push("/");
    }else{
      if (!profileInfo){
        history.push("/profileCreate")
      }
    }
    
    
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  



  return (
    <ChatContext.Provider
      value={{
        user,setUser,selectedChat, setSelectedChat,chats,setChats,profile, setProfile
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;