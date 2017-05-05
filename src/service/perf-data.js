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
    body: JSON.stringify({
      project,
      option,
      timeZone
    }),
  });
}

export function getTagValues(option) {
  return fetch(`/api/perf/data/getTagValues?${queryString.stringify(option)}`);
}

export function getPerfData(option) {
  return fetch(`/api/perf/data/getPerfData?${queryString.stringify(option)}`);
}

export async function getIndexData(id, timeZone) {
  const t1 = await getTagValues({
    id,
    tag: 'deviceOs',
    timeZone,
  });
  const t2 = await getTagValues({
    id,
    tag: 'page',
    timeZone,
  });
  const t3 = await getTagValues({
    id,
    tag: 'device',
    timeZone,
  });
  const data = await getPerfData({ id, timeZone });

  return {
    data, table: [t1, t2, t3]
  }
}
