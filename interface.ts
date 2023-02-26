/*
    TypeScript의 핵심 원칙 중 하나는 타입 검사가 값의 형태에 초점을 맞추고 있다는 것
    이를 "덕 타이핑(duck typing)" 혹은 "구조적 서브타이핑 (structural subtyping)"
    TypeScript에서, 인터페이스는 이런 타입들의 이름을 짓는 역할을 하고 
    코드 안의 계약을 정의 및 프로젝트 외부에서 사용하는 코드의 계약을 정의하는 강력한 방법
*/

// ※First Interface (첫번째 예제)
// 함수에 전달된 객체가 나열된 요구 조건을 충족하면, 허용됨
interface LabeledValue {
    label: string;
}
function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
}
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj); // myObj엔 LabeledValue에서 명시한 label 프로퍼티가 들어가 있으므로 검사에 통과함

// ※Optional Properties
// 인터페이스의 모든 프로퍼티가 필요한 것은 아님, 특정 조건에만 존재 or 아예 없음
// 객체 안의 몇 개의 프로퍼티만 채워 함수에 전달하는 `option bags` 같은 패턴 만들 시 유용
interface SquareConfig {
    // 선택적 프로퍼티는 선언에서 프로퍼티 이름 끝에 ?를 붙여 표시
    color?: string;
    width?: number;
}
// 선택적 프로퍼티의 이점은 인터페이스에 속하지 않는 프로퍼티의 사용 방지 및 사용 가능한 속성 기술
function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 };

    if (config.color) {
        newSquare.color = config.color;
    }

    if (config.width) {
        newSquare.area = config.width * config.width;
    }

    return newSquare;
}
let mySquare = createSquare({ color: 'black' });
console.log(mySquare);

// ※Readonly Properties
// 일부 프로퍼티들은 객체가 처음 생성될 때만 수정 가능해야 함
// 그럴 땐 프로퍼티 이름 앞에 readonly를 넣어서 지정 가능
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // readonly 프로퍼티를 생성 이후에 수정하려고 하므로 오류 발생
// TypeScript에서는 모든 변경 메서드(Mutating Methods)가 제거된 Array<T>와 동일한 ReadonlyArray<T> 타입을 제공
// 생성 후에 배열을 변경하지 않음을 보장할 수 있습니다.
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // 오류!
ro.push(5); // 오류!
ro.length = 100; // 오류!
a = ro; // 오류!
// ReadonlyArray를 일반 배열에 재할당이 불가능한 것을 확인 할 수 있는데 이건 타입 단언(type assertion)으로 오버라이드 가능
a = ro as number[];

// ※Excess Property Checks
// 인터페이스의 첫 번째 예제에서 TypeScript가 { label: string; } 으로 작성해도 { size: number; label: string } 허용했음
// 또한 선택적 프로퍼티를 배우고 'options bags'을 기술할 때 유용하다는 것을 배움
// 하지만 그냥 둘을 결합할 시 에러가 발생할 수 있음
// createSquare를 사용한 예제를 약간 변형하여 테스트해보자!

let mySquare2 = createSquare({ colour: 'red', width: 100 });
// createSquare의 매개변수가 colour로 전달된 것에 유의할 것, 이 경우엔 JS의 경우 조용히 오류 발생시킴
// width 프로퍼티는 적합하지만, color 프로퍼티는 없고.. 추가 colour 프로퍼티는 중요하지 않기 때문에, 이 프로그램이 올바르다고 생각 할 수 있음
// 하지만, TypeScript는 이 코드에 버그가 있을 수 있다고 생각함,
// 객체 리터럴은 다른 변수에 할당 OR 인수로 전달 시 특별한 처리를 받고, 초과 프로퍼티 검사를 받는다
// 만약 객체 리터럴이 '대상 타입(target type)'이 갖고 있지 않은 프로퍼티를 갖고 있으면, 에러 발생함
// ex) error: Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?

// 이 검사를 피하는 방법은 간단함, 제일 간단한 건 타입 단언 사용
let mySquare3 = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// 특별한 경우에, 추가 프로퍼티가 있음을 확실할 시, 문자열 인덱스 서명(string index signatuer)을 추가하는 것이 더 낫다
interface SquareConfig2 {
    color?: string;
    width?: number;
    [propName: string]: any;
}
function signatuerTest(config: SquareConfig2): boolean {
    console.log(config);
    return false;
}
signatuerTest({ colour: 'red', width: 100, test: 'test' }); // colour 및 test 프로퍼티를 삽입해도 오류를 표시하지 않는다!

// 검사를 피하는 마지막 방법은 객체를 다른 변수에 할당하는 것
// squareOptions가 추가 프로퍼티 검사를 받지 않기 때문에 컴파일러는 에러를 주지 않는다
let squareOptions = { colour: 'red', width: 100 };
let mySquare4 = createSquare(squareOptions);
// !주의할 점
// squareOptions 와 SquareConfig 사이에 공통 프로퍼티가 있는 경우에만 위 방법 사용 가능 ex) 여기선 width가 공통되는 중
let squareOptions2 = { colour: 'red' };
let mySquare5 = createSquare(squareOptions2); // 공통 프로퍼티가 존재하지않아 에러 표시 중

