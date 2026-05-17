import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
<<<<<<< HEAD
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
=======

>>>>>>> 44965a67d9b0021247ad4610fd6070d7de6825de
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data;
    }
}