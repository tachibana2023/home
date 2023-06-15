let clickCount = 0;
const element = document.querySelector('.copyright');

element.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 10) {
        element.textContent = '';
        clickCount = 0;
    }
    if (clickCount === 30) {
        element.textContent = 'こんにちわ';
        clickCount = 0;
    }
    //コード見られたら元も子もないよね....
});



// KONAMIコマンド
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let input = [];

document.addEventListener('keydown', (e) => {
    input.push(e.key);
    input.splice(-secretCode.length - 1, input.length - secretCode.length);
    if (input.join('') === secretCode.join('')) {
        console.log('KONAMIコマンド発動!');
    }
});



//振ったら起動
window.addEventListener('devicemotion', function (event) {
    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
        
    }
});