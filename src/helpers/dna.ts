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

export function buf2hex(buffer) {
  return [...new Uint16Array(buffer)]
    .map((x) => x.toString(16).padStart(4, "0"))
    .join("");
}

export function buf2bin(buffer) {
  return [...new Uint16Array(buffer)]
    .map((x) => x.toString(2).padStart(16, "0"))
    .join("");
}

export const unsequence = (sequence: string): any[] =>
  hex2buff(sequence).reduce((acc, id, index): any => {
    acc.push({
      trait_type: Object.values(attributeTable)[index].name,
      value: Object.values(attributeTable)[index].items.find(
        (attr) => attr.id === id
      ).name,
    });
    return acc;
  }, []);
