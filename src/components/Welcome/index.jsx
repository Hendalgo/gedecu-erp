import React, { useContext } from 'react'
import { SessionContext } from '../../context/SessionContext'
import DownloadButton from '../DownloadButton'
import AddButton from '../AddButton'
const Welcome = ({ text, add, textButton, showButton = true}) => {
  const { session } = useContext(SessionContext)
  return (
    <div className='row WelcomeContainer pt-4 pb-3'>
      <div className='d-flex justify-content-between'>
        <div className=''>
          <h6 className='welcome'>Bienvenido, {session.name} 👋</h6>
          <h4>{text}</h4>
        </div>
        <div className=''>
          <div className='d-flex align-items-center g-4'>
            <div className='me-4  '>
              {/* <DownloadButton /> */}
            </div>
            {
              showButton && <AddButton add={add} text={textButton || text} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
