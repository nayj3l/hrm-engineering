const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

const images = slider.querySelectorAll('img');
console.log('Number of images in the sliders:', images.length);

let translateValue = 0;
let imgIterator = 1;

prevButton.addEventListener('click', () => {
    translateValue += 100;
    imgIterator--;
    if(imgIterator < 1){
        translateValue = (images.length-1) * -100;
        imgIterator = images.length;
    }
    slider.style.transform = `translateX(${translateValue}%)`;
});

nextButton.addEventListener('click', () => {
    translateValue -= 100;
    imgIterator++;
    if(imgIterator > images.length){
        translateValue = 0;
        imgIterator = 1;
    }
    slider.style.transform = `translateX(${translateValue}%)`;
});