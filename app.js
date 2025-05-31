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

const adsService = require('./service/AdsService.js');
const linkenService = require('./service/LinkenService.js');

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
/**
 * ads 创建窗口
 */
app.post('/adsCreateUser' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const json= await  adsService.createUser(req.body);
        res.send(json);
        console.log(JSON.stringify(json) +"创建窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsCreateUser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
/**
 * ads 打开窗口
 */
app.get('/adsOpen', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {

        const browserId = req.query.browserId;  // 使用 query 获取 GET 请求中的参数
        console.log(browserId+"打开窗口窗口"+new Date());
        const json=    await adsService.open(browserId);
        res.send(json);
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsOpen错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
/**
 * ads 修改窗口
 */
app.post('/adsUpdateUser' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const json=     await  adsService.updateUser(req.body);
        res.send(json);
        console.log(req.body.user_id+"修改窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsOpen错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
/**
 * ads 关闭窗口
 */
app.get('/adsStopBrowser', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {

    try {

        const browserId=  req.query.browserId;
        const json=   await adsService.stopBrowser(browserId);
        res.send(json);
        console.log(browserId+"关闭窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsStopBrowser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
/**
 * ads 删除窗口
 */
app.get('/adsDeleteUser', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const user_ids=  req.query.user_ids;
        const json=  await adsService.deleteUser(user_ids);
        res.send(json);
        console.log(user_ids+"删除窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("deleteUser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});
/**
 * linken 创建并且打开窗口
 */
app.post('/linkenCreateUserOpen' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const json= await  linkenService.create_quick_proxy_open(req.body);
        res.send(json);
        console.log(JSON.stringify(json) +"打开窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsCreateUser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});

/**
 * linken 删除并关闭窗口
 */
app.get('/linkenStopDelete', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {

        const uuid=  req.query.uuid;
        const json= await  linkenService.stopDelete(uuid);
        res.send(json);
        console.log("关闭删除流程结束"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsCreateUser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});