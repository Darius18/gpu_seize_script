let t = {
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
        nodeName: "gpu25",
        nodeAddress: "172.18.127.105",
        nodeLabel: "SXM-A800-80G",
        gpuIndex: "0,1,2,3,4,5,6,7",
      },
    ],
  },
};

// 创建 WebSocket 连接
const ws = new WebSocket("ws://172.18.127.66:8066");

// 连接成功时执行
ws.onopen = function () {
  console.log("WebSocket connected!");
  ws.send(JSON.stringify(t));
  console.log("Message sent:", t);
};

// 接收到消息时执行
ws.onmessage = function (event) {
  console.log("Received:", event.data);
};

// 连接关闭时执行
ws.onclose = function () {
  console.log("WebSocket disconnected!");
};

// 发生错误时执行
ws.onerror = function (error) {
  console.error("WebSocket Error:", error);
};
