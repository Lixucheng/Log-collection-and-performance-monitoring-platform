import fetch from 'helpers/fetch';

function getLogList(deviceId) {
    return fetch(`/api/log/list/${deviceId}`);
}
export default getLogList;