import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Show loading states
const projectsContainer = document.querySelector('.projects');
const profileStats = document.querySelector('#profile-stats');

if (projectsContainer) {
  projectsContainer.innerHTML = '<p>Loading projects...</p>';
}

if (profileStats) {
  profileStats.innerHTML = '<p>Loading GitHub stats...</p>';
}

// Load and display projects
try {
  const projects = await fetchJSON('./lib/projects.json');
  if (projects && projects.length > 0) {
    const latestProjects = projects.slice(0, 3);
    renderProjects(latestProjects, projectsContainer, 'h2');
  } else {
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p>Projects coming soon!</p>';
    }
  }
} catch (error) {
  console.error('Error loading projects:', error);
  if (projectsContainer) {
    projectsContainer.innerHTML = '<p>Unable to load projects. Please try again later.</p>';
  }
}

// Load and display GitHub stats
try {
  const githubData = await fetchGitHubData('auchung'); 
  if (profileStats) {
    if (githubData) {
      profileStats.innerHTML = `
        <h2 id="github-heading">GitHub Stats</h2>
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos || 0}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists || 0}</dd>
          <dt>Followers:</dt><dd>${githubData.followers || 0}</dd>
          <dt>Following:</dt><dd>${githubData.following || 0}</dd>
        </dl>
      `;
    } else {
      profileStats.innerHTML = '<p>GitHub stats unavailable at the moment.</p>';
    }
  }
} catch (error) {
  console.error('Error loading GitHub stats:', error);
  if (profileStats) {
    profileStats.innerHTML = '<p>Unable to load GitHub stats. Please try again later.</p>';
  }
}