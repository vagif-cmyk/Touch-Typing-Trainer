document.addEventListener('DOMContentLoaded', async () => {


  let intervalId;
  let wordIndex = 0;
  let totalNumberOfCharacters = 0;
  let countOfErrors = 0;
  let countOfCorrect = 0;
  let seconds = 1;
  let words;
  let texts = await getData();

  const correctСhar = /^[\w;:=+()*&%$#"!|/\s-]$/; // в эту регулярку входят все символы которые могут находится в набираемом текте.
  const rusСhar = /^[А-Яа-я]$/; // символы на русском языке.

  const boxForText = document.querySelector('.print__text');
  const btnStart = document.querySelector('.btn-start');
  const modalWrapp = document.querySelector('.modal');
  const modalResult = document.querySelector('.modal__result');
  const resultSpeed = document.querySelector('.modal__result-speed');
  const resultAccuracy = document.querySelector('.modal__result-accuracy');
  const resultBtn = document.querySelector('.modal__result-btn');
  const speed = document.querySelector('.speed__speed');
  const percent = document.querySelector('.accuracy__percent');
  const recomWrapp = document.querySelector('.modal__recom');
  const recomBtn = document.querySelector('.modal__recom-btn');

  btnStart.addEventListener('click', async () => { installContent(); });

  recomBtn.addEventListener('click', (event) => {
    modalWrapp.style.display = 'none';
    recomWrapp.style.display = 'none';
  })
  
  // устанавливает основной контент
  function installContent() {
    btnStart.style.display = 'none';

    let text = texts[0].replace(/\s+/gm, ' '); // убираем лишние пробелы с помощью регуляркию. Добавлены флаги g(искать глобально) и m(искать в многострочной строке)

    addContent('Ddd');
    words = document.querySelectorAll('.print__item');
    words[wordIndex].classList.add('bgdgreen');
    modalWrapp.classList.add('closed');

    setTimeout(() => {
      modalWrapp.style.display = 'none';
    }, 300);

    document.addEventListener('keyup', (event) => {
      printEvents(event);
    });
    document.addEventListener('keydown', (event) => {
      intervalId = setInterval(() => {
        seconds++;
        console.log(seconds);
      }, 1000);
    }, { once: true });
  }


  // ПРОВЕРКА КАЖДЫЕ 0.250s
  // ОБЩЕЕ КОЛИЧЕСТВО ВВЕДЕННЫХ СИМВОЛОВ ДЕЛИМ НА ВРЕМЯ И УМНОЖАЕМ 60000


  // добавляет события для печати текста.
  function printEvents(event) {
    const focus = document.querySelector('.bgdgreen');

    if (rusСhar.test(event.key)) {
      modalWrapp.classList.remove('closed');
      recomWrapp.style.display = 'block';
      modalWrapp.style.display = 'flex';

      // alert('Поменяйте раскрадку клавиатуры на английскую');
      return;
    }
    else if (correctСhar.test(event.key)) {

      if (event.key === focus.textContent) {
        countOfCorrect++;
        if (countOfCorrect === totalNumberOfCharacters) {
          clearInterval(intervalId);

          modalWrapp.classList.remove('closed');
          resultSpeed.textContent = `Скорость ${speed.textContent}`
          resultAccuracy.textContent = `Точность ${percent.textContent} %`
          modalResult.style.display = 'block';

          modalWrapp.style.display = 'flex';

          return;
        }
        speed.textContent = `${Math.trunc(countOfCorrect / seconds) * 60000} зн./мин`; // поправить формулу.
        words[wordIndex].classList.remove('bgdgreen', 'bgdred');
        words[wordIndex].classList.add('passed');
        wordIndex++;
        words[wordIndex].classList.add('bgdgreen');
      }
      else if (event.key !== focus.textContent) {
        words[wordIndex].classList.add('bgdred');
        countOfErrors++;
        percent.textContent = (100 - (countOfErrors * 100 / totalNumberOfCharacters)).toFixed(1);
      }
    }

  }

  // добавляет контент в обертку для текста.
  function addContent(text) {
    for (let word of text) {
      totalNumberOfCharacters++;
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