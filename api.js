const ws = new WebSocket('wss://wsapi.master.live/?APPSRC=NIMO&BR&1046');
ws.binaryType = 'arraybuffer';

const max_msg = 10;
const packages = {
    hello: [
        `Pacote omitido`,
        `Pacote omitido`,
    ],
    info: [
        `Pacote omitido`,
        `Pacote omitido`,
        `AAMdAAECBAAAAgQQAyw8QANWBm5pbW91aWYLT25Vc2VyRXZlbnR9AAEB2wgAAQYEdFJlcR0AAQHNCgoDAAACN/6lECAWIDBhNDc2OTRmYTMzNTU1NWZhMTAyYmMxMGJkMTA0NWVhJwAAAVhBUUJvNTc2anpQbUREYW9Meldhb2haWDRZa2NJeTRRUWZDMTRwdGZvdG5fdkVCWWVDSzRZRUtEQVMxTy05LVhjMHF6NXNycW1zbk94MjJvWG5oeEdscE9COWdReGEtcFU2Z2tTZGRVZHF5Nm5kMUNicERtSFlHemd1Yl9HZlpxUnBLUFlwdUR6SjFlWFBsakp4eC1veER6bDl3YlBjVUtMUmN6UURLdlJCZ0NCQXZTa293VGNodG9EcExvb00ycjR3OXBPSmZJbmhiQUFDTEtLVWtOcWtZNWMwNGVUTVczdGVjTllOQ0gydndmN01qRlFTZ1JxTkQyNW5hTjFzR25GZi1HSmNsaTY3Z1BQc21KVkhuSlNfd0w4TFFwTWdjZ29ERUJSS2l6czI4NHB5TlJDZzFwZzdfZGF5dDhyQVNqT1c3c0Zpem96MW1TTHFtdzZFOFJxaXhBSzYQd2ViJjEuMC40Jm5pbW9UVkYAVgQxMDQ2ZgMxLjBwY4YCQlKWAKYAsAQLEAEjAAACN/6lECAzAAAAAXGHPMBAAQuMmAyoDCw2IWY1NzNjMjRlOGZlNzA1OTEtZjU3M2MyNGU4ZmU3MDU5MUw=`,
        `AAMdAAECBgAAAgYQAyw8QARWBm5pbW91aWYPT25Vc2VySGVhcnRCZWF0fQABAdkIAAEGBHRSZXEdAAEBywoKAwAAAjf+pRAgFiAwYTQ3Njk0ZmEzMzU1NTVmYTEwMmJjMTBiZDEwNDVlYScAAAFYQVFCbzU3Nmp6UG1ERGFvTHpXYW9oWlg0WWtjSXk0UVFmQzE0cHRmb3RuX3ZFQlllQ0s0WUVLREFTMU8tOS1YYzBxejVzcnFtc25PeDIyb1huaHhHbHBPQjlnUXhhLXBVNmdrU2RkVWRxeTZuZDFDYnBEbUhZR3pndWJfR2ZacVJwS1BZcHVEekoxZVhQbGpKeHgtb3hEemw5d2JQY1VLTFJjelFES3ZSQmdDQkF2U2tvd1RjaHRvRHBMb29NMnI0dzlwT0pmSW5oYkFBQ0xLS1VrTnFrWTVjMDRlVE1XM3RlY05ZTkNIMnZ3ZjdNakZRU2dScU5EMjVuYU4xc0duRmYtR0pjbGk2N2dQUHNtSlZIbkpTX3dMOExRcE1nY2dvREVCUktpenMyODRweU5SQ2cxcGc3X2RheXQ4ckFTak9XN3NGaXpvejFtU0xxbXc2RThScWl4QUs2EHdlYiYxLjAuNCZuaW1vVFZGAFYEMTA0NmYDMS4wcGOGAkJSlgCmALAECxMAAAI3/qUQICMAAAABcYc8wDABC4yYDKgMLDYhMTQ3NzgzMThhYjIwZDcxNC0xNDc3ODMxOGFiMjBkNzE0TA==`,
        `AAMdAAEAjAAAAIwQAyw8QP9WBmxhdW5jaGYMcXVlcnlIdHRwRG5zfQAAYwgAAQYEdFJlcR0AAFYKAwAAAjf+pRAgFhB3ZWJoNSYwLjAuMSZuaW1vKQACBhBjZG4ud3VwLmh1eWEuY29tBhJjZG53cy5hcGkuaHV5YS5jb202DE5JTU8mQlImMTA0NkYAC4yYDKgMLDYATA==`,
    ]
};
const type_package = {
    newMsg: "781d",
    newFollow: "009c",
    like: "7a1d",
    onLive: /[a-f0-9]{2}1d/,
    onLive2: "d91d",
    trevo: "281d"
};

let box_mensagens = [];
let cache_onLive = [];

ws.onopen = function(evt) {
    loopPackage(packages.hello);
}

