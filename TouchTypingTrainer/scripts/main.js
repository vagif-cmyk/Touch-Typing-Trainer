document.addEventListener('DOMContentLoaded', async () => {

  let intervalId; // будет использоватся для остановки setInterval.
  let wordIndex = 0;  // будет использоватся для распознания на каком символе мы находимся.
  let totalNumberOfCharacters = 0; // будет использоватся для общего кол-во символов в тексте.
  let countOfErrors = 0;// будет использоватся для подсчета неправильно введенных символов пользователем.
  let countOfCorrect = 0;// будет использоватся для подсчета правильно введенных символов пользователем.
  let seconds = 1;// будет использоватся для отсчета времени за которое пользователь печатает текст.
  let words;  // будет использоватся для записи всех DOM элементов в кот. находятся символы в тексте.

  const correctСhar = /^[\w;:=+()*&%$#"!|/\s-]$/; // в эту регулярку входят все символы которые могут находится в набираемом текте.
  const rusСhar = /^[А-Яа-я]$/; // символы на русском языке.

  // получаем все DOM элементы с кот. будем работать.
  const boxForText = document.querySelector('.print__text');
  const btnStart = document.querySelector('.btn-start');
  const modalWrapp = document.querySelector('.modal');
  const modalResult = document.querySelector('.modal__result');
  const resultSpeed = document.querySelector('.modal__result-speed');
  const resultAccuracy = document.querySelector('.modal__result-accuracy');
  const speed = document.querySelector('.speed__speed');
  const percent = document.querySelector('.accuracy__percent');
  const recomWrapp = document.querySelector('.modal__recom');
  const recomBtn = document.querySelector('.modal__recom-btn');

  let texts = await getData(); // получаем данные из api.

  btnStart.addEventListener('click', async () => { installContent(); }); // при клике на кнопку "Начать тест" установить основной контент.

  recomBtn.addEventListener('click', (event) => {  // при клике на кнопку "Закрыть" закрыть модалку.
    smoothWindowHiding();
    recomWrapp.style.display = 'none';
  })

  // реализует плавное удаление модального окна.
  function smoothWindowHiding() {
    modalWrapp.classList.add('closed');

    setTimeout(() => {
      modalWrapp.style.display = 'none';
    }, 300);
  }

  // устанавливает основной контент
  function installContent() {
    btnStart.style.display = 'none'; //Убираем кнопку "Начать тест" из модалки.

    let text = texts[0].replace(/\s+/gm, ' '); // убираем лишние пробелы с помощью регуляркию. Добавлены флаги g(искать глобально) и m(искать в многострочной строке)

    addContent('Ddd ddd Ddd');
    words = document.querySelectorAll('.print__item');  // получаем все DOM элементы в кот. находятся символы в тексте
    words[wordIndex].classList.add('bgdgreen');     // для первого символа устанавливаем класс означающий фокус(зеленый цвет для элемента).

    smoothWindowHiding();  // плавно убираем модалку.

    document.addEventListener('keyup', (event) => { // назначаем событие на отжатую кнопку в документе.
      printEvents(event);
    });

    // при первом вводе символа запустить таймер
    document.addEventListener('keydown', (event) => {
      intervalId = setInterval(() => {
        seconds++;
      }, 1000);
    }, { once: true }); // запустить один раз.
  }

  // добавляет события для печати текста.
  function printEvents(event) {
    const focus = document.querySelector('.bgdgreen');  // берем элемент в "фокусе".

    if (rusСhar.test(event.key)) {  // если введенный символ на русском, открываем модалку и просим установить английскую раскладку и выходим из функции(ничего не делаем).
      modalWrapp.classList.remove('closed');
      recomWrapp.style.display = 'block';
      modalWrapp.style.display = 'flex';

      return;
    }
    else if (correctСhar.test(event.key)) { // иначе если введенный символ может находится в набираемом текте.

      if (event.key === focus.textContent) { // если введен правельный символ.
        countOfCorrect++;                     // увеличиваем счетчик кол-ва правильно введенных символов пользователем.
        if (countOfCorrect === totalNumberOfCharacters) {  // если кол-ва правильно введенных символов равно общему кол-ву символов в тексте - пользователь напечатал весь текст.
          clearInterval(intervalId);  // останавливаем счетчик времени.

          modalWrapp.classList.remove('closed');  // открываем модалку с инфомацией о печети и выходим из функции.
          resultSpeed.textContent = `Скорость ${speed.textContent}`
          resultAccuracy.textContent = `Точность ${percent.textContent} %`
          modalResult.style.display = 'block';

          modalWrapp.style.display = 'flex';

          return;
        }
        // если это не конец текста
        speed.textContent = `${Math.trunc(countOfCorrect / seconds) * 60000} зн./мин`; // поправить формулу.  // отображаем скорость печати.
        words[wordIndex].classList.remove('bgdgreen', 'bgdred'); // удаляем классы фокуса и ощибки
        words[wordIndex].classList.add('passed'); // добавляем класс кот. означает что символ уже правильно напечатан.
        wordIndex++;     // сдвигаем индекс.
        words[wordIndex].classList.add('bgdgreen'); // добавляем класс фокуса в следующий символ.
      }

      else if (event.key !== focus.textContent) {  // если введен неправильный символ
        if (!(words[wordIndex].classList.contains('bgdred'))) {  // если элемент кот. находится в "фокусе" содержит класс 'bgdred' значит на этом элементе пользователь уже ощибался. В этом случае не увеличиваем кол-во ощибок(countOfErrors) чтобы процент ощибок не уходил в минус.
          countOfErrors++;                                        // иначе увеличиваем счетчик ощибок...
          words[wordIndex].classList.add('bgdred');               // добавляем класс ощибки...
          percent.textContent = (100 - (countOfErrors * 100 / totalNumberOfCharacters)).toFixed(1);  // отображаем процент ощибок применяя toFixed(1) чтобы оставался один знак после точки.
        }
      }
    }
  }

  // добавляет контент в обертку для текста.
  function addContent(text) {
    for (let word of text) {  // в цикле проходимся по строке.
      totalNumberOfCharacters++;  // считаем сколько всего символов в тексте.
      const span = document.createElement('span');// создаем span
      const classItem = (word === ' ' ? 'space' : 'word');  // в зависимости пробел это или другой символ...
      span.classList.add(classItem, 'print__item')                          // добавляет нужный класс и класс для всех символов.
      span.innerHTML = word;
      boxForText.appendChild(span);
    }
  }
  // получает данные из API.
  async function getData() {
    const request = await fetch('https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1');
    const response = await request.json();
    return response;
  }
});