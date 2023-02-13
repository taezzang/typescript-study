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
    [x: number]: Animal;
    [x: string]: Dog;
}
// 문자열 인덱스 시그니처는 '사전' 패턴을 기술하는데 강력한 방법이지만, 모든 프로퍼티들이 반환 타입과 일치하도록 강제함
// 문자열 인덱스가 obj.property 가 obj['property']로도 이용 가능함을 알려주기 때문
// 아래 코드에선 name의 타입이 문자열 인덱스 타입과 불일치, 타입 검사는 에러를 발생시킴
interface NumberDictionary {
    [index: string]: number;
    length: number; // 성공, length는 숫자
    name: string; // 오류, `name`의 타입은 인덱서의 하위타입이 아님
}

// ! 인덱서블 타입은 이해가 좀 힘들다 추가로 계속 공부하자
