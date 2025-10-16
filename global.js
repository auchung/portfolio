console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/auchung', title: 'GitHub' },
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );
      if (a.host !== location.host) {
        a.target = "_blank";
      }
    nav.append(a);
  }
  
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="theme-switch">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
);

// Theme Format
const select = document.querySelector('.color-scheme select');
function setColorScheme(value) {
  document.documentElement.style.setProperty('color-scheme', value);
  select.value = value;
}
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark');
}
// Preference
select.addEventListener('input', (event) => {
  const newScheme = event.target.value;
  setColorScheme(newScheme);
  localStorage.colorScheme = newScheme;
  console.log('Color scheme changed to:', newScheme);
});

// Resume: Contract and Expand
const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.parentElement.nextElementSibling;
        content.classList.toggle('show');
        btn.classList.toggle('rotate');
      });
    });


// Contact
const form = document.querySelector('form');
form?.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const data = new FormData(form);
  let url = form.action + "?";
  const params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }
  url += params.join("&"); 
  location.href = url;
  form.reset();
});