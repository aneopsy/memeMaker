import { Canvas, createCanvas, Image } from "canvas";
import mergeImages from "merge-images";
import GIFEncoder from "gif-encoder-2";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { attributeTable } from "./tables";
import { upload } from "./various";
import { Attribute } from "../types";
import { downloadFromS3 } from "./aws";

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
      var w2 = img.width / 12;
      canvas2.width = height;
      canvas2.height = height;
      ctx2.drawImage(img, 0, 0, height, height, 0, 0, height, height);
      resolveMain(canvas2.toDataURL());
    };
  });
}

const orderAttr = (attr: Attribute[]): Attribute[] => {
  const order = [0, 1, 6, 5, 4, 3, 2];
  return order.map((id) => ({
    trait_type: attributeTable[id].name,
    value: attr.find((a) => a.trait_type === attributeTable[id].name).value,
  }));
};

export const getAttrFromMint = (mint: string): Attribute =>
  attributeTable.reduce((acc: Attribute, val): Attribute => {
    if (val.items.find((x) => x.mint === mint))
      return {
        trait_type: val.name,
        value: val.items.find((x) => x.mint === mint).name,
      };
    return acc;
  }, null);

export const generateGif = async (unsequenced: Attribute[]) => {
  const images = await Promise.all(
    orderAttr(unsequenced).map((attr) =>
      downloadFromS3(path.join(attr.trait_type, `${attr.value}.png`))
    )
  );
  const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
  return await createGif(b64);
};

export const generateSample = async (unsequenced: Attribute[]) => {
  const images = await Promise.all(
    orderAttr(unsequenced).map((attr) =>
      downloadFromS3(path.join(attr.trait_type, `${attr.value}.png`))
    )
  );
  const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });
  return await createSample(b64);
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
