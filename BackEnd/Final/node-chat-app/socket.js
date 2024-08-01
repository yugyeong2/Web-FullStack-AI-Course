// 메시지 서버소켓 파일
// 해당 socket.js 모듈이 메시징 서버 역할을 제공한다.

// socket.io 팩키지 참조
const SocketIO = require("socket.io");

// socket.js 모듈 기능 정의
module.exports = (server)=>{
    // 서버소켓의 입출력(Input/Output) 메시지 처리 객체 io 생성
    // input 메시지는 웹브라우저에서 들어오는 메시지
    // output 메시지는 서버소켓에서 웹브라우저로 전송하는 메시지
    // const io = SocketIO(server,{path:"/socket.io"}); // -> CORS 이슈 발생

    // 서버 소켓에 대한 CORS 이슈 해결
    // 탐색기에서 띄워도 가능 -> 프론트는 html 파일만 갖고 있으면 상관없다.
    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });


    // 자바스크립트에서 on(=이벤트 핸들러(처리기))
    // io 객체에 connection 이벤트가 발생하면, 콜백함수를 실행한다.
    // connection 이벤트는 웹브라우저와 서버소켓이 연결 완료되면 발생한다.
    // -> 연결이 전제되었을 때, 다른 기능이 수행되어야 하기 때문에 connection 안에 구현한다.
    io.on("connection", (socket) => {
        // socket은 현재 연결된 사용자(웹브라우저)와 서버소켓간 연결 객체
        // 웹브라우저에서 서버소켓에 broadcast라는 이벤트 수신기를 호출하면, 관련 콜백함수가 실행된다.
        // socket.on("서버소켓 이벤트 수신기명", 처리할 콜백함수);

        // 웹브라우저(클라이언트/프론트엔드)에서 서버소켓에 broadcast라는 이벤트를 호출하면,
        // 서버소켓은 클라이언트에서 보내준 메시지를 수신하고,
        // 콜백함수를 통해 서버에서 클라이언트로 메시지를 전송(io.emit())한다.
        socket.on("broadcast", function(msg){
            // 현재 메시지 서버에 연결된 모든 사용자들(웹브라우저/프론트엔드웹페이지)에게 메시지를 전송하는데,
            // 클라이언트 메시지 수신 이벤트 receiveAll로 msg데이터를 전송한다.
            // io.emit()메소드는 서버소켓(io)에 연결된 모든 사용자에게 메시지를 보낼 때 사용한다.
            // io.emit('클라이언트 이벤트 수신기명', 클라이언트로 보낼 데이터);
            io.emit("receiveAll", msg);
        });


        // 템플릿에서 보내준 메시지 수신 처리기
        socket.on("sendAll", function(nickname, message){
            io.emit("broadcastAll", nickname, message);
        });


        // 지정한 채팅방 개설 및 입장처리 메시지 이벤트 수신기
        // socket.on("서버 측 이벤트 수신기명", 콜백함수(){});
        socket.on("entry", async(nickname, channel) => {
            // socket.join('채팅방 이름');은  서버환경에 해당 채팅방이름으로 채널을 개설하고, 현재 입장하는 사용자를 해당 채팅방 사용자로 등록 처리한다.
            // 이미 해당 채널이 개설되어 있으면 신규 개설하지 않고 기존 채널로 입장한다.
            // socket.join('채팅방 이름');
            socket.join(channel);

            // 현재 접속자를 제외한 해당 채널에 이미 접속한 모든 사용자에게 메시지를 발송한다.
            // socket.to('채널명').emit();
            // 내가 입장했을 떼는 아래와 메시지가 뜨지 않는다. 다른 메시지가 뜨게 할 수도 있음.
            socket.to(channel).emit("entryOk", `${nickname}님이 ${channel} 채널에 입장하였습니다.`);

            // 나에게만 보내고 싶을 때: socket.emit, 나를 제외한 나머지에게 보내고 싶을 때: socket.to
            // 현재 채널에 입장하고 있는 사용자에게만 메시지 발송하기
            // socket.emit(); -> 현재 서버소켓을 호출한(입장하는) 사용자에게만 메시지 발송하기
            // socket은 개인 사용자(나)를 기준으로 보낼 때 사용, io는 서버 단위로 연결되어 있는 사용자에게 보낼 때 사용
            socket.emit("entryOk", `${nickname}님, ${channel} 채널에 입장하신 것을 환영합니다.`);
        });


        // 접속한 채팅방 명시적 퇴장하기
        socket.on('exit', async(nickname, channel) => {
            // 나를 제외한 채팅방 내 모든 사용자에게 퇴장 사실 알림 처리
            socket.to(channel).emit("exitOk", `${nickname}님이 ${channel} 채널에서 퇴장하였습니다.`);

            // socket.leave(채팅방명); // 해당 채팅방 나가기 처리
            socket.leave(channel); // 채팅방 퇴장처리

            // 현재 퇴장하는 사용자한테도 메시지 전송
            socket.emit("exitOk", `${channel} 채널에서 퇴장했습니다. ${nickname}님, 안녕히 가세요.`);
        });


        // 채팅방 기준으로 해당 채팅방에 나를 포함한 모든 사용자들에게 메시지 발송하기
        // 클라이언트에서 메시지 데이터를 JSON 포맷으로 전송한다.
        socket.on('channelMsg', async(msgData) => { // JSON 데이터로 파라미터를 받는다.
            // 클라이언트로 보낼 메시지 포맷 정의
            const message = `${msgData.Nickname}:${msgData.Message}`;   

            // io.to('채널명').emit()은 현재 채널에 메시지를 보낸 당사자(나)를 포함한 현재 채널의 모든 접속자(사용자)에게 메시지를 발송한다.
            io.to(msgData.Channel).emit('receiveChannel', message)
        });

    });
}

/*
 * io.to(): 나(클라이언트)를 포함한 현재 채널에 접속한 모든 사람
 * io.emit(): 나(클라이언트)를 포함한 서버에 연결된 모든 사람
 * socket.to(): 나(클라이언트)를 제외한 현재 채널에 접속한 모든 사람
 * socket.emit(): 나(클라이언트)를 제외한 서버에 연결된 모든 사람
 */