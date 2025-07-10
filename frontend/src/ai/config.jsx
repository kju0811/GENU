import { createChatBotMessage } from "react-chatbot-kit";
import { chatHeader,chatButton } from "../components/chatCompnents";
import "../style/chat.css";

const config = {
  initialMessages: [
    createChatBotMessage(
      "안녕하세요! NURUNG2입니다😊"
    ),
  ],
  customComponents: {
    header: chatHeader
  },
};

export default config;