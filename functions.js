function encodeBase64(data) {
    if (typeof btoa === "function") {
        return btoa(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "utf-8").toString("base64");
    } else {
        throw new Error("Failed to determine the platform specific encoder");
    }
}

function decodeBase64(data) {
    if (typeof atob === "function") {
        return atob(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
}

function a2hex(str) {
  let arr = [];
  
  for (let i = 0, l = str.length; i < l; i ++) {
    let hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  
  return arr.join('');
}

function hex2a(hexx) {
    let hex = hexx.toString("utf-8");
    let str = '';
    
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    
    return decode_utf8(str);
}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}