// ※Function Types
// 인터페이스는 JavaScript 객체가 가질 수 있는 넓은 범위의 형태를 기술할 수 있음.
// 프로퍼티로 객체를 기술하는 것 외에, 인터페이스는 함수 타입을 설명할 수 있음
// 인터페이스로 함수 타입을 기술하기 위해 인터페이스에 호출 서명 (call signature)를 전달함
// 각 매개변수는 이름 및 타입이 모두 필요
interface SearchFunc {
    (source: string, subString: string): boolean;
}
// 한번 정의 되면, 함수 타입 인터페이스는 다른 인터페이스처럼 사용 가능
let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
};
// 매개변수의 이름이 같을 필요는 없음

// 함수 매개변수들은 같은 위치에 대응되는 매개변수끼리 한번에 하나씩 검사함
// 만약, 타입을 전혀 지정하지 않고 싶다면, SearchFunc 타입의 변수로 직접 함수 값이 할당되었으므로 인수 타입 추론이 가능함
// 반환 타입은 반환하는 값으로 추론된다 (여기서는 false OR true)
let mySearch2: SearchFunc;
mySearch2 = function (src, sub) {
    let result = src.search(sub);
    return result > -1;
};
// 함수 표현식이 숫자 나 문자열을 반환했다면, 타입 검사는 반환 타입이 SearchFunc 인터페이스에 정의된 반환 타입과 일치하지 않는다는 에러를 발생시킴

// ※Indexable Types
// 인터페이스로 함수 타입을 설명하는 방법과 유사하게 a[10] 이나 ageMap["daniel"] 처럼 타입을 인덱스로 기술할 수 있음
// 인덱서블 타입은 인덱싱 시 해당 반환 유형과 함께 객체를 인덱싱하는데 사용할 수 있는 타입을 기술하는 인덱스 시그니쳐를 가짐
interface stringArray {
    [index: number]: string;
}

let myArray: stringArray;
myArray = ['Bob', 'Fred'];

let myStr: string = myArray[0];
// 위에서 인덱스 서명이 있는 StringArray 인터페이스가 있다
// 이 인덱스 서명은 StringArray가 number로 색인화(indexed)되면 string을 반환할 것을 나타냄

// 인덱스 서명을 지원하는 타입에는 두 가지가 있다: 문자열과 숫자.
// 두 타입의 인덱서를 모두 지원하는 것은 가능, 숫자 인덱서에서 반환된 타입은 반드시 문자열 인덱서에서 반환된 타입의 하위타입이어야 함
// 그 이유는 number로 인덱싱할 때, Js는 실제로 객체를 인덱싱하기 전에 string으로 변환하기 때문
// 즉, 100 (number)로 인덱싱하는 것은 "100" (string)으로 인덱싱하는 것과 같기 때문에, 서로 일관성 있어야 함
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 오류: 숫자형 문자열로 인덱싱을 하면 완전히 다른 타입의 Animal이 됨
interface NotOkay {
    [x: number]: Animal; // array[1] 로 불러와도 Js에선 array["1"]로 해당 값을 가져오기 때문에 숫자 인덱서의 반환 타입은 꼭!! 문자 인덱서의 반환 타입의 하위여야 함
    [x: string]: Dog;
}
// ! 위 예제에선 숫자 인덱서로 반환된 타입인 Animal이 문자열 인덱서에 반환된 Dog 타입의 하위 타입이 아니기 때문에 에러가 난다
// 위의 NotOkay에서 오류만 없애기 위해선 Dog가 Animal의 하위가 아닌 Animal이 Dog을 상속받기 OR 숫자 인덱서의 반환 타입이 Dog여야 한다.
interface isOkay {
    [x: number]: Dog;
    [x: string]: Animal;
}

// 문자열 인덱스 시그니처는 '사전' 패턴을 기술하는데 강력한 방법이지만, 모든 프로퍼티들이 반환 타입과 일치하도록 강제함
// 문자열 인덱스가 obj.property 가 obj['property']로도 이용 가능함을 알려주기 때문
// 아래 코드에선 name의 타입이 문자열 인덱스 타입과 불일치, 타입 검사는 에러를 발생시킴
interface NumberDictionary {
    [index: string]: number;
    length: number; // 성공, length는 숫자
    name: string; // 오류, `name`의 타입은 인덱서의 하위타입이 아님
}

// 인덱스 시그니처가 프로퍼티 타입들의 합집합이며냐 다른 타입 프로퍼티도 허용 가능!
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number;
    name: string;
}

// 인덱스 할당을 막기 위해 인덱스 시그니처를 읽기 전용으로 만들기도 가능
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray2: ReadonlyStringArray = ['Alice', 'Bob'];
myArray2[2] = 'Mallory'; // 오류! readonly 이므로 값 할당 불가

// ※클래스 타입

