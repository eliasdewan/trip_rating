import { Hono } from "hono";
import { Bindings } from "..";

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const currentUrl = new URL(c.req.url);
  let searchDate;
  const date = c.req.query('date');
  let limitParam = c.req.query('limit');
  let limit;
  if (limitParam) {
    limit = parseInt(limitParam);
    if (limit > 30) {
      limit = 10;
    }
  } else {
    limit = 10;
  }
  if (!date) {
    searchDate = new Date().toLocaleDateString('en-CA')
  } else {
    searchDate = date;
  }


  // const keys = await c.env.TRIP_LOG.list({ prefix: "2024-08-09T14" })

  let result, value, keys, htmlList = "";
  function addObject(object: { [key: string]: any }) {

    for (const key of Object.keys(object)) {
      if (typeof (object[key]) == "object") {
        htmlList += `<div><b style="color:red;">${key.toUpperCase()}:</b>`
        console.log(Object.keys(object[key]));
        if (Object.keys(object[key])[0] == "text") {

          htmlList += `${object[key][Object.keys(object[key])[0]]}`
        } else {
          addObject(object[key]);
        }
        htmlList += `</div>`
        continue
      }
      htmlList += (`<div><b>${key.toUpperCase()}:</b>${object[key]}</div>`)
    }
  }
  try {
    result = await c.env.TRIP_LOG.list({ prefix: searchDate })
    if (result) {
      console.log("yes keys");
      keys = result.keys.toReversed().slice(0, limit);
      for (let i in keys) {
        value = await c.env.TRIP_LOG.get(keys[i].name, { type: "json" }) as { [key: string]: any }
        htmlList += `<div><b style="color:blue;">${keys[i].name}:</b>`
        addObject(value);
      }

      // value = await c.env.TRIP_LOG.get(keys[0].name, { type: "json" }) as { [key: string]: any }
      // htmlList += `<div><b style="color:blue;">${keys[0].name}:</b>`
      // addObject(value);
    }
  } catch (e) {
    console.log(e);

  }
  const htmlString = `<!doctype html>
    <head>
    <title>Trip Log</title>
    <style>
      html * {
        font-size: 16px;
        line-height: 1.625;
        color: #2020131;
        font-family: system-ui, sans-serif;
      }
    </style>
  </head>
  

<body>
<h1>TripLog</h1>

<form action=${currentUrl} method="GET">
<fieldset>
<label for="dateInput">Choose a date:</label>
<input type="date" name="date" value="${searchDate}">
<label for="dateInput">Choose a limit:</label>
<input type="number" name="limit" value="${limit}" max="30" min="1">
<button type="submit">Submit</button>
</fieldset>
</form>
<p> You're searching ${searchDate}</p>
<div>${htmlList}</div>
</body>`;
  return c.html(htmlString);
})


app.get('/sql', async c => {
  const { results } = await c.env.TRIPLOG.prepare('SELECT * FROM successlogs ORDER BY (id) DESC limit 10').all();

  return c.json(results);
})
export default app;