// 자식 컴포넌트 참조
import Personal from '@/components/personal';
import Company from '@/components/company';

const Profile = () => {
    return (
        <>
            {/* 자식 요소에 props로 읽기전용 데이터를 전달한댜. */}
            <Personal
            name="박유경"
            email="test@test.co.kr"
            phone="010-1234-5678"
            age={22}
            >
                {/* 자식 컴포넌트의 children 값을 정의한다. */}
                <b>사용자 기본 프로필</b> {/* -> children이라는 속성으로 자동으로 전달된다. */}
            </Personal>
            
            <hr></hr>
            
            <Company
            company="유경소프트웨어"
            role="풀스택 개발자"
            address="청주시 복대동"
            >
                <span>회사 정보</span>
            </Company>
        </>
    );
}

export default Profile;