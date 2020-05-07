/**
 * Promisify XMLHttpRequest
 * @param {string} method 
 * @param {string} url 
 * @param {[{name: string, value: string}]} reqHeaders 
 * @param {string | Object} body 
 */
function HttpRequest(method, url, reqHeaders, body) {
        return new Promise( (resolve, reject) => {
            if (!method || !url) {
                reject("Expected method and URL");
            }

            let xmlHttp = new XMLHttpRequest();
            
            xmlHttp.open(method, url, true);
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            if (reqHeaders && reqHeaders.length > 0) {
                for (let [key, value] of Object.entries(reqHeaders)) {
                    xmlHttp.setRequestHeader(key, value);
                }
            }

            xmlHttp.onload = () => {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    resolve(xmlHttp.responseText);
                } else {
                    reject(xmlHttp.statusText);
                }
            }

            xmlHttp.onerror = e => {
                reject(e)
            };

            xmlHttp.send(body);
        });
}