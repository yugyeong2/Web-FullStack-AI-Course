
// !
// 인터페이스의 목적은 데이터 타입을 정의하거나,
// 특정 인터페이스를 상속받아 기능을 확장가능(extends)하며,
// 특정 클래스에서 해당 인터페이스를 상속받으면 반드시 인터페이스의 기능과 속성을 클래스에서 구현(implements)해주어야 한다.

// extends: 기능을 확장
// implements: 클래스의 기능을 제어하기 위해

interface User {
    name:string;
    age:number;
}

// ! 인터페이스와 타입의 차이: "=" 주의
type MemberType = {
    name:string;
    age:number;
}

function greeting(user:User):string {
    return `Hello! ${user.name}.`;
}

let user = {name: "Yugyeong", age: 22};
console.log(greeting(user));

// 인터페이스는 인터페이스를 상속받아 기능을 확잘할 수 있다.
interface Person {
    name: string;
}

interface Person {
    address: string;
}

interface Group {
    group: string;
}

// Employee 인터페이스는 extends(확장) 키워드를 이용해 특정 인터페이스를 상속받아, 기능을 확장할 수 있다.
// 여러 개의 인터페이스를 상속 받을 수 있다. 
interface Employee extends Person, Group {
    department: string;
}

let employee: Employee = {
    name: "Alice",
    department: "Development",
    address: "청주시",
    group: "IT"
};

// -------------------------------------

// 객체 지향적으로 인터페이스를 사용
// OOP(Object Oriented Programming)에서의 인터페이스
// 인터페이스에서 정의한 속성과 기능을 정의하고,
// 인터페이스를 상속받은 클래스는 반드시 해당 인터페이스에 정의된 속성/기능을 구현해야 하는 제약 제공
// 인터페이스는 직접적인 기능 구현을 하지 않고, 형식만 정의해서 해당 형식을 구현하거나 확장할 수 있는 방법을 제공한다.
interface Movable { 
    speed: number;
    move(): void;
}

// Car 클래스는 Movable 인터페이스를 상속받아, 해당 인터페이스의 속성과 기능을 클래스내에서 구현(implements)해야 한다.
class Car implements Movable {
    speed: number;

    // 생성자 함수: 생성자 함수는 클래스를 통해 객체가 생성되는 시점에 자동을 호출되는 함수
    // 클래스를 이용해 객체를 만들어 내는 과정 new Car()를 인스턴스화 한다고 표현한다.
    // 생성자 함수를 정의하지 않을 수도 있다.
    constructor(speed:number) {
        // this는 현재 클래스 내부에 접근하기 위한 예약어
        // this.speed는 클래스 내 내부 속성인 상단의 클래스 내에 정의된 speed 속성이다.
        // = 뒤에 오는 speed는 객체를 생성하는 시점에 new Car(500); 생성자 함수로 전달되는 속도값 파라미터이다.
        this.speed = speed;
    }

    move() {
        console.log(
            `현재 자동차는 ${this.speed.toString()} km 속도로 이동 중입니다.`
        );
    }
}

// 클래스를 이용해 myCar라는 객체(Object)를 생성한다.
// new 연산자를 이용해 클래스의 객체를 만들고,
// 만들어진 객체는 프로그램이 실해오디는 컴퓨터의 메모리에 저장되며, 이러한 과정을 인스턴스화 라고 표현한다.
// 클래스는 인스턴스화 될 때, 클래스 내 정의된 생성자 함수가 자동으로 실행되고, 해당 함수에 파라미터를 전달할 수 있다.
let myCar = new Car(100);
console.log("내 차의 현재 속도:", myCar.speed);
myCar.move();