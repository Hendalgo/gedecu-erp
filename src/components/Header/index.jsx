import React, { useContext } from 'react';
import { SessionContext } from '../../context/SessionContext';

const Header = ({title}) => {
  const {session} = useContext(SessionContext);
  return (
    <div className=" bg-white">
      <div className="row">
        <div className="col-12">
        <div className='d-flex '>
          <div>
            <span>Escritorio /</span>
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
        </div>
      </div>
    </div>
  )
}

export default Header