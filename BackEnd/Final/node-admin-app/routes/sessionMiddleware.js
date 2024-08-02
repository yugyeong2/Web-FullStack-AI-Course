// 관리자 로그인 상태 체크 미들웨어
exports.isLoggedIn = (req, res, next) => {
     // 로그인을 아예하지 않으면, isLoggedIn이 생기지 않았으므로 undefined이다.
    if(req.session.isLoggedIn != undefined) { // isLoggedIn이 true인 경우(로그인한 경우)
        // 현재 사용자 로그인 상태이면, 원래 요청했던 프로세스를 넘어간다.
        next();
    } else {
        // 로그인이 안된 상태이면, 로그인 페이지로 무조건 이동시킨다.
        res.redirect('/login');
    }
}