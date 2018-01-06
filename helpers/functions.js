const request = require('request');

exports.rand = (max) => {
    return Math.floor(Math.random() * max + 1);
}

exports.getJoke = () => {
    let options = {
        url: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                resolve(data)
            }
            else {
                reject('Something went wrong!')
            }
        });
    })

}