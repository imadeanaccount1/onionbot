const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const puppeteer = require("puppeteer");
var Filter = require("bad-words"),
  filter = new Filter();
const wrapSvgText = require("wrap-svg-text");
const { wrap } = require("module");

//   const font2base64 = require('node-font2base64')

// const _data = font2base64.encodeToDataUrlSync('./Roboto_Condensed/static/RobotoCondensed-SemiBold.ttf')

const image2 = fs.readFileSync("./onion.png");
const base64Image2 = new Buffer.from(image2).toString("base64");

const test = require("dotenv").config();
filter.addWords(...process.env.BADWORDS.split(","));

async function scrape() {
  let posts = JSON.parse(await fs.readFileSync("./images/posts.json"))

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const pageOne = await browser.newPage();
  await pageOne.goto("https://www.theonion.com/latest");

  loop = true;
  let data = ["", "", "", ""];
  while (loop) {
    await pageOne.waitForTimeout(3000);

    await pageOne.evaluate((_) => {
      if (
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "video"
          )
      ) {
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "video"
          )
          .scrollIntoView();
      } else {
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "img"
          )
          .scrollIntoView();
      }
    });
    await pageOne.waitForTimeout(500);

    loop = false;

    const firstDivText = await pageOne.evaluate((_) => {
      return [
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "h2"
          ).textContent,
        document.querySelector("time").textContent,
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "p"
          ) == null
          ? ""
          : document
              .querySelector("time")
              .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
                "p"
              ).textContent,
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
            "video"
          )
          ? document
              .querySelector("time")
              .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
                "video"
              ).poster
          : document
              .querySelector("time")
              .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
                "img"
              ).src,
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
            "a"
          )[
          document
            .querySelector("time")
            .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
              "a"
            ).length - 1
        ].href,
      ];
    });
    data = [
      filter.clean(firstDivText[0]),
      firstDivText[1].split("ished")[0] +
        "ished " +
        firstDivText[1].split("ished")[1],
      firstDivText[2] != "" ? filter.clean(firstDivText[2]) : "",
      firstDivText[3],
      firstDivText[4],
    ];
    if (data[0].includes("**") || data[2].includes("**") || posts.filter(post => post.title == data[0]).length > 0) {
      await pageOne.evaluate((_) => {
        document
          .querySelector("time")
          .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      });
      loop = true;
    }
  }

  // await pageOne.waitForTimeout(50000);
  browser.close();
  return data;
}
async function go() {
  let posts = JSON.parse(await fs.readFileSync("./images/posts.json"))

  const data = await scrape();
  const imagename = Date.now().toString();

  //   const image = fs.readFileSync("./image.jpg");
  //   const base64Image = new Buffer.from(image).toString("base64");
  //   const dataURI = "data:image/jpeg;base64," + base64Image;
  const onionImage = "data:image/jpeg;base64," + base64Image2;
  // const font2base64 = require('node-font2base64')
  // const _data = font2base64.encodeToDataUrlSync('./font.ttf')
  console.log("starting image generation");
  nodeHtmlToImage({
    output: "./images/" + imagename + ".png",
    handlebarsHelpers: {
      notequals: (a, b) => a != b,
    },
    beforeScreenshot: async function (page) {
      // console.log('before screenshot', wrapSvgText.toString())
      // const test = wrapSvgText
      // const testfunc = function (options, document) {
      //   const document = document;
      //   wrapSvgText(options, document);
      // };
      console.log("before screenshot", data[0]);
      await page.exposeFunction("wrapSvg", wrapSvgText);
      await page.exposeFunction("data", await data);
      await page.exposeFunction("testText", data[0]);

      // await page.exposeFunction("wrapSvgStr", wrapSvgText.toString().split('ction(t){')[1].split("n),h")[0] + "n),h");
      // console.log('exposed function', wrapSvgText.toString())

      // page.injectFile('./node_modules/wrap-svg-text/index.min.js')
      // .then(result => console.log(result))
      // .then(error => console.log(error));
      await page.evaluate(
        async (headline, preview) => {
          // const func = Function(wrapSvgStr)
          (function () {
            var ns, flush, main;
            ns = "http://www.w3.org/2000/svg";
            flush = function (o) {
              var text;
              if (isNaN(o.x + o.y) || !o.text) {
                return;
              }
              text = document.createElementNS(ns, "text");
              text.appendChild(document.createTextNode(o.text));
              text.setAttribute("x", o.x - 1);
              text.setAttribute("y", o.y + 2);
              text.setAttribute("dominant-baseline", "hanging");
              return text;
            };
            main = function (opt) {
              var text,
                style,
                div,
                ref$,
                divbox,
                range,
                obj,
                texts,
                i$,
                to$,
                j,
                t,
                tt,
                j$,
                to1$,
                i,
                box,
                that,
                g,
                spans;
              opt == null && (opt = {});
              (text = opt.text), (style = opt.style);
              style = opt.style || {};
              text = opt.text || "";
              if (opt.node) {
                div = opt.node;
                if (!text) {
                  text = div.textContent;
                }
                div.textContent = "";
              } else {
                div = document.createElement("div");
                import$(
                  ((ref$ = div.style),
                  (ref$.opacity = 0),
                  (ref$["pointer-events"] = "none"),
                  (ref$["z-index"] = 0),
                  (ref$["position"] = "absolute"),
                  (ref$.top = 0),
                  (ref$.left = 0),
                  ref$),
                  style
                );
                document.body.appendChild(div);
              }
              if (opt.useRange) {
                div.innerText = text;
                divbox = div.getBoundingClientRect();
                range = document.createRange();
                obj = {
                  text: "",
                  x: NaN,
                  y: NaN,
                };
                texts = [];
                for (i$ = 0, to$ = div.childNodes.length; i$ < to$; ++i$) {
                  j = i$;
                  t = div.childNodes[j];
                  tt = t.textContent;
                  for (j$ = 0, to1$ = t.length; j$ < to1$; ++j$) {
                    i = j$;
                    range.setStart(t, i);
                    range.setEnd(t, i + 1);
                    box = range.getBoundingClientRect();
                    if (obj.y === box.y - divbox.y) {
                      obj.text += tt[i];
                    } else {
                      if ((that = flush(obj))) {
                        texts.push(that);
                      }
                      obj.text = tt[i];
                      obj.x = box.x - divbox.x;
                      obj.y = box.y - divbox.y;
                    }
                  }
                }
                if ((that = flush(obj))) {
                  texts.push(that);
                }
                g = document.createElementNS(ns, "g");
              } else {
                spans = text.split("").map(function (t) {
                  var span;
                  div.appendChild((span = document.createElement("span")));
                  span.appendChild(document.createTextNode(t));
                  return span;
                });
                divbox = div.getBoundingClientRect();
                obj = {
                  text: "",
                  x: NaN,
                  y: NaN,
                };
                texts = [];
                spans.map(function (it) {
                  var box, that;
                  box = it.getBoundingClientRect();
                  if (obj.y === box.y - divbox.y) {
                    return (obj.text += it.textContent);
                  } else {
                    if ((that = flush(obj))) {
                      texts.push(that);
                    }
                    obj.text = it.textContent;
                    obj.x = box.x - divbox.x;
                    return (obj.y = box.y - divbox.y);
                  }
                });
                if ((that = flush(obj))) {
                  texts.push(that);
                }
                g = document.createElementNS(ns, "g");
              }
              texts.map(function (it) {
                return g.appendChild(it);
              });
              if (!opt.node) {
                document.body.removeChild(div);
              } else {
                div.textContent = div.textContent;
              }
              return g;
            };
            if (typeof module != "undefined" && module !== null) {
              module.exports = main;
            } else if (typeof window != "undefined" && window !== null) {
              window.wrapSvgText1 = main;
            }
            function import$(obj, src) {
              var own = {}.hasOwnProperty;
              for (var key in src) if (own.call(src, key)) obj[key] = src[key];
              return obj;
            }
          }).call(this);

          // const script1 = document.createElement("script");
          // script1.src = "./node_modules/wrap-svg-text/index.min.js";
          // document.body.appendChild(script1)
          console.log("hi");
          // const asdfg = wrapSvgText.toString();
          // throw new Error(asdfg)

          const dat = wrapSvgText1({
            text: preview,
            style: {
              fontSize: "50px",
              width: "1980px",
            },
          });
          dat.id = "test";
          const dat2 = wrapSvgText1({
            text: headline,
            style: {
              fontSize: "50px",
              width: "1040px",
            },
          });
          dat2.id = "test1";

          const myGroup = document.getElementById("thisId");
          console.log(dat.children);
          for (let child of dat.children) {
            console.log(child.getAttribute("x"));
            child.setAttribute(
              "x",
              parseInt(child.getAttribute("x")) + 4033.03
            );
            child.setAttribute(
              "y",
              parseInt(child.getAttribute("y")) + 2524.77
            );
          }

          myGroup.appendChild(dat);
          console.log(
            "translate(0," +
              Math.round(40 - dat.getBBox().height).toString() +
              ")"
          );
          dat.setAttribute(
            "transform",
            "translate(0," +
              Math.round(40 - dat.getBBox().height).toString() +
              ")"
          );

          const myGroup2 = document.getElementById("thisId2");
          console.log(dat2.children);
          for (let child of dat2.children) {
            console.log(child.getAttribute("x"));
            child.setAttribute(
              "x",
              parseInt(child.getAttribute("x")) + 4033.03
            );
            child.setAttribute(
              "y",
              parseInt(child.getAttribute("y")) + 2540.52
            );
          }

          myGroup2.appendChild(dat2);
          console.log(
            "translate(0," +
              Math.round(40 - dat2.getBBox().height).toString() +
              ")"
          );
          dat2.setAttribute(
            "transform",
            "translate(0," +
              Math.round(
                150 - (dat2.getBBox().height + dat.getBBox().height)
              ).toString() +
              ")"
          );
        },
        data[0],
        data[2]
      );
    },
    html: `<html>
    <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Condensed">
    <style> 
    body {
      margin: 0;
      padding: 0;
      background-color: black;
      width: 1315px;
      height: 740px;
    }
    svg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 900
    }
    .bg {
      width: 1315px;
      height: 740px;
      object-fit: contain;
    }
    .bg2{
      z-index: -100;
      width: 1315px;
      height: 740px;
      object-fit: cover;
      position: absolute;
      top:0px;
      left:0px;
      filter: brightness(80%) blur(8px);
      -webkit-filter: brightness(80%) blur(8px);
  }
    #test > text {
      font-family:'Georgia', serif;font-size:29.167px;fill:white;
  }
  #test1 > text {
      font-family:'Georgia', serif;font-size:50px;fill:white;font-weight:700;
  }
    </style>
    </head>
    <body>
<svg style="overflow:visible;" width="1315px" height="740px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1,0,0,1,-11145.8,-8127.86)"><g id="Artboard2" transform="matrix(1,0,0,1,8618.44,6185.94)"><rect x="2527.37" y="1941.92" width="1315px" height="740px" style="fill:none;"/><g transform="matrix(5.44089,0,0,1,-58295.6,-5275.83)"><path d="M11253.5,7261.27C11253.5,7260.47 11253.5,7259.71 11253.4,7259.15C11253.3,7258.58 11253.1,7258.27 11253,7258.27C11246.9,7258.27 11192.9,7258.27 11186.9,7258.27C11186.7,7258.27 11186.6,7258.58 11186.5,7259.15C11186.4,7259.71 11186.3,7260.47 11186.3,7261.27C11186.3,7268.1 11186.3,7284.76 11186.3,7291.59C11186.3,7292.39 11186.4,7293.15 11186.5,7293.72C11186.6,7294.28 11186.7,7294.59 11186.9,7294.59C11192.9,7294.59 11246.9,7294.59 11253,7294.59C11253.1,7294.59 11253.3,7294.28 11253.4,7293.72C11253.5,7293.15 11253.5,7292.39 11253.5,7291.59C11253.5,7284.76 11253.5,7268.1 11253.5,7261.27Z" style="fill:rgb(40,42,195);"/></g><g transform="matrix(0.599903,0,0,0.599903,146.146,784.038)"><g transform="matrix(41.6734,0,0,41.6734,4634.34,2043.35)"></g><text x="4048.93px" y="2043.35px" style="font-family:'RobotoCondensed-SemiBold', 'Roboto Condensed';font-weight:600;font-size:41.673px;fill:white;">{{publishedMessage}}</text></g><g transform="matrix(0.621195,0,0,0.621195,540.171,753.584)"><path d="M5250.66,2052.27C5250.66,2093.17 5217.5,2126.34 5176.6,2126.34L5176.53,2126.34C5135.66,2126.34 5102.53,2093.2 5102.53,2052.33L5102.53,2052.2C5102.53,2011.33 5135.66,1978.2 5176.53,1978.2L5176.6,1978.2C5217.5,1978.2 5250.66,2011.36 5250.66,2052.27Z" style="fill:rgb(40,42,195);"/></g><g id="path1947" transform="matrix(1.32357,0,0,1.32357,3729.42,1999.9)"><path d="M33.841,30.214L15.692,30.214C15.288,30.214 14.959,29.886 14.959,29.481L14.959,16.651C14.959,16.457 15.037,16.27 15.174,16.133C15.312,15.996 15.498,15.918 15.692,15.918L34.583,15.918C34.838,20.287 35.162,25.573 33.841,30.214ZM16.746,19.492L18.699,26.645L20.802,26.645L22.036,22.146L22.124,22.146L23.357,26.645L25.464,26.645L27.413,19.492L25.404,19.492L24.31,24.269L24.25,24.269L23.072,19.492L21.096,19.492L19.937,24.297L19.873,24.297L18.759,19.492L16.746,19.492ZM33.448,31.435C31.772,36.086 28.187,39.905 20.821,41.186C14.693,42.315 11.818,36.938 7.276,39.574C6.147,40.221 5.287,42.693 4.64,41.673C4.212,41.027 5.336,40.002 4.64,39.574C4.162,39.305 3.461,40.484 2.969,40.052C2.476,39.619 3.128,39.057 2.75,38.609C2.372,38.161 1.69,38.549 1.307,37.997L1.307,38.037C0.71,37.177 3.078,36.694 3.506,35.729C5.665,31.66 1.845,33.322 0.223,23.97C-2.881,6.282 27.382,6.282 31.411,5.536C35.121,4.89 31.361,0 34.261,0C35.256,0 34.261,2.537 35.256,2.9C36.25,3.263 36.867,0.592 37.892,1.457C39.285,2.636 36.549,3.716 37.295,4.457C37.807,5.004 39.096,3.959 39.523,4.686C40.27,5.815 38.23,6.566 36.405,6.884C34.293,7.239 34.281,10.406 34.514,14.697L24.036,14.697C23.984,14.697 23.938,14.664 23.921,14.615C23.904,14.566 23.92,14.511 23.961,14.479C28.756,10.73 32.865,9.024 32.117,8.272C30.774,6.929 24.855,8.749 24.855,8.749C15.668,11.983 5.67,18.036 4.958,25.527C4.749,27.726 5.386,31.864 8.191,33.585C9.517,34.381 11.418,30.891 13.51,27.14C13.537,27.092 13.593,27.068 13.647,27.082C13.701,27.096 13.738,27.144 13.738,27.2C13.738,27.84 13.738,29.018 13.738,29.969C13.738,30.779 14.394,31.435 15.204,31.435L26.911,31.435C26.963,31.435 27.009,31.468 27.026,31.517C27.044,31.566 27.028,31.62 26.988,31.652C26.623,31.941 26.22,32.214 25.77,32.471C23.402,33.814 21.771,33.978 18.831,33.914C16.414,33.864 14.205,31.914 13.509,34.908C12.798,38.206 20.856,37.445 23.984,36.326L23.994,36.336C26.843,35.32 28.737,33.415 29.945,31.435L33.448,31.435ZM10.385,13.758C14.086,11.057 21.005,8.869 19.537,8.919C14.429,9.048 4.018,13.276 3.62,19.727C3.461,21.717 6.739,16.444 10.385,13.758Z" style="fill:white;"/></g><g transform="matrix(1,0,0,1.16209,-1450.22,-433.613)"><rect x="3977.59" y="2446.78" width="1315" height="234.069" style="fill:url(#_Linear1);"/></g><g transform="matrix(1,0,0,1,-1465.14,-54.6238)" id="thisId2"><g transform="matrix(50,0,0,50,4312.86,2540.52)"></g></g><g id="thisId" transform="matrix(1,0,0,1,-1465.14,85.3138)"><g transform="matrix(29.1667,0,0,29.1667,4242.61,2524.77)"></g></g></g><g id="g1945"></g><g id="g1949"></g></g><defs><linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.43326e-14,-234.069,234.069,1.43326e-14,4625.87,2680.84)"><stop offset="0" style="stop-color:rgb(4,4,27);stop-opacity:1"/><stop offset="0.55" style="stop-color:rgb(4,4,27);stop-opacity:0.788235"/><stop offset="1" style="stop-color:rgb(4,4,27);stop-opacity:0"/></linearGradient></defs></svg>
    <svg>
        </svg>
        <img class="bg2" src="{{imageSource}}" />
    <img class="bg" src="{{imageSource}}" />
    <script src="./node_modules/wrap-svg-text/index.min.js"></script>
    <script>
    const helloworld = "hi"
    
    </script>
    </body>
    </html>
`,
    content: {
      imageSource: data[3],
      onionImage: onionImage,
      headline: data[0],
      preview: data[2],
      publishedMessage: data[1].toUpperCase(),
    },
  })
    .then(() => {
      console.log(JSON.stringify(data));

        console.log(imagename, data[0])
        posts.push({
          id: imagename,
          title: data[0],
          date: data[1],
          preview: data[2],
          image: data[3],
          link: data[4],
        });
        fs.writeFile("./images/posts.json", JSON.stringify(posts), (error) => {
          if (error) {
            console.log("An error has occurred ", error);
            return;
          }
          console.log("Data written successfully to disk");
        });
      // });
      console.log("The images were created successfully!");

      const image3 = fs.readFileSync("./images/" + imagename + ".png");
      const base64Image3 = new Buffer.from(image3).toString("base64");
      var formdata = new FormData();
      formdata.append("image", base64Image3);
      formdata.append("name", imagename);
      fetch("https://api.imgbb.com/1/upload?key=" + process.env.IMGBB_APIKEY, {
        body: formdata,
        method: "POST",
      })
        .then((response) => response.json())
        .then((res) => {
          fetch("https://api.wasteof.money/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: process.env.WASTEOF_USERNAME,
              password: process.env.WASTEOF_PASSWORD,
            }),
          })
            .then((res) => res.json())
            .then((res1) => {
              if (res1.error) {
                console.error(res1.error);
                throw new Error(
                  "error while authenticating with wasteof",
                  res1.error
                );
                return;
              }
              fetch("https://api.wasteof.money/posts", {
                method: "POST",
                headers: {
                  Authorization: res1.token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  post:
                    "<p>" + data[4] + '</p><img src="' + res.data.url + '">',
                }),
              })
                .then((res) => res.json())
                .then((res2) => {
                  if (res2.error) {
                    console.error(res2.error);
                    throw new Error("error while posting post", res2.error);
                    return;
                  }
                  console.log(res2.id);
                  fetch(
                    "https://api.wasteof.money/posts/" + res2.id + "/loves",
                    {
                      method: "POST",
                      headers: {
                        Authorization: res1.token,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                });
            });
        })
        .catch((error) => {
          console.error(error);
          throw new Error("error while uploading image", error);
        });
    })
    .catch((error) => {
      console.error(error);
      throw new Error("error while generating image", error);
    });
}

go();
