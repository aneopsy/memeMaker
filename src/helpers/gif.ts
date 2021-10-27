import { Canvas, createCanvas, Image } from "canvas";
import mergeImages from "merge-images";
import GIFEncoder from "gif-encoder-2";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { upload } from "./various";
import { Attribute } from "../types";
import {
  downloadAttrS3,
  downloadImageS3,
  getAttributeTable,
  uploadImageS3,
} from "./aws";
import { unsequence } from "./dna";

export const checkDNA = (dna: string) => {
  return /[0-9A-Fa-f]{28}/g.test(dna);
};
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

async function createSample(b64: string) {
  return new Promise<string>(async (resolveMain) => {
    let [_, height] = await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve([image.width, image.height]);
      image.src = b64;
    });

    const canvas2 = createCanvas(height, height);
    const ctx2 = canvas2.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas2.width = height;
      canvas2.height = height;
      ctx2.drawImage(img, 0, 0, height, height, 0, 0, height, height);
      resolveMain(canvas2.toDataURL());
    };
    img.src = b64;
  });
}

function removeImageBlanks(imageObject) {
  const imgWidth = imageObject.width;
  const imgHeight = imageObject.height;
  var canvas = createCanvas(imgWidth, imgHeight);
  var context = canvas.getContext("2d");
  context.drawImage(imageObject, 0, 0);

  var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
    data = imageData.data,
    getRBG = function (x, y) {
      var offset = imgWidth * y + x;
      return {
        red: data[offset * 4],
        green: data[offset * 4 + 1],
        blue: data[offset * 4 + 2],
        opacity: data[offset * 4 + 3],
      };
    },
    isWhite = function (rgb) {
      return (
        rgb.opacity === 0 ||
        (rgb.red > 200 && rgb.green > 200 && rgb.blue > 200)
      );
    },
    scanY = function (fromTop) {
      var offset = fromTop ? 1 : -1;

      // loop through each row
      for (
        var y = fromTop ? 0 : imgHeight - 1;
        fromTop ? y < imgHeight : y > -1;
        y += offset
      ) {
        // loop through each column
        for (var x = 0; x < imgWidth; x++) {
          var rgb = getRBG(x, y);
          if (!isWhite(rgb)) {
            if (fromTop) {
              return y;
            } else {
              return Math.min(y + 1, imgHeight);
            }
          }
        }
      }
      return null; // all image is white
    },
    scanX = function (fromLeft) {
      var offset = fromLeft ? 1 : -1;

      // loop through each column
      for (
        var x = fromLeft ? 0 : imgWidth - 1;
        fromLeft ? x < imgWidth : x > -1;
        x += offset
      ) {
        // loop through each row
        for (var y = 0; y < imgHeight; y++) {
          var rgb = getRBG(x, y);
          if (!isWhite(rgb)) {
            if (fromLeft) {
              return x;
            } else {
              return Math.min(x + 1, imgWidth);
            }
          }
        }
      }
      return null; // all image is white
    };

  var cropTop = scanY(true),
    cropBottom = scanY(false),
    cropLeft = scanX(true),
    cropRight = scanX(false),
    cropWidth = cropRight - cropLeft,
    cropHeight = cropBottom - cropTop;

  canvas.width = cropWidth;
  canvas.height = cropHeight;
  // finally crop the guy
  canvas
    .getContext("2d")
    .drawImage(
      imageObject,
      cropLeft,
      cropTop,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

  return canvas.toDataURL();
}

async function createCrop(b64: string) {
  return new Promise<string>(async (resolveMain) => {
    const img = new Image();

    img.onload = () => {
      resolveMain(removeImageBlanks(img));
    };
    img.src = await createSample(b64);
  });
}

const orderAttr = async (attr: Attribute[]): Promise<Attribute[]> => {
  const attributeTable = await getAttributeTable();
  const order = [0, 1, 6, 5, 4, 3, 2];
  return order.map((id) => ({
    trait_type: attributeTable[id].name,
    value: attr.find((a) => a.trait_type === attributeTable[id].name).value,
  }));
};

export const getAttrFromMint = async (mint: string): Promise<Attribute> => {
  const attributeTable = await getAttributeTable();
  return attributeTable.reduce((acc: Attribute, val): Attribute => {
    if (val.items.find((x) => x.mint === mint))
      return {
        trait_type: val.name,
        value: val.items.find((x) => x.mint === mint).name,
      };
    return acc;
  }, null);
};

export const generateGif = async (dna: string) => {
  if (!checkDNA(dna)) throw new Error("Wrong DNA");
  try {
    return Buffer.from(await downloadImageS3(`gif/${dna}.gif`));
  } catch {
    const unsequenced = await unsequence(dna);
    const images = await Promise.all(
      (
        await orderAttr(unsequenced)
      ).map((attr) =>
        downloadAttrS3(path.join(attr.trait_type, `${attr.value}.png`))
      )
    );
    const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
    const gif = await createGif(b64);
    await uploadImageS3(gif, `gif/${dna}.gif`);
    return gif;
  }
};

export const generateSample = async (dna: string) => {
  if (!checkDNA(dna)) throw new Error("Wrong DNA");
  try {
    return Buffer.from(await downloadImageS3(`sample/${dna}.png`));
  } catch {
    const unsequenced = await unsequence(dna);
    const images = await Promise.all(
      (
        await orderAttr(unsequenced)
      ).map((attr) =>
        downloadAttrS3(path.join(attr.trait_type, `${attr.value}.png`))
      )
    );
    const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
    const sample = await createSample(b64);
    await uploadImageS3(sample, `sample/${dna}.png`);
    return sample;
  }
};

export const generateCrop = async (dna: string) => {
  if (!checkDNA(dna)) throw new Error("Wrong DNA");
  try {
    return Buffer.from(await downloadImageS3(`crop/${dna}.png`));
  } catch {
    const unsequenced = await unsequence(dna);
    const images = await Promise.all(
      (
        await orderAttr(unsequenced)
      ).map((attr) =>
        downloadAttrS3(path.join(attr.trait_type, `${attr.value}.png`))
      )
    );
    const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
    const crop = await createCrop(b64);
    await uploadImageS3(crop, `crop/${dna}.png`);
    return crop;
  }
};

export const update2Arweave = async (manifest: any, image: Buffer) => {
  const data = new FormData();
  let uri = undefined;
  manifest.image = "image.gif";
  manifest.properties.files[0].uri = "image.gif";

  data.append(
    "transaction",
    "3PaWgDdv4ete2MxscSP4ViorTEhR6c2Bg66APEWrC2mt4YFzJ7ETLhRcNdTVYPEQskWqzg6JDKyq1R4ZHs2T36w8"
  );
  data.append("env", "mainnet-beta");
  data.append("file[]", image, "image.gif");
  data.append("file[]", JSON.stringify(manifest), "metadata.json");
  try {
    const metadataFile = (await upload(data)).messages?.find(
      (m: any) => m.filename === "manifest.json"
    );
    if (metadataFile?.transactionId) {
      uri = `https://arweave.net/${metadataFile.transactionId}`;
      const resp = await axios.get(uri);
      if (resp.status === 200) {
        const resp2 = await axios.get((resp.data as any).image);
        if (
          resp2.status !== 200 &&
          resp2.status !== 304 &&
          resp2.status !== 202
        ) {
          throw new Error("Link down");
        }
      } else {
        throw new Error("Link down");
      }
    } else {
      throw new Error("Link down");
    }
  } catch {
    throw new Error("Error during upload");
  }

  return uri;
};
