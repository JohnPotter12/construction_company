//                       Калькулятор ремонту

function initCalculator() {
  // Елементи керування
  const areaRange = document.getElementById("areaRange");
  const areaInput = document.getElementById("areaInput");
  const repairClass = document.getElementById("repairClass");
  const finalPrice = document.getElementById("finalPrice");

  // Знаходимо всі інпути всередині контейнера калькулятора
  const inputs = document.querySelectorAll("#calc-app input, #calc-app select");

  function calculate() {
    const area = parseFloat(document.getElementById("areaInput").value) || 0;
    const propertyK = parseFloat(
      document.querySelector('input[name="propertyType"]:checked').value,
    );
    const basePrice = parseFloat(document.getElementById("repairClass").value);

    let totalExtras = 0;

    // 1. Послуги, що залежать від ПЛОЩІ (м²)
    const perMeterItems = [
      { id: "needDesign", price: 25 },
      { id: "needSupervision", price: 15 },
      { id: "warmFloor", price: 35 },
      { id: "demolition", price: 10 },
    ];

    perMeterItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el && el.checked) totalExtras += area * item.price;
    });

    // 2. Послуги, що залежать від КІЛЬКОСТІ (шт.)
    const electricPoints =
      parseInt(document.getElementById("electricPoints").value) || 0;
    const plumbingPoints =
      parseInt(document.getElementById("plumbingPoints").value) || 0;
    const acUnits =
      parseInt(document.getElementById("acUnitsCount").value) || 0;

    totalExtras += electricPoints * 15; // Електрика
    totalExtras += plumbingPoints * 45; // Сантехніка
    totalExtras += acUnits * 150; // Кондиціонування (монтаж траси)

    // 3. ФІНАЛЬНА СУМА
    const finalTotal = area * basePrice * propertyK + totalExtras;

    // Відображення
    const finalPriceDisplay = document.getElementById("finalPrice");
    const currentVal =
      parseInt(finalPriceDisplay.innerText.replace(/\s/g, "")) || 0;
    animateValue(finalPriceDisplay, currentVal, finalTotal, 500);
  }

  // СИНХРОНІЗАЦІЯ: Повзунок -> Інпут
  areaRange.addEventListener("input", function () {
    areaInput.value = this.value;
    calculate();
  });

  // СИНХРОНІЗАЦІЯ: Інпут -> Повзунок
  areaInput.addEventListener("input", function () {
    let val = parseFloat(this.value);
    if (val > 250) val = 250;
    if (val < 0) val = 0;
    areaRange.value = val;
    calculate();
  });

  // Функція анімації цифр
  function animateValue(obj, start, end, duration) {
    if (isNaN(start)) start = 0;
    if (isNaN(end)) end = 0;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.innerHTML = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Додаємо слухачі на всі зміни
  inputs.forEach((input) => {
    input.addEventListener("change", calculate);
    // Для радіо-кнопок і чекбоксів 'input' теж корисний
    input.addEventListener("input", calculate);
  });

  calculate(); // Перший запуск
}

document.addEventListener("DOMContentLoaded", initCalculator);

//                             QUIZ

document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".quiz-step");
  const nextBtns = document.querySelectorAll(".next-btn");
  const prevBtns = document.querySelectorAll(".prev-btn");
  const progress = document.getElementById("quiz-progress");
  let currentStep = 0;

  // Оновлення прогрес-бару
  function updateProgress() {
    const percent = ((currentStep + 1) / steps.length) * 100;
    progress.style.width = percent + "%";
  }

  // Функція переходу до кроку
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("d-none", i !== index);
    });
    updateProgress();
  }

  // Кнопки "Далі"
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // Кнопки "Назад"
  prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Спеціально для повзунка площі
  const areaInput = document.getElementById("quizArea");
  const areaText = document.getElementById("areaVal");
  if (areaInput) {
    areaInput.oninput = function () {
      areaText.innerText = this.value;
    };
  }
});

//                                      периметр

document.addEventListener("DOMContentLoaded", function () {
  const range = document.getElementById("areaRange");
  const input = document.getElementById("areaInput");

  // Коли рухаємо повзунок
  range.addEventListener("input", function () {
    input.value = this.value;
    // Викликаємо розрахунок ціни, якщо він у тебе в окремій функції
    if (typeof calculate === "function") calculate();
  });

  // Коли пишемо в інпут
  input.addEventListener("input", function () {
    let val = parseInt(this.value);

    // Перевірка на межі (щоб не ввели 1000 або -5)
    if (val > 250) val = 250;
    if (val < 10) val = 20;

    range.value = val;
    // Викликаємо розрахунок ціни
    if (typeof calculate === "function") calculate();
  });

  // Валідація: якщо користувач залишив поле порожнім, повертаємо мінімум
  input.addEventListener("blur", function () {
    if (this.value === "" || this.value < 20) {
      this.value = 10;
      range.value = 10;
    }
  });
});

//                                       Відправка заявки

const userNameInput = document.getElementById("userName");
const userPhoneInput = document.getElementById("userPhone");
const submitBtn = document.getElementById("submitBtn");

function validateContacts() {
  // Якщо ім'я довше 2 символів і телефон довше 9 символів — вмикаємо кнопку
  if (
    userNameInput.value.trim().length > 2 &&
    userPhoneInput.value.trim().length >= 10
  ) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

userNameInput.addEventListener("input", validateContacts);
userPhoneInput.addEventListener("input", validateContacts);

async function submitVitaQuiz(event) {
  event.preventDefault();

  // 1. Збір даних
  const propertyTypeEl = document.querySelector(
    'input[name="propertyType"]:checked',
  );
  const repairClassEl = document.getElementById("repairClass");

  const quizData = {
    userName: userNameInput.value, // Додаємо ім'я
    userPhone: userPhoneInput.value, // Додаємо телефон
    propertyType: document
      .querySelector('input[name="propertyType"]:checked')
      ?.nextElementSibling.innerText.trim(),
    repairClass:
      document.getElementById("repairClass").options[
        repairClassEl.selectedIndex
      ].text,
    area: document.getElementById("areaInput").value,
    engineering: {
      electric: document.getElementById("electricPoints").value,
      plumbing: document.getElementById("plumbingPoints").value,
      ac: document.getElementById("acUnitsCount").value,
    },
    extras: [],
    estimatedTotal: document.getElementById("finalPrice").innerText,
  };

  // Збираємо всі увімкнені чекбокси (дизайн, нагляд + інженерні допи)
  document
    .querySelectorAll(
      ".extra-check:checked, #needDesign:checked, #needSupervision:checked",
    )
    .forEach((check) => {
      const label = check.nextElementSibling
        ? check.nextElementSibling.innerText.trim()
        : "Додаткова послуга";
      quizData.extras.push(label);
    });

  // 2. Відправка
  try {
    const response = await fetch("http://localhost:5006/api/send-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status === "success") {
        alert(
          "Дякуємо! Ваша заявка прийнята. Менеджер зв’яжеться з вами найближчим часом.",
        );
        // Тут можна закрити модалку або перенаправити клієнта
      }
    } else {
      throw new Error("Помилка сервера: " + response.status);
    }
  } catch (error) {
    console.error("Деталі помилки:", error);
    alert(
      "Вибачте, сталася помилка при відправці. Спробуйте пізніше або зателефонуйте нам.",
    );
  }
}
const quizForm = document.getElementById("vitaQuiz");
if (quizForm) {
  quizForm.addEventListener("submit", submitVitaQuiz);
}
