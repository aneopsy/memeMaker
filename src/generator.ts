import path from "path";
import mergeImages from "merge-images";
import { Image, Canvas } from "canvas";
import { unsequence } from "./helpers/dna";
import { attributeTable } from "./helpers/tables";

export const generatorHandler = async () => {
  const dna = "";
  const unsequenced = unsequence(dna);
  const order = [0, 1, 6, 5, 4, 3, 2];
  const basePath = path.join("./", "images/");
  console.log(basePath);
  const images = order.map((id) =>
    path.join(
      basePath,
      attributeTable[id].name,
      `${attributeTable[id][unsequenced[id]]}.png`
    )
  );
  console.log(JSON.stringify(images, null, 2));

  const b64 = await mergeImages(images, { Canvas: Canvas, Image: Image });

  console.log(
    `Unsequenced Attributes: ${JSON.stringify(unsequenced, null, 2)} - ${b64}`
  );

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "image/png" },
    body: b64,
  };
};
