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

// ※Typing the function
// 이전에 사용했던 예시에 타입을 더해보자
function add2(x: number, y: number): number {
    return x + y;
}
let myAdd2 = function (x: number, y: number): number {
    return x + y;
};
// 각 파라미터와 함수 자신의 반환될 타입을 정해줄 수 있음
// TypeScript는 반환 문을 보고 반환 타입을 파악할 수 있으므로 반환 타입을 생략할 수 있음
