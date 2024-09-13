const express = require("express");
const app = express();

const { proxy, scriptUrl, killAll } = require("rtsp-relay")(app);

let activeStreams = {}; // 保存所有设备的活动 WebSocket 连接

app.ws("/api/stream", (ws, req) => {
    // 从请求参数中获取设备 ID 和 RTSP URL
    const deviceId = req.query.deviceId;
    const url = req.query.url;
    console.log('deviceId',deviceId, '--','url', url);
    if (!deviceId || !url) {
        ws.close();
        console.error("缺少 deviceId 或 URL");
        return;
    }

    // 检查是否存在当前设备的活动流，如果有则关闭它
    if (activeStreams[deviceId]) {
        killAll(); // 关闭所有的 FFmpeg 流
        activeStreams[deviceId].close(); // 关闭 WebSocket 连接
        console.log(`关闭之前的流连接：${deviceId}`);
    }

    // 更新当前设备的活动 WebSocket 连接
    activeStreams[deviceId] = ws;

    // 使用请求的 URL 创建新的 RTSP 流转发
    const streamProxy = proxy({
        url,
        verbose: true,
        transport: "tcp",
        additionalFlags: ["-q", "1", "-s", "1920x1080"], // 其他参数设置，例如画质
    });

    // 绑定新流到 WebSocket
    streamProxy(ws);

    // 当 WebSocket 连接关闭时，重置当前设备的活动流
    ws.on("close", () => {
        if (activeStreams[deviceId] === ws) {
            delete activeStreams[deviceId]; // 从活动流中移除设备
            console.log(`当前流已关闭：${deviceId}`);
        }
    });
});

app.listen(2000, () => {
    console.log("服务启动---端口：2000");
});
