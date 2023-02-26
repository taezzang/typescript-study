/*
 TypeScript에는 클래스, 네임스페이스, 모듈이 있지만, 
 함수는 여전히 이 일을 어떻게 할 것인지를 설명하는 데 있어 핵심 역할을 수행
 TypeScript에서는 표준 JavaScript 함수가 작업을 수월하게 하도록 몇 가지 새로운 기능을 추가
*/

// ※Function
// TypeScript 함수는 JavaScript와 마찬가지로 기명 함수(named function)과 익명 함수(anonymous function)로 생성 가능
// 기명 함수
function add(x, y) {
    return x + y;
}
// 익명 함수
let myAdd = function (x, y) {
    return x + y;
};
// JavaScript 처럼 함수는 함수 외부의 변수 참조 가능
let z = 100;
function addToZ(x, y) {
    return x + y + z;
}

// ※Function Types

// -함수의 타이핑(Typing the function)
// 이전에 사용했던 예시에 타입을 더해보자
function add2(x: number, y: number): number {
    return x + y;
}
let myAdd2 = function (x: number, y: number): number {
    return x + y;
};
// 각 파라미터와 함수 자신의 반환될 타입을 정해줄 수 있음
// TypeScript는 반환 문을 보고 반환 타입을 파악할 수 있으므로 반환 타입을 생략할 수 있음

// -함수 타입 작성하기 (Writing the function type)
// 합수 타입들을 살펴보고 함수의 전체 타입 작성하기
let myAdd3: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
// 함수 타입은 매개변수의 타입과 반환 타입이 있고, 전체 함수 타입을 작성하고자 하면 이 두 가지 타입이 필요함
// 매개변수 목록처럼 각 매개변수에 이름과 타입을 작성해 주자. 이건 가독성을 위한 것
// 위 myAdd3 함수의 선언을 다음과 같이 쓸 수 있음
let myAdd4: (baseValue: number, increment: number) => number = function (x: number, y: number): number {
    return x + y;
};
// 매개변수의 타입들이 올바르게 나열되어 있다면 함수 타입에 이름 붙이더라도 유효한 타입으로 간주
// 두 번째로 반환타입. 매개변수 타입들과 반환 타입 사이에 '화살표 표기'( => )를 써서 반환 타입을 분명히 할 수 있음
// 함수 표기에 필요한 부분들이며 만약 함수가 값을 반환하지 않는다면 비워두는 대신 void를 써서 표시 함
// 매개변수 타입과 반환 타입만이 함수 타입을 구성, 캡처된 변수는 타입에 반영되지 않으며 사실상 캡처된 변수는 함수의 '숨겨진 상태'의 일부이고 API 구성하지 않음
