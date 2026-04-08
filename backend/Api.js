const http = require('https');

const options = {
    method: 'GET',
    hostname: 'imdb236.p.rapidapi.com',
    port: null,
    path: '/api/imdb/cast/nm0000190/titles',
    headers: {
        'x-rapidapi-key': '5cf9d8e0bemsh3004889fd362426p154b66jsnaa2a23cb51d4', // <--- AJOUTE ÇA
        'x-rapidapi-host': 'imdb236.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.end();
