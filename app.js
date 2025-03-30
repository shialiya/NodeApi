const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use('/web', express.static('web'));
const UserAgent = require('user-agents');

const PORT = process.env.PORT || 55555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const {  getdata} = require('./BattleSrp.js');
const {  getAirBnbbda} = require('./airbnb/airbnb.js');
const {  getUberSaveCard} = require('./uber/uber.js');

app.post('/getBattleLogin', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const password = req.body.password;
        const srpParams = req.body.srpParams;

        // 检查 srpParams 和 srpParams.modulus 是否存在
        if (!srpParams || !srpParams.modulus) {
            console.log("Received body:", req.body);  // 打印接收到的 body 信息
            return res.status(400).json({ error: "srpParams or srpParams.modulus is missing" });
        }

        // 调用 getdata 并返回结果
        res.json(getdata(srpParams, password));
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("Error occurred in /getBattleLogin:", error);
        console.log("接收到的信息为:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "An internal server error occurred" });
    }
});

app.get('/randUaZZZZZZZ' , (req, res) => {
    try {
        // new UserAgent( ) ;
        // const userAgent = new UserAgent({
        //     deviceCategory: 'mobile',
        //     platform: /Linux/
        // });
        const userAgent =  new UserAgent( ) ;
    res.send(userAgent.toString());
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("获取获取ua错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "An internal server error occurred" });
    }
});
app.post('/getAirBnbbda' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        // new UserAgent( ) ;
        // const userAgent = new UserAgent({
        //     deviceCategory: 'mobile',
        //     platform: /Linux/
        // });
        if ( !req.body ){
            return res.status(400).json({ error: "ua不能为空" });

        }
        const ua = req.body.UserAgent;
        if (!ua){
            return res.status(400).json({ error: "ua不能为空" });

        }
        res.send(getAirBnbbda(ua));
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("获取获取ua错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});


app.post('/getUberCard' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        if (!req.body ){
            return res.status(400).json({ error: "传参不能为空" });
        }
        const reqData = req.body.number;
        if (!reqData){
            return res.status(400).json({ error: "传参不能为空" });
        }

        let dataJson = {
            "number": req.body.number,
            "cvv": req.body.cvv,
            "expiration_month": req.body.expiration_month,
            "expiration_year": req.body.expiration_year,
            "options": {
                "tenancy": "production"
            }
        };
        res.send(getUberSaveCard(dataJson));
        console.log("uber执行完毕");
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("获取uber加密错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
