export default function fetching(queryValue) {
    return fetch(`https://restcountries.com/v3.1/name/${queryValue}`)
        .then(response => {
            if (response.status === 404) {
                return Promise.reject(new Error());
            }
            
            return response.json();
        })
}