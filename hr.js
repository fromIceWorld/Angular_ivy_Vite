const socket = new WebSocket("ws://localhost:8889");
socket.OPEN = () => socket.send("客户端请求建立WebSocket连接");
socket.onmessage = (event) => {
  // location.reload();
  const data = event.data;
  console.log(data);
  let { path, time } = JSON.parse(data);
  pathInfo = path.replace(/\\/g, "/");
  if (pathInfo.endsWith(".css")) {
  } else if (pathInfo.endsWith(".ts") || pathInfo.endsWith(".js")) {
    Promise.all([import("/@modules/@angular/core"), import(pathInfo)]).then(
      (list) => {
        const [core, module] = list;
        const moduleRef = core.ɵCompiler_compileModuleSync__POST_R3__(module);
        console.log(moduleRef);
      }
    );
  }
};
socket.onclose = () => {
  console.log("客户端断开WebSocket连接");
};
