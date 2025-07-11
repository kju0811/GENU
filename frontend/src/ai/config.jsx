import { createChatBotMessage } from "react-chatbot-kit";
import { chatHeader,chatButton,botImg } from "../components/chatCompnents";
import "../style/chat.css";

const config = {
  initialMessages: [
    createChatBotMessage(
      "안녕하세요! NURUNG2입니다😊"
    ),
  ],
  customComponents: {
    header: chatHeader,
    botAvatar: botImg
  },
};

export default config;