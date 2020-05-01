/* Not actually at test, just learning promises + async/await stuff */
function square(n) {
    return new Promise(function (resolve, reject) {
        if (n < 0){ 
            reject(n); 
        } else {
            resolve(n ** 0.5);
        }
    });
}

async function asyncSquare(n) {
    let result = await square(n);
    return result;
}

async function test(x){
    var a = await asyncSquare(x).catch((err) => {
        console.trace(err);
    });
    if (a) {
        console.log(a);
    }
}

test(10);
test(20);
test(25);