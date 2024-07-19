// ==UserScript==
// @name         空闲服务器抢占
// @namespace    http://tampermonkey.net/
// @version      2024-07-18
// @description  try to take over the world!
// @author       zchi
// @match        http://172.18.127.68:8888/
// @icon         https://pics5.baidu.com/feed/0bd162d9f2d3572c057f85c7c3eafd2263d0c30e.jpeg?token=15720a6eec4ed4f401fb1f044c3a6d97&s=03E25723583233A518388B9C0300C0A1
// ==/UserScript==

(function() {
    'use strict';

    // core code here...
    function get_server_status(nodeName, nodeAddress, timeout = 2000) {
  console.log("开始获取服务器状态");

  return new Promise((resolve) => {
    const ws = new WebSocket("ws://172.18.127.66:8067/resource");
    let timer;

    ws.onopen = function () {
      console.log("WebSocket connected!");
      const message = JSON.stringify({
        type: 1,
        nodeName: nodeName,
        nodeAddress: nodeAddress,
        occupiedList: [],
      });
      ws.send(message);
      console.log("Message sent:", message);

      // Set up timeout for the response
      timer = setTimeout(() => {
        console.log("Request timed out");
        ws.close();
        resolve(0);
      }, timeout);
    };

    ws.onmessage = function (event) {
      clearTimeout(timer);
      console.log("Received:", event.data);
      ws.close();
      resolve(JSON.parse(event.data));
    };

    ws.onclose = function () {
      console.log("WebSocket disconnected!");
    };

    ws.onerror = function (error) {
      clearTimeout(timer);
      console.error("WebSocket Error:", error);
      ws.close();
      resolve(0);
    };
  });
}

const serves_raw = {
  nodesListerName:
    "gpu39,gpu33,gpu25,gpu31,gpu21,gpu34,gpu27,gpu36,gpu35,gpu24,gpu38,gpu22,gpu43,gpu46,gpu37,gpu44,gpu48,gpu40,gpu26,gpu29,gpu23,gpu28,gpu49,gpu45,gpu47,gpu30,gpu32,gpu41,gpu42",
  nodesListerAddr:
    "172.18.127.119,172.18.127.113,172.18.127.105,172.18.127.111,172.18.127.101,172.18.127.114,172.18.127.107,172.18.127.116,172.18.127.115,172.18.127.104,172.18.127.118,172.18.127.102,172.18.127.123,172.18.127.126,172.18.127.117,172.18.127.124,172.18.127.128,172.18.127.120,172.18.127.106,172.18.127.109,172.18.127.103,172.18.127.108,172.18.127.129,172.18.127.125,172.18.127.127,172.18.127.110,172.18.127.112,172.18.127.121,172.18.127.122",
  nodesListerLabel:
    "SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G,SXM-A800-80G",
  nodesListerStatus:
    "ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready,ready",
};

const SERVER_IDS = [
  "gpu23",
  "gpu26",
  "gpu35",
  "gpu37",
  "gpu40",
  "gpu44",
  "gpu45",
  "gpu48",
  "gpu47",
  "gpu49",
];
const SERVER_IDS_TEST = [
  "gpu39",
  "gpu33",
  "gpu25",
  "gpu31",
  "gpu21",
  "gpu34",
  "gpu27",
  "gpu36",
  "gpu35",
  "gpu24",
  // "gpu38",
  //38 第二轮有问题
  // "gpu22",
  //22 第二轮有问题
  "gpu43",
  "gpu46",
  "gpu37",
  "gpu44",
  "gpu48",
  "gpu40",
  "gpu26",
  "gpu29",
  "gpu23",
  "gpu28",
  "gpu49",
  "gpu45",
  "gpu47",
  "gpu30",
  "gpu32",
  "gpu41",
  "gpu42",
];
function handle_servers_to_obj(serves) {
  const servers_obj = {};
  const names = serves.nodesListerName.split(",");
  const addresses = serves.nodesListerAddr.split(",");
  const labels = serves.nodesListerLabel.split(",");

  for (let i = 0; i < names.length; i++) {
    servers_obj[names[i]] = {
      nodeName: names[i],
      nodeAddress: addresses[i],
      nodeLabel: labels[i],
    };
  }
  return servers_obj;
}

function get_server_choosed(servers_ids) {
  let serves = handle_servers_to_obj(serves_raw);
  let res = [];
  servers_ids.forEach((id) => {
    let item = serves[id];
    res.push(item);
  });
  return res;
}

let servers = get_server_choosed(SERVER_IDS);
console.log(servers);
let FREE_SERVER = null;

function get_date() {
  // 获取当前时间戳
  const timestamp = Date.now();

  // 创建一个新的 Date 对象
  const date = new Date(timestamp);

  // 获取月、日、时、分、秒
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，所以需要加1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // 格式化为“月日 时:分:秒”
  const formattedDate = `${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}
async function check_if_free() {
  create_log(get_date());
  create_log("🌀开始检查服务器是否空闲");
  console.log("开始检查服务器是否空闲");
  for (let item of servers) {
    console.log("check!!!!!!");
    //移除feedback最后一个<p>
    if (feedback.lastChild) {
      feedback.removeChild(feedback.lastChild);
    }
    create_log(`❓正在检查：${item.nodeName}`);
    let res = await get_server_status(item.nodeName, item.nodeAddress);
    if (res.occupied === "0,0,0,0,0,0,0,0") {
      console.log("服务器" + item.nodeName + "空闲");
      create_log("✅服务器" + item.nodeName + "空闲");
      FREE_SERVER = item;
      return;
    } else if (res == 0) {
      console.log("服务器离线：", res);
      feedback.removeChild(feedback.lastChild);
      create_log("❎服务器" + item.nodeName + "离线，已跳过");
      create_log("继续检查");
    }
  }
  if (feedback.lastChild) {
    feedback.removeChild(feedback.lastChild);
  }
  console.log("服务器全部占用");
}

async function get_and_clone_LISA() {
  return new Promise((resolve, reject) => {
    let rows = document.querySelectorAll("tr.el-table__row");
    let row_lisa = null;
    rows.forEach((row) => {
      let cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        if (cell.innerText.includes("morg_dim_256")) {
          row_lisa = row;
          console.log("找到了：", row);
          return;
        }
      });
      if (row_lisa) {
        return;
      }
    });
    if (!row_lisa) {
      reject("未找到 'morg_dim_256' 行");
      return;
    }
    row_lisa.querySelectorAll("button")[1].click();
    setTimeout(() => {
      let container = document.querySelectorAll(".container")[0];
      let lastChild = container.lastElementChild;
      let btn_clone = lastChild.children[0];
      btn_clone.click();

      setTimeout(() => {
        let container = document.querySelectorAll(".container")[0];
        let lastChild = container.lastElementChild;
        let btn_clone = lastChild.children[0];
        btn_clone.click();

        setTimeout(() => {
          let rows = document.querySelectorAll("tr.el-table__row");
          let cells = rows[0].querySelectorAll("td");
          let btns = cells[cells.length - 1];
          btns.querySelectorAll("button")[0].click();

          setTimeout(() => {
            if (window.location.hash.includes("trainingTask")) {
              resolve("跳转配置界面成功！");
            } else {
              reject("跳转配置界面失败！");
            }
          }, 500);
        }, 1000);
      }, 1000);
    }, 1000);
  });
}

function set_new_gpu(gpu_name) {
  let res = [
    ["gpu31", "0"],
    ["gpu31", "1"],
    ["gpu31", "2"],
    ["gpu31", "3"],
    ["gpu31", "4"],
    ["gpu31", "5"],
    ["gpu31", "6"],
    ["gpu31", "7"],
  ];

  res.forEach((item) => {
    item[0] = gpu_name;
  });
  return res;
}

async function set_drop_and_start_train(FREE_SERVER) {
  return new Promise((resolve, reject) => {
    console.log(`开始训练：${FREE_SERVER.nodeName}`);
    let new_gpu = set_new_gpu(FREE_SERVER.nodeName);
    let drop_vue = document.querySelector(".el-cascader").__vue__;
    drop_vue._data.checkedValue = new_gpu;

    setTimeout(() => {
      let btn_start = document.querySelectorAll(".el-button")[3];
      btn_start.click();
      setTimeout(() => {
        create_log("✅本次发起训练成功！");
        sendEmail(FREE_SERVER.nodeName);
        create_log("🕙5分钟后将再次检查...");
        create_log("-----------------------.");
        window.location.href =
          "http://172.18.127.68:8888/#/trainingTaskManagement";
        resolve("本次训练发起成功！");
      }, 500);
    }, 1000);
  });
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    let interval = 100; // 定期检查间隔时间
    let elapsed = 0;

    function check() {
      if (stop_flag) {
        create_log("❌停止运行！");
        // reject(new Error("Operation stopped"));
      } else if (elapsed >= ms) {
        resolve();
      } else {
        elapsed += interval;
        setTimeout(check, interval);
      }
    }

    setTimeout(check, interval);
  });
}

let stop_flag = false; //全局变量，用于停止循环
async function main() {
  while (!stop_flag) {
    console.log("开始新的一轮");
    await check_if_free(); // 等待检查空闲服务器完成
    if (FREE_SERVER != null) {
      //有空闲服务器
      try {
        await get_and_clone_LISA();
        await set_drop_and_start_train(FREE_SERVER);
        console.log("本次操作全部完成");
        await delay(300000);
        console.log("5分钟结束，再次检查空闲服务器");
      } catch (error) {
        console.error("操作失败：", error);
      }
    } else {
      console.log("没有空闲服务器");
      create_log("⭕没有空闲服务器，3分钟后再次检查");
      create_log("-------------------");
      await delay(180000);
    }
  }
}
let feedback; //全局变量，用于添加记录
function create_log(content) {
  let log = document.createElement("p");
  log.textContent = content;
  feedback.appendChild(log);
  feedback.scrollTop = feedback.scrollHeight;
}
function create_GUI() {
  // 创建GUI容器
  let guiContainer = document.createElement("div");
  guiContainer.style.position = "fixed";
  guiContainer.style.top = "10px";
  guiContainer.style.right = "10px";
  guiContainer.style.backgroundColor = "white";
  guiContainer.style.border = "1px solid black";
  guiContainer.style.borderRadius = "5px";
  guiContainer.style.padding = "10px";
  guiContainer.style.zIndex = "9999";
  document.body.appendChild(guiContainer);

  // 添加标题
  let title = document.createElement("h2");
  title.textContent = "服务器抢占进程";
  guiContainer.appendChild(title);

  // 添加按钮
  let button1 = document.createElement("button");
  button1.classList = "button-6";
  button1.textContent = "点击开始";
  button1.disabled = false;
  guiContainer.appendChild(button1);

  //添加反馈信息：
  feedback = document.createElement("div");
  feedback.classList = "feedback";
  feedback.textContent = "";
  guiContainer.appendChild(feedback);

  let button2 = document.createElement("button");
  button2.classList = "button-6";
  button2.textContent = "结束";
  button2.disabled = true;
  guiContainer.appendChild(button2);

  // 添加事件监听器
  button1.addEventListener("click", function () {
    if (!window.location.hash.includes("trainingTaskManagement")) {
      create_log("⚠️请跳转到 训练任务列表 页面");
      return;
    }
    create_log("✅开始");
    stop_flag = false;
    main();
    button2.disabled = false;
  });

  button2.addEventListener("click", function () {
    if (!window.location.hash.includes("trainingTaskManagement")) {
      create_log("⚠️请跳转到 训练任务列表 页面");
      return;
    }
    create_log("❎正在终止进程...");
    create_log("❎正在终止进程...");
    stop_flag = true;
    button1.disabled = false;
    button2.disabled = true;
  });

  // 添加样式
  let style = document.createElement("style");
  style.textContent = `
        #myGuiContainer {
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        }
        #myGuiContainer input {
            margin-bottom: 10px;
        }
        #myGuiContainer button {
            display: block;
            margin-bottom: 10px;
            margin:0 auto;
        }
        #myGuiContainer .feedback {
            margin:10px;
            borderRadius:5px;
            font-size:0.6rem;
        overflow-y:auto;
        max-height: 200px;
        }

        .button-6 {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  margin-bottom: 10px;
}

