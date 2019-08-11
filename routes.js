const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>APP</title></head>');
        res.write('<body><form method="post" action="/message"><input name="message"><button>Send</button></form></body>');
        res.write('</html>');
        return res.end();    
    }
    if(url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1]; 
            fs.writeFile('message.txt', message, err => {
                if(err) {
                    res.statusCode(500);
                    return res.end();
                }
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end();
            });
        });
    }
    
    res.write('<html>');
    res.write('<head><title>H! APP</title></head>');
    res.write('<body><h1>Hi!</h1></body>');
    res.write('</html>');
    res.end();
}

module.exports = requestHandler;