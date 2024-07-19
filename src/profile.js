const imageContainer = document.querySelector('.image-container');
const interactiveImage = document.querySelector('.interactive-image');

imageContainer.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - imageContainer.offsetLeft;
    const mouseY = event.clientY - imageContainer.offsetTop;

    const moveX = (mouseX / imageContainer.offsetWidth) * 15;
    const moveY = (mouseY / imageContainer.offsetHeight) * 15;

    interactiveImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

imageContainer.addEventListener('mouseleave', () => {
    interactiveImage.style.transform = 'translate(0, 0)';
    interactiveImage.style.filter = 'blur(0px)';
});