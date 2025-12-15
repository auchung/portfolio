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
nav.setAttribute('role', 'navigation');
nav.setAttribute('aria-label', 'Main navigation');
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
    a.setAttribute('aria-label', `Navigate to ${title} page`);
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );
      if (a.host !== location.host) {
        a.target = "_blank";
        a.setAttribute('rel', 'noopener noreferrer');
        a.setAttribute('aria-label', `${title} (opens in new tab)`);
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
      const section = btn.closest('section');
      const content = section.querySelector('.content');
      const header = section.querySelector('header');
      const heading = section.querySelector('h2');
      
      // Set initial ARIA attributes
      if (content && heading) {
        const sectionId = `section-${Math.random().toString(36).substr(2, 9)}`;
        content.id = sectionId;
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', sectionId);
        btn.setAttribute('aria-label', `Toggle ${heading.textContent} section`);
      }
      
      btn.addEventListener('click', () => {
        const isExpanded = content.classList.contains('show');
        content.classList.toggle('show');
        btn.classList.toggle('rotate');
        btn.setAttribute('aria-expanded', !isExpanded);
      });
      
      // Allow keyboard activation on header
      if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.addEventListener('click', () => btn.click());
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      }
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
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    return null;
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // 1️⃣ Clear any existing content
  containerElement.innerHTML = '';

  // 2️⃣ Loop through each project object
  for (let project of projects) {
    // 3️⃣ Create an article element for each project
    const article = document.createElement('article');
    article.setAttribute('role', 'listitem');

    // 4️⃣ Create the dynamic heading (make it a link if url exists)
    const heading = document.createElement(headingLevel);
    if (project.url) {
      const link = document.createElement('a');
      link.href = project.url;
      link.textContent = project.title;
      link.setAttribute('aria-label', `View ${project.title} project`);
      if (project.url.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      heading.appendChild(link);
    } else {
      heading.textContent = project.title;
    }

    // 5️⃣ Create and set up the image (make it a link if url exists)
    let imgContainer;
    if (project.url) {
      imgContainer = document.createElement('a');
      imgContainer.href = project.url;
      imgContainer.setAttribute('aria-label', `View ${project.title} project`);
      if (project.url.startsWith('http')) {
        imgContainer.target = '_blank';
        imgContainer.rel = 'noopener noreferrer';
      }
    } else {
      imgContainer = document.createElement('div');
    }
    
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.alt || `${project.title} project image`;
    img.loading = 'lazy';
    imgContainer.appendChild(img);

    // 6️⃣ Create a div to hold the description, year, and tags
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

    // 🔟 Add tags if they exist
    if (project.tags && Array.isArray(project.tags) && project.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.classList.add('project-tags');
      project.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.classList.add('tag');
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
      });
      infoDiv.appendChild(tagsDiv);
    }

    // 1️⃣1️⃣ Append all the elements to the article
    article.appendChild(heading);
    article.appendChild(imgContainer);
    article.appendChild(infoDiv);

    // 1️⃣2️⃣ Append the article to the container
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
    return await fetchJSON(`https://api.github.com/users/${username}`);
  }

