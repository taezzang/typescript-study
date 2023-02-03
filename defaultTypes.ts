// TypeScript에서 지원하는 데이터 타입에 대해 간략하게 정리

// ※기존에 JS에서도 사용하던, 이미 잘 알고있는 기본 타입들

// Boolean
let isDone: boolean = false;

// ※Number
// 16진수, 10진수 리터럴 및 2진수, 8진수 리터럴도 지원
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// ※String
// JS 처럼 큰따옴표 및 작은 따옴표로 감싸 사용 가능
// 템플릿 문자열도 (``) 사용 가능
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.
I'll be ${age + 1} years old next month.`;

// ※Array
// 타입뒤에 [] 쓰기 OR 제네릭으로 배열 타입 쓰기
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// ※Tuple
// 요소의 타입과 개수가 고정된 배열 표현 가능
// 요소들의 타입이 모두 같을 필요는 없음
let x: [string, number]; // 튜플 타입으로 선언
x = ['hello', 10]; // 올바른 초기화 방법
x = [10, 'hello']; // 틀린 초기화 방법
// 정해진 인덱스에 위치한 요소에 접근 시 해당 요소 타입을 통해 검사 가능
console.log(x[0].substring(1)); // 성공
console.log(x[1].substring(1)); // number타입엔 substring 불가
x[3] = 'world'; // 정해진 인덱스 외 다른 인덱스 접근 시 오류 발생

// ※Enum
// 기존 JS에서 공식적으로 지원하진 않으나 TS에선 자체적으로 구현한 기능임
// enum은 값의 집합에 더 나은 이름을 붙일 수 있음
// enum 타입 사용 시 Tree-shaking이 되지 않아 최종적으로 사용하지 않더라도 번들에 포함되는 등 단점이 존재함
enum Color { // 기본적으로, enum은 0부터 시작하여 멤버들의 번호를 매김
    Red,
    Green,
    Blue,
}
let c: Color = Color.Green;
// 멤버 중 하나의 값을 수동으로 설정 가능 ex) 0 대신 1부터 시작
enum Color2 {
    Red = 1,
    Green,
    Blue,
}
let c2: Color2 = Color2.Green;
// 또는, 모든 값을 수동으로 설정 가능하다
enum Color3 {
    Red = 1,
    Green = 2,
    Blue = 4,
}
// Color enum 멤버와 매칭되는지 알 수 없을 때, 이에 일치하는 이름을 알아낼 수 있다
let colorName: string = Color[2];
console.log(colorName); // 값이 2인 'Green'이 출력됩니다.

// ※Any
// 타입 검사를 하지 않고, 그 값들이 통과하길 원한다면 any 타입 사용을 고려해보자
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false; // 놀랍게도 오류 안남
// 사실상 기존 JS로 개발하는 것처럼 작업 할 수 있게 해주는 방법임
// Object로 선언된 변수들은 오직 어떤 값이든 할당할 수 있게 해주지만 실제로 메소드가 존재해도 임의로 호출 불가
let prettySure: Object = 4;
prettySure.toFixed(); // 오류 : 프로퍼티 'toFixed'는 'Object'에 존재하지 않음
// any 타입은 타입의 일부만 알고 전체는 알지 못할 때 유용함 ex) 여러 타입이 섞인 배열을 다룰 때..
let list: any[] = [1, true, 'free'];
list[1] = 100;

// ※Void
// 어떤 타입도 존재할 수 없음을 나타냄, 보통 함수에서 반환 값이 없을 때 반환 타입을 표현하기 위해 쓰임
function warnUser(): void {
    console.log('This is my warning message');
}
let unusable: void = undefined;
unusable = null; // 성공 '--strictNullChecks' 를 사용하지 않을때만...

// ※Null and Undefined
// TypeScriptsms undefined과 null 둘 다 자신의 타입 이름으로 사용
let u: undefined = undefined;
let n: null = null; // 얘네 둘은 이거밖에 안됨
