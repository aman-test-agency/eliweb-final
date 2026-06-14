// const express = require("express");
// const next = require("next");
// const cors = require("cors");

// const dev = process.env.NODE_ENV !== "production";
// const port = parseInt(process.env.PORT || "5000", 10);
// const app = next({ dev, dir: __dirname });
// const handle = app.getRequestHandler();

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://www.eliweb.com",
//   "https://eliweb-final.vercel.app",  // add this line
//   process.env.CLIENT_URL,
//   process.env.FRONTEND_URL,           // add this too
// ].filter(Boolean);

// app.prepare().then(() => {
//   const server = express();

//   // server.use(
//   //   cors({
//   //     origin(origin, callback) {
//   //       if (!origin || allowedOrigins.includes(origin)) {
//   //         callback(null, true);
//   //         return;
//   //       }
//   //       callback(new Error("Not allowed by CORS"));
//   //     },
//   //     credentials: true,
//   //   }),
//   // );
// server.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//         return;
//       }
//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   }),
// );
//   server.get("/health", (_req, res) => {
//     res.json({ status: "ok" });
//   });

//   server.all("*", (req, res) => handle(req, res));

//   server.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> EliWeb API ready on http://localhost:${port}`);
//   });
// });
const express = require("express");
const next = require("next");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "5000", 10);
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.eliweb.in",
  "https://eliweb-final.vercel.app",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.prepare().then(() => {
  const server = express();

  server.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );

  server.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> EliWeb API ready on http://localhost:${port}`);
  });
});