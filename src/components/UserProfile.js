import React from 'react';
import { useParams } from 'react-router-dom';

function UserProfile(props) {
  const { id } = useParams();

  return (
    <div>
      DISPLAY USER WITH THIS ID GETING FROM USEPARAM() HOOK ===== {id}
    </div>
  );
}

export default UserProfile;