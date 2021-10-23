import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CACHE_PATH } from "./constants";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import { web3 } from "@project-serum/anchor";
import { StringPublicKey } from "../types";

export function buffer2Array(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return view;
}

export function array2Buffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

export const getUnixTs = () => new Date().getTime() / 1000;

export function fromUTF8Array(data: number[], clean: boolean = false) {
  let str = "",
    i;

  for (i = 0; i < data.length; i++) {
    const value = data[i];
    if (clean && String.fromCharCode(value) == "\x00") continue;
    if (value < 0x80) {
      str += String.fromCharCode(value);
    } else if (value > 0xbf && value < 0xe0) {
      str += String.fromCharCode(((value & 0x1f) << 6) | (data[i + 1] & 0x3f));
      i += 1;
    } else if (value > 0xdf && value < 0xf0) {
      str += String.fromCharCode(
        ((value & 0x0f) << 12) |
          ((data[i + 1] & 0x3f) << 6) |
          (data[i + 2] & 0x3f)
      );
      i += 2;
    } else {
      // surrogate pair
      const charCode =
        (((value & 0x07) << 18) |
          ((data[i + 1] & 0x3f) << 12) |
          ((data[i + 2] & 0x3f) << 6) |
          (data[i + 3] & 0x3f)) -
        0x010000;

      str += String.fromCharCode(
        (charCode >> 10) | 0xd800,
        (charCode & 0x03ff) | 0xdc00
      );
      i += 3;
    }
  }

  return str;
}

export const chunks = (array: any[], size: number) =>
  array.length
    ? Array.apply(0, new Array(Math.ceil(array.length / size))).map(
        (_: any[], index: number) =>
          array.slice(index * size, (index + 1) * size)
      )
    : array;

export function cachePath(env: string, cacheName: string) {
  return path.join(CACHE_PATH, `${env}-${cacheName}.json`);
}

export function loadCache(cacheName: string, env: string) {
  const path = cachePath(env, cacheName);
  console.log(path);
  return fs.existsSync(path)
    ? JSON.parse(fs.readFileSync(path).toString())
    : undefined;
}

export const saveCache = (cacheName: string, env: string, cacheContent: any) =>
  fs.writeFileSync(
    cachePath(env, cacheName),
    JSON.stringify(cacheContent, null, 2)
  );

export const parsePrice = (price: string): number =>
  Math.ceil(parseFloat(price) * LAMPORTS_PER_SOL);

export const upload = async (data: FormData) =>
  await (
    await fetch(
      "https://us-central1-principal-lane-200702.cloudfunctions.net/uploadFile4",
      {
        method: "POST",
        body: data,
      }
    )
  ).json();

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: web3.PublicKey
) => {
  const result = await web3.PublicKey.findProgramAddress(seeds, programId);
  return [result[0].toBase58(), result[1]] as [StringPublicKey, number];
};
export const toPublicKey = (key: string | web3.PublicKey) =>
  typeof key !== "string" ? key : new web3.PublicKey(key);

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const writeFile = async (file: string, obj: any) => {
  await fs.promises.writeFile(file, JSON.stringify(obj, null, 2));
};

export const saveFile = (cacheName: string, cacheContent: any) =>
  fs.writeFileSync(cacheName, JSON.stringify(cacheContent, null, 2));

export const readDir = async (basePath: string) =>
  await fs.promises.readdir(basePath);

export const fileExist = (s: fs.PathLike) =>
  new Promise((r) => fs.access(s, fs.constants.F_OK, (e) => r(!e)));

export const loadFile = async (file: string) => {
  try {
    if (await fileExist(file))
      return JSON.parse((await fs.promises.readFile(file)).toString());
  } catch (error) {
    throw error;
  }
  return null;
};

export const randomNumber = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

export const pickRandomAndRemove = (arr: any[]) => {
  const toPick = randomNumber(0, arr.length - 1);
  return remove(arr, toPick);
};

export const pickRandom = (arr: any[]) => randomNumber(0, arr.length - 1);

export const pickRandomObject = (arr: any[]) =>
  arr[randomNumber(0, arr.length - 1)];

export const remove = (arr: any[], toPick: number) => arr.splice(toPick, 1);

export const arrRemoveValue = (arr: [], value: any) =>
  arr.filter((ele: any) => ele != value);

export const unique = (value: any, index: number, self: any) => {
  return self.indexOf(value) === index;
};

export const notUnique = (value: any, index: number, self: any) => {
  return self.indexOf(value) !== index;
};

export const reverse = (s: string) => s.split("").reverse().join("");

export const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const escapeRegExp = (string: string) =>
  string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

export const replaceAll = (str, find, replace) =>
  str.replace(new RegExp(escapeRegExp(find), "g"), replace);

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
