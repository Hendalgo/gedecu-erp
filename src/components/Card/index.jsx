import { ReactSVG } from 'react-svg'
import './Card.css'
import PropTypes from 'prop-types'

const Card = ({ country, currency, total, percent, img }) => {
  return (
    <div className='bg-white CardContainer'>
      <div className='px-4 pt-4 pb-3 d-flex justify-content-between'>
        <div>
          <div className='CountryName pb-1'>
            <ReactSVG
              src='/world.svg'
              className='me-2'
              wrapper='span'
            />
            {country}
          </div>
          <div className='TotalCard'>
            {`${currency} ${total}`}
          </div>
        </div>
        <div className='ms-5 CardIcon'>
          <img src={img} alt={country} />
        </div>
      </div>
      <div className='pb-4 px-4'>
        {percent >= 0
          ? <ReactSVG
              src='/up.svg'
              wrapper='span'
            />
          : <ReactSVG
              src='/down.svg'
              wrapper='span'
            />}
        <span>{percent}% día de hoy</span>
      </div>
    </div>
  )
}

Card.propTypes = {
  country: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired
}

export default Card
