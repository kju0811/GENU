import { createChatBotMessage } from "react-chatbot-kit";
import { chatHeader,botImg,loadSessionMessages } from "../components/chatCompnents";
import "../style/chat.css";

const loadedMessages = loadSessionMessages();

const config = {
  initialMessages: [
    createChatBotMessage(
     "안녕하세요! NURUNG2입니다!! 응답까지 2~3초이상 소요 될수있으니 잠시만 기다려주세요😊"
    ),
  ],
  customComponents: {
    header: chatHeader,
    botAvatar: botImg
  },
};

export default config;