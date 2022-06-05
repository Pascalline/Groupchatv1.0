import React from 'react';

function Message(props) {
    return ( 
            <p className={props.messagestyling}>{props.body}
            </p>
     );
}

export default Message;