const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const url = require('url');

app.use(cors());
app.use('/web', express.static('web'));
const UserAgent = require('user-agents');

const PORT = process.env.PORT || 55555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const adsService = require('./service/AdsService.js');
const kameleoService = require('./service/KameleoService.js');
const linkenService = require('./service/LinkenService.js');

const {  getdata} = require('./BattleSrp.js');
const {  getAirBnbbda} = require('./airbnb/airbnb.js');
const {  getUberSaveCard} = require('./uber/uber.js');
const {  walmart} = require('./walmart/walmartEncryption.js');

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

app.post('/getWalmartCard' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
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
            "PIEL": req.body.PIEL,
            "PIEE": req.body.PIEE,
            "PIEK": req.body.PIEK
        };
        res.send(walmart(req.body.number,req.body.cvv,req.body.PIEL,req.body.PIEE,req.body.PIEK));
        console.log("沃尔玛执行完毕");
    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("获取uber加密错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});

// walmart("4147400373263126", "111", 6, 4, "7D75519B8BD3380E6F02D767494EFB8F");

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
        await adsService.deleteUser(user_ids);
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

app.post("/proxy", async (req, res) => {
    const {
        url,
        method = "GET",
        headers = {},
        proxy,
        body,
        browser = "chrome_124"
    } = req.body;

    try {
        const options = {
            method: method.toUpperCase(),
            url: url,
            headers: headers,
            timeout: 30000,
            tlsClientIdentifier: browser || "chrome_124", // 如 chrome_120, chrome_124, firefox_120
            followRedirects: true
        };

        // 设置请求体
        if (["POST", "PUT", "PATCH"].includes(options.method) && body) {
            options.body = typeof body === "object" ? JSON.stringify(body) : body;
        }

        // 处理代理
        if (proxy) {
            options.proxyUrl = `http://${proxy.trim()}`;
        }

        // 发起请求
        const response = await request(options);

        res.json({
            responseBody: response.body,
            responseHeaders: response.headers,
            statusCode: response.statusCode,
            cookieStore: response.cookies
        });
    } catch (err) {
        console.error("❌ 请求失败:", err);
        res.status(500).json({
            error: err.message || "请求失败",
            stack: err.stack
        });
    }
});
/**
 * kameleo 查询符合条件的所有指纹
 */
app.get('/queryKameleFingerprints', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        // 获取完整的 query string 字符串，不包含前面的 '?'
        const queryString = url.parse(req.originalUrl).query;

        // 将整个 queryString 作为 browserProduct 传入
        const browserProduct = queryString;

        const json = await kameleoService.queryFingerprints(browserProduct);

        res.send(json);
        console.log(browserProduct + " 查询指纹 " + new Date());;

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("adsStopBrowser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});

/**
 * kameleo 创建浏览器实例
 */
app.post('/kameleoCreateUser' , bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const json= await  kameleoService.createUser(req.body);
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
 * kameleo 打开窗口
 */
app.get('/kameleoOpen', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {

        const browserId = req.query.browserId;  // 使用 query 获取 GET 请求中的参数
        console.log(browserId+"打开窗口窗口"+new Date());
        const json=    await kameleoService.open(browserId);
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
 * kameleo 关闭浏览器
 */
app.get('/kameleoStop', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {

    try {

        const browserId=  req.query.browserId;
        const json=   await kameleoService.stopBrowser(browserId);
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
 * kameleo 删除窗口
 */
app.get('/kameleoDeleteUser', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async function(req, res) {
    try {
        const browserId=  req.query.browserId;
        await kameleoService.deleteUser(browserId);
        console.log(user_ids+"删除窗口"+new Date());

    } catch (error) {
        // 捕获异常并打印错误信息和接收到的 body
        console.error("deleteUser错误", error);
        console.log("Received body:", req.body);  // 打印接收到的 body 信息

        // 返回一个错误响应，但不直接终止程序
        res.status(500).json({ error: "错误" });
    }
});