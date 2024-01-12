import { createContext, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const jwt = require("jsonwebtoken");

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const fetchChats = async (recipient) => {
    const userToken = await AsyncStorage.getItem("jwtToken");
    const decodedToken = jwt.decode(userToken);
    const senderId = decodedToken ? decodedToken.id : null;
    const response = await axios.get(
      `http://10.194.65.23:9000/api/v1/chat/${senderId}/${recipient}`
    );
    setChats(response.data);
  };

  const sendChat = async (recipient, chatType, chat, role) => {
    const _id = await SecureStorage.getItemAsync("id");
    console.log(recipient, chat, role, _id);

    try {
      const response = await axios.post(
        `http://10.194.65.39:8000/portal/chat`,
        {
          sender: _id,
          recipient,
          chatType: "text",
          chat,
          role,
        }
      );
      return response;
    } catch (e) {
      return { error: true, chat: e.response.data.chat };
    }
  };

  const fetchMyIntern = async (recipient) => {
    const sender = await SecureStorage.getItemAsync("id");
    const response = await axios.get(
      `http://10.194.65.39:8000/portal/company/user/${sender}/`
    );
    console.log("Intern");
    setMyIntern(response.data);
  };
  const fetchMyCompany = async (recipient) => {
    const id = await SecureStorage.getItemAsync("id");

    const response = await axios.get(
      `http://10.194.65.39:8000/portal/user/company/${id}/`
    );

    setMyCompany(response.data);
  };

  const valueToShare = {
    chats,
    sendChat,
    fetchChats,
    fetchMyIntern,
    fetchMyCompany,
    myIntern,
    myCompany,
  };

  return (
    <ChatContext.Provider value={valueToShare}>{children}</ChatContext.Provider>
  );
};

export { ChatProvider };

export default ChatContext;
