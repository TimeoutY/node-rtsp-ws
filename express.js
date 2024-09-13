const Stream = require("node-rtsp-stream");
const express = require("express");
const app = express();
// let router = express.Router();
// 设置rtsp视频流
// const rtsp_url = 'rtsp://192.168.1.10:554/stream1'

var streams = {};

app.all("*", function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");

  if (req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});
// 处理所有的OPTIONS请求

//开启一路新视频
function setNew(id, rtsp) {
  console.log('rtsp----',rtsp);
  
  return (streams[id] = new Stream({
    name: "sockets",
    // streamUrl: 'rtsp://admin:hiwei713@192.168.1.65:554/h264/ch33/main/av_stream',
    streamUrl: rtsp,
    wsPort: `9980`,
    ffmpegOptions: {
      // 选项ffmpeg标志
      '-rtsp_transport': 'tcp', // 使用 TCP 传输
      "-f": "mpegts", // 输出文件格式
      "-codec:v": "mpeg1video", // 视频编解码器
      "-stats": "", // 显示统计信息
      "-r": 30, // 帧率
      "-s": '1920x1080',         // 设置分辨率，例如 720p（高清）
      "-b:v": "1000k",             // 设置视频比特率，例如 2 Mbps，影响清晰度
      // "-preset": "veryfast",    // 设置编码速度，影响 CPU 使用和清晰度平衡
      // "-s": "640x480", // 视频尺寸
      // "-s": "1920x1080",
      "-bf": 0, // B帧数量
      '-an': '', // 禁用音频
      // // 音频
      // "-codec:a": "mp2", // 音频编解码器
      // "-ar": 44100, // 采样率（以赫兹为单位）
      // "-ac": 1, // 音频通道数
      // "-b:a": "128k", // 音频比特率
    },
  }));
}
// 关闭一路
function closeS(id) {
  if (streams[id]) {
    streams[id].wsServer.close();
    streams[id].mpeg1Muxer.stream.kill();
    streams[id] = null;
  }
}
app.get("/open", (req, res) => {
  if (!req.query.rtsp) {
    res.send({ code: 500, msg: "没有获取到rtsp地址", port: `998${req.query.id}` });
    return
  }
  if (!streams[req.query.id]) {
    streams[req.query.id] = setNew(req.query.id, req.query.rtsp);
  }
  res.send({ code: 200, msg: "成功", port: `998${req.query.id}` });
});

app.get("/close", (req, res) => {
  //关闭已经开启的websocket

  if (req.query.id == "all") {
    // streams
    for (let i = 1; i < 8; i++) {
      console.log(streams[i]);
      if (streams[i]) {
        closeS(i);
      }
    }
  } else {
    closeS(req.query.id);
  }
  console.log("关闭");
  res.send({ code: 200, msg: "关闭成功" });
});

app.listen(1111, function () {
  console.log("启动:1111");
});
