/*

***************************
QuantumultX:
[rewrite_local]
^https?:\/\/api-access.pangolin-sdk-toutiao.com\/api\/ad\/union\/sdk\/settings.* url script-response-body https://raw.githubusercontent.com/TaiJi2022/Script/main/pipimiaonoads.js
[mitm]
hostname = api-access.pangolin-sdk-toutiao.com
***************************

var obj = JSON.parse($response.body);
obj.message = "";
$done({body: JSON.stringify(obj)}); 
