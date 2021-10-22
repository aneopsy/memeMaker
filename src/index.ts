import { Canvas, createCanvas, Image } from "canvas";
import mergeImages from "merge-images";
import GIFEncoder from "gif-encoder-2";
import express from "express";
import path from "path";

import { unsequence } from "./helpers/dna";
import { attributeTable } from "./helpers/tables";

const app = express();
const port = process.env.PORT || 8081;

async function createGif(b64: string, algorithm: string = "neuquant") {
  return new Promise<Buffer>(async (resolveMain) => {
    let [width, height] = await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve([image.width, image.height]);
      image.src = b64;
    });

    const canvas2 = createCanvas(height, height);
    const ctx2 = canvas2.getContext("2d");
    const parts: string[] = [];
    const img = new Image();

    img.onload = () => {
      var w2 = img.width / 12;
      for (var i = 0; i < 12; i++) {
        var x = w2 * i;
        canvas2.width = height;
        canvas2.height = height;
        ctx2.drawImage(img, x, 0, height, height, 0, 0, height, height);
        parts.push(canvas2.toDataURL());
      }
    };

    img.src = b64;

    const encoder = new GIFEncoder(height, height, algorithm, true, 12);
    encoder.start();
    encoder.setDelay(100);
    encoder.setQuality(30);

    const canvas = createCanvas(height, height);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < 12; i++) {
      await new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          encoder.addFrame(ctx);
          resolve();
        };
        image.src = parts[i];
      });
    }
    encoder.finish();
    resolveMain(encoder.out.getData());
  });
}

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

  const gif = await createGif(b64);
  // var img = Buffer.from(b64.replace(/^data:image\/png;base64,/, ""), "base64");

  const headers = { "Content-Type": "image/gif", "Content-Length": gif.length };
  res.writeHead(200, headers);
  res.end(gif);
});

app.get("/decode/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const unsequenced = unsequence(dna);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(unsequenced));
});

app.get("/", (req, res) => res.send("You have reached the Pixsols Generator"));

app.listen(port, () => {
  console.log(`Pixsols Generator listening at on port ${port}`);
});
