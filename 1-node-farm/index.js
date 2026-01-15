const http = require("http");
const url = require("url");
const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

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
const tempOverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  "utf-8"
);

const replaceTemplate = (tempCard, product) => {
  let output = tempCard.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  //console.log(typeof output);

  return output;
};

const server = http.createServer((req, res) => {
  console.log(req.url); //will print / and /favicon.

  const pathName = req.url;
  //Overview
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }
  //Product
  else if (pathName === "/product")
    res.end("From server: I am the overview page!");
  //API
  else if (pathName === "/api") {
    //tell the browser thaat we are sending a json
    res.writeHead(200, { "Content-type": "application/json" });
    // res.end(data);
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
  console.log("The server is up and running. Listening on port 8000!")
);
