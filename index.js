var express = require('express');
var loadFile = require('./util/readFile');
var app = express();

//  主页输出 "Hello World"
app.get('/', function (req, res) {
    console.log("主页 GET 请求");
    res.send('Hello GET');
})

app.get('/getCMSData', async function (req, res) {
    let query = req.query;
    if(query.docId && query.type){
        let resulet = await loadFile.requestCMS(query.docId , query.type , query.isPreview || false);
        res.json(resulet);
    }else{
        res.send('docId或type不能为空，请检查！');
    }
})

var server = app.listen(9005, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("读取cms文档，访问地址为 http://%s:%s", host, port)

})