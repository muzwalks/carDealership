const express = require("express");
const app = express();
const path = require("path");

require("./app/routes")(app);
require("./app/server")();
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
