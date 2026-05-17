import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
import { createComparison, skipEmptyTargetValues, rules } from '../lib/comparison.js'; // уточните путь к утилитам

export function initSearching(searchField) {
  const compare = createComparison([
    skipEmptyTargetValues,
    rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
  ]);

  return (data, state) => {
    return data.filter(row => compare(row, state));
  };
}
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data;
    }
}