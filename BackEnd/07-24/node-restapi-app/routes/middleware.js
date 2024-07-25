// exports.함수명은 해당 모듈 파일에서 여러 개의 재사용 가능한 함수의 기능을 바로 외부에서 사용할 수 있게 노출한다.

// 사용자 요청 URL을 분석해서 파라미터 방식으로 값이 전달된 경우
// 특정 parameter 값을 추출해서 비즈니스 로직을 적용한다.
// http://localhost:3000/articles/1
// http://localhost:3000/api/articles/1
exports.checkParams = (req, res, next) => {
    
    if(req.params.id == undefined) { // undefined: 값이 할당되지 않았다.
        console.log("id 파라미터가 존재하지 않습니다.");
        // res.redirect('/');
    } else {
        console.log("id 파라미터 값:", req.params.id);
    }
    next();
}

// 사용자 요청 URL을 분석해서 파라미터 방식으로 값이 전달된 경우
// 특정 key 값을 추출해서 비즈니스 로직을 적용한다.
exports.checkQuery = (req, res, next) => {
    if(req.query.category == undefined) {
        console.log("category 키 값이 전달되지 않았습니다.");
    }
    next();
}