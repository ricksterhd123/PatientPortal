/* Not actually at test, just learning promises + async/await stuff */
function asyncSquare(n) {
    return new Promise(function (resolve, reject) {

        if (n < 0){ 
            reject(n); 
        } else {
            resolve(n ** 0.5);
        }
    });
}

async function printSquare(n) {
    let result = await asyncSquare(n);
    console.log(`Result: ${result}`)
}

// let promise = asyncSquare(-4);
// promise.then(console.log).catch(console.log).finally(console.log);
var a = printSquare(-5);
console.log(a);