ws.onclose = function(event) {
  console.log("WebSocket is closed now.");
};

ws.onerror = function(event) {
  console.error("WebSocket error observed:", event);
};

let pack_receiv = 0;
ws.onmessage = function(event) {
  pack_receiv += 1;
  
  const data = event.data;
  const dtView = new DataView(data);
  let package = readPackage(dtView, 0);
  
  // Troca de pacotes para receber informações do servidor
  if(package == '0004 1d00 006d 0000 006d 1003 2c3c 40ff') {
    let intervalSendMsg = setInterval(function() {
        if(pack_receiv == 2) {
            loopPackage(packages.info);
            pack_receiv = 0;
            clearInterval(intervalSendMsg);
            
            // Ping
            setInterval(function() {                
                ws.send(sendData(packages.info[3], true));
            }, 30000);
        }
    }, 10);
  }
  
  // Notificação recebida
  let header_pack = null;
  if(header_pack = package.match(/0016 1d00 01([0-9a-f]{2}) [0-9a-f]{2}06 116e 696d 6f3a 315f/)) {
    let hexNotify = readPackage(dtView, 2).substr(0, 4);
    
    console.log("Chegou notificação");

    switch(true) {
        // Mensagem
        case hexNotify == type_package.newMsg:
            let from_msg = readPackage(dtView, 3).replace(/[^0-9a-f]/gi, "");
            from_msg += readPackage(dtView, 4).replace(/[^0-9a-f]/gi, "");
            let matchs = from_msg.match(/(0e|0c|07|17)(.*)2c/);
            
            if(matchs != null) {
                from_msg = hex2a(matchs[2]);
                
                let msg = "";
                let buffer_i = 4;
                let msg_buffer = null;
                
                do {
                    msg_buffer = readPackage(dtView, buffer_i).replace(/[^0-9a-f]/gi, "");
                    buffer_i++;
                    msg += msg_buffer;
                    
                    if(buffer_i > 11) {
                        break;
                    }
                } while(!msg_buffer.match(/(3c4a)/));
                
                matches = msg.match(/c026(.*)3c4a/);
                msg = hex2a(matches[1].substr(2));
                
                if(msg.match(/\:[0-9]{3}\:/)) {
                    msg = msg.replace(/\:([0-9]{3})\:/gi, `<img src="./img/emote/$1.webp" width="26px" height="26px" style="padding: 0 5px 0 5px;"/>`);
                }

                mensagemChat({
                    nickname: from_msg,
                    msg
                });
                
                // console.info(`${from_msg} diz: ${msg}`);
            }
            break;
        // Follow
        case hexNotify == type_package.newFollow:
            console.log("+1 follow");
            
            let content_tmp = "";
            let buffer_ii = 4;
            let buffer_tmp = null;
            
            do {
                buffer_tmp = readPackage(dtView, buffer_ii).replace(/[^0-9a-f]/gi, "");
                content_tmp += buffer_tmp;
                
                if(buffer_ii > 16) {
                    break;
                }

                buffer_ii++;
            } while(!buffer_tmp.match(/(7d23)/));
            
            matches = content_tmp.match(/a8(.*)23/);

            if(matches != null && matches.length > 1) {
                let data = JSON.parse(matches[1]);
            
                console.log(`${data.fanName} é um novo seguidor!`);

                entrouLive({
                    nickname: data.fanName,
                    msg: "começou a seguir."
                });
            }
            
            break;
        
        // Like live
        case hexNotify == type_package.like:
            let content_like = "";
            let i_like = 3;
            let buffer_like = null;
            
            do {
                buffer_like = readPackage(dtView, i_like).replace(/[^0-9a-f]/gi, "");
                content_like += buffer_like;
                
                if(i_like > 5) {
                    break;
                }

                i_like++;
            } while(!buffer_like.match(/(1660)/));

            let from_like = content_like.match(/160c(.*)2c0b/);

            if(from_like != null && from_like.length > 1) {
                from_like = hex2a(from_like[1]);
            
                console.log(`${from_like} deu like.`);

                entrouLive({
                    nickname: from_like,
                    msg: "deu like:400:"
                });
            }
            
            break;
        // Entrou na live celular
        case hexNotify == type_package.onLive2 && header_pack[1] == "00":
            console.log("Entrou na live Celular");

            let content_msg = "";
            let i_msg = 4;
            let buffer_msg = null;
            
            do {
                buffer_msg = readPackage(dtView, i_msg).replace(/[^0-9a-f]/gi, "");
                content_msg += buffer_msg;
                
                if(i_msg > 6) {
                    break;
                }

                i_msg++;
            } while(!buffer_msg.match(/(1660)/));
            
            let user_live = content_msg.match(/(260c|2606)(.*)3660/);

            if(user_live != null && user_live.length > 1) {
                user_live = hex2a(user_live[2]);
                
                if(!hasNotifyOnLive(user_live)) {
                    console.log(`${user_live} entrou na live`);

                    entrouLive({
                        nickname: user_live,
                        msg: "entrou na Live"
                    });

                    notifyOnLive(user_live);
                }
            }
            
            break;
        // Entrou na live PC
        case hexNotify.match(type_package.onLive) != null:
            console.log("Entrou na live PC");
            
            let content = "";
            let buffer_i = 3;
            let buffer = null;
            
            do {
                buffer = readPackage(dtView, buffer_i).replace(/[^0-9a-f]/gi, "");
                content += buffer;
                
                if(buffer_i > 6) {
                    break;
                }

                buffer_i++;
            } while(!buffer.match(/(2c3c)/));
            
            //let user_live2 = content.match(/([0-9a-f]{2}0[0-9a-f]])(.*)(2c3c|36[0-9a-f])/);
            let user_live2 = content.match(/[0-9a-f]{2}(.*)2c3c/);
            
            if(user_live2 != null && user_live2.length > 1) {
                user_live2 = hex2a(user_live2[1]);

                if(!hasNotifyOnLive(user_live2)) {
                    console.log(`${user_live2} entrou na live`);
    
                    entrouLive({
                        nickname: user_live2,
                        msg: "entrou na Live"
                    });

                    notifyOnLive(user_live2);
                }
            }
            
            break;
        case hexNotify == type_package.trevo:
            console.log("Trevo recebido");

            let trevo_content = "";
            let trevo_i = 4;
            let trevo_buffer = null;
            
            do {
                trevo_buffer = readPackage(dtView, trevo_i).replace(/[^0-9a-f]/gi, "");
                trevo_content += trevo_buffer;
                
                if(trevo_i > 6) {
                    break;
                }

                trevo_i++;
            } while(!trevo_buffer.match(/(6300)/));
            
            let from_trevo = trevo_content.match(/560c(.*)6300/);

            if(from_trevo != null && from_trevo.length > 1) {
                console.log(`${from_trevo[1]} enviou :trevo:`);
            }

            break;
    }
  }
};

