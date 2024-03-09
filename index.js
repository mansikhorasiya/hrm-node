const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", require("./src/routers/index.routes"));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
