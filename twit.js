const puppeteer = require('puppeteer');

const username = 'vishal85419897'
const password = 'Shanky@132'
const hashtagToUse = "#covidresources delhi"
let browser = null;
let pages = null;

(async () => {
    browser = await puppeteer.launch({ headless: false,
        defaultViewport: null,
        args: ["--start-maximized",'--disable-dev-shm-usage','--enable-features=NetworkService',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--shm-size=3gb', // this solves the issue
    ]});
        
    pages = await browser.pages();
    let tab = pages[0];

    await tab.goto('https://twitter.com/login', {waitUntil: 'networkidle2'});

    //LOGIN

    await tab.waitForSelector("input[type='text']", { visible: true });
    await tab.type("input[type='text']", username);
    await tab.waitForSelector("input[type='password']", { visible: true });
    await tab.type("input[type='password']", password);
    
    await tab.waitForSelector("div[data-testid='LoginForm_Login_Button']", { visible: true });
    await tab.click("div[data-testid='LoginForm_Login_Button']");

    await tab.waitForSelector("a[data-testid='AppTabBar_Explore_Link']", { visible: true });
    await tab.click("a[data-testid='AppTabBar_Explore_Link']");

    await tab.waitForSelector("input[data-testid='SearchBox_Search_Input']", { visible: true });
    await tab.type("input[data-testid='SearchBox_Search_Input']", hashtagToUse);

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 3000);
    })
    await tab.waitForSelector(".css-18t94o4.css-1dbjc4n.r-j7yic.r-rull8r.r-qklmqi.r-6dt33c.r-1ny4l3l.r-o7ynqc.r-6416eg",{visible:true});
    await tab.click(".css-18t94o4.css-1dbjc4n.r-j7yic.r-rull8r.r-qklmqi.r-6dt33c.r-1ny4l3l.r-o7ynqc.r-6416eg");

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 3000);
    })


    autoScroll(tab);

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 3000);
    })

    await tab.waitForSelector(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu",{visible:true});

    const allPosts =  await tab.evaluate(function(){
                   const tds = Array.from(document.querySelectorAll(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu"));
                   return tds.map(td => td.innerText.split("\n"));
              });


              console.log(allPosts);
            console.log(allPosts.length);
            
            for(let i =0;i<allPosts.length;i++){
                var arrayToString = JSON.stringify(Object.assign({}, allPosts[i]));  // convert array to string
                var stringToJsonObject = JSON.parse(arrayToString);
                allPosts[i] = stringToJsonObject;
            }
           
            var arrayToString = JSON.stringify(Object.assign({}, allPosts));  // convert array to string
            var stringToJsonObject = JSON.parse(arrayToString);
            console.log(stringToJsonObject);


//     await tab.waitForSelector(".css-901oao.r-18jsvk2.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0",{visible:true});

//     const allPosts1 = await tab.evaluate(function(){
//         const tds = Array.from(document.querySelectorAll(".css-901oao.r-18jsvk2.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0"));
//         return tds.map(td => td.innerText);
//    });

            
//             for(let i =0;i<allPosts1.length;i++){
//                 var arrayToString = JSON.stringify(Object.assign({}, allPosts1[i]));  // convert array to string
//                 var stringToJsonObject = JSON.parse(arrayToString);
//                 allPosts1[i] = stringToJsonObject;
//             }

//             var arrayToString = JSON.stringify(Object.assign({}, allPosts1));  // convert array to string
//             var stringToJsonObject = JSON.parse(arrayToString);
            
   
})();



async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
