Stream = require("node-rtsp-stream");
stream = new Stream({
  name: "Bunny",
  // streamUrl: "rtsp://YOUR_IP:PORT",
//   公司摄像头rtsp流地址：
// rtsp://admin:a12345678@192.168.31.124:554/cam/realmonitor?channel=1&subtype=0
  streamUrl: "rtsp://admin:a12345678@192.168.31.124:554/cam/realmonitor?channel=1&subtype=0",
  wsPort: 6789,
  ffmpegOptions: { // ffmpeg的选项标志
    "-f": "mpegts", // 输出文件格式
    "-codec:v": "mpeg1video", // 视频编解码器
    "-b:v": "1000k", // 视频比特率
    "-stats": "", // 显示统计信息
    "-r": 25, // 帧率
    "-s": "640x480", // 视频尺寸
    "-bf": 0, // B帧数量
    // 音频
    "-codec:a": "mp2", // 音频编解码器
    "-ar": 44100, // 采样率（以赫兹为单位）
    "-ac": 1, // 音频通道数
    "-b:a": "128k", // 音频比特率
  },
});
