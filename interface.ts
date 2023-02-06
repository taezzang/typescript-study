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
