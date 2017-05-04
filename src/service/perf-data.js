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

export function getFilterData(project, option, timeZone) {
  return fetch(`/api/perf/data/getFilterData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ project, option, timeZone }),
  });
}

export function getTagValues(option) {
  return fetch(`/api/perf/data/getTagValues?${queryString.stringify(option)}`);
}
