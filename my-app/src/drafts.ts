// Code used previously no longer needed

import { Hono } from "hono";
import { Bindings } from ".";

const app = new Hono<{ Bindings: Bindings }>()

// run to execute , all to retrive
app.post('/db', async (c) => {
  // const TB = await c.env.TRIPLOG.prepare('select * FROM successlogs').all();
  // const { results } = await c.env.TRIPLOG.prepare('select * FROM successlogs').all();
  // console.log(TB, "dt tb", results);

  let cursor = null;
  let smt;
  let result;
  const limit = 20;
  do {
    let kvkeys = [];
    const kvResponse = await c.env.TRIP_LOG.list({ cursor, limit });
    const kvResponseKeys = kvResponse.keys;
    //Prepare for each part
    smt = 'INSERT INTO successlogs (entry,data) VALUES ';

    // For every key and value , build two binding positions
    let index = 1;
    for (const key of kvResponseKeys) {
      smt = smt.concat(`(?${index * 2 - 1},?${index * 2}),`)
      index++;

      const value = await c.env.TRIP_LOG.get(key.name);
      kvkeys.push(key.name, value);
    }


    // End of statement check for leading comma
    if (smt.endsWith(",")) {
      smt = smt.slice(0, -1);
      console.log(smt);
    }

    // Run the sql query
    result = await c.env.TRIPLOG.prepare(smt).bind(...kvkeys).run();
    cursor = kvResponse.cursor;
    console.log(">", cursor, "<");

  } while (cursor);

  return c.json({ statement: smt, result });
});

// old database test
app.post('/dbtest', async c => {
  let smt = 'INSERT INTO successlogs (entry,data) VALUES'
  for (let i = 0; i < 2; i++) {

    let cc = i + 1;
    smt = smt.concat(`(?${cc * 2 - 1},?${cc * 2}),`)
  }
  if (smt.endsWith(",")) {
    smt = smt.slice(0, -1)
  }

  let bindList = [];

  for (let i = 0; i < 2; i++) {
    bindList.push(`'key${i}'`, `'val'ue${i}'`)
    // smt = smt.concat(`('key${i}', 'value${i}'),`)
  }
  const result = await c.env.TRIPLOG.prepare(smt).bind(...bindList).run();
  console.log(bindList.toString());
  console.log(bindList.length);
  console.log(result);

  console.log(smt);

  return c.json({ statement: smt });
})