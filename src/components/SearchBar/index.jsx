import React from "react";

const SearchBar = ({ text = "", search, change = () => null }) => {
  const handleSumbit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="d-flex">
      <input
        name="search"
        type="text"
        id=""
        className="form-control rounded-0 rounded-start"
        onChange={({ target }) => change(target.value)}
        placeholder={text.concat("...")}
        autoComplete="none"
      />
      {/* <input name='search' type='text' id='' className='form-control' placeholder={`${text.replace(/\b\w/g, function (m) { return m.toUpperCase() })}...`} autoComplete='none' /> */}
      <input type="submit" className="btn btn-primary rounded-0 rounded-end" value={`Buscar`} />
    </div>
  );
};

export default SearchBar;
