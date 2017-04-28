

const fetch = (url: string, data?: any): Promise<any> => new Promise((resolve, reject) => {
    window.fetch(url, Object.assign({credentials: 'include'}, data))
        .then((response: any) => response.json())
        .then((ret) => {
            resolve(ret);
        }).catch((e) => {
            reject(e);
        });
});

export default fetch;