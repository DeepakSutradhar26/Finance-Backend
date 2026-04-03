export const makeRequest = (endpoint : string, method : string, body : any) => {
    return new Request(endpoint, {
        method : method,
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(body),
    });
}