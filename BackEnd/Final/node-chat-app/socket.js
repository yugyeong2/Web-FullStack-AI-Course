// 메시지 서버소켓 파일
// 해당 socket.js 모듈이 메시징 서버 역할을 제공한다.

/*
 * io 객체: 서버 소켓 객체
 * io.to(): 나(클라이언트)를 포함한 현재 채널에 접속한 모든 사용자
 * io.emit(): 나(클라이언트)를 포함한 서버 소켓과 연결된 모든 사용자

 * socket 객체: 개별 사용자/그룹 단위의 메시지 처리 객체
 * socket.to(): 나(클라이언트)를 제외한 현재 채널에 접속한 모든 사용자
 * socket.emit(): 나(클라이언트)를 제외한 서버에 연결된 모든 사용자
 */

// socket.io 팩키지 참조
const SocketIO = require("socket.io");

// DB 객체 참조
var db = require('./models/index');

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
var sequelize = db.sequelize;
const { QueryTypes } = sequelize;

// OpenAI API 호출을 위한 axios 패키지 참조
const axios = require('axios');

// 파일 처리를 위한 file system 내장 객체 참조
const fs = require('fs');

// OpenAI 객체 생성
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

        // !
        const req = socket.request;

        // 웹 소켓 서버에 접속한 사용자 아이피 조회
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace('::;ffff', '');

        // 웹 소켓 아이디 = connection id 추출
        // 서버에서 사용자를 구분할 수 있는 connection id(=socket.id)
        // -> connection id를 통해 사용자에게 직접 메시지를 보낼 수도 있다.
        const socketId = socket.id;

        // 클라이언트 소켓이 비정상적으로 소켓과 연결이 끊어진 경우를 인지하여, 해당 사용자의 연결 정보를 갱신할 수 있다.
        // 비정상적인 소켓 끊김: 웹브라우저를 닫고 나가기 / 모바일 앱을 닫기 / 네트워크가 끊김 (wifi <-> mobile)
        // -> 연결된 상태에서 연결이 끊어지기 때문에 disconnection은 connection 안쪽에서 구현
        socket.on('disconnect', async() => {
            // 사용자 연결 끊김 처리 필요
            await UserDisconnectionOut();
        });

        // 비정상 연결 끊김 사용자 정보 처리
        async function UserDisconnectionOut() {
            // 현재 웹소켓이 끊긴 사용자 정보 조회
            let exitUser = await db.ChannelMember.findOne({
                where: { connection_id: socketId, active_state_code: 1 }
            });
            // ! ...

            // 나갈 때 메시지
            if(exitUser != null) {
                var msg = {
                    channel_id: exitUser.channel_id,
                    member_id: exitUser.member_id,
                    nick_name: exitUser.nick_name,
                    msg_type_code: 0,
                    connection_id: socketId,
                    message: exitUser.nick_name + ' 사용자가 퇴장했습니다.',
                    ip_address: userIP,
                    msg_state_code: 1,
                    msg_date: new Date()
                };

                await db.ChannelMessage.create(msg);
            }
        }
        // !

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
        socket.on("entry", async(member, channel) => {
            // socket.join('채팅방 이름');은  서버환경에 해당 채팅방이름으로 채널을 개설하고, 현재 입장하는 사용자를 해당 채팅방 사용자로 등록 처리한다.
            // 이미 해당 채널이 개설되어 있으면 신규 개설하지 않고 기존 채널로 입장한다.
            // socket.join('채팅방 이름');
            socket.join(channel);

            let chatUser = await db.ChannelMember.findOne({
                where: { channel_id: channel, member_id: member.member_id } // 어떤 채널에 어떤 사용자가 접속해있는지
            });

            // 현재 채널에 접속한 사용자 정보가 없으면, 접속 정보를 갱신한다.
            // 채팅방에 들어올 때마다, 최신의 정보를 갱신한다.
            if(chatUser == null) {
                var entryMember = {
                    channel_id: channel,
                    member_id: member.member_id,
                    nick_name: member.name,
                    member_type_code: 0,
                    active_state_code: 1,
                    last_contact_date: new Date(),
                    connection_id: socketId,
                    ip_address: userIP,
                    edit_date: new Date(),
                    edit_member_id: member.member_id
                };

                chatUser = await db.ChannelMember.create(entryMember);
                console.log('생성된 채널 접속자:', chatUser.nick_name);

            } else {
                var updateMember = {
                    
                    active_state_code: 1,
                    last_contact_date: new Date(),
                    connection_id: socketId,
                    ip_address: userIP,
                    edit_date: new Date(),
                    edit_member_id: member.member_id
                };

                chatUser = await db.ChannelMember.update(updateMember, {
                    where: {
                        channel_id: channel,
                        member_id: member.member_id,
                    },
                });
            }

            // 입장 메시지
            var entry_message = {
                channel_id: channel,
                member_id: member.member_id,
                nick_name: member.name,
                msg_type_code: 1, // 입장 메시지
                connection_id: socketId,
                message: member.name + ' 사용자가 입장했습니다.',
                ip_address: userIP,
                msg_state_code: 1,
                msg_date: new Date()
            };

            await db.ChannelMessage.create(entry_message);

            // 현재 접속자를 제외한 해당 채널에 이미 접속한 모든 사용자에게 메시지를 발송한다.
            // socket.to('채널명').emit();
            // 내가 입장했을 떼는 아래와 메시지가 뜨지 않는다. 다른 메시지가 뜨게 할 수도 있음.
            socket
            .to(channel)
            .emit("entryOk", {
                    member_id: member.member_id,
                    name: member.name,
                    profile: member.profile,
                    message: `${member.name}님이 ${channel} 채널에 입장하였습니다.`,
                    send_date: new Date()
                }
            );

            // 나에게만 보내고 싶을 때: socket.emit, 나를 제외한 나머지에게 보내고 싶을 때: socket.to
            // 현재 채널에 입장하고 있는 사용자에게만 메시지 발송하기
            // socket.emit(); -> 현재 서버소켓을 호출한(입장하는) 사용자에게만 메시지 발송하기
            // socket은 개인 사용자(나)를 기준으로 보낼 때 사용, io는 서버 단위로 연결되어 있는 사용자에게 보낼 때 사용
            socket.emit("entryOk",{
                    member_id: member.member_id,
                    name: member.name,
                    profile: member.profile,
                    message: `${member.name}님, ${channel} 채널에 입장하신 것을 환영합니다.`,
                    send_date: new Date()
                }
            );
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
        socket.on('channelMsg', async(channel, msgData) => { // JSON 데이터로 파라미터를 받는다.
            try {
                // 클라이언트로 보낼 메시지 포맷 정의
                const message = {
                    member_id: msgData.member_id,
                    name: msgData.name,
                    profile: msgData.profile,
                    message: msgData.message,
                    send_date: new Date(),
                };

                // 채팅방에서 주고받은 메시지를 DB에 저장
                var msg = {
                    channel_id: channel,
                    member_id: msgData.member_id,
                    nick_name: msgData.name,
                    msg_type_code: 2,
                    connection_id: socketId,
                    message: msgData.message,
                    ip_address: userIP,
                    msg_state_code: 1,
                    msg_date: new Date()
                };

                await db.ChannelMessage.create(msg);

                // io.to('채널명').emit()은 현재 채널에 메시지를 보낸 당사자(나)를 포함한 현재 채널의 모든 접속자(사용자)에게 메시지를 발송한다.
                io.to(channel).emit('receiveChannel', message);

                console.log('채널 메시지:', message);
            } catch (error) {
                console.error('channelMsg 전송 중 에러:', error);
            }
        });


        // ChatGPT-4o와의 질문-답변 처리 실시간 이벤트 수신기 정의
        // 프론트엔드 소켓에서 호출하는 gpt 서버 이벤트 수신기 정의
        socket.on('gpt', async(msg) => {
            // Step0: 사용자가 보내준 메시지 데이터를 다시 현재 사용자에게 발송해 화면에 표시
            // socket.emit('gptMessage', msg); -> 현재 메시지를 보내온 사용자에게만 서버에서 메시지 발송
            socket.emit('gptMessage', msg);

            // Step1: 프론트엔드 소켓에서 전달해준 메시지 데이터 추출 - prompt
            const prompt = msg.message;

            // Step2: OpenAI ChatGPT REST API 호출
            // -> 서버와 gpt는 실시간 연결이 아니라, RestAPI 통신하여 요청과 응답을 처리한다.
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o', // 지원 LLM 모델: gpt-4o-mini, gpt-4o, gpt-4, gpt-3.5-turbo
                messages: [{role: 'user', content: prompt}],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            });

            // Step3: ChatGPT 응답 메시지 반환 받기
            const gptMessage = response.data.choices[0].message.content;

            // Step4: 프론트엔드 소켓으로 GPT 응답 메시지 데이터 전송
            msg.message = gptMessage;
            msg.member_id = 0; // ChatGPT는 0번 사용자로 처리
            socket.emit('gptMessage', msg);
        });
    });
};

