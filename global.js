console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// Step 1: Get all nav links
let navLinks = $$("nav a");

// Step 2: Find the link to the current page
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

// Step 3: Add the "current" class if found
if (currentLink) {
  currentLink.classList.add("current");
}

const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.parentElement.nextElementSibling;
        content.classList.toggle('show');
        btn.classList.toggle('rotate');
      });
    });