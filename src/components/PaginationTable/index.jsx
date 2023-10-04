import React from 'react'
import ReactPaginate from 'react-paginate';
import "./PaginationTable.css"

const PaginationTable = ({handleChange, itemsTotal, itemOffset, itemsPerPage = 10, quantity, text= 'reportes'}) => {
  

  return (
    <div className="d-flex PaginationContainer align-items-center">
      <span>{itemsTotal} {text}</span>
      <ReactPaginate 
        breakLabel={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
        <path d="M2.99951 9.99915C2.60169 9.99915 2.22016 9.84111 1.93885 9.55981C1.65755 9.2785 1.49951 8.89697 1.49951 8.49915C1.49951 8.10132 1.65755 7.71979 1.93885 7.43849C2.22016 7.15718 2.60169 6.99915 2.99951 6.99915C3.39734 6.99915 3.77887 7.15718 4.06017 7.43849C4.34148 7.71979 4.49951 8.10132 4.49951 8.49915C4.49951 8.89697 4.34148 9.2785 4.06017 9.55981C3.77887 9.84111 3.39734 9.99915 2.99951 9.99915ZM7.99951 9.99915C7.60169 9.99915 7.22016 9.84111 6.93885 9.55981C6.65755 9.2785 6.49951 8.89697 6.49951 8.49915C6.49951 8.10132 6.65755 7.71979 6.93885 7.43849C7.22016 7.15718 7.60169 6.99915 7.99951 6.99915C8.39734 6.99915 8.77887 7.15718 9.06017 7.43849C9.34148 7.71979 9.49951 8.10132 9.49951 8.49915C9.49951 8.89697 9.34148 9.2785 9.06017 9.55981C8.77887 9.84111 8.39734 9.99915 7.99951 9.99915ZM12.9995 9.99915C12.6017 9.99915 12.2202 9.84111 11.9389 9.55981C11.6575 9.2785 11.4995 8.89697 11.4995 8.49915C11.4995 8.10132 11.6575 7.71979 11.9389 7.43849C12.2202 7.15718 12.6017 6.99915 12.9995 6.99915C13.3973 6.99915 13.7789 7.15718 14.0602 7.43849C14.3415 7.71979 14.4995 8.10132 14.4995 8.49915C14.4995 8.89697 14.3415 9.2785 14.0602 9.55981C13.7789 9.84111 13.3973 9.99915 12.9995 9.99915Z" fill="#0D6EFD"/>
        </svg>}
        nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.48419 1.73371C3.51903 1.69878 3.56041 1.67108 3.60597 1.65217C3.65153 1.63327 3.70037 1.62354 3.74969 1.62354C3.79902 1.62354 3.84786 1.63327 3.89342 1.65217C3.93898 1.67108 3.98036 1.69878 4.01519 1.73371L8.51519 6.23371C8.55012 6.26854 8.57782 6.30992 8.59673 6.35548C8.61563 6.40104 8.62536 6.44988 8.62536 6.49921C8.62536 6.54853 8.61563 6.59737 8.59673 6.64293C8.57782 6.68849 8.55012 6.72987 8.51519 6.76471L4.01519 11.2647C3.94478 11.3351 3.84928 11.3747 3.74969 11.3747C3.65011 11.3747 3.55461 11.3351 3.48419 11.2647C3.41378 11.1943 3.37422 11.0988 3.37422 10.9992C3.37422 10.8996 3.41378 10.8041 3.48419 10.7337L7.71944 6.49921L3.48419 2.26471C3.44927 2.22987 3.42156 2.18849 3.40266 2.14293C3.38375 2.09737 3.37402 2.04853 3.37402 1.99921C3.37402 1.94988 3.38375 1.90104 3.40266 1.85548C3.42156 1.80992 3.44927 1.76854 3.48419 1.73371Z" fill="#0D6EFD"/>
        </svg>}
        onPageChange={handleChange}
        pageRangeDisplayed={3}
        pageCount={quantity}
        previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.51519 1.73371C8.55012 1.76854 8.57782 1.80992 8.59673 1.85548C8.61563 1.90104 8.62536 1.94988 8.62536 1.99921C8.62536 2.04853 8.61563 2.09737 8.59673 2.14293C8.57782 2.18849 8.55012 2.22987 8.51519 2.26471L4.27994 6.49921L8.51519 10.7337C8.58561 10.8041 8.62517 10.8996 8.62517 10.9992C8.62517 11.0988 8.58561 11.1943 8.51519 11.2647C8.44478 11.3351 8.34928 11.3747 8.24969 11.3747C8.15011 11.3747 8.05461 11.3351 7.98419 11.2647L3.48419 6.76471C3.44927 6.72987 3.42156 6.68849 3.40266 6.64293C3.38375 6.59737 3.37402 6.54853 3.37402 6.49921C3.37402 6.44988 3.38375 6.40104 3.40266 6.35548C3.42156 6.30992 3.44927 6.26854 3.48419 6.23371L7.98419 1.73371C8.01903 1.69878 8.06041 1.67108 8.10597 1.65217C8.15153 1.63327 8.20037 1.62354 8.24969 1.62354C8.29902 1.62354 8.34786 1.63327 8.39342 1.65217C8.43898 1.67108 8.48036 1.69878 8.51519 1.73371Z" fill="#0D6EFD"/>
        </svg>}
        renderOnZeroPageCount={null}
      />
    </div>
  )
}

export default PaginationTable;