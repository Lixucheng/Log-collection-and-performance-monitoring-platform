import fetch from 'helpers/fetch';
const queryString = require('query-string');

export function getProjectList(option) {
  return fetch(`/api/perf/projects/list?${queryString.stringify(option)}`);
}
export function removeProject(id) {
  return fetch(`/api/perf/projects/remove?id=${id}`);
}
export function addProject(project) {
  return fetch(`/api/perf/projects/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project),
  });
}