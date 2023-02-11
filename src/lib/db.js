import mysql from "mysql2/promise";
import fs from "fs";

export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // ssl: {
    //   //only for local testing if using planet scale
    //   key: fs.readFileSync("mysql_keys/ca-key.pem"),
    //   cert: fs.readFileSync("mysql_keys/ca-cert.pem"),
    // },
  });
  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
