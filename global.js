console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
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
  
// Theme: Button
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

// Theme: Color Scheme
const select = document.querySelector('.color-scheme select');

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const automaticOption = select.querySelector('option[value="light dark"]');
automaticOption.textContent = `Automatic (${prefersDark ? 'Dark' : 'Light'})`;

function setColorScheme(value) {
  document.documentElement.style.setProperty('color-scheme', value);
  select.value = value;
}

if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark');
}
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


export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // 1️⃣ Clear any existing content
  containerElement.innerHTML = '';

  // 2️⃣ Loop through each project object
  for (let project of projects) {
    // 3️⃣ Create an article element for each project
    const article = document.createElement('article');

    // 4️⃣ Create the dynamic heading
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;

    // 5️⃣ Create and set up the image
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title || 'Project image';

    // 6️⃣ Create a div to hold the description and year
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('project-info');

    // 7️⃣ Create the description paragraph
    const p = document.createElement('p');
    p.textContent = project.description;

    // 8️⃣ Create the year element
    const year = document.createElement('p');
    year.classList.add('project-year');
    year.textContent = `c. ${project.year}`;

    // 9️⃣ Append description and year to the info div
    infoDiv.appendChild(p);
    infoDiv.appendChild(year);

    // 🔟 Append all the elements to the article
    article.appendChild(heading);
    article.appendChild(img);
    article.appendChild(infoDiv);

    // 1️⃣1️⃣ Append the article to the container
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
    return await fetchJSON(`https://api.github.com/users/${username}`);
  }

