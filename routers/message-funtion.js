const CryptoJS = require("crypto-js");
const request = require("request");

// SENS 문자메시지 서비스 api 설정
exports.send_message = function (phone, message) {
    var user_phone_number = phone; //수신 전화번호 기입
    var resultCode = 404;
    const date = Date.now().toString();
    const uri = process.env.SENS_SERVICE_ID; //서비스 ID
    const secretKey = process.env.SENS_SECRETKEY; // Secret Key
    const accessKey = process.env.SENS_ACCESSKEY; //Access Key
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    request(
        {
            method: method,
            json: true,
            uri: url,
            headers: {
                "Contenc-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
            },
            body: {
                type: "SMS",
                countryCode: "82",
                from: "01074823542",
                content: message,
                messages: [{ to: `${user_phone_number}` }],
            },
        },
        function (err, res, html) {
            if (err) console.log(err);
            else {
                resultCode = 200;
                console.log(html);
            }
        }
    );
    return resultCode;
}

// 인증번호 생성
exports.RandomCode = function (n) {
    let str = "";
    for (let i = 0; i < n; i++) str += Math.floor(Math.random() * 10);
    return str;
}