/*
 TypeScript에는 클래스, 네임스페이스, 모듈이 있지만, 
 함수는 여전히 이 일을 어떻게 할 것인지를 설명하는 데 있어 핵심 역할을 수행
 TypeScript에서는 표준 JavaScript 함수가 작업을 수월하게 하도록 몇 가지 새로운 기능을 추가
*/

// ※Function (함수)
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

// ※Function Types (함수 타입)

// -Typing the function (함수의 타이핑)
// 이전에 사용했던 예시에 타입을 더해보자
function add2(x: number, y: number): number {
    return x + y;
}
let myAdd2 = function (x: number, y: number): number {
    return x + y;
};
// 각 파라미터와 함수 자신의 반환될 타입을 정해줄 수 있음
// TypeScript는 반환 문을 보고 반환 타입을 파악할 수 있으므로 반환 타입을 생략할 수 있음

// -Writing the function type (함수 타입 작성하기)
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

// -Inferring the types (타입의 추론)
// 위 myAdd2는 전체 함수 타입을 가진다.
// 위 myAdd4의 매개변수 x와 y는 number 타입을 가진다.
// 이러한 타입 추론 형태를 'contextual typing' 이라 부름

// ※선택적 매개변수와 기본 매개변수 (Optional and Default Parameter)
// 함수에 주어진 인자의 수는 함수가 기대하는 매개변수의 수와 일치해야 함
function buildName(firstName: string, lastName: string) {
    return firstName + ' ' + lastName;
}
// let result1 = buildName('Bob'); // 오류, 너무 적은 매개변수
// let result2 = buildName('Bob', 'Adams', 'Sr.'); // 오류, 너무 많은 매개변수
let result3 = buildName('Bob', 'Adams'); // 정확함

// 선택적 매개변수를 원한다면 매개변수 이름 끝에 ? 를 붙임으로써 해결 가능
function buildName2(firstName: string, lastName?: string) {
    if (lastName) return firstName + ' ' + lastName;
    else return firstName;
}

let result4 = buildName2('Bob'); // 지금은 바르게 동작 (lastName은 선택적 매개변수이므로)
// let result5 = buildName2('Bob', 'Adams', 'Sr.'); // 오류, 너무 많은 매개변수
let result6 = buildName2('Bob', 'Adams'); // 정확함

// 유저가 값을 제공하지 않거나 undefined로 했을 때에 할당될 매개변수의 값을 미리 세팅 가능
// 이것을 '기본-초기화 매개변수' 라고 함
function buildName3(firstName: string, lastName = 'Smith') {
    // lastName만 기본-초기화 매개변수인 것 firstName은 buildName2와 같이 필수로 입력해야 함!
    return firstName + ' ' + lastName;
}

let result7 = buildName3('Bob'); // 올바르게 동작, "Bob Smith" 반환
let result8 = buildName3('Bob', undefined); // 여전히 동작, 역시 "Bob Smith" 반환
// let result9 = buildName3('Bob', 'Adams', 'Sr.'); // 오류, 너무 많은 매개변수
let result10 = buildName3('Bob', 'Adams'); // 정확함
// 모든 필드 매개변수 뒤에 오는 '기본-초기화 매개변수'는 선택적으로 처리되며, 함수 호출 시 생략 가능함

// 순수한 선택적 매개변수와 다르게 기본-초기화 매개변수는 필수 매개변수 뒤에 오는 것이 강요되지 않음
// 만약 기본-초기화 매개변수가 필수 매개변수보다 앞에 오게 된다면 사용자가 명시적으로 undefined 전달해주어야 기본-초기화 매개변수 볼 수 있음
function buildName4(firstName = 'Will', lastName: string) {
    return firstName + ' ' + lastName;
}

// let result11 = buildName4('Bob'); // 오류, 매개변수 수가 적음
// let result12 = buildName4('Bob', 'Adams', 'Sr.'); // 오류, 매개변수 수가 많음
let result13 = buildName4('Bob', 'Adams'); // 성공, "Bob Adams" 반환
let result14 = buildName4(undefined, 'Adams'); // 성공, "Will Adams" 반환

