import React from 'react';
import profile_icon from './profile_icon.png';

function handleError(e){
    e.target.src = profile_icon;
    console.log(e.target.src);
}

function Picture(props) {
    return ( 
        <div>
        <img src={props.imageUrl} alt="Not loaded" className={props.picstyling} referrerPolicy="no-referrer" onError={handleError}></img>
        </div>
     );
}

export default Picture;