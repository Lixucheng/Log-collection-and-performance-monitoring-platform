import fetch from 'helpers/fetch';
const queryString = require('query-string');

export function getAllNameList(option) {
  return fetch(`/api/perf/data/namelist?${queryString.stringify(option)}`);
}

// id, target
export function getTargetData(option) {
  return fetch(`/api/perf/data/targetData?${queryString.stringify(option)}`);
}


export function getAllTargetTags(option) {
  return fetch(`/api/perf/data/getAllTargetTags?${queryString.stringify(option)}`);
}
