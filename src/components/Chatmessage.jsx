import React, { Component } from 'react';

import Picture from "./Picture.jsx";
import Message from "./Message.jsx";

    var styled;

class Chatmessage extends Component {

    render(){

        if(this.props.styling == true){
          styled = ["TopContainer2", "messageContainer2", "displayName2", "pictureandmessage2",
        "pic2", "nextpic2", "timestamp2", "picture2", "message2"]
        } else{            
            styled = ["TopContainer", "messageContainer", "displayName", "pictureandmessage",
            "pic", "nextpic", "timestamp", "picture", "message"]
}

    return ( 
        <div className={styled[0]}>
        <div className={styled[1]}>
            <p className={styled[2]}>{this.props.sender}</p>
            <div className={styled[3]}>
                <div className={styled[4]}>
            <Picture imageUrl={this.props.imageUrl} picstyling={styled[7]} /></div>
            <div className={styled[5]}>
            <Message messageid={this.props.messageid} body={this.props.body} messagestyling={styled[8]} /></div>
            
            </div>
            <p className={styled[6]}>{this.props.timestamp}</p>
        </div>
        </div>
     );}

}

export default Chatmessage;