#### 项目技术栈介绍
+ 项目为兼容移动端和PC端样式，使用css3媒体查询。
+ 项目即时通信使用socket.io插件。
+ 项目后端使用node分配计算机内存空间，读写文件。

#### 项目使用介绍
+ 项目目录包含background.png、content.txt，files.txt，index.html，index.js，readme.md，record.txt，users.txt等。
+ 首先安装socket.io依赖，npm install socket.io。
+ 在项目所在文件夹目录下打开终端node index.js，项目启动至http://localhost:3000/。

#### 注意事项
+ 确认聊天记录content.txt，文件列表file.txt，登录时间记录record.txt，用户列表users.txt等文件存在于根目录中。
 - 注意：
   * 文件名称不可修改；
   * 登录时间记录record.txt文件用于后期清理房间内长时间未登录的用户，需要另写脚本；
   * 该聊天项目在PC端测试完好，移动端可用但文件发送接收可能存在兼容问题。
   * 本项目为聊天室通信小工具，目前需求包含发送接收文字、文件，查看房间人员信息，定时清理长久未登录人员信息，支持暂存最多30条聊天记录，意在解决内网开发时带来的诸多不便，本项目可启动聊天服务，其他计算机可访问服务端IP+端口访问该服务。

#### 项目预览
![Image text](https://raw.githubusercontent.com/please512/chat_room/master/chat_room/pic2.png)
![Image text](https://raw.githubusercontent.com/please512/chat_room/master/chat_room/pic1.png)