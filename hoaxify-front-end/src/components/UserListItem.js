import React from "react";
import { Link } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
function UserListItem(props) {
  const { user } = props;
  const {userName,displayName,image} = user
  
  return (
    <Link to={`/users/${user.userName}`} className="list-group-item list-group-item-action">
      <ProfileImageWithDefault
        width="32px"
        height="32px"
        className="rounded-circle"
        alt={`${user.userName} profile`}
        image={image}
      />

    
      <span className="pl-2">{displayName}@{user.userName}</span>
    </Link>
  );
}

export default UserListItem;
