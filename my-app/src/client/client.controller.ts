import { Hono } from "hono";
import { Bindings } from "..";
import { modernHtml } from "./view.modern";

const app = new Hono<{ Bindings: Bindings }>();

// 1. Empty list initialize 
let htmlList = "";

app.get('/sql/:modern?', async c => {
  // Base
  const currentUrl = new URL(c.req.url);
  let searchDate;
  const date = c.req.query('date');
  let limitParam = c.req.query('limit');
  let limit;
  if (limitParam) {
    limit = parseInt(limitParam);
    if (limit > 50) {
      limit = 20;
    }
  } else {
    limit = 20;
  }
  if (!date) {
    searchDate = new Date().toLocaleDateString('en-CA')
  } else {
    searchDate = date;
  }

  htmlList = "";
  console.log("📅", searchDate);
  const modern = c.req.param('modern');

  if (modern === 'modern') {
    const { results: requestData } = await c.env.TRIPLOG.prepare(`SELECT * FROM successlogs WHERE DATE(timestamp) = ? AND ENTRY LIKE '%Request' ORDER BY (id)  DESC limit ?`).bind(searchDate, limit).all();
    const { results: resultData } = await c.env.TRIPLOG.prepare(`SELECT * FROM successlogs WHERE DATE(timestamp) = ? AND ENTRY LIKE '%SuccessResponse' ORDER BY (id) DESC limit ?`).bind(searchDate, limit).all();
    htmlList = modernHtml(requestData as Array<{ entry: string, data: string }>, resultData as Array<{ entry: string, data: string }>);

  }
  else {

    // 2. Query the database
    const { results } = await c.env.TRIPLOG.prepare(`SELECT * FROM successlogs WHERE DATE(timestamp) = ? ORDER BY (id) DESC limit ?`).bind(searchDate, limit).all();
    // console.log(results);

    // 3. Create headline for entry
    for (let i in results) {
      htmlList += `<div><b style="color:blue;">${results[i].entry}</b>`
      htmlList += `<div><b style="color:blue;">${results[i].timestamp}</b>`
      // console.log(JSON.parse(results[i].data));
      // Data

      // 4. For each entry loop through to get all the keys and data
      try {
        addObject(JSON.parse(results[i].data));
      }
      catch { }
    }


  }



  // return c.json(results);
  const htmlString = clientTemplateString(currentUrl, searchDate, limit, htmlList);
  return c.html(htmlString);
})



app.get('/', async c => {
  return c.redirect('/sql');
})

app.get('/modern', async c => { })


function clientTemplateString(currentUrl: URL, searchDate: string, limit: number, htmlList: string) {

  return `<!doctype html>
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
<label for="dateInput">Search date:</label>
<input type="date" name="date" value="${searchDate}">
<button type="reset" >🔄️</button>
<label for="dateInput">Limit:</label>
<input type="number" name="limit" value="${limit}" max="50" min="1">
<button type="submit" style="width: 50%; height: 100px;">🦉</button>
</fieldset>
</form>
<p> You're searching ${searchDate}</p>
<div>${htmlList}</div>
</body>`;
}




function addObject(object: { [key: string]: any }) {

  // 5. Loop through the object to get all the keys and values
  for (const key of Object.keys(object)) {

    // 6. If the value is an object, loop through the object again and highlight in red
    if (typeof (object[key]) == "object") {
      // FIXME: some how numbers appear in keys when there is bigger list, maybe find out
      htmlList += `<div><b style="color:red;">${key.toUpperCase()}:</b>`
      console.log("🔑", Object.keys(object[key]));

      // 7. If the object just has value text just add that value, else loop through the object again
      if (Object.keys(object[key])[0] == "text") {
        // An entry containing just "text", meaning an object containing single value and just add that value after key
        htmlList += `${object[key][Object.keys(object[key])[0]]}`
      } else {
        addObject(object[key]);
      }
      htmlList += `</div>`
      continue
    }

    // 8. If the value is not an object just add the key and value
    if (key == "origin" || key == "destination") {
      htmlList += (`<div><b>${key.toUpperCase()}:</b><a href="https://www.google.com/maps/search/?api=1&query=${object[key]}">${object[key]}</a></div>`)
      //add google maps link navigation url with origin and destination key as they have the address
      if (key == "destination") {
        htmlList += (`<div><a href="https://www.google.com/maps/dir/?api=1&origin=${object["origin"]}&destination=${object[key]}">🗺️ Navigate</a></div>`)
        htmlList += (`<div><a href="https://www.google.com/maps/dir/Current+Location/${object["origin"]}/${object[key]}">🧭 Navigate with current Location</a></div>`)
      }
      continue
    }
    htmlList += (`<div><b>${key.toUpperCase()}:</b>${object[key]}</div>`)
  }
}




export default app;