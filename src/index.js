import "module-alias/register";
import http from "http";
import app from "./app";

const server = http.createServer(app);

const port = app.get("port");

server.listen(app.get("port") || 8003, "0.0.0.0");

const onError = (error) => {
  if (error.syscall !== "listen") throw error;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server Listening on My custom port " + bind);
};

server.on("error", onError);
server.on("listening", onListening);
