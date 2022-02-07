import "./SearchBar.css";

interface SearchBarProps {
  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar = ({searchQuery, setSearchQuery} : SearchBarProps) => (
    <div className="searchBar">
      <span className="searchText">
        Search:
      </span>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Type Search Here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
)