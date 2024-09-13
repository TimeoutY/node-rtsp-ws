const onvif = require('node-onvif');
const express = require('express');
const app = express();

app.use(express.json());

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
// 发现 ONVIF 网络摄像头
app.post('/onvif', (req, resd) => {
  console.log(req.body);
  const { addr, username, password } = req.body;
  onvif.startProbe().then((device_info_list) => {
    console.log(device_info_list.length + ' devices were found');
    console.log(device_info_list);
    device_info_list.forEach((info) => {
      console.log('- ' + info.urn);
      console.log('  - ' + info.name);
      console.log('  - ' + info.xaddrs[0]);
    });

    // 假设我们使用第一个发现的设备
    // if (device_info_list.length > 0) {
    let device = new onvif.OnvifDevice({
      xaddr: 'http://' + addr + '/onvif/device_service',
      user: username, // 从接口传递过来的用户名
      pass: password // 从接口传递过来的密码
    });
    device.init().then(() => {
      let url = device.getUdpStreamUrl();
      console.log('The device is initialized');
      resd.send({ code: 200, msg: '摄像头连接成功', data: { addr: url } });
      // 创建控制摄像头的接口
      app.post('/control/start', (req, res) => {
        console.log('收到开始控制请求', req.body);
        const params = {
          'speed': {
            'x': req.body.x || 0, // 平移速度
            'y': req.body.y || 0, // 倾斜速度
            'z': req.body.z || 0  // 缩放速度
          },
          'timeout': req.body.timeout || 1 // 持续时间（秒）
        };
        console.log(params);
        return device.ptzMove(params).then((r) => {
          res.send({ code: 200, msg: 'PTZ移动命令发送成功' });
        }).catch((error) => {
          res.status(500).send({ code: 500, msg: '发送PTZ移动命令时出错', error: JSON.stringify(error) });
        });
      });
      app.post('/control/stop', (req, res) => {
        console.log('收到停止控制请求', req.body);
        device.ptzStop().then((r) => {
          res.send({ code: 200, msg: 'PTZ--stop' });
        }).catch((error) => {
          res.status(500).send({ code: 500, msg: '发送PTZ移动命令时出错', error });
        });

      });

      // }).catch((error) => {
      //   console.error(error);
      // });
      //   }
    }).catch((error) => {
      console.error(error);
    });
  }).catch((error) => {
    console.error(error);
  });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
