const http = require("http");
const https = require("https");
const CLIENT_ID = "";
const CLIENT_SECRET = "";
http.createServer(function(request, response){
    var path = "http://"+ request.headers.host + request.url;
    var qqq = new URL(path);
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
     
    if(qqq.pathname === "/"){
        response.end(`<a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=`+CLIENT_ID+`">АВТОРИЗОВАТЬСЯ</a>`);
    
    }
    else if(qqq.pathname== "/qwerty"){
        let code  = qqq.searchParams.get('code');
        let data = `grant_type=authorization_code&code=`+code+`&client_id=`+CLIENT_ID+`&client_secret=`+CLIENT_SECRET;
        let option = {
            hostname: 'oauth.yandex.ru',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data),
            },
            method: 'POST',
            path: '/token',
        }
        https.request(option, (zxc)=>{
            let access='';
            zxc.on('data', (d) => {
                access=access+d;
                console.log(d.toString());
            });

            zxc.on('end', () => {
                access=JSON.parse(access).access_token;
                console.log(access);
                let option1 = {
                    hostname: 'login.yandex.ru',
                    headers: {
                        'Authorization': 'OAuth '+access,
                    },
                    method: 'GET',
                    path: '/info?format=json',
                }
                https.request(option1, (wq)=>{
                    let fd="";
                    wq.on('data', (s) => {
                        fd=fd+s;
                        console.log(s.toString());
                    });

                    wq.on('end', () => {
                        fd=JSON.parse(fd);
                        response.end("Здравствуйте " +fd.real_name+"!");
                    });
                }).end();
            });
        }).write(data);
        
    }
    else{
        response.end("<h2>Not found</h2>");
    }
}).listen(3000);