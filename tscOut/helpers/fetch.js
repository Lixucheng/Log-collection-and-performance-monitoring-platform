const fetch = (url, data) => new Promise((resolve, reject) => {
    window.fetch(url, Object.assign({ credentials: 'include' }, data))
        .then((response) => response.json())
        .then((ret) => {
        resolve(ret);
    }).catch((e) => {
        reject(e);
    });
});
export default fetch;
//# sourceMappingURL=fetch.js.map