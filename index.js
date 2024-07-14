function get_server_status(nodeName, nodeAddress) {
  return new Promise((resolve, reject) => {
    // 创建 WebSocket 连接
    const ws = new WebSocket("ws://172.18.127.66:8067/resource");

    // 连接成功时执行
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
    };

    // 接收到消息时执行
    ws.onmessage = function (event) {
      console.log("Received:", event.data);
      resolve(JSON.parse(event.data));
    };

    // 连接关闭时执行
    ws.onclose = function () {
      console.log("WebSocket disconnected!");
    };

    // 发生错误时执行
    ws.onerror = function (error) {
      console.error("WebSocket Error:", error);
      reject(error);
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
  "gpu38",
  "gpu22",
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
  for (let i = 0; i < serves.nodesListerName.split(",").length; i++) {
    servers_obj[serves.nodesListerName.split(",")[i]] = {
      nodeName: serves.nodesListerName.split(",")[i],
      nodeAddress: serves.nodesListerAddr.split(",")[i],
      nodeLabel: serves.nodesListerLabel.split(",")[i],
    };
  }
  return servers_obj;
}
function get_server_choosed(servers_ids) {
  let serves = handle_servers_to_obj(serves_raw);
  let res = [];
  servers_ids.forEach((id) => {
    let item = serves[id];
    // console.log(item);
    res.push(item);
  });
  return res;
}

let servers = get_server_choosed(SERVER_IDS_TEST);
console.log(servers);
let FREE_SERVER = null; //空闲服务器的信息，obj

/**
 * 逐个检查本服务器是否全部是空闲
 */
async function check_if_free() {
  for (let item of servers) {
    console.log("check!!!!!!");
    let res = await get_server_status(item.nodeName, item.nodeAddress);
    console.log(typeof res);
    if (res.occupied === "0,0,0,0,0,0,0,0") {
      console.log("服务器" + item.nodeName + "空闲");
      FREE_SERVER = item;
      set_params(); //设置配置参数
      return;
    }
  }
  console.log("服务器全部占用");
}

check_if_free();

function get_and_clone_LISA() {
  let rows = document.querySelectorAll("tr.el-table__row");
  let row_lisa = null;
  rows.forEach((row) => {
    let cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      if (cell.innerText.includes("lisa")) {
        row_lisa = row;
        console.log("找到了：", row);
        return;
      }
    });
    if (row_lisa) {
      return;
    }
  });
  //点击克隆lisa
  row_lisa.querySelectorAll("button")[1].click();
  setTimeout(() => {
    let container = document.querySelectorAll(".container")[0];
    let lastChild = container.lastElementChild;
    let btn_clone = lastChild.children[0];
    btn_clone.click();

    //点击返回训练任务列表
    setTimeout(() => {
      let container = document.querySelectorAll(".container")[0];
      let lastChild = container.lastElementChild;
      let btn_clone = lastChild.children[0];
      btn_clone.click();

      //对新建的lisa任务进行资源配置
      setTimeout(() => {
        //点击“配置按钮”
        let rows = document.querySelectorAll("tr.el-table__row");
        let cells = rows[0].querySelectorAll("td");
        let btns = cells[cells.length - 1];
        btns.querySelectorAll("button")[0].click();

        setTimeout(() => {
          if (window.location.hash.includes("trainingTask")) {
            console.log("跳转配置界面成功！");
            set_params_and_start();
          } else {
            console.error("跳转配置界面失败！");
          }
        }, 500);
      }, 1000);
    }, 1000);
  }, 1000);
}

let send_data_to_start;

/**
 * 设置发送的参数
 */
function set_params() {
  send_data_to_start = {
    admin: false,
    type: 2,
    content: {
      ids: { uid: 19, tid: 3329 },
      command: "START",
      containerName: "",
      logAddress: "",
      modelName: null,
      originalModelUrl: null,
      continuousModelUrl: null,
      resourceType: "gpu",
      modelType: 8,
      frameworkType: -1,
      toolBoxName: "无",
      params: "",
      selectedDataset: "null",
      imageName: "base-images/lisa:v1.2",
      distributingMethod: -1,
      cmd: "source /home/haoxiangzhao/anaconda3/bin/activate lisa;deepspeed --master_port=24999 /home/haoxiangzhao/LISA/train_ds.py",
      selectedNodes: [
        {
          nodeName: FREE_SERVER.nodeName,
          nodeAddress: FREE_SERVER.nodeAddress,
          nodeLabel: FREE_SERVER.nodeLabel,
          gpuIndex: "0,1,2,3,4,5,6,7",
        },
      ],
    },
  };
  console.log("要发送的配置参数：", send_data_to_start);
}

function start_train() {
  console.log("----开始训练---");
}