// - Implementing an interface
// 클래스가 특정 계약을 충족시키도록 명
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void; // 구현된 메소드를 인터페이스 안에서도 기술 가능
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) {}
}
// ! 인터페이스는 클래스의 public과 private 모두보다는, public을 기술함
// 그래서 클래스 인스턴스의 private에서는 특정 타입이 있는 지 검사 불가

// - Difference between the static and instance sides of classes
// 클래스의 인터페이스를 다룰 때, 두 가지 타입을 가진다는 것을 인지하면 좋다. (스태틱 타입과 인스턴스 타입)
// 생성 시그니처 (construct signature)로 인터페이스를 생성하고, 클래스를 생성하려고 하면 인터페이스를 implements 할 때 에러가 발생함
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock2 implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) {}
}
// Clock2 클래스에서 new (hour: number, minute: number) 생성자에 대한 구현을 하고 있어서 오류가 남
// ! 클래스가 인터페이스를 implements 할 때, 클래스의 인스턴스만 검사하기 때문에 생성자는 스태틱이라 해당 검사에 포함되지 않음

// 대신, 클래스의 스태틱 부분을 직접적으로 다룰 필요가 있다.
// 아래 예제에선 ClockConstructor2는 생성자 정의, ClockInterface2는 인스턴스 메소드를 정의
interface ClockConstructor2 {
    new (hour: number, minute: number): ClockInterface2;
}
interface ClockInterface2 {
    tick(): void;
}

function createClock(ctor: ClockConstructor2, hour: number, minute: number): ClockInterface2 {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface2 {
    constructor(h: number, m: number) {} // ClockConstructor2의 생성자 시그니처에 해당됨
    tick() {
        // ClockInterface2를 구현해야 하므로 tick 메소드 구현
        console.log('beep beep');
    }
}
// DigitalClock과 같은 방식
class AnalogClock implements ClockInterface2 {
    constructor(h: number, m: number) {}
    tick() {
        console.log('tick tock');
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// 다른 방식은 클래스 표현을 사용
// interface ClockConstructor {
//     new (hour: number, minute: number);
// }

// interface ClockInterface {
//     tick();
// }

// const Clock: ClockConstructor = class Clock implements ClockInterface {
//     constructor(h: number, m: number) {}
//     tick() {
//         console.log('beep beep');
//     }
// };

// ※Extending Interfaces 인터페이스 확장
// 클래스처럼 인터페이스도 확장이 가능함
// 인터페이스 멤버를 다른 인터페이스에 복사하는 것이 가능해짐
// 인터페이스를 재사용성 높은 컴포넌트로 쪼갤 때, 유연함 제공
interface Shape {
    color: string;
}
interface Square extends Shape {
    sideLength: number;
}
let square = {} as Square;
square.color = 'blue';
square.sideLength = 10;

// 다수의 인터페이스도 확장이 가능하다!
interface PenStroke {
    // 새 인터페이스 추가!
    penWidth: number;
}

interface Square2 extends Shape, PenStroke {
    // 두 개의 인터페이스를 확장한다
    sideLength: number;
}
let square2 = {} as Square2;
square2.color = 'blue';
square2.sideLength = 10;
square2.penWidth = 5.0;

// ※Hybrid Types
// Js의 동적이고 유연한 특성 대문에, 위에서 설명했던 몇몇 타입의 조합으로 동작하는 객체를 가끔 마주할 수 있음
// 그런 예 중 하나는 추가적인 프로퍼티와 함께, 함수와 객체 역할 모두 수행하는 객체
// 써드파티 (3rd-party) JavaScript와 상호작용할 때, 타입의 형태를 완전히 기술하기 위해 위와 같은 패턴을 사용해야할 수도 있음
interface Counter {
    // 이해는 잘 안가지만 첨봤을 땐 일단 class와 비슷하다고 이해 중
    (start: number): string;
    interval: number;
    reset(): void;
}
function getCounter(): Counter {
    let counter = function (start: number) {
        console.log(start);
        return 'test';
    } as Counter;
    counter.interval = 123;
    counter.reset = function () {};
    return counter;
}
let c = getCounter();
console.log(c(10));
c.reset();
c.interval = 5.0;

// ※클래스를 확장한 인터페이스 (Interfaces Extending Classes)
// 인터페이스 타입이 클래스 타입을 확장하면, 클래스의 멤버는 상속, 구현은 상속받지 않음
// 인터페이스가 구현을 제공하지 않고, 클래스의 멤버 모두를 선언한 것과 동일, 심지어 기초 클래스의 private과 protected 멤버도 상속 받음
// 이건 인터페이스가 private 혹은 protedted 멤버를 포함한 클래스를 확장할 수 있다는 뜻이며 인터페이스 타입은 그 클래스나 하위클래스에 의해서만 구현 가능
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {}
}

class TextBox extends Control {
    select() {}
}

// Control 클래스거나 하위 클래스가 아니라서 private state 멤버를 구현할 수 가 없음!
class Image implements SelectableControl {
    private state: any;
    select() {}
}
