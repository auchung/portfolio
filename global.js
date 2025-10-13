console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.parentElement.nextElementSibling;
        content.classList.toggle('show');
        btn.classList.toggle('rotate');
      });
    });