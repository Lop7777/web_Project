const $$dice = document.querySelectorAll('#dice');
const $$player1 = document.querySelectorAll('[player-01]');
const $$player2 = document.querySelectorAll('[player-02]');
const $$subtotal = document.querySelectorAll('.subtotal');
const $$bonus = document.querySelectorAll('.bonus');
const $$total = document.querySelectorAll('.total');

let diceValue = [1, 1, 1, 1, 1];
let diceBool = [true, true, true, true, true];

let playerboard = [{1: NaN, 2: NaN, 3: NaN, 4: NaN, 5: NaN, 6: NaN, 7: NaN, 8: NaN, 9: NaN, 10: NaN, 11: NaN, 12: NaN},
                   {1: NaN, 2: NaN, 3: NaN, 4: NaN, 5: NaN, 6: NaN, 7: NaN, 8: NaN, 9: NaN, 10: NaN, 11: NaN, 12: NaN}];
let tmpboard = {};
let playerTotal = [{subtotal : 0, maintotal : 0, bonus : 0, total : 0}, {subtotal : 0, maintotal : 0, bonus : 0, total : 0}]

let TURN = 0;
let rollCount = 3;
let selectTurn = 0;
let diceFlag = false;

document.querySelector('#roll').addEventListener('click', () => {
    if(diceFlag) return;
    if(rollCount === 0) return;

    diceFlag = true;
    const interval = setInterval(() => {
        radomizeDice(diceContainer);
    }, 50);

    setTimeout(() => {
        clearInterval(interval)
        diceFlag = false;

        tmpboard = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0};
        for(let i = 0; i < 5; i++) {
            if(diceBool[i]) {
                diceValue[i] = Math.floor(Math.random() * 6) + 1;
                $$dice[i].innerHTML = diceValue[i];
            }
        }
        
        //diceValue = [1,1,1,1,1];

        setDice(diceContainer);

        diceValue.forEach(value => {
            tmpboard[value] += value;
        });

        diceValue.forEach(value => {
            tmpboard[7] += value;
        })
        
        const values = new Set(diceValue);

        if(values.size === 1 || values.size === 2) {
            values.forEach(v1 => {
                let count = 0;
                diceValue.forEach(v2 => {
                    if(v1 === v2) {
                        count ++;
                    }
                });
                if (count >= 4) {
                    tmpboard[8] = tmpboard[7];
                    return;
                }
            })
        }

        let valueCounts = {};
        diceValue.forEach(value => {
            if (valueCounts[value]) {
                valueCounts[value]++;
            } else {
                valueCounts[value] = 1;
            }
        });

        let hasTwo = false;
        let hasThree = false;
        for (let value in valueCounts) {
            if (valueCounts[value] === 2) {
                hasTwo = true;
            } else if (valueCounts[value] === 3) {
                hasThree = true;
            }
        }

        if (hasTwo && hasThree) {
            tmpboard[9] = tmpboard[7];
        }

        if (values.has(1) && values.has(2) && values.has(3) && values.has(4)) {
            tmpboard[10] = 15;
        } else if (values.has(2) && values.has(3) && values.has(4) && values.has(5)) {
            tmpboard[10] = 15;
        } else if (values.has(3) && values.has(4) && values.has(5) && values.has(6)) {
            tmpboard[10] = 15;
        }

        if (values.has(1) && values.has(2) && values.has(3) && values.has(4) && values.has(5)) {
            tmpboard[11] = 30;
        } else if (values.has(2) && values.has(3) && values.has(4) && values.has(5) && values.has(6)) {
            tmpboard[11] = 30;
        }

        if (values.size === 1) {
            tmpboard[12] = 50;
        }

        for(let j = 0; j < Object.keys(tmpboard).length; j++) {
            if(TURN === 0) {
                if (!isNaN(playerboard[TURN][j + 1])) continue;
                $$player1[j].innerHTML = tmpboard[j+1];
            }
            else if (TURN === 1) {
                if (!isNaN(playerboard[TURN][j + 1])) continue;
                $$player2[j].innerHTML = tmpboard[j+1];
            }
        }
        rollCount --;
        
    }, 1000);

})

