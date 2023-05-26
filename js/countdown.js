document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.getElementById('top_num');
    const targetDate = new Date('2023-06-17T00:30:00.000Z'); // UTCで指定（日本標準時で9時30分）

    function updateCountdown() {
        const now = new Date();
        const remainingSeconds = Math.floor((targetDate - now));

        if (remainingSeconds >= 0) {
            countdownElement.textContent = Math.round(remainingSeconds / 864000) / 100;
        } else {
            countdownElement.textContent = '0';
            clearInterval(interval);
        }
    }

    const interval = setInterval(updateCountdown, 10000);
    updateCountdown();
});