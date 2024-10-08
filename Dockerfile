# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine as builder

# 更新包管理器并安装 FFmpeg
RUN apk add --no-cache ffmpeg

# 创建工作目录
WORKDIR /app

# 复制应用源码到容器中
COPY . .

# 安装 pnpm 包管理器和应用依赖
RUN npm install -g pnpm && pnpm install

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD [ "node", "rtsp-flunet.js" ]
