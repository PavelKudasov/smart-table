export function initSearching(searchFieldName) {
  return (query, state) => {
    const searchValue = state[searchFieldName];
    return searchValue ? { ...query, search: searchValue } : query;
  };
}