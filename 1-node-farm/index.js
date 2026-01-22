const http = require("http");
const url = require("url"); //necessary to parse var in the URL
const fs = require("fs");

const replaceTemplate = require("./module/replaceTemplate");

/**
 * Template  will also be the same so read it when start the application
 * We are doing the Sync version because it is being done doing at the begining.
 * and will be executade only once when the application get loaded.
 * However it couldn't be done inside the callback function of the server,
 * beacuse if there is many request at a time the code will be blocked, once for
 * each request!!!
 *
 * Replacing the placeholders. Insted of using the '', use a /regex/g and use
 * the 'g' (global) flag, because there might be multiple instances of
 * that placeholder. Ex.: PRODUCTNAME APPEARAS IN MORE THAN ONE PLACE.
 *
 * A new var output was used to manipulate the template as it's not a good practice
 * manipulate the template directly. Besides that, .replace returns a new string and
 * doesn't modify the original.
 *
 * "not_organic" is the name of the class that makes the bedge disapear
 * */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data); // returns an array of JS objs

const tempOverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  "utf-8",
);

///////////////////////////////////////////////////

const server = http.createServer((req, res) => {
  // get access to the object nad these props
  const { query, pathname } = url.parse(req.url, true);

  //Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //Product
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    //tell the browser thaat we are sending a json

    res.writeHead(200, { "Content-type": "application/json" });

    res.end(data);
    //Not Found
  } else {
    res.writeHead(404, {
      "Const-type": "text/html",
      "my-own-header": "helo milionare",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("The server is up and running. Listening on port 8000!"),
);
