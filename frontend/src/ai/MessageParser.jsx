import { getIP } from "../components/Tool";

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }
  parse(message) {
    console.log(message);
    const jwt = sessionStorage.getItem('jwt');
    if (message.trim() != "") {
    localStorage.setItem("chat_messages",message);
    fetch(`http://${getIP()}:9093/chatbot/talk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : jwt
      },
      body: JSON.stringify( message ),
    })
    .then((response) => response.json())
    .then((data) => {
      const answer = data.res || "서버가 불안정해요";  // res는 서버가 보내주는 응답 키
      const botMessage = this.actionProvider.createChatbotMessage(answer);
      this.actionProvider.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
      localStorage.setItem("chat_messages",JSON.stringify(botMessage));
    })
  } else {
    const userMessage = this.actionProvider.createClientMessage();
  }
  }
}

export default MessageParser;