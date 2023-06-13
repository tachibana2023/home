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