/*

***************************
QuantumultX:
[rewrite_local]
^https?:\/\/tnc3-aliec2.snssdk.com\/get_domains\/v4 url script-response-body https://raw.githubusercontent.com/TaiJi2022/Script/main/pipimiaonoads.js
[mitm]
hostname = tnc3-aliec2.snssdk.com
***************************

var obj = JSON.parse($response.body);
// obj.data.ttnet_http_dns_addr = [];
$done({body: JSON.stringify(obj)}); 
