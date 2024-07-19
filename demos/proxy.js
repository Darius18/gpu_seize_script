const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();

// 允许跨域请求
app.use(
  cors({
    origin: "http://172.18.127.68:8888", // 允许的来源
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // 允许发送凭证
  })
);

// 设置代理中间件
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "http://172.18.127.66:8066", // 目标服务器地址
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // 重写路径
    },
    onProxyRes: function (proxyRes, req, res) {
      // 在代理响应中添加CORS头
      res.header("Access-Control-Allow-Origin", "http://172.18.127.68:8888");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
    },
    onError: function (err, req, res) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end(
        "Something went wrong. And we are reporting a custom error message."
      );
    },
  })
);

app.listen(3000, () => {
  console.log("代理服务器运行在 http://localhost:3000");
});
