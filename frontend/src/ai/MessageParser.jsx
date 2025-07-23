import { getIP } from "../components/Tool";

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }
  parse(message) {
    const jwt = sessionStorage.getItem('jwt');
    if (message.trim() != "") {
        // 기존 유저 메시지들 가져오기 (없으면 빈 배열)
        const existingUserMessages = JSON.parse(sessionStorage.getItem("user") || "[]");
        // 새 메시지를 기존 배열에 추가
        const updatedUserMessages = [...existingUserMessages, message];
        // 업데이트된 배열을 다시 저장
        sessionStorage.setItem("user", JSON.stringify(updatedUserMessages));
        
        fetch(`http://${getIP()}:9093/chatbot/talk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(message),
        })
        .then((response) => response.json())
        .then((data) => {
            const answer = data.res || "서버가 불안정해요";
            const botMessage = this.actionProvider.createChatbotMessage(answer);
            
            this.actionProvider.setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
            }));
            
            // 기존 봇 메시지들 가져오기 (없으면 빈 배열)
            const existingBotMessages = JSON.parse(sessionStorage.getItem("bot") || "[]");
            // 새 메시지를 기존 배열에 추가
            const updatedBotMessages = [...existingBotMessages, botMessage];
            // 업데이트된 배열을 다시 저장
            sessionStorage.setItem("bot", JSON.stringify(updatedBotMessages));
        })
    } else {
        const userMessage = this.actionProvider.createClientMessage();
    }
}
}

export default MessageParser;