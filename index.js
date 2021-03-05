var http = require('http');
var fs = require('fs');
var socketIO=require("socket.io");
// var io = require('socket.io')(http);
// 引入进来的是模块，模块中有方法，下一步就是使用方法
// Node.js一个最主要的特点：执行的基本都是函数

///////////        http          /////////////

function todata(data){//对接收到的参数进行url解码
    console.log(decodeURIComponent(data))
    return decodeURIComponent(data)
}

// 创建服务
var myServer = http.createServer(function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 服务器返回数据
    function back(obj){
        res.end(JSON.stringify(obj));
    }
    if(req.url=='/'){
        console.log('首页加载')
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, { "Content-type": "text/html;charset=utf-8" });
            res.write(data);
            res.end()
        });
    }

    if(req.url=='/getImage'){
        fs.readFile('background.png', function(err, data) {
            res.writeHead(200, { "Content-type": "binary" });
            res.end(data);
        });
    }
})

//服务端等着客户端请求需要做一个监听。通过创建的服务。
//监听
myServer.listen('3000',function(err){
    if(err){
        console.log(err);
        throw err;
    }
    console.log("文件服务器已开启。端口号为:3000");
})

///////////        http          /////////////

///////////        net          /////////////

const io = socketIO(myServer, {
    // ...
})
io.on("connection", (socket) => {
    console.log('socket建立连接')
    fs.readFile('./users.txt','utf-8',(err,users)=>{
        console.log(users.toString())
        io.emit("parter",users.toString());
    })
    
    fs.readFile('./content.txt','utf-8',(err,allRecord)=>{
        io.emit("getMsg",allRecord.toString());
    })
    socket.on('logintime',(data)=>{
        console.log(data)
        fs.readFile('./record.txt','utf-8',(err,record)=>{
            if(!err){
                if(record.toString().includes(data.nick)){
                    // console.log('当前时间戳'+Date.now())
                    // console.log(record.toString())
                    record.toString().split(',').forEach(s=>{
                        if(s.split(':')[0]==data.nick){
                            var reRecord=record.toString().replace(s.split(':')[1],data.time)
                            // console.log(reRecord)
                            fs.writeFile('record.txt','',(err)=>{
                                if(!err){
                                    fs.writeFile('record.txt',reRecord,(err)=>{
                                        if(!err){
                                            console.log('旧昵称'+data.nick+'登录时间更新成功！')
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else{
                    fs.writeFile('record.txt',record.toString()+data.nick+':'+data.time+',',(err)=>{
                        if(!err){
                            console.log('新昵称'+data.nick+'登录时间更新成功！')
                        }
                    })
                }
            }else{
                console.log('登录记录record.txt文件不存在')
            }
        })
    })
    socket.on('login',(data)=>{
        var nick=data.nick
        fs.readFile('./users.txt','utf-8',(err,users)=>{
            if(!err){
                console.log(users.toString())
                console.log(nick)
                if(!users.toString().includes(nick)){
                    fs.writeFile('users.txt',users.toString()+nick+',',(err)=>{
                        if(!err){
                            console.log('新备注添加成功！')
                        }
                        fs.readFile('./users.txt','utf-8',(err,users)=>{
                            console.log(users.toString())
                            io.emit("parter",users.toString());
                        })
                    })
                }
            }else{
                console.log('用户列表users.txt文件不存在')
            }
        })
    })
    socket.on('download',(data)=>{
        console.log(data.content)
        fs.readFile('./files.txt','utf-8',(err,files)=>{
            console.log(files.toString().split('&').filter(s=>!!s))
            files.toString().split('&').filter(s=>!!s).forEach((s)=>{
                if(JSON.parse(s).download==data.content){
                    socket.emit("file",JSON.parse(s));
                }
            })
        })
    })
    socket.on('send',(data)=>{
        if(!data.download){
            fs.readFile('./content.txt','utf-8',(err,content)=>{
                if(!err){
                    var all=content.toString()+JSON.stringify(data)+'-'
                    var temparr=all.split('-').filter(s=>!!s)
                    console.log(temparr)
                    var needsave=[]
                    if(temparr.length>10){
                        needsave=temparr.splice(temparr.length-10,temparr.length-1)
                    }else{
                        needsave=temparr
                    }
                    fs.writeFile('content.txt',needsave.join('-')+'-',(err)=>{
                        if(!err){
                            console.log('聊天记录更新成功')
                            fs.readFile('./content.txt','utf-8',(err,allRecord)=>{
                                io.emit("getMsg",allRecord.toString());
                            })
                        }
                    })
                }else{
                    console.log('聊天记录content.txt文件不存在！')
                }
            })
        }else{
            console.log(data)
            fs.readFile('./files.txt','utf-8',(err,files)=>{
                if(!err){
                    fs.writeFile('files.txt',files.toString()+JSON.stringify(data)+'&',(err)=>{
                        if(!err){
                            console.log('上传文件成功！')
                            fs.readFile('./content.txt','utf-8',(err,content)=>{
                                if(!err){
                                    data.content=data.download
                                    data.download=true
                                    fs.writeFile('content.txt',content.toString()+JSON.stringify(data)+'-',(err)=>{
                                        if(!err){
                                            console.log('文件记录成功！')
                                            fs.readFile('./content.txt','utf-8',(err,allRecord)=>{
                                                io.emit("getMsg",allRecord.toString());
                                            })
                                        }
                                    })
                                }
                            })
                        }else{
                            console.log(err)
                        }
                    })
                }else{
                    console.log('文件目录files.txt不存在！')
                }
            })
        }
    })
})

///////////        net          /////////////