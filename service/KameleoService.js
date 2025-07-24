var host = "http://127.0.0.1:";
var port = 5050;
var urlQian = host + port
const axios = require('axios').default;
const fetch = require('fetch-retry')(require('node-fetch'), {
    retries: 1,
    retryDelay: (attempt, error, response) => Math.pow(2, attempt) * 1000,
    fetchTimeout: 60000,  // 超时时间为8000毫秒（5秒）
    retryOn: (attempt, error, response) => {

        if (attempt >= 2) {
            console.error(`达到最大重试次数返回false (${attempt}).`);
            return false;
        }
        // 重试条件
        if (error) {
            return [
                'ECONNRESET',
                'ETIMEDOUT',
                'ENOTFOUND',
                'EAI_AGAIN',
                'Client network socket disconnected before secure TLS connection was established'
            ].includes(error.code || error.message);
        }
        // 检查响应状态码
        if (response && response.status === 502) {
            console.error(`Attempt ${attempt + 1} received 502 status code`);
            return true; // 如果返回502，进行重试
        }
        return false;
    }
});
/**
 * 创建创空
 * @param data
 * @returns {Promise<unknown>}
 */
class KameleoService {

    // constructor() {
    //     this.queue = [];  // 队列，用于保存待调用的函数
    //     this.isProcessing = false;  // 标志是否正在处理请求
    // }
    // async _callWithDelay(func) {
    //     return new Promise((resolve, reject) => {
    //         this.queue.push({ func, resolve, reject });
    //         this._processQueue();  // 尝试处理队列中的请求
    //     });
    // }
    //
    // // 处理队列中的请求
    // async _processQueue() {
    //     if (this.isProcessing) return;  // 如果已经在处理请求，直接返回
    //     if (this.queue.length === 0) return;  // 如果队列为空，直接返回
    //
    //     this.isProcessing = true;  // 设置正在处理状态
    //
    //     // 每次调用一个函数，并在三秒后处理下一个
    //     const { func, resolve, reject } = this.queue.shift();
    //     try {
    //         const result = await func();  // 调用队列中的函数
    //         resolve(result);  // 调用成功，返回结果
    //     } catch (error) {
    //         reject(error);  // 调用失败，返回错误
    //     }
    //
    //     // 等待2秒后继续处理队列中的下一个请求
    //     setTimeout(() => {
    //         this.isProcessing = false;
    //         this._processQueue();  // 继续处理下一个请求
    //     }, 1100);  // 延迟 1.1 秒钟
    // }

    constructor() {
        this.queue = [];  // 队列，用于保存待调用的函数
        this.intervalId = null;  // 用于定时调用的定时器ID
    }

