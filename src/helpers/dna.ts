import { Attribute } from "../types";
import { getAttributeTable } from "./aws";

export function hex2buff(hexString) {
  hexString = hexString.replace(/^0x/, "");
  if (hexString.length % 2 != 0) {
    console.log(
      "WARNING: expecting an even number of characters in the hexString"
    );
  }
  var bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log("WARNING: found non-hex characters", bad);
  }
  var pairs = hexString.match(/[\dA-F]{4}/gi);
  var integers = pairs.map(function (s) {
    return parseInt(s, 16);
  });
  var array = new Uint16Array(integers);
  return array;
}

export function buf2hex(buffer: number[]) {
  return [...new Uint16Array(buffer)]
    .map((x) => x.toString(16).padStart(4, "0"))
    .join("");
}

export function buf2bin(buffer: number[]) {
  return [...new Uint16Array(buffer)]
    .map((x) => x.toString(2).padStart(16, "0"))
    .join("");
}

export const unsequence = async (sequence: string): Promise<Attribute[]> => {
  const attributeTable = await getAttributeTable();
  return hex2buff(sequence).reduce((acc, id, index): any => {
    console.log(id, attributeTable[index].name, attributeTable[index].items);
    acc.push({
      trait_type: attributeTable[index].name,
      value: attributeTable[index].items.find((attr: any) => attr.id === id)
        .name,
    });
    return acc;
  }, []);
};

export const sequence = async (object: any[]): Promise<string> => {
  const attributeTable = await getAttributeTable();
  return (
    buf2hex(
      attributeTable
        ?.reduce((acc, val) => {
          acc.push(object.find((attr) => val.name === attr.trait_type));
          return acc;
        }, [])
        ?.reduce((acc: number[], id: any): number[] => {
          if (attributeTable.find((attr) => attr.name === id.trait_type))
            acc.push(
              attributeTable
                .find((attr) => attr.name === id.trait_type)
                .items.find((trait) => trait.name === id.value).id as number
            );
          return acc;
        }, [])
    ) || ""
  );
};

export const replaceAttr = (attrs: Attribute[], attr: Attribute): Attribute[] =>
  attrs.reduce((acc: Attribute[], val) => {
    if (val.trait_type === attr.trait_type) acc.push(attr);
    else acc.push(val);
    return acc;
  }, []);
