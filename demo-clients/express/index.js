const express = require("express");
const crypto = require("crypto");
const port = 8000;
const app = express();
const axios = require("axios");
const http = require("http").Server(app);
const clientId = "55a0c367-e820-41d2-8682-f5cde2178f9c";
const client_secret =
  "560b9b615224ae04b8ff063615a0e78a9f05321bb93929b9de8b64a30495331247baf02e72d66951e0bf161eed94067e9d8217f39c73fe61f6a5fd78a46e42ff";
const authServer = {
  host: "localhost",
  port: 3000,
  path: "/user/authorize",
};
const redirect_uri = "http://localhost:8000/callback";
let data = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

const hashAuthRequest = (state) => {
  const hash = crypto.createHash("sha256");
  hash.update(`${clientId}${client_secret}`);
  hash.update(`${state}${client_secret}`);
  const digest = hash.digest("hex");
  const nonce = digest.toString().substring(0, 32);
  return nonce;
};

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/data", (_, res) => {
  res.json(data);
});

app.get("/login", (_, res) => {
  const state = crypto.randomBytes(32).toString("hex").substring(0, 16);
  const nonce = hashAuthRequest(state);
  const scopes = "repo-3 profile-3 notes-15";
  res.redirect(
    301,
    `http://${authServer.host}:${authServer.port}${authServer.path}?client_id=${clientId}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes}&state=${state}&nonce=${nonce}`
  );
});

const refreshTokens = async (refreshToken, userId) => {
  const data = {
    client_id: clientId,
    client_secret: client_secret,
    refreshToken: refreshToken,
    userId: userId,
  };
  const res = await axios.post(
    `http://${authServer.host}:${authServer.port}/api/apps/refresh-access-token`,
    data
  );
  return res.data;
};

const getAccessToken = async (code) => {
  const data = {
    client_id: clientId,
    client_secret: client_secret,
    code: code,
  };
  const res = await axios.post(
    `http://${authServer.host}:${authServer.port}/api/apps/get-access-token`,
    data
  );
  return res.data;
};

app.use("/callback", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    res.send("Error: " + error);
    return;
  }
  if (!code) {
    res.send("Error: No code received");
    return;
  }
  data = await getAccessToken(code)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
  res.redirect(302, "/data");
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
