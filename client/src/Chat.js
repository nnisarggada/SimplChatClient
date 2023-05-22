import React, { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, room}) {

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const message_data = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + (new Date(Date.now()).getMinutes() < 10 ? '0' : '') + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', message_data);
      setCurrentMessage('');
      setMessageList((list) => [...list, message_data]);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => socket.removeListener('receive_message');
  }, [socket]);

  return (
    <div className='chat-holder'>
      <div className="chat-header">
        <p>Room Name : {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className='scroller'>
        {messageList.map((messageContent) => {
          return (
          <div className='message' id={messageContent.author === username ? "right" : "left"}>
              <div className='message-author'>
                <p><b><i>{messageContent.author === username ? "You" : messageContent.author}</i></b></p>
              </div>
              <div className='message-content'>
                <p>{messageContent.message}</p>
              </div>
              <div className='message-time'>
                <p>{messageContent.time}</p>
              </div>
            </div>
          )
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" value={currentMessage} placeholder="Type a message..." onChange={(e) => {setCurrentMessage(e.target.value);}} onKeyPress={(e) => {e.key === 'Enter' && sendMessage();}}/>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat

