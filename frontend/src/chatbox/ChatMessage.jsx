import RobotImage from '../assets/robot.png'
import UserImage from '../assets/user.png'
import UseAutoScroll from './UseAutoScroll';
import './ChatMessage.css'
function ChatMessage({ messages }) {
  const containerMessRef = UseAutoScroll([messages]);  
  return (
    <div className="container-mess" ref={containerMessRef}>
      {messages.map((mess) => (
        <div key={mess.id} className={mess.sender === 'robot' ? "message-robot" : 'message-user'}>
          {mess.sender === 'robot' && <img className="avatar" src={RobotImage} width="50" />}
          <div className="container-message-send">
            <div className='message-text'>{mess.message} </div>
            <div className='time-send-mess'>{mess.time}</div>
          </div>
          {mess.sender === 'user' && <img className="avatar" src={UserImage} width="50" />}
        </div>
      ))
      }
    </div>
  )
}
export default ChatMessage