function readPackage(package, block) {
    let maxByte = 16;
    let package_tmp = '';
    let i_pos = block > 0 ? (block * maxByte) : 0;
    
    for(let i=i_pos > 0 ? i_pos : 0, ii=0; ii<maxByte; i++) {
        ii++;
        if(i+1 >= package.byteLength) {
            break;
        }

        let hex = package.getUint8(i).toString(16);
        package_tmp += hex.length == 1 ? 0x0 + hex : hex;
    }

    return package_tmp.replace(/([0-9a-f]{4})/gi, '$1 ').trim();
}

function loopPackage(package) {
    for(let i=0; i<package.length; i++) {
        ws.send(sendData(package[i], true));
    }
}

function sendData(data, base64 = false) {
    const buf = new ArrayBuffer(data.length);
    const bufView = new Uint8Array(buf);
    
    if(base64) {
        data = decodeBase64(data);
    }

    for (let i=0, strLen=data.length; i < strLen; i++) {
        bufView[i] = data[i].charCodeAt();
    }
    
    return bufView;
}

function mensagemChat(data) {
    notificaLive(`
        <div class="mensagem">
            <span class="nickname">${data.nickname}:</span>
            <span class="msg">${data.msg}</span>
        </div>`
    );
}

function entrouLive(data) {
    notificaLive(`
        <div class="mensagem">
            <span class="live-nickname">${data.nickname}</span>
            <span class="live-msg">${data.msg}</span>
        </div>`
    );
}

function notificaLive(data) {
    let element = document.getElementById("mensagem-box");

    box_mensagens.push(msgParse(data));

    element.innerHTML = "";
    for(let i=0; i<box_mensagens.length; i++) {
        element.innerHTML += box_mensagens[i];
    }
    
    if(element.scrollHeight > element.clientHeight) {
        box_mensagens.shift();
        element.children[0].innerHTML = "";
    }
}

function msgParse(msg) {
    if(msg == null || typeof msg == "undefined") {
        return "";
    }


    if(msg.match(/\:[0-9]{3}\:/)) {
        msg = msg.replace(/\:([0-9]{3})\:/gi, `<img src="./img/emote/$1.webp" width="26px" height="26px" style="padding: 0 5px 0 5px;"/>`);
    }

    return msg;
}

function notifyOnLive(key) {
    cache_onLive.push(
        {
            time: new Date(Date.now() + 60 * 1000).getTime(),
            key: key
        }
    );
}

function hasNotifyOnLive(key) {
    let len_cache = cache_onLive.length;

    if(len_cache == 0) {
        return false;
    }

    for(let i=0; i<len_cache; i++) {
        if(cache_onLive[i].time != null && Date.now() > cache_onLive[i].time
         && cache_onLive[i].key != null && cache_onLive[i].key == key) {
            cache_onLive[i].time = null;
            return false;
        }
    }

    return true;
}