.button-6:hover,
.button-6:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.button-6:hover {
  transform: translateY(-1px);
}

.button-6:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
    `;
  document.head.appendChild(style);

  // 给GUI容器添加ID，方便样式控制
  guiContainer.id = "myGuiContainer";
}
function sendEmail(gpu_name) {
  function loadScrpit(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = callback;
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  function initEmail() {
    emailjs.init({
      publicKey: "MiINJFxV_IUgwKW5x",
      privateKey: "cK5lMKXKwxiB03PpsD_1N",
      // Do not allow headless browsers
      //   blockHeadless: true,
    });

    // 发送邮件的函数
    function sendEmail() {
      const serviceID = "service_phlvo8u";
      const templateID = "template_8edbqyl";
      const templateParams = {
        // to_email: "2300801795@qq.com",
        to_name: "zhukuan",
        // from_email: 'sender@example.com',
        // subject: 'Test Email',
        message: gpu_name,
      };

      emailjs.send(serviceID, templateID, templateParams).then(
        function (response) {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
          create_log("✅📧通知已发送");
        },
        function (error) {
          console.error("Failed to send email:", error);
        }
      );
    }

    setTimeout(sendEmail, 1000);
  }

  loadScrpit(
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
    initEmail
  );
}

// if(window.location.hash.includes("trainingTaskManagement")) {
//   console.log("当前页面为训练任务管理页面，开始创建GUI");
//   create_GUI();
// }

const intervalId = setInterval(() => {
  if (window.location.hash.includes("trainingTaskManagement")) {
    console.log("当前页面为训练任务管理页面，开始创建GUI");
    create_GUI();
    clearInterval(intervalId); // 满足条件后清除定时器，停止检查
  }
}, 1000); // 每隔1秒检查一次

})();