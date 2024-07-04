import express from "express";
import { open } from "sqlite";
import { Database } from "sqlite3";

async function main() {
  const app = express();
  const port = 8090;
  const db = await open({
    filename: ":memory:",
    driver: Database,
  });

  // initialize DB here
  {
    await db.run("create table users (name text)");
    await db.run("insert into users values (?)", ["(your name here)"]);
  }

  // set up route handlers here
  app.get("/", async (_req, res) => {
    const names: string[] = [];
    await db.each(`select name from users`, (err: Error | null, row: { name: string }) => {
      if (err != undefined) {
        throw err;
      }
      names.push(row.name);
    });
    res.json(names.map((name) => `hello, ${name}!`));
  });

  // run the app
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main();
