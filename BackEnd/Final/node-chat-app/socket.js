// 메시지 서버소켓 파일
// 해당 socket.js 모듈이 메시징 서버 역할을 제공한다.

// socket.io 팩키지 참조
const SocketIO = require("socket.io");

// socket.js 모듈 기능 정의
module.exports = (server)=>{
    // 서버소켓의 입출력(Input/Output) 메시지 처리 객체 io 생성
    // input 메시지는 웹브라우저에서 들어오는 메시지
    // output 메시지는 서버소켓에서 웹브라우저로 전송하는 메시지
    const io = SocketIO(server,{path:"/socket.io"});

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
    });
}