// ※나머지 매개변수 (Rest Parameter)
// 필수, 선택적, 기본 매개변수는 한 번에 하나의 매개변수만을 가지고 이야기 함
// Js에서는 모든 함수 내부에 위치한 arguments라는 변수를 사용해 직접 인자를 가지고 작업 가능
// TS에서는 이 인자들을 하나의 변수로 모을 수 있음
function buildName5(firstName: string, ...restOfName: string[]) {
    return firstName + ' ' + restOfName.join(' ');
}

// employeeName 은 "Joseph Samuel Lucas MacKinzie" 가 될것입니다.
let employeeName = buildName5('Joseph', 'Samuel', 'Lucas', 'MacKinzie');

// 나머지 매개변수는 선택적 매개변수들의 수를 무한으로 취급함
// 나머지 매개변수로 인자들을 넘겨줄 땐 원하는 만큼 넘기기 가능 (아무것도 안넘길 수 도 있다!)
// 컴파일러는 생략 부호(...) 뒤의 이름으로 전달된 인자 배열을 빌드하여 함수에서 사용할 수 있도록 함
function buildName6(firstName: string, ...restOfName: string[]) {
    return firstName + ' ' + restOfName.join(' ');
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName6;

// ※this
// TypeScript는 몇 가지 기술들로 잘못된 this 사용을 잡아낼 수 있음

// -this와 화살표 함수 (this and arrow functions)
// JS에서, this는 함수가 호출될 때 정해지는 변수, 매우 강력하고 유연한 기능이지만 항상 함수가 실행되는 콘텐스트에 대해 알아햐 함
let deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function () {
        return function () {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return { suit: this.suits[pickedSuit], card: pickedCard % 13 }; // deck 객체의 suits가 아닌 window의 suits를 참조하게 됨
        };
    },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit);
// 위 예시에선 createCardPicker가 자기 자신을 반환하는 함수임을 주목하자.
// 기대했던 로그 대신 오류가 뜨게 되는데 이유는 createCardPicker에 의해 생성된 함수에서 사용중인 this가 deck객체가 아닌 window로 설정되었기 때문
// cardPicker()의 자체적인 호출 때문에 생긴 일, 최상위 레벨에서의 비-메서드 문법의 호출은 this를 window로 함 (strict mode에선 this가 undefined로 됨)

// 해당 문제는 함수 반환 전 바인딩을 알맞게 하는 것으로 해결 가능
// 함수 표현식을 ES6 화살표 함수로 바꾸자, 화살표 함수는 함수가 호출된 곳이 아닌 함수가 생성된 쪽의 this를 캡처함
let deck2 = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function () {
        // 아랫줄은 화살표 함수로써, 'this'를 이곳에서 캡처할 수 있도록 함
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    },
};

let cardPicker2 = deck2.createCardPicker();
let pickedCard2 = cardPicker2();

console.log('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit); // 성공! 'card: 0 of clubs' 반환

// -this 매개변수 (this parameter)
// 위 예제에서 this.suits[pickedSuit]의 타입은 any, this가 객체 리터럴 내부의 함수(createCardPicker)에서 왔기 때문
// 이것을 고치기 위해 명시적으로this 매개변수를 줄 수 있음, this 매개변수는 함수의 매개변수 목록에서 가장 먼저 나오는 가짜 매개변수
function f(this: void) {
    // 독립형 함수에서 `this`를 사용할 수 없는 것을 확인함
}

// 위 예제에서 Card와 Deck 두 가지 인터페이스 타입을 추가해 보자.
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck3: Deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    // NOTE: 아래 함수는 이제 callee (arguments 객체 속성)가 반드시 Deck 타입이어야 함을 명시적으로 지정합니다.
    createCardPicker: function (this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    },
};

let cardPicker3 = deck3.createCardPicker();
let pickedCard3 = cardPicker();

alert('card: ' + pickedCard3.card + ' of ' + pickedCard3.suit);

// -콜백에서 this 매개변수 (this parameters in callbacks)
// 나중에 호출할 콜백 함수를 라이브러리에 전달할 때 this때문에 오류발생할 수 있음
// 라이브러리는 콜백을 일반 함수처럼 호출하므로 this는 undefined가 됨   (이 부분 이해가 잘 안됨...)
// 일부 작업에선 this 매개변수를 콜백 오류를 막는데 사용 가능함, 먼저 라이브러리 작성자는 콜백 타입을 this로 표시해줘야함
interface UIElment {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
