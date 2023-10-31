import { useState } from 'react';
import MsgContext from './MsgContext';


const MsgState = (props) => {
  const url = 'http://localhost:5000/api/'
  const [displayMsgJSON, setMsgJSON] = useState({})
  const [msgArray, setMsgArray] = useState([{}])
  const [userDetail, setUserDetail] = useState({})
  const [loginFailed, setLoginFailed] = useState(() => {
    const storedValue = localStorage.getItem('loginfailed');
    if (storedValue === 'false') {
      return false;
    }
    return true;
  });
  const [responseChatID, setResponseChatID] = useState(() => {
    return localStorage.getItem('reschat')
  })
  const [searchedUsername, setSearchedUsername] = useState(() => {
    let returnVal = {
      "name": "", "username": ""
    }
    if (localStorage.getItem('username') && localStorage.getItem('name')) {
      returnVal = {
        "name": localStorage.getItem('name'), "username": localStorage.getItem('username')
      }
    }
    return returnVal;
  })

  const getChats = async (x) => {
    const response = await fetch(`${url}chat/getchats/${x}`, {
      method: "GET",
      headers: {
        "authToken": localStorage.getItem('token')
      }
    });
    const msgJSON = await response.json()
    setMsgJSON(msgJSON)
    setMsgArray(msgJSON.messages)
  }


  return (
    <MsgContext.Provider value={{ getChats, displayMsgJSON, msgArray, setMsgArray, userDetail, setUserDetail, setLoginFailed, loginFailed, setResponseChatID, responseChatID, searchedUsername, setSearchedUsername }}>
      {props.children}
    </MsgContext.Provider>
  );
}

export default MsgState