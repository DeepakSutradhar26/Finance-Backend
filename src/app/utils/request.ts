export const makeRequest = (endpoint : string, method : string, body? : any, token? : any) => {
    return new Request(endpoint, {
        method : method,
        headers : {
            "Content-type" : "application/json",
            ...(token && {"Authorization" : `Bearer ${token}`})
        },
        ...(body && {body : JSON.stringify(body)}),
    });
}

export const makeCredRequest = (endpoint : string, method : string, body? : any) => {
    return new Request(endpoint, {
        method : method,
        headers : {
            "Content-type" : "application/json",
        },
        credentials : 'include',
        ...(body && {body : JSON.stringify(body)}),
    });
}
