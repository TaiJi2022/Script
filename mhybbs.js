/*
米游社签到脚本
更新时间: 2022.11.08
脚本兼容: QuantumultX
************************
QX
************************
*/

const CookieWA = '';


/************************
QuantumultX 远程脚本配置:
************************
[task_local]
# 米游社签到
0 0 * * * https://raw.githubusercontent.com/TaiJi2022/Script/main/mhybbs.js
[rewrite_local]
# 获取Cookie
https:\/\/api-takumi\.mihoyo\.com\/event\/bbs_sign_reward\/(home|sign|extra).* url script-request-header https://raw.githubusercontent.com/TaiJi2022/Script/main/mhybbs.js

[Mitm] 
hostname= api-takumi.mihoyo.com
*/

const $ = API('mhybbs');
const date = new Date();
const body = `{"act_id":"e202009291139501","region":"cn_gf01","uid":"100121857"}`;
const reqData = {
  url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
  headers: {
    Cookie: CookieWA || $.read("COOKIE"),
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
  },
  body: body
};
if ($.env.isRequest) {
  GetCookie()
} else if (!reqData.headers.Cookie) {
  $.notify('米游社', ``, `未填写/未获取Cookie!`);
} else if (!reqData.headers.Cookie.includes('cookie_token=')) {
  $.notify('米游社', ``, `Cookie关键授权字段缺失, 需重新获取!`);
} else {
  $.http.put(reqData)
    .then((resp) => {
        $.info(resp)
      if (resp.body.match(/OK/)) {
        $.msgBody = date.getMonth() + 1 + "月" + date.getDate() + "日, 签到成功 🎉"
      } else if (resp.body.match(/(ÄúÒÑ|\u4e0b\u671f\u518d\u6765|>��Ǹ������)/)) {
        $.msgBody = date.getMonth() + 1 + "月" + date.getDate() + "日, 已签过 ⚠️"
      } else if (resp.body.match(/invalid/)) {
        $.msgBody = "签到失败, Cookie失效 ‼️‼️"
      } else if (resp.statusCode == 403) {
        $.msgBody = "服务器暂停签到 ⚠️"
      } else {
        $.msgBody = "脚本待更新 ‼️‼️"
      }
    })
    .catch((err) => ($.msgBody = `签到失败 ‼️‼️\n${err || err.message}`))
    .finally(async () => {
      $.notify('米游社', ``, $.msgBody);
      $.done();
    })
}

function GetCookie() {
    const TM = $.read("TIME");
    const CK = $request.headers['Cookie'] || $request.headers['cookie'];
    if (CK && CK.includes('cookie_token=')) {
      $.write(CK, "COOKIE");
      if (!TM || TM && (Date.now() - TM) / 1000 >= 21600) {
        $.notify("米游社", "", `写入Cookie成功 🎉`);
        $.write(JSON.stringify(Date.now()), "TIME");
      } else {
        $.info(`米游社\n写入Cookie成功 🎉`)
      }
    } else {
      $.info(`米游社\n写入Cookie失败, 关键值缺失`)
    }
    $.done()
  } 

  //https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
function ENV() { const e = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: "undefined" != typeof $task, isLoon: "undefined" != typeof $loon, isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon, isBrowser: "undefined" != typeof document, isNode: "function" == typeof require && !e, isJSBox: e, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { function t(t, a) { a = "string" == typeof a ? { url: a } : a; const h = e.baseURL; h && !d.test(a.url || "") && (a.url = h ? h + a.url : a.url), a.body && a.headers && !a.headers["Content-Type"] && (a.headers["Content-Type"] = "application/x-www-form-urlencoded"), a = { ...e, ...a }; const c = a.timeout, l = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...a.events }; let f, y; if (l.onRequest(t, a), s) f = $task.fetch({ method: t, ...a }); else if (o || n) f = new Promise((e, s) => { $httpClient[t.toLowerCase()](a, (t, o, n) => { t ? s(t) : e({ statusCode: o.status || o.statusCode, headers: o.headers, body: n }) }) }); else if (r) { const e = require("got"), s = require("iconv-lite"); f = new Promise((o, n) => { e[t.toLowerCase()](a).then(e => o({ statusCode: e.statusCode, headers: e.headers, body: s.decode(e.rawBody, "utf-8") })).catch(n) }) } else if (i) { const e = new Request(a.url); e.method = t, e.headers = a.headers, e.body = a.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } else u && (f = new Promise((e, s) => { fetch(a.url, { method: t, headers: a.headers, body: a.body }).then(e => e.json()).then(t => e({ statusCode: t.status, headers: t.headers, body: t.data })).catch(s) })); const p = c ? new Promise((e, s) => { y = setTimeout(() => (l.onTimeout(), s(`${t} URL: ${a.url} exceeds the timeout ${c} ms`)), c) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(y), e)) : f).then(e => l.onResponse(e)) } const { isQX: s, isLoon: o, isSurge: n, isScriptable: i, isNode: r, isBrowser: u } = ENV(), a = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"], d = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, h = {}; return a.forEach(e => h[e.toLowerCase()] = (s => t(e, s))), h } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (i) { const e = require("fs"); return { fs: e } } return null })(), this.initCache(); const s = (e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }); Promise.prototype.delay = function (e) { return this.then(function (t) { return s(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (o || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), i) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (o || n) && $persistentStore.write(e, this.name), i && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || o) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); i && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || o ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : i ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || o) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); i && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", a = "", d = {}) { const h = d["open-url"], c = d["media-url"]; if (s && $notify(e, t, a, d), n && $notification.post(e, t, a + `${c ? "\n多媒体:" + c : ""}`, { url: h }), o) { let s = {}; h && (s.openUrl = h), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, a) : $notification.post(e, t, a, s) } if (i || u) { const s = a + (h ? `\n点击跳转: ${h}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { const o = require("push"); o.schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { s || o || n ? $done(e) : i && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
