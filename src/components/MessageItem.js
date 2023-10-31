import React from 'react'
import '../styles/MessageItem.css'
const MessageItem = (props) => {
    if(props.responseChatID!==null){const scrollableDiv = () => {
        setTimeout(() => {
            let scrollableDiv = document.getElementById("scrollableDiv");
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }, 50);
    }
    scrollableDiv()}

    return (
        <div>
            <div className={`${props.messages.sender === props.userType ? 'user' : 'recipient'}-message`}>
                {props.messages.content}
            </div>
        </div>
    )
}

export default MessageItem
