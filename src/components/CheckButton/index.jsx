import PropTypes from 'prop-types'

const CheckButton = ({type = 'done', action, id}) => {
  return (
    type === 'done'?<button onClick={() => action(id)} className='TableActionButtonsDone'>
      <svg xmlns='http://www.w3.org/2000/svg' width='17' height='12' viewBox='0 0 17 12' fill='none'>
        <path d='M5.54113 11.775C5.08695 11.7752 4.65138 11.5947 4.3305 11.2733L0.670374 7.6145C0.276542 7.22054 0.276542 6.58193 0.670374 6.18797C1.06433 5.79414 1.70294 5.79414 2.09689 6.18797L5.54113 9.63221L14.6531 0.520227C15.0471 0.126396 15.6857 0.126396 16.0796 0.520227C16.4735 0.914185 16.4735 1.55279 16.0796 1.94675L6.75175 11.2733C6.43087 11.5947 5.9953 11.7752 5.54113 11.775Z' fill='#198754' />
      </svg>
    </button>
    :
    <button onClick={() => action(id)} className='TableActionButtonsCancel'>
      <svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'>
        <path d='M9.78941 8.00022L16.0825 1.70782C16.4731 1.31718 16.4731 0.683833 16.0825 0.293224C15.6919 -0.0974159 15.0585 -0.0974159 14.6679 0.293224L8.37546 6.58628L2.08307 0.293224C1.69243 -0.0974159 1.05908 -0.0974159 0.668468 0.293224C0.277859 0.683865 0.277828 1.31721 0.668468 1.70782L6.96152 8.00022L0.668468 14.2926C0.277828 14.6833 0.277828 15.3166 0.668468 15.7072C1.05911 16.0979 1.69246 16.0979 2.08307 15.7072L8.37546 9.41416L14.6679 15.7072C15.0585 16.0979 15.6919 16.0979 16.0825 15.7072C16.4731 15.3166 16.4731 14.6833 16.0825 14.2926L9.78941 8.00022Z' fill='#DC3545' />
      </svg>
    </button>
  )
}

CheckButton.propTypes = {
  type: PropTypes.string,
  action: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

export default CheckButton