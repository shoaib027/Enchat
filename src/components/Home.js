import React, { useContext } from 'react'
import Messages from './Messages'
import MsgContext from '../context/MsgContext'

const Home = () => {
  const myContext = useContext(MsgContext)
  const { loginFailed,responseChatID } = myContext
  return (
    <div className='message-parent'>
      {!loginFailed && responseChatID!==null &&
        <Messages/>
      }
      {
        responseChatID===null && loginFailed===false && <h1>Search for a user and Start a new Chat</h1>
      }
      {
        loginFailed===true && 
        <h1>Please Login To Chitchat with your favourite ones</h1>
      }
    </div>
  )
}

export default Home
