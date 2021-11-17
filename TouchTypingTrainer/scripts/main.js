document.addEventListener('DOMContentLoaded', async () => {




  const boxForText = document.querySelector('.print__wrapp');

  let wordIndex = 0;
  let texts = await getData();
  let content = texts[0].replace(/\s+/gm, ' '); // убираем лишние пробелы с помощью регуляркию. Добавлены флаги g(искать глобально) и m(искать в многострочной строке)

  addContent(content);

  const words = document.querySelectorAll('.print__item');
  words[wordIndex].classList.add('bgdgreen');

  printEvents();

  // добавляет события для печати текста.
  function printEvents() {
    document.addEventListener('keyup', (event) => {
      const focus = document.querySelector('.bgdgreen');

      if (event.key === focus.textContent) {
        words[wordIndex].classList.remove('bgdgreen');
        words[wordIndex].classList.remove('bgdred');
        words[wordIndex].classList.add('passed');
        wordIndex++;
        words[wordIndex].classList.add('bgdgreen');
      }
      else if(event.key !== focus.textContent && event.key !== 'Shift') {
        words[wordIndex].classList.add('bgdred');
      }
    });
  }

  // добавляет контент в обертку для текста.
  function addContent(text) {
    for (let word of text) {
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