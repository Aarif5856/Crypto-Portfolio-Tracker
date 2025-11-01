import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { searchCoinByQuery } from '../utils/coingecko';

const useDebounce = (fn, delay = 300) => {
  const timer = useRef();
  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
};

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const runSearch = useDebounce(async (val) => {
    if (!val || val.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await searchCoinByQuery(val);
      setSuggestions(res ? [res] : []);
    } catch {
      setSuggestions([]);
    }
  }, 350);

  useEffect(() => {
    runSearch(query);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search size={16} className="text-secondary" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search assets, wallets, domains"
          className="w-full bg-transparent text-sm text-primary focus:outline-none placeholder:text-secondary"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#121212]">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelect?.(s);
                setQuery('');
                setSuggestions([]);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-primary hover:bg-white/5"
            >
              <div className="truncate">
                <div className="font-medium">{s.name}</div>
                <div className="text-secondary text-xs">{s.symbol}</div>
              </div>
              <div className="badge">CoinGecko</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

