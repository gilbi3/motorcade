var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {

    fs.readFile("index.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (err) throw err;
        res.write(data);
        res.end();
    });

}).listen(8080);