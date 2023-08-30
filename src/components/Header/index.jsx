import React, { useContext } from 'react';
import { SessionContext } from '../../context/SessionContext';

const Header = ({title}) => {
  const {session} = useContext(SessionContext);
  return (
    <div className='d-flex bg-white'>
      <div>
        <span>{title}</span>
      </div>
      <div>
        <img src="" alt="" />
        <div>
          <span>{session.name}</span>
          <span>{session.permissionTitle}</span>
        </div>
      </div>
    </div>
  )
}

export default Header