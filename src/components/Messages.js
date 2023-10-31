import React, { useContext, useEffect, useState } from 'react'
import '../styles/Messages.css'
import MessageItem from './MessageItem'
import MsgContext from '../context/MsgContext'
import { useNavigate } from 'react-router-dom'
const { io } = require("socket.io-client");
const socket = io("http://localhost:5000");


const Messages = () => {
  const myContext = useContext(MsgContext);
  const navigate = useNavigate()
  const { msgArray, setMsgArray, loginFailed, setLoginFailed, userDetail, setUserDetail, responseChatID, searchedUsername, getChats } = myContext;
  const [messageVal, setMessageVal] = useState("")
  let userDetailState = {}
  // let responseChatIDState = "notset"
  const url = 'http://localhost:5000/api/'
  const handleChange = (e) => {
    setMessageVal(e.target.value)
  }
  
  socket.on('message', (newMessage) => {
    setMsgArray(msgArray.concat(newMessage))
  })

  const fetchUser = async () => {
    let response = await fetch(`${url}auth/getuser`, {
      method: "POST",
      headers: {
        "authToken": localStorage.getItem('token')
      }
    });
    response = await response.json();
    userDetailState = response;
    setUserDetail(userDetailState)
    socket.emit('authenticate',userDetailState._id)
    await setLoginFailed(false)
    if (responseChatID !== null) {
      getChats(responseChatID)
    }

  }
  if (localStorage.getItem('token')) {
    setLoginFailed(false)
  }
//USE EFFECT
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUser();

      socket.on("connect", () => {
      });
    }
    else {
      navigate('/login')
    }
    // eslint-disable-next-line
  }, [])

  // Send a Message to the respective the user
  const userDetailID = userDetail._id
  const sendMessage = async () => {
    try {
      let response = await fetch(`${url}chat/chats/${responseChatID}/messages`, {
        method: "POST",
        headers: {
          "authToken": localStorage.getItem('token'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "content": messageVal, "sender": userDetailID })
      });
      // eslint-disable-next-line 
      response = await response.json();
      setMessageVal("")

    }
    catch (e) {
      console.log(e.message)
    }
  }
  const isButtonDisabled = () => {
    const inputField = messageVal;
    if (inputField.trim() === "") {
      return true
    }
    return false
  }

  // const handleEnterKeyPress = (event) => {
  //   if (event.key === 'Enter') {
  //     // The Enter key was pressed, so you can call your function here
  //     sendMessage();
  //   }
  // };

  // // Assuming you have an input element with an id "myInput"
  // const inputElement = document.getElementById('message-input');

  // // Attach the event listener to the input element
  // inputElement.addEventListener('keypress', handleEnterKeyPress);

  return (
    <>
      {responseChatID !== null && searchedUsername.username !== "" && <div className='message-container'>
        <div className="header">
          <h1>Message Inbox</h1>
          <p>You are chatting with {searchedUsername.name} <br />
            Username &#64;{searchedUsername.username}
          </p>
        </div>
        <div className="messageItemContainer" id="scrollableDiv" style={{ height: "50vh", display: "grid", margin: "5px" }}>
          {
            !loginFailed && responseChatID !== null && msgArray.map((msgArray, i) => {
              return <MessageItem key={i} messages={msgArray} responseChatID={responseChatID} userType={userDetail._id} />
            })
          }
        </div>
        <div className="message-input-container">
          <input className="message-input" name="message-input" value={messageVal} onChange={handleChange} id="message-input" type="text" placeholder="Type your message..." />
          <button onClick={sendMessage} disabled={isButtonDisabled()} className='send-button'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
      }
    </>
  )
}

export default Messages
