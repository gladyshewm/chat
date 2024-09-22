import { forwardRef, InputHTMLAttributes } from 'react';
import './SearchInput.css';
import { SearchIcon } from '@shared/assets';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <div className="search-input-container">
        <input
          ref={ref}
          className={`search-input ${className}`}
          type="text"
          placeholder={placeholder || ' '}
          {...props}
        />
        <SearchIcon />
      </div>
    );
  },
);
