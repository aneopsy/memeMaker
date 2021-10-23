import { Attribute } from "../types";
import { attributeTable } from "./tables";

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

export const unsequence = (sequence: string): Attribute[] =>
  hex2buff(sequence).reduce((acc, id, index): any => {
    acc.push({
      trait_type: Object.values(attributeTable)[index].name,
      value: Object.values(attributeTable)[index].items.find(
        (attr) => attr.id === id
      ).name,
    });
    return acc;
  }, []);

export const sequence = (object: any[]): string =>
  buf2hex(
    object.reduce((acc: number[], id: any): number[] => {
      if (attributeTable.find((attr) => attr.name === id.trait_type))
        acc.push(
          attributeTable
            .find((attr) => attr.name === id.trait_type)
            .items.find((trait) => trait.name === id.value).id as number
        );
      return acc;
    }, [])
  );

export const replaceAttr = (attrs: Attribute[], attr: Attribute): Attribute[] =>
  attrs.reduce((acc: Attribute[], val) => {
    if (val.trait_type === attr.trait_type) acc.push(attr);
    else acc.push(val);
    return acc;
  }, []);
