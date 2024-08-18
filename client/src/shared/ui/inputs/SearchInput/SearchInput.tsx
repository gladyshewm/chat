import { forwardRef, InputHTMLAttributes } from 'react';
import './SearchInput.css';
import { SearchIcon } from '../../icons';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
