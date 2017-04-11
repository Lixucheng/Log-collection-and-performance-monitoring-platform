import fetch from 'helpers/fetch';

export function getLogList(deviceId, page, time) {
  if (!time)
    return fetch(`/api/log/list/${deviceId}?page=${page}`);
  return fetch(`/api/log/list/${deviceId}?page=${page}&startTime=${time[0]}&endTime=${time[1]}`);
}
export function sendLogRequest(deviceId, time) {
  if (!time)
    return fetch(`/api/log/request/${deviceId}`);
  return fetch(`/api/log/request/${deviceId}?startTime=${time[0]}&endTime=${time[1]}`);
}