import {useState } from 'react'
import LoadingSpinner from '../assets/loading-spinner.gif'
import {Chatbot} from 'supersimpledev'
import dayjs from 'dayjs'
import './ChatInput.css'
function ChatInput({ messages, setMessages }) {
  const [textInput, setTextInput] = useState('');
  function sendTextInput(event) {
    setTextInput(event.target.value);
  }
  async function sendMess() {
    const newChatMessages = [...messages, {
      message: textInput,
      sender: 'user',
      time: dayjs().format('h:mma'),
      id: crypto.randomUUID()
    }]
    setMessages([...newChatMessages, {
      message: <img className="loading-gif" src={LoadingSpinner} alt=""/>,
      sender: 'robot',
      id: crypto.randomUUID()
    }
    ]);
    setTextInput('');
    const response = await Chatbot.getResponseAsync(textInput);
    setMessages([...newChatMessages, {
      message: response,
      sender: 'robot',
      time: dayjs().format('h:mma'),
      id: crypto.randomUUID()
    }
    ]);
    console.log(messages);
  }
  function enterMess(event) {
    if (event.key === 'Enter') {
      sendMess();
    } else if (event.key === 'Escape') {
      setTextInput('');
    }
  }
  async function saveMessageInput(){ 
    const newChatMessages =
      [...messages,
      {
        message: textInput,
        sender: 'user',
        time: dayjs().format('h:mma'),
        id: crypto.randomUUID()
      }
      ];
     
    setMessages(
      [...newChatMessages, {
        message: <img className="loading-gif" src={LoadingSpinner} alt=""/> ,
        sender: 'robot',
        id: crypto.randomUUID()
      }]
    );
    setTextInput('');
    const response =  await Chatbot.getResponseAsync(textInput);
    setMessages([...newChatMessages, {
      message: response,
      sender: 'robot',
      time: dayjs().format('h:mma'),
      id: crypto.randomUUID()
    }])
  }
  function handleClearChatMess(){
    setMessages([]);
  }
  return (
    <div className="container-input-btn">
      <input className="text-input"
        placeholder="Send a message to Chatbot"
        size="30"
        value={textInput}
        onChange={sendTextInput}
        onKeyDown={enterMess}
      />
      <button className="send-btn" onClick={saveMessageInput}>✔️</button>
    </div>
  )
}
export default ChatInput