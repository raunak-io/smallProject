// modules required from library
const http = require("http");
const fs = require("fs");
const url = require("url");

// reading files in synchronous way
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
//template replacement function
const replaceTemp = (temp, product) => {
  let output = temp.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

//converting data to javascript object
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//creating server

const myServer = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join(" ");
    let output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);

    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    let output = replaceTemp(tempProduct, product);
    res.end(output);

    //not found page
  } else {
    res
      .writeHead(404, { "Content-Type": "text/html" })
      .end("<h1>Page not found</h1>");
  }
});

myServer.listen(8000, "127.0.0.1", () => {
  console.log("Server connected successfully");
});
