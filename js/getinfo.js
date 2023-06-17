let table = document.getElementById("apiTable");
//bot垢
let url = "https://script.google.com/macros/s/AKfycbyovXOouXEk0pDSOdrSFveIBKIPDxekUw3sQVTrsjJ7kOthVWkhyZYg3QFpS54zs9WO/exec";
//学校垢
let url2 = "https://script.google.com/macros/s/AKfycby7A3iU486U_kk-btxZLWQCMArQq0WowMYGg304NnKCXVOFBtto5qX_7TdNVwIO-L-1/exec";
//gu
let url3 = "https://script.google.com/macros/s/AKfycbwwk4Rb3eLcqqHjhkmYArteJ-gB5zq4k5BMgRhnlgkbTHpchLDBwYQlm5sJTXL8GwcE/exec";
//ぐるまつん
let url4 = "https://script.google.com/macros/s/AKfycbwCbJkqOG7T3YiOlEbSADkKu3X75ESA98BhnTiulDemOubt0X9GB9eBWDmeqD4m45ivOg/exec";
//ipちん
let url5 = "https://script.google.com/macros/s/AKfycbwl59ezcGpjA1ZI_Cec8B-SSD1uPdW22oHat7XQeloc0dtTBe_EsWm0jiDcKcwrfHwr/exec";
//けみでも
let url6 = "https://script.google.com/macros/s/AKfycbxSe1Axc54Sw_7a3exkoHznnJkZ7Rf7pK44B6syV3nmbEMUE4xfRAaobk-NlfUFXzC4/exec";
//くらくら
let url7 = "https://script.google.com/macros/s/AKfycbylG6A_4w_gDtJMrqqwavxnE4fasYGd6DHtV1ksXokYrePkd5YrQtuT1O2vui0z31QKkQ/exec"


const element = document.querySelector('.copyright');

window.onload = function () {
    checkLastVisit();
};

function main_function() {
    const random = Math.random();
    try {
        ch_info(url);
    } catch (e) {
        try {
            if (random < 1 / 2) {
                ch_info(url2);
            } else {
                ch_info(url3);
            }
        } catch (error) {
            try {
                ch_info(url3);
            } catch (e) {
                try {
                    ch_info(url4);
                } catch (e) {
                    try {
                        ch_info(url5);
                    } catch (e) {
                        try {
                            ch_info(url6)
                        } catch (e) {
                            try {
                                ch_info(url7)
                            } catch (error) {
                                finish();
                            }
                        }
                    }
                }
            }
        }
    }

}



//リセットコマンド
element.addEventListener('click', () => {
    localStorage.removeItem('lastVisit');
});

//最初に呼ばれる
function checkLastVisit() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date().getTime();
    if (!lastVisit || currentTime - lastVisit > 180000) {
        //3分以上
        main_function();
        localStorage.setItem('lastVisit', currentTime);
    } else {
        //連打時
        let table = document.getElementById("apiTable");
        let results2 = localStorage.getItem('lastResponse');
        results2 = results2.split(",");
        let rows = table.rows;
        for (let i = 0; i < results2.length; i++) {
            let lastCell = rows[i + 1].cells[4];
            lastCell.textContent = results2[i] + "分";
        }

    }
}

//取得-変更
function ch_info(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let apiResponse = data;
            let results = apiResponse.message.result;
            localStorage.setItem('lastResponse', results);
            let rows = table.rows;
            for (let i = 0; i < results.length; i++) {
                let lastCell = rows[i + 1].cells[4];
                lastCell.textContent = results[i] + "分";
            }

        });
}

//落ちちゃった時
function finish() {
    let rows = table.rows;
    for (let i = 0; i < 17; i++) {
        let lastCell = rows[i + 1].cells[4];
        lastCell.textContent = "エラー";
    }
}