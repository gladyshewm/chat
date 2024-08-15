import React, { forwardRef, InputHTMLAttributes } from 'react';
import './SearchInput.css';
import SearchIcon from '../../../icons/SearchIcon';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="search-input-container">
        <input
          ref={ref}
          className={`search-input ${className}`}
          type="text"
          placeholder=" "
          {...props}
        />
        <SearchIcon />
      </div>
    );
  },
);

export default SearchInput;
