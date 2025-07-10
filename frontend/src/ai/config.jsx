import { createChatBotMessage } from "react-chatbot-kit";
import chatHeader from "../components/chatHeader";
import "../style/chat.css";

const config = {
  initialMessages: [
    createChatBotMessage(
      "안녕하세요! 궁금한 내용을 입력해주세요."
    ),
  ],
  customComponents: {
    header: chatHeader
  },
};

export default config;