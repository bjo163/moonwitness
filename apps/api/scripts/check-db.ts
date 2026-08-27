import { Database } from "sqlite-sync"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

async function checkDb() {
  try {
    const db = await open({
      filename: "moonwitness.db", // Or whatever the db name is
      driver: sqlite3.Database,
    })
    const users = await db.all('SELECT * FROM "vx.user"')
    console.log("vx.user:", users)
    const nodes = await db.all('SELECT * FROM "vx.node"')
    console.log("vx.node:", nodes)
  } catch (e) {
    console.error(e)
  }
}
checkDb()
