import './App.css';
import io from 'socket.io-client';
import React, { useState } from 'react';
import Chat from './Chat';

const socket = io.connect("http://chat.nnisarg.xyz:3001");

function App() {

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const  joinRoom = () => {
    if(username !== '' && room !== ''){
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      <h3 className='title'>Simpl Chat</h3>
      {!showChat ?
      (<div className='holder'>
        <div className='input-box'>
          <label>Username</label>
          <input type='text' placeholder='Your name' onChange={(e) => {setUsername(e.target.value)}}/>
        </div>
        <div className='input-box'>
          <label>Room</label>
          <input type='text' placeholder='Room Name' onChange={(e) => {setRoom(e.target.value)}}/>
        </div>
        <button onClick={joinRoom}>Join</button>
      </div>)
      :
      (<Chat socket={socket} username={username} room={room} />)}
    </div>
  );
}

export default App;
