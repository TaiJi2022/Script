/*

***************************
QuantumultX:
[rewrite_local]
^https?:\/\/api-access.pangolin-sdk-toutiao.com\/api\/ad\/union\/sdk\/settings.* url script-response-body https://raw.githubusercontent.com/TaiJi2022/Script/main/pipimiaonoads.js
[mitm]
hostname = api-access.pangolin-sdk-toutiao.com
***************************

var body = $response.body;
var obj = JSON.parse(body);

obj['message'] = "";
body = JSON.stringify(obj);

console.log(body);

$done(body);
