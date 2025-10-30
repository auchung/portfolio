import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

let searchQuery = '';
let selectedIndex = -1;
let currentPieData = [];

renderProjects(projects, projectsContainer, 'h2');
if (titleElement) titleElement.textContent = `${projects.length} Projects`;
renderPieChart(projects);

function renderPieChart(projectsGiven) {
    // Clear previous chart & legend
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    // Roll up data by year
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({ value: count, label: year }));
    if (data.length === 0) return; // Avoid drawing when no data

    // Update currentPieData for combined filtering
    currentPieData = data;

    // Create arc generator
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    // Create pie layout
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map(d => arcGenerator(d));

    // Color scale
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Draw arcs
    arcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .on('click', () => {
                // Toggle selection
                selectedIndex = selectedIndex === i ? -1 : i;
            
                // Apply combined filter to projects
                const filteredProjects = getFilteredProjects(projects, currentPieData);
                renderProjects(filteredProjects, projectsContainer, 'h2');
                if (titleElement) titleElement.textContent = `${filteredProjects.length} Projects`;
            
                // Update slice colors only
                svg.selectAll('path')
                    .attr('fill', (_, idx) => idx === selectedIndex ? 'orange' : colors(idx))
                    .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
            
                // Update legend
                legend.selectAll('li')
                    .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));
            });
    });

    // Draw legend
    data.forEach((d, idx) => {
        legend
            .append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

function getFilteredProjects(projectsData, pieData) {
    return projectsData
        .filter(p => selectedIndex === -1 || p.year === pieData[selectedIndex].label)
        .filter(p => p.title.toLowerCase().includes(searchQuery));
}

searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value.toLowerCase();

    // Filter projects based on BOTH pie selection and search
    const filteredProjects = getFilteredProjects(projects, currentPieData);

    renderProjects(filteredProjects, projectsContainer, 'h2');
    if (titleElement) titleElement.textContent = `${filteredProjects.length} Projects`;

    svg.selectAll('path')
        .attr('fill', (_, idx) => idx === selectedIndex ? 'orange' : colors(idx))
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        
    legend.selectAll('li')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

});



