var host = "http://127.0.0.1:";
var port = 40080;
var urlQian = host + port
const axios = require('axios').default;
const fetch = require('fetch-retry')(require('node-fetch'), {
    retries: 1,
    retryDelay: (attempt, error, response) => Math.pow(2, attempt) * 1000,
    fetchTimeout: 80000,  // 超时时间为80秒
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
class LinkenService {

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
        }, 2000);  // 每 1.8 秒钟执行一次
    }

    // 停止定时调用
    stopProcessing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);  // 清除定时器
            this.intervalId = null;
        }
    }

    async createUser() {
        return this._callWithDelay(() => this._createUser());
    }
    //创建窗口
    async _createUser() {  // 这个函数接收一个参数 data
        try {
            const response = await fetch(`${urlQian}/sessions/create_quick`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({count:1}) // 将 data 转为 JSON 字符串
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
    async _open(data) {

        let responseJson =   null;
        let  responseBody =  null;
        try {
             const resp = await fetch(`${urlQian}/sessions/start`, {
                 method: 'POST',
                 body: JSON.stringify(data) // 将 data 转为 JSON 字符串

             });
            const res=await resp.json();
            responseBody = JSON.stringify(res);
            if (res.debug_port != 0 && res.uuid ) {
                // const browser = await puppeteer.connect({browserWSEndpoint: res.data.data.ws.puppeteer, defaultViewport: null});
                // const page = await browser.newPage();
                // await page.goto('https://www.linkenpower.com');
                // await page.screenshot({ path: './linkenpower.png' });
                // await browser.close();
                return res;
            } else {
                return {success: false, message: "Data condition not met in response."+responseBody+"当前浏览器为"+profileId};
            }
        } catch (err) {
            console.log(err.message+"linken返回"+responseBody);
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
        const url = `${urlQian}/api/v1/browser/stop?user_id=${profileId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',  // 使用 GET 方法
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
        const data = {
            user_ids: [user_ids]
        };

        console.log(data);

        const url = `${urlQian}/api/v1/user/delete`;

        // 配置请求头
        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            // 发起初始请求
            let response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            let resp = await response.json();
            let msg = resp.msg;

            // 检查是否需要停止浏览器再重试
            while (msg.includes('mailbox users and cannot be deleted')) {
                console.log('Stopping browser for user:', user_ids[0]);

                // 调用 stopBrowser 方法（确保上下文正确）
                await this.stopBrowser(user_ids[0]);

                // 等待 5 秒钟
                await new Promise(resolve => setTimeout(resolve, 5000));

                // 再次尝试删除用户
                response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                });

                resp = await response.json();
                msg = resp.msg;
            }

            return resp;
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
    //修改代理信息
    async updateConnection(data) {
        return this._callWithDelay(() => this._updateConnection(data));
    }
    //修改代理信息
    async _updateConnection(data) {
        // 这个函数接收一个参数 data
        try {
            const response = await fetch(`${urlQian}/sessions/connection`, {
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

    /**
     * 创建会话并打开窗口
     * @param data 需要打开窗口的数据
     * @returns {Promise<void>}
     */
    async create_quick_proxy_open(data) {

        //创建窗口
        const newUser= await this.createUser();
        const  uuid =newUser[0].uuid;
        //修改代理
        data.uuid=uuid;
        await this.updateConnection(data);
        const startData={
            "uuid": uuid,
            "headless": false,
            "disable_images": false,
            "chromium_args": "--blink-settings=imagesEnabled=false"

        }
        //打开窗口
        const  port_uuid= await this.open(data);
        return port_uuid;
    }
}
var linkenService= new LinkenService();

linkenService.startProcessing();

module.exports = linkenService;
// async  function text(){
//    var ss= await linkenService.deleteUser("kqxxww5");
//    console.log(ss);
// }
// text();