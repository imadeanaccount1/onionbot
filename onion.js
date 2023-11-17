const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const puppeteer = require("puppeteer");
var Filter = require("bad-words"),
  filter = new Filter();

const image2 = fs.readFileSync("./onion.png");
const base64Image2 = new Buffer.from(image2).toString("base64");

const test = require("dotenv").config();
filter.addWords(...process.env.BADWORDS.split(","));

async function scrape() {
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
      if (document
        .querySelector("time")
        .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
          "video"
        )) {
          document
        .querySelector("time")
        .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
          "video"
        ).scrollIntoView();
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
              ) ? document
              .querySelector("time")
              .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
                "video"
              ).poster : document
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
    if (data[0].includes("**") || data[2].includes("**")) {
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
  const data = await scrape();
  const imagename = Date.now().toString();

//   const image = fs.readFileSync("./image.jpg");
//   const base64Image = new Buffer.from(image).toString("base64");
//   const dataURI = "data:image/jpeg;base64," + base64Image;
  const onionImage = "data:image/jpeg;base64," + base64Image2;
  // const font2base64 = require('node-font2base64')
  // const _data = font2base64.encodeToDataUrlSync('./font.ttf')
  console.log('starting image generation')
  nodeHtmlToImage({
    output: "./images/" + imagename + ".png",
    handlebarsHelpers: {
      notequals: (a, b) => a != b,
    },
    html: `<html>    <head>
  <style>
    body {
        font-family: Georgia, serif;
      width: 1315px;
      height: 740px;
      margin: 0px;
      padding: 0px;
      justify-content: center;
      align-items: center;
      display: flex;
      

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
    .bg {
        z-index: 100;
        height: 740px;
        object-fit: contain;
        align-self: center;
        justify-self: center;

    }

    .with-eight {
        text-shadow:
            0.044em 0 black,
            0px 0px 25px rgba(0,0,0,0.85),
            0 0.044em black,
            -0.044em 0 black,
            0 -0.044em black,
            -0.044em -0.044em black,
            -0.044em 0.044em black,
            0.044em -0.044em black,
            0.044em 0.044em black;    }
    .headline {
        position: absolute;
        bottom: ${data[2] == "" ? "-20px" : "90px"};
        left: 60px;
        font-size: calc(60px);
        font-weight: 700;
        color: white;
        0px 0px 10px rgba(0,0,0,0.75);
        z-index: 600;


    }
    .preview {
      z-index: 500;

        position: absolute;
        bottom: 18px;
        right: 40px;
        left: 40px;
        padding: 10px 12px;
        background-color: white;
        font-size: calc(28px);
        font-weight: 400;
        color: black;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);

        
    }
    .posteddate {
        position: absolute;
        top: 35px;
        left: 40px;
        padding: 8px;
        background-color: rgb(0, 107, 58);
        font-size: calc(30px);
        font-weight: 400;
        color: white;
        text-shadow: 0px 0px 7px 0px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.75);
        z-index: 700;

    }
    .onion {
        position: absolute;
        top: 35px;
        right: 50px;
        filter: drop-shadow(0px 0px 10px rgba(0,0,0,0.75));
        width: 76px;
        height: 76px;
        z-index: 800;

    }
  </style>
</head>
<body>
<img class="bg2" src="{{imageSource}}" />

<img class="bg" src="{{imageSource}}" />
<p class="headline with-eight">{{headline}}</p>
{{#if (notequals preview '')}}
<div class="preview">{{preview}}</div>
{{/if}}
<div class="posteddate">{{publishedMessage}}</div>
<img class="onion" src="{{onionImage}}" />
</body>
</html>`,
    content: {
      imageSource: data[3],
      onionImage: onionImage,
      headline: data[0],
      preview: data[2],
      publishedMessage: data[1],
    },
  }).then(() => {
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
              throw new Error("error while authenticating with wasteof", res1.error);
              return;
            }
            fetch("https://api.wasteof.money/posts", {
              method: "POST",
              headers: {
                Authorization: res1.token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                post: "<p>" + data[4] + '</p><img src="' + res.data.url + '">',
              }),
            })
              .then((res) => res.json())
              .then((res2) => {
                if (res2.error) {
                  console.error(res2.error);
                  throw new Error("error while posting post", res2.error);
                  return;
                }
              });
          });
      })
      .catch((error) => {
        console.error(error);
        throw new Error("error while uploading image", error)
      });
  }).catch((error) => {
    console.error(error);
    throw new Error("error while generating image", error)
  });
}

go();
