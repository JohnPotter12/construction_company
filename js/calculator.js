const areaInput = document.getElementById('area');
const areaText = document.getElementById('areaVal');
const totalPriceText = document.getElementById('totalPrice');
const radioButtons = document.getElementsByName('reType');
const extraChecks = document.querySelectorAll('.extra');

function calculate() {
    const area = parseInt(areaInput.value);
    areaText.innerText = area;

    // 1. Отримуємо ціну за пакет (radio)
    let basePrice = 0;
    radioButtons.forEach(radio => {
        if (radio.checked) basePrice = parseInt(radio.value);
    });

    // 2. Отримуємо суму додаткових послуг за метр (checkbox)
    let extraPricePerMeter = 0;
    extraChecks.forEach(check => {
        if (check.checked) extraPricePerMeter += parseInt(check.value);
    });

    // 3. Підсумкова формула
    const total = area * (basePrice + extraPricePerMeter);
    
    // Плавна зміна цифр (анімація)
    totalPriceText.innerText = total.toLocaleString();
}

// Слухаємо зміни на всіх елементах
areaInput.addEventListener('input', calculate);
radioButtons.forEach(r => r.addEventListener('change', calculate));
extraChecks.forEach(c => c.addEventListener('change', calculate));

// Запускаємо один раз при завантаженні
calculate();