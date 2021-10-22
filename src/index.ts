import { Canvas, Image } from "canvas";
import mergeImages from "merge-images";
import express from "express";
import path from "path";

import { unsequence } from "./helpers/dna";
import { attributeTable } from "./helpers/tables";

const app = express();
const port = process.env.PORT || 8081;

app.get("/gif/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const unsequenced = unsequence(dna);
  const order = [0, 1, 6, 5, 4, 3, 2];
  const basePath = path.join(__dirname, "../", "images/");
  const images = order.map((id) =>
    path.join(basePath, attributeTable[id].name, `${unsequenced[id].value}.png`)
  );

  const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
  var img = Buffer.from(b64.replace(/^data:image\/png;base64,/, ""), "base64");

  const headers = { "Content-Type": "image/png", "Content-Length": img.length };
  res.writeHead(200, headers);
  res.end(img);
});

app.get("/", (req, res) => res.send("You have reached the Pixsols Generator"));

app.listen(port, () => {
  console.log(`Pixsols Generator listening at on port ${port}`);
});
