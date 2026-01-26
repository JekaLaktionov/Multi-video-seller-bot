// ==UserScript==
// @name         Tempo Faucet Auto-Spammer
// @match        https://docs.tempo.xyz/quickstart/faucet*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  const wallets = [
    { address: "0x48fA0e205Ce2c8525e0B51dE809Df2946C6C164E" },
    { address: "0xd2bc09f7068297c641f49605c2d5F4Ce34fb5334" },
    { address: "0x9701Cd3840cFDa2Aa282D67C7A1C78f75C659c48" },
    { address: "0x6e1e576F943917D96e9EC5f76516ED3Cf9A07236" },
    { address: "0x133247ED4763C1eDaF2AEE05aDdace83BC0aE5aD" },
    { address: "0x012134DFF975767eEc6f604A334689762AbcD419" },
    { address: "0x6251796B031A96939B24e1247B9AB3Caf305Ca84" },
    { address: "0x22E04753A92C67bC1F0b498853c65701BE48E906" },
    { address: "0xc08c1CC3f158a1Acf9d5732fC4ED0d00E8429F49" },
    { address: "0x3885b704EB6B4f228D19899Af90458983D0E67Ce" }
  ];

    // Используем localStorage, чтобы не сбрасывать индекс при перезагрузке страницы
    let currentIndex = parseInt(localStorage.getItem('faucet_index') || '0');

    function setNativeValue(el, value) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    async function startFaucet() {
        if (currentIndex >= wallets.length) {
            console.log("🚀 ВСЕ ГОТОВО! Очищаем индекс.");
            localStorage.setItem('faucet_index', '0');
            return;
        }

        const input = document.querySelector('input[name="fundAddress"]');
        const button = [...document.querySelectorAll("button")].find(b => b.textContent.includes("Add funds"));


console.log("🧹 Очищаю поле ввода...");
        setNativeValue(input, "");
        await new Promise(r => setTimeout(r, 500));



        // Если элементов нет, ждем 1 секунду и пробуем снова
        if (!input || !button || button.disabled) {
            console.log("⏳ Ждем появления кнопки или поля...");
            setTimeout(startFaucet, 2000);
            return;
        }



        console.log(`🤖 Работаю с кошельком #${currentIndex}: ${wallets[currentIndex].address}`);

        // 1. Вставляем адрес
        setNativeValue(input, wallets[currentIndex].address);

        // 2. Ждем немного для правдоподобности
        await new Promise(r => setTimeout(r, 1000));

        // 3. Жмем кнопку
        button.click();
        console.log("✅ Кнопка нажата");

        // 4. Увеличиваем индекс и сохраняем
        currentIndex++;
        localStorage.setItem('faucet_index', currentIndex.toString());

        // 5. Ждем завершения анимации/запроса на сайте (минимум 10-15 сек)
        // Тестовые краны работают медленно, им нужно время
        console.log("💤 Спим 15 секунд перед следующим кошельком...");
        setTimeout(startFaucet, 15000);
    }

    // Запускаем через 3 секунды после полной загрузки страницы
    window.addEventListener('load', () => {
        setTimeout(startFaucet, 3000);
    });

})();
