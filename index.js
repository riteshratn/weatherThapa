const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

//kuchh error h....temr replace kr nahi paa rha h....
let replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);

    return temperature;
    
};

const server = http.createServer((req, res) => {
  if ((req.url == "/")) {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=b19035f43bfbd27762c8653f6c9b6b75")
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
       // console.log(arrData[0].main.temp);
       const realTimeData = arrData.map((val) =>replaceVal(homeFile,val)).join("");
       res.write(realTimeData);
       //console.log(realTimeData);
       })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        
      });
    }else{
         res.end("Files not found");
    }
  
});


// const server = http.createServer((req, res) => {
//   if ((req.url == "/")) {
//     requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=b19035f43bfbd27762c8653f6c9b6b75")
//       .on("data", (chunk) => {
//         const objdata = JSON.parse(chunk);
//         const arrData = [objdata];
//         console.log(arrData[0].name);
//       //  const realTimeData = arrData.map((val) =>replaceVal(homeFile,val));
//       //  res.write(realTimeData);
//       //  //console.log(realTimeData);
//       //  //console.log(arrData);
//       //  })
//       let realTimeData = homeFile.replace("{%tempval%}",arrData[0].main.temp).replace("{%tempmin%}",arrData[0].main.temp_min).replace("{%tempmax%}",arrData[0].main.temp_max).replace("{%location%}",arrData[0].name).replace("{%country%}",arrData[0].sys.country);
//       res.write(realTimeData,"utf-8");
//       res.end();
//       })
//       .on("end", (err) => {
//         if (err) return console.log("connection closed due to errors", err);
//         res.end();
//       });
//     }else{
//          res.end("Files not found");
//     }
// });

server.listen(3000,"localhost");
