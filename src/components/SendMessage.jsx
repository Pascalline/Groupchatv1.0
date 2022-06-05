function SendMessage() {
    return ( 
        <div className="sendDiv">
            <div className='sendDivLower'>
            <input type="text" placeholder="Say something..." className="sendInput"></input>
            <button type='submit' className='sendbutton'>
Send
                 </button></div>
        </div>
     );
}

export default SendMessage;