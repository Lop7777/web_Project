const $$dice = document.querySelectorAll('#dice');
const $$player1 = document.querySelectorAll('[player-01]');
const $$player2 = document.querySelectorAll('[player-02]');
const $$subtotal = document.querySelectorAll('.subtotal');
const $$bonus = document.querySelectorAll('.bonus');

let diceValue = [0, 0, 0, 0, 0]; // 주사위 5개 각 숫자 (굴릴 때마다 변화)
let diceBool = [true, true, true, true, true]; // 주사위 고정 or 해제

let playerboard = [{1: NaN, 2: NaN, 3: NaN, 4: NaN, 5: NaN, 6: NaN},
              {1: NaN, 2: NaN, 3: NaN, 4: NaN, 5: NaN, 6: NaN}]; // player 스코어 (!뒤에 7번, 8번... 추가하여 확장!)
let tmpboard = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}; // 주사위 굴릴 때 숫자 임시 기록 (!playerscore과 동일 할 것!)
let playerTotal = [{subtotal : 0, bonus : 0, total : 0}, {subtotal : 0, bonus : 0, total : 0}]

let TURN = 0;
let rollCount = 3; // 굴릴 수 있는 횟수

document.querySelector('#roll').addEventListener('click', () => {
    if(rollCount == 0) return; // 3번 굴리면 무시

    tmpboard = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}; // 점수 기록판 비움

    for(let i = 0; i < 5; i++) { // 주사위 굴림
        if(diceBool[i]) { // diceBool 이 true로 활성화 되어 있을 때만 실행
            diceValue[i] = Math.floor(Math.random() * 6) + 1;
            $$dice[i].innerHTML = diceValue[i];
        }
    }

    diceValue.forEach(value => { // 기록판 (Aces ~ Sixes) 까지 기록
        tmpboard[value] += value; // 주사위 값이 기록된 배열 순회하며 값이 X인 경우 board.X에 가산
    });

    //!!여기에 fourkind, fullhouse 등은 어떻게 처리할 지 작성하면 됨!!

    for(let j = 0; j < 6; j++) { // 표 숫자를 board 내부 값에 따라 변경
        if(TURN === 0) {
            if (!isNaN(playerboard[TURN][j + 1])) continue;
            $$player1[j].innerHTML = tmpboard[j+1];
        }
        else if (TURN === 1) {
            if (!isNaN(playerboard[TURN][j + 1])) continue;
            $$player2[j].innerHTML = tmpboard[j+1];
        }
    }

    rollCount -= 1; // 굴릴 수 있는 횟수 깎기
})

$$dice.forEach((element, index) => { // 주사위 클릭시 고정할 지 여부
    element.addEventListener("click", () => {
        if(diceValue[0] === 0) { // 주사위 내부 값이 비어있으면 (아무 배열값이라도 0이면 전부 0일테니 0번째만 체크) 리턴 
            return;
        }
        if(diceBool[index]) {
            element.style.backgroundColor = 'grey';
            diceBool[index] = false;
        }
        else {
            element.style.backgroundColor = 'white';
            diceBool[index] = true;
        }
    })
})

const Select = (element, index) => { // 표 선택 시 동작 (바로 밑 이벤트 리스너로 호출 됨)
    element.addEventListener("click", function playerSelect (e) {
        console.log("select 클릭"); // 작동하는 지 테스트

        // 주사위 내부 값이 비어있으면 (아무 배열값이라도 0이면 전부 0일테니 0번째만 체크) 리턴
        // 해당 속성이 맞는지 has어쩌구를 통해 체크 (아니면 리턴해서 선택 무효화)
        if(diceValue[0] === 0 || !e.target.hasAttribute(`player-0${TURN + 1}`)) { 
            e.target.addEventListener("click", playerSelect, { once: true }); // once 때문에 한번이라도 실행되었으면 자동 제거되므로 이벤트 리스너 다시 추가
            return; // 리턴으로 밑 실행 코드 무시
        }
    
        e.target.style.backgroundColor = 'grey';
        diceValue = [0, 0, 0, 0, 0]; // 주사위 값 0으로 리셋
        rollCount = 3; // 굴릴 수 있는 횟수 리셋
        
        document.querySelector(`.gameNumber${TURN + 1}`).style.backgroundColor = 'white';

        playerboard[TURN][index + 1] = tmpboard[index + 1]; // 스코어에 기록

        playerTotal[TURN].subtotal += tmpboard[index + 1]; // 최종 토탈에 가산

        $$subtotal[TURN].innerHTML = playerTotal[TURN].subtotal; // 서브토탈 부분 보이게

        if(playerTotal[TURN].subtotal >= 63) {
            playerTotal[TURN].bonus = 35;
            $$bonus[TURN].innerHTML = 35;
        }

        TURN += 1; // 턴 + 1

        // 만약 비어있다면 (예를 들어 TURN이 2일 때 player[2]은 없으니 undefine 일 것임) 실행
        if(playerboard[TURN] === undefined) TURN = 0;

        document.querySelector(`.gameNumber${TURN + 1}`).style.backgroundColor = 'rgba(69, 69, 255, 0.212)';     

        $$dice.forEach((element, index) => {
            element.style.backgroundColor = 'white';
            diceBool[index] = true;
            element.innerHTML = '1';
        })
    }, {once : true});
}

$$player1.forEach(Select);
$$player2.forEach(Select);