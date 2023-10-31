import React, { useContext } from 'react'
import MsgContext from '../context/MsgContext'
import { Link } from 'react-router-dom'

const SearchUser = () => {
  const url = 'http://localhost:5000/api/'
  const myContext = useContext(MsgContext)
  const { searchedUsername, userDetail, getChats, setResponseChatID } = myContext
  const createChat = async () => {
    try {
      let responseChatID = await fetch(`${url}chat/chats`, {
        method: "POST",
        headers: {
          "authToken": localStorage.getItem('token'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "participants": [userDetail._id, searchedUsername.userID],
          "messages": []
        })
      });
      responseChatID = await responseChatID.json()
      responseChatID = responseChatID.chatID
      return responseChatID
      
    } catch (ARUR) {
      // let ARUR = "some error occured while creating the chat in the createChat()"//Just for fun
      return ARUR.message
    }
  }

  const handleChat = async () => {
    try {
      let responseChatID = await fetch(`${url}search/chatsearch`, {
        method: "POST",
        headers: {
          "authToken": localStorage.getItem('token'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "username": searchedUsername.username })
      });
      if (responseChatID.ok) {

        responseChatID = await responseChatID.json()
        responseChatID = responseChatID.chatID
        if (responseChatID !== null) {
          localStorage.setItem('reschat', responseChatID)
          await setResponseChatID(responseChatID)
          getChats(responseChatID)
        }
        else {
          responseChatID = await createChat()
          localStorage.setItem('reschat', responseChatID)
          await setResponseChatID(responseChatID)
        }

      }
      else {
        await setResponseChatID(null)
      }
    }
    catch (error) {
      console.error("Search Chat Error:", error);
    }

  }

  return (
    <div className='container'>
      {searchedUsername.username !== "" && <div className="card text-center">
        <div className="card-header">
          Result
        </div>
        <div className="card-body">
          <h5 className="card-title">{searchedUsername.name}</h5>
          <p className="card-text">&#64;{searchedUsername.username} is available on Enchat!</p>
          <button onClick={handleChat} disabled={userDetail.username === searchedUsername.username ? true : false} className="btn btn-primary">
            <Link to="/home" className="nav-link" aria-current="page">{userDetail.username === searchedUsername.username ? 'Gotcha!' : 'Say Hello!'}</Link>
          </button>
        </div>
        <div className="card-footer text-body-secondary">
          Enjoy Enchat!
        </div>
      </div>}

      {searchedUsername.username === "" && <div className="container">
        No results found.
      </div>
      }
    </div>
  )
}

export default SearchUser
