# 使用包含 FFmpeg 的 Ubuntu 镜像
FROM duanxin/ubuntu2204-ffmpeg:latest

# 安装 Node.js 环境
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# 创建工作目录
WORKDIR /app

# 复制应用源码到容器中
COPY . .

# 安装应用依赖
RUN npm install -g pnpm

RUN pnpm install

# 暴露应用运行的端口
EXPOSE 2000

# 启动应用
CMD [ "node", "rtsp-relay.js" ]
