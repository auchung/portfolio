console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// Helper function to select multiple elements
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// Step 1: Define pages
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/auchung', title: 'GitHub' }
];

// Step 2: Create and insert nav
let nav = document.createElement('nav');
document.body.prepend(nav);

// Step 3: Detect environment (local vs GitHub Pages)
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/" 
  : "/portfolio/";  // name of your GitHub repo

// Step 4: Loop through pages and create links
for (let p of pages) {
  let url = !p.url.startsWith('http') ? BASE_PATH + p.url : p.url;
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${p.title}</a>`);
}

// Step 5: Highlight current page link
let navLinks = $$("nav a");
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);
currentLink?.classList.add("current");

// const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// // Step 1: Get all nav links
// let navLinks = $$("nav a");

// // Step 2: Find the link to the current page
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// Step 3: Add the "current" class if found
// if (currentLink) {
//   currentLink.classList.add("current");
// }

const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.parentElement.nextElementSibling;
        content.classList.toggle('show');
        btn.classList.toggle('rotate');
      });
    });