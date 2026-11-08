import { useId, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ config, actions }) {
  const { label, placeholder } = config;
  const { onSearch } = actions;
  const inputId = useId();
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === "") onSearch("");
  };

  return (
    <form className="searchbar" role="search" onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <div className="searchbar-row">
        <div className="searchbar-field">
          <Search aria-hidden="true" size={20} className="searchbar-icon" />
          <input
            id={inputId}
            className="form-input searchbar-input"
            type="search"
            placeholder={placeholder}
            autoComplete="off"
            value={value}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Buscar
        </button>
      </div>
    </form>
  );
}