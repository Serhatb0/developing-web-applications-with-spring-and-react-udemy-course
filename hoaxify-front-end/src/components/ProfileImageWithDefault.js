import React from 'react'
import defaultProfile from "../assets/img/profile (1).png";
export default function ProfileImageWithDefault(props) {
    const {image,tempimage} = props;
    let imageSource = defaultProfile;
    if (image) {
      imageSource ='images/profile/'+ image;
    }
  return (
    <img
        {...props}
        alt={`profile`}
        src={tempimage || imageSource}
        onError={(event)=>{
          event.target.src = defaultProfile;
        }}
      />
  )
}
