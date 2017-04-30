import fetch from 'helpers/fetch';
const queryString = require('query-string');

export function getAllNameList(option) {
  return fetch(`/api/perf/data/namelist?${queryString.stringify(option)}`);
}