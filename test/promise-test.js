/* jshint esversion: 8 */
/* Not actually at test, just learning promises + async/await stuff */

function asyncSquare(n) {
    return new Promise(function (resolve, reject) {
        if (n < 0){ 
            reject("Cannot square negative integer"); 
        } else {
            resolve(n ^ 0.5);
        }
    });
}

async function printSquare(n) {
    let result = await asyncSquare(n);
    console.log(result);
}

// let promise = asyncSquare(-4);
// promise.then(console.log).catch(console.log).finally(console.log);
printSquare(5);

