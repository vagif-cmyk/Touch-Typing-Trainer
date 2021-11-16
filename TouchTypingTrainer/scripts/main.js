document.addEventListener('DOMContentLoaded', async () => {

  const boxForText = document.querySelector('.print__text');

  let texts = await getData();
  boxForText.textContent = texts[0];



  // получает данные из API.
  async function getData() {

    const request = await fetch('https://baconipsum.com/api/?type=meat-and-filler');
    const response = await request.json();

    return response;
  }


});