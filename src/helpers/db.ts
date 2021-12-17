import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

export const getConnection = async () => {
  //USE VAR ENV
  return await mysql.createConnection({
    host: "23.254.224.229",
    user: "pddpezpw_aneopsy",
    password: "=(gWGP-Cuy0s",
    database: "pddpezpw_nft",
    port: 3306,
  });
};

export const query = async (sql: string, params: any) => {
  const connection = await getConnection();
  const [results] = await connection.execute(sql, params);

  return results;
};

export const getAttributeTable = async () => {
  const connection = await getConnection();
  const result = await connection.query(
    "SELECT t.key AS traitID, t.name AS traitName, a.name AS attributeName, a.key AS attributeID FROM trait t LEFT JOIN `attribute` a ON t.`attribute` = a.key"
  );
  return (result[0] as any[]).reduce((acc, val) => {
    if (!acc.find((x: any) => x.id === val.attributeID))
      acc.push({ id: val.attributeID, name: val.attributeName, items: [] });
    acc[acc.findIndex((x: any) => x.id === val.attributeID)].items.push({
      id: val.traitID,
      name: val.traitName,
    });
    return acc;
  }, []);
};

export const isUniq = async (dna) => {
  const connection = await getConnection();
  const result = await connection.query(
    `SELECT count(*) FROM uniqueness u WHERE dna = "${dna}"`
  );
  return (result[0] as unknown) === 0;
};

export const addUniq = async (mint, dna) => {
  const connection = await getConnection();
  const result = await connection.query(
    `INSERT INTO uniqueness (mint, dna, update_timestamp) VALUES (${mint}, ${dna}, ${Date.now()})`
  );
  return (result[0] as unknown) === 0;
};
