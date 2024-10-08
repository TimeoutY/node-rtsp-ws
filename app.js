Stream = require("node-rtsp-stream");
stream = new Stream({
  name: "Bunny",
  // streamUrl: "rtsp://YOUR_IP:PORT",
//   公司摄像头rtsp流地址：
// rtsp://admin:a12345678@192.168.31.124:554/cam/realmonitor?channel=1&subtype=0
  streamUrl: "rtsp://sdgs:Sdgs_2023@10.7.94.101/media/video1",
  wsPort: 9998,
  ffmpegOptions: { // ffmpeg的选项标志
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
});