const Select = (element, index) => {
    element.addEventListener("click", function playerSelect (e) {
        console.log("select 클릭");

        if(diceValue[0] === 0 || !e.target.hasAttribute(`player-0${TURN + 1}`) || diceFlag) { 
            e.target.addEventListener("click", playerSelect, { once: true });
            return;
        }
    
        e.target.style.backgroundColor = 'grey';
        diceValue = [1, 1, 1, 1, 1];
        setDice(diceContainer);
        diceValue = [0, 0, 0, 0, 0];
        rollCount = 3;

        playerboard[TURN][index + 1] = tmpboard[index + 1];
        if(index + 1 <= 6){
            playerTotal[TURN].subtotal += tmpboard[index + 1];
        } else {
            playerTotal[TURN].maintotal += tmpboard[index + 1];
        }

        playerTotal[TURN].total = playerTotal[TURN].subtotal + playerTotal[TURN].maintotal

        $$subtotal[TURN].innerHTML = `${playerTotal[TURN].subtotal}/63`;
        $$total[TURN].innerHTML = playerTotal[TURN].total;

        if(playerTotal[TURN].subtotal >= 63) {
            playerTotal[TURN].bonus = 35;
            $$bonus[TURN].innerHTML = 35;
            playerTotal[TURN].total += 35;
        }
        $$total[TURN].innerHTML = playerTotal[TURN].total;

        const currentPlayerScores = playerboard[TURN];
        for (let i = 0; i < 12; i++) {
            if (i !== isNaN(currentPlayerScores[i + 1])) {
                if(TURN === 0) {
                    if (!isNaN(playerboard[TURN][i + 1])) continue;
                    $$player1[i].innerHTML = '';
                }
                else if (TURN === 1) {
                    if (!isNaN(playerboard[TURN][i + 1])) continue;
                    $$player2[i].innerHTML = '';
                }
            }
        }

        document.querySelector(`.gameNumber${TURN + 1}`).style.backgroundColor = 'white';

        TURN += 1;
        selectTurn += 1;
        if(playerboard[TURN] === undefined) TURN = 0;

        document.querySelector(`.gameNumber${TURN + 1}`).style.backgroundColor = 'rgba(69, 69, 255, 0.212)';     

        $$dice.forEach((element, index) => {
            diceBool[index] = true;
        })

        if (selectTurn === 24) {
            let totals = playerTotal.map(player => player.total);
            let isDraw = totals[0] === totals[1];
            let winnerName = (totals[0] > totals[1]) ? 'player#1' : 'player#2';
            let endMessage = isDraw ? "DRAW" :  winnerName + "  Win!" ;
            document.getElementById('modal').style.display = 'flex'
            let resultValue = endMessage;
            let resultElement = document.getElementById("value");
            resultElement.innerHTML = resultValue;
        }

    }, {once : true});
}

$$player1.forEach(Select);
$$player2.forEach(Select);

function keyCodeprint() {
    var keyCode = window.location.reload()
    window.status = keyCode
}

document.querySelector('#restart').addEventListener('click', () => {
    alert ('게임을 다시하시겠습니까?')
    keyCodeprint();
})

function endGame(){
    let reset = {};
    if(!reset) return;
    playerboard = [];
    document.write(playerboard);
}

document.querySelector('#end').addEventListener('click', () => {
    alert ('게임을 종료하시겠습니까?')
    endGame();
})

function createDice(number) {
    const dotPositionMatrix ={
        1: [
        [50, 50]
        ],
        2: [
            [20, 20],
            [80, 80]
        ],
        3: [
            [20, 20],
            [50, 50],
            [80, 80]
        ],
        4: [
            [20, 20],
            [20, 80],
            [80, 20],
            [80, 80]
        ],
        5: [
            [20, 20],
            [20, 80],
            [50, 50],
            [80, 20],
            [80, 80]
        ],
        6: [
            [20, 20],
            [20, 50],
            [20, 80],
            [80, 20],
            [80, 50],
            [80, 80]
        ]
    };

    const dice = document.createElement("div");

    dice.classList.add("dice");

    for (const dotPosition of dotPositionMatrix[number]){
        const dot = document.createElement("div");

        dot.classList.add("dice-dot");
        dot.style.setProperty("--top", dotPosition[0] + "%");
        dot.style.setProperty("--left", dotPosition[1] + "%");

        dice.appendChild(dot); 
    }
    return dice;
}

function radomizeDice(diceContainer) {
    diceContainer.innerHTML = "";
    for (let i = 0; i < 5; i++){
        let value;
        if (!diceBool[i]) {
            value = diceValue[i];
        } else {
            value = Math.floor((Math.random()*6)+1);
            diceValue[i] = value;
        }
        const dice = createDice(value);
        if (!diceBool[i]) {
            dice.classList.add("lock");
        }
        diceContainer.appendChild(dice);
    }
}

function setDice(diceContainer) {
    diceContainer.innerHTML = "";
    for (let i = 0; i < 5; i++){
        const dice = createDice(diceValue[i]);
        dice.addEventListener('click', function () {
            if (rollCount == 3 || rollCount == 0) return;

            if (dice.classList.contains("lock")) {
                dice.classList.remove("lock");
                diceBool[i] = true;
            } else {
                if (document.querySelectorAll('.lock').length == 4) return;
                dice.classList.add("lock");
                diceBool[i] = false;
            }
        });
        if (!diceBool[i]) {
            dice.classList.add("lock");
        }
        diceContainer.appendChild(dice);
    }
}

const diceContainer = document.querySelector(".dice-container");
setDice(diceContainer);
diceValue = [0, 0, 0, 0, 0];