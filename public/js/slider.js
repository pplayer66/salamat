var slider = document.querySelector('.slider-block');
var currentSlide;
var len = slider.children.length;
var numb = 0;
console.log(len);

setInterval(()=>{
	slider.children[numb].style.opacity = 0;
	++numb;
	numb = numb % len;
	slider.children[numb].style.opacity = 1;
}, 2200);