    // 添加任务到队列
    async _callWithDelay(func) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await func();  // 调用传入的异步函数
                    resolve(result);  // 返回结果
                } catch (error) {
                    reject(error);  // 错误处理
                }
            });
        });
    }

    // 开始定时调用请求
    startProcessing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);  // 清除已有的定时器
        }

        this.intervalId = setInterval(() => {
            if (this.queue.length > 0) {
                const func = this.queue.shift();  // 获取队列中的第一个函数
                func();  // 调用它
            }
        }, 500);  // 每 0.5秒钟执行一次
    }

    // 停止定时调用
    stopProcessing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);  // 清除定时器
            this.intervalId = null;
        }
    }

    async createUser(data) {
        return this._callWithDelay(() => this._createUser(data));
    }
    //创建窗口
    async _createUser(data) {  // 这个函数接收一个参数 data
        try {
            const response = await fetch(`${urlQian}/profiles/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // 将 data 转为 JSON 字符串
            });

            if (!response.ok) {
                // 如果响应状态码不是 2xx，抛出错误
                const errorText = await response.text(); // 获取错误响应文本
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // 返回 JSON 格式的响应体
            const result = await response.json();
            return result;
        } catch (error) {
            // 捕获错误并抛出
            throw error;
        }
    }
    async open(profileId) {
        return this._callWithDelay(() => this._open(profileId));
    }

    /**
     * 打开窗口
     * @param profileId 配置id
     * @returns {Promise<{success: boolean, message: string}|{success: boolean, message: *}|any>}
     */
    async _open(profileId) {

        let responseJson =   null;
        let  responseBody =  null;
        try {
            const resp = await fetch(`${urlQian}/profiles/${profileId}/start`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                        arguments: ['headless']

                }),
                method: 'POST'
            });
            const res=await resp.json();
            responseBody = JSON.stringify(res);
            if (res.lifetimeState) {
                // const browser = await puppeteer.connect({browserWSEndpoint: res.data.data.ws.puppeteer, defaultViewport: null});
                // const page = await browser.newPage();
                // await page.goto('https://www.adspower.com');
                // await page.screenshot({ path: './adspower.png' });
                // await browser.close();
                return res;
            } else {
                return {success: false, message: "_open."+responseBody+"当前浏览器为"+profileId};
            }
        } catch (err) {
            console.log(err.message+"ads返回"+responseBody);
            return {success: false, message: err.message};
        }
    }

    async queryFingerprints(profileId) {
        return this._callWithDelay(() => this._queryFingerprints(profileId));
    }

    /**
     * 查询符合条件的所有指纹
     * @param profileId 配置id
     * @returns {Promise<{success: boolean, message: string}|{success: boolean, message: *}|any>}
     */
    async _queryFingerprints(profileId) {

        let responseJson =   null;
        let  responseBody =  null;
        try {
            const resp = await fetch(`${urlQian}/fingerprints?${profileId}`, {
                method: 'GET'
            });
            const res=await resp.json();


            responseBody = JSON.stringify(res);
            if (Array.isArray(res)) {
                // const browser = await puppeteer.connect({browserWSEndpoint: res.data.data.ws.puppeteer, defaultViewport: null});
                // const page = await browser.newPage();
                // await page.goto('https://www.adspower.com');
                // await page.screenshot({ path: './adspower.png' });
                // await browser.close();
                return res;
            } else {
                return {success: false, message: "获取所有指纹库失败"+responseBody+"当亲传参为"+profileId};
            }
        } catch (err) {
            console.log(err.message+"ads返回"+responseBody);
            return {success: false, message: err.message};
        }
    }
    async stopBrowser(profileId) {
        return this._callWithDelay(() => this._stopBrowser(profileId));
    }
    /**
     * 关闭窗口
     * @param profileId 配置id
     * @returns {Promise<null|any>}
     */
    async _stopBrowser(profileId) {
        const url = `${urlQian}/profiles/${profileId}/stop`;

        try {
            const response = await fetch(url, {
                method: 'POST',  // 使用 GET 方法
                headers: {}  // 请求头
            });

            // 返回 JSON 格式的响应
            return await response.json();
        } catch (error) {
            console.log("关闭窗口报错"+error);
            return null;
        }
    }

    async deleteUser(user_ids) {
        return this._callWithDelay(() => this._deleteUser(user_ids));
    }
    /**
     * 删除窗口
     * @param user_ids
     * @returns {Promise<null|any>}
     */
    async _deleteUser(user_ids) {



        const url = `${urlQian}/profiles/${user_ids}`;

        // 配置请求头
        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            // 发起初始请求
            let response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateUser(user_ids) {
        return this._callWithDelay(() => this._updateUser(user_ids));
    }
    //修改指纹信息
    async _updateUser(data) {  // 这个函数接收一个参数 data
        try {

            const response = await fetch(`${urlQian}/api/v1/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // 将 data 转为 JSON 字符串
            });

            if (!response.ok) {
                // 如果响应状态码不是 2xx，抛出错误
                const errorText = await response.text(); // 获取错误响应文本
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // 返回 JSON 格式的响应体
            const result = await response.json();
            return result;
        } catch (error) {
            // 捕获错误并抛出
            throw error;
        }
    }

}
var kameleoService= new KameleoService();

kameleoService.startProcessing();

module.exports = kameleoService;
// async  function text(){
//    var ss= await adsService.deleteUser("kqxxww5");
//    console.log(ss);
// }
// text();