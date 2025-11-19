import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';


async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    return data;
  }


  function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          enumerable: false,
          writable: false,
          configurable: false,
        });
  
        return ret;
      });
  }

  let xScale;
  let yScale;

  function renderCommitInfo(data, commits) {
    const dl = d3.select('#stats').html('').append('dl').attr('class', 'stats');

    // Total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Total commits
    dl.append('dt').text('Commits');
    dl.append('dd').text(commits.length);
  
    // Number of files
    const numFiles = d3.group(data, (d) => d.file).size;
    dl.append('dt').text('Files');
    dl.append('dd').text(numFiles);
  
    // Maximum depth
    const maxDepth = d3.max(data, (d) => d.depth);
    dl.append('dt').text('Max depth');
    dl.append('dd').text(maxDepth);
  
    // Longest line
    const maxLine = d3.max(data, (d) => d.line);
    dl.append('dt').text('Longest line');
    dl.append('dd').text(maxLine);
  
    // Maximum lines per commit
    const maxLines = d3.max(commits, (d) => d.totalLines);
    dl.append('dt').text('Max lines');
    dl.append('dd').text(maxLines);
  }

  function renderScatterPlot(data, commits) {

    const width = 1000;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  
    // Sort commits by total lines so larger dots are underneath smaller ones
    const sortedCommits = commits.slice().sort((a, b) => b.totalLines - a.totalLines);
  
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // ----- Scales -----
    xScale = d3.scaleTime()
    .domain(d3.extent(sortedCommits, (d) => d.datetime))
    .range([0, width])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
  
    // ----- Radius scale for dot size -----
    const [minLines, maxLines] = d3.extent(sortedCommits, (d) => d.totalLines);
    const rScale = d3
      .scaleSqrt()
      .domain([minLines, maxLines])
      .range([2, 30]);
  
    // ----- Gridlines -----
    const gridlines = svg.append('g')
      .attr('class', 'gridlines')
      .call(
        d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat('')
      );
    svg.selectAll('.gridlines line').attr('stroke', '#ddd').attr('stroke-opacity', 0.7);
    svg.selectAll('.gridlines path').remove(); // remove dark top line
  
    // ----- Axes -----
    
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3.axisLeft(yScale).ticks(12).tickFormat((d) => `${d}:00`);
  
    svg
  .append('g')
  .attr('transform', `translate(0, ${height})`) // x-axis at bottom
  .attr('class', 'x-axis')
  .call(xAxis);

svg
  .append('g')
  .attr('transform', `translate(0, 0)`) // y-axis at left
  .attr('class', 'y-axis')
  .call(yAxis);
  
    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Date');
  
    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Hour of Day');
  
    // ----- Dots -----
    const dots = svg.append('g').attr('class', 'dots');
  
    dots.selectAll('circle')
    .data(sortedCommits, (d) => d.id)
  .join('circle')
  .attr('cx', (d) => xScale(d.datetime))
  .attr('cy', (d) => yScale(d.hourFrac))
  .attr('r', (d) => rScale(d.totalLines))
  .attr('fill', 'steelblue')
  .attr('fill-opacity', 0.7)
  .on('mouseenter', (event, commit) => {
    d3.select(event.currentTarget).attr('fill-opacity', 1); // highlight dot
    renderTooltipContent(commit);                           // update tooltip text
    updateTooltipVisibility(true);                          // show tooltip
    updateTooltipPosition(event);                            // position near cursor
  })
  .on('mousemove', (event) => {
    updateTooltipPosition(event);                           // follow cursor
  })
  .on('mouseleave', (event) => {
    d3.select(event.currentTarget).attr('fill-opacity', 0.7); // reset dot
    updateTooltipVisibility(false);                           // hide tooltip
  });
  createBrushSelector(svg);

  }
  
  function renderTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
  
    if (Object.keys(commit).length === 0) return;
  
    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime?.toLocaleString('en', {
      dateStyle: 'full',
    });
  }

  function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
  }

  function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  }
  
  function createBrushSelector(svg) {
    const brush = d3.brush()
      .on('brush end', brushed); // <-- attach event handler
  
    svg.append('g')
      .attr('class', 'brush')
      .call(brush);
  
    svg.selectAll('.dots, .overlay ~ *').raise();
  }

  function brushed(event) {
    const selection = event.selection;
    d3.selectAll('circle').classed('selected', (d) =>
      isCommitSelected(selection, d),
    );
    renderSelectionCount(selection);
    renderLanguageBreakdown(selection);
  }
  
  function isCommitSelected(selection, commit) {
    if (!selection) return false;
    const [[x0, y0], [x1, y1]] = selection;
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  }

  function renderSelectionCount(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];
  
    const countElement = document.querySelector('#selection-count');
    countElement.textContent = `${
      selectedCommits.length || 'No'
    } commits selected`;
  
    return selectedCommits;
  }
  
  function renderLanguageBreakdown(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];
    const container = document.getElementById('language-breakdown');
  
    if (selectedCommits.length === 0) {
      container.innerHTML = '';
      return;
    }
  
    const lines = selectedCommits.flatMap((d) => d.lines);
  
    const breakdown = d3.rollup(lines, (v) => v.length, (d) => d.type);
  
    container.innerHTML = '';
    for (const [language, count] of breakdown) {
      const proportion = count / lines.length;
      const formatted = d3.format('.1~%')(proportion);
  
      container.innerHTML += `
        <dt>${language}</dt>
        <dd>${count} lines (${formatted})</dd>
      `;
    }
  }
  

function onTimeSliderChange() {
  const slider = document.getElementById("commit-progress");
  const timeDisplay = document.getElementById("commit-time");

  commitProgress = +slider.value;

  commitMaxTime = timeScale.invert(commitProgress);

  timeDisplay.textContent = commitMaxTime.toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
  filteredCommits = commits.filter((d) => d.datetime <= commitMaxTime);

  updateScatterPlot(data, filteredCommits);
  updateCommitInfo(data, filteredCommits);   // new: update stats
  updateFileDisplay(filteredCommits)
}

function updateScatterPlot(data, commits) {
  const svg = d3.select('#chart').select('svg');

  // Update xScale domain based on filtered commits
  xScale.domain(d3.extent(commits, d => d.datetime));

  // Update x-axis
  const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat('%b %d'));
  const xAxisGroup = svg.select('g.x-axis');
  xAxisGroup.selectAll('*').remove();
  xAxisGroup.call(xAxis);

  // Update dot radius scale
  const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

  const dots = svg.select('g.dots');

  // Sort commits so larger dots are underneath smaller ones
  const sortedCommits = d3.sort(commits, d => -d.totalLines);

  // Update circles
  dots.selectAll('circle')
  .data(sortedCommits, (d) => d.id)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('fill', 'steelblue')
    .style('fill-opacity', 0.7)
    .on('mouseenter', (event, commit) => {
      d3.select(event.currentTarget).style('fill-opacity', 1);
      renderTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mouseleave', (event) => {
      d3.select(event.currentTarget).style('fill-opacity', 0.7);
      updateTooltipVisibility(false);
    });
}

function updateCommitInfo(data, commits) {
  const container = d3.select('#stats');
  container.selectAll('dl.stats').remove(); // remove old stats

  const dl = container.append('dl').attr('class', 'stats');

  // Total LOC (sum of lines in filtered commits)
  const totalLOC = d3.sum(commits, (c) => c.totalLines);
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(totalLOC);

  // Total commits
  dl.append('dt').text('Commits');
  dl.append('dd').text(commits.length);

  // Number of files in filtered commits
  const filesInCommits = new Set(commits.flatMap((c) => c.lines.map((l) => l.file)));
  dl.append('dt').text('Files');
  dl.append('dd').text(filesInCommits.size);

  // Maximum depth among filtered commits
  const maxDepth = d3.max(commits.flatMap((c) => c.lines.map((l) => l.depth)));
  dl.append('dt').text('Max depth');
  dl.append('dd').text(maxDepth);

  // Longest line among filtered commits
  const maxLine = d3.max(commits.flatMap((c) => c.lines.map((l) => l.line)));
  dl.append('dt').text('Longest line');
  dl.append('dd').text(maxLine);

  // Maximum lines in a single commit (from filtered commits)
  const maxLines = d3.max(commits, (d) => d.totalLines);
  dl.append('dt').text('Max lines');
  dl.append('dd').text(maxLines);
}
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let data = await loadData();
let commits = processCommits(data);
renderCommitInfo(data, commits);
renderScatterPlot(data, commits);

console.log(commits);

let commitProgress = 100;
let timeScale = d3
.scaleTime()
.domain([
  d3.min(commits, (d) => d.datetime),
  d3.max(commits, (d) => d.datetime),
])
.range([0, 100]);
let commitMaxTime = timeScale.invert(commitProgress);

let filteredCommits = commits;

document
.getElementById("commit-progress")
.addEventListener("input", onTimeSliderChange);

onTimeSliderChange();

let lines = filteredCommits.flatMap((d) => d.lines);

function updateFileDisplay(filteredCommits) {
  // Flatten all lines from filtered commits
  let lines = filteredCommits.flatMap((d) => d.lines);

  // Group by file
  let files = d3
    .groups(lines, (d) => d.file)
    .map(([name, lines]) => ({ name, lines }))
    .sort((a, b) => b.lines.length - a.lines.length);

  // Bind data to divs inside #files
  const filesContainer = d3
    .select('#files')
    .selectAll('div')
    .data(files, (d) => d.name)
    .join(
      (enter) =>
        enter.append('div').call((div) => {
          div.append('dt').append('code');
          div.append('dd');
        }),
      (update) => update,
      (exit) => exit.remove()
    );

  // Update file name and total lines in dt
  filesContainer.select('dt > code').text((d) => d.name);

  // Append a small element for total lines (optional)
  filesContainer.select('dt > code').append('small').text((d) => ` (${d.lines.length} lines)`);

  // Update dd with individual line dots
  filesContainer
    .select('dd')
    .selectAll('div')
    .data((d) => d.lines)
    .join('div')
    .attr('class', 'loc')
    .style('background', (d) => colors(d.type));
}

d3.select('#scatter-story')
  .selectAll('.step')
  .data(commits)
  .join('div')
  .attr('class', 'step')
  .html(
    (d, i) => `
		On ${d.datetime.toLocaleString('en', {
      dateStyle: 'full',
      timeStyle: 'short',
    })},
		I made <a href="${d.url}" target="_blank">${
      i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'
    }</a>.
		I edited ${d.totalLines} lines across ${
      d3.rollups(
        d.lines,
        (D) => D.length,
        (d) => d.file,
      ).length
    } files.
		Then I looked over all I had made, and I saw that it was very good.
	`,
  );

  d3.select('#files-story')
  .selectAll('.step')
  .data(commits)
  .join('div')
  .attr('class', 'step')
  .html(
    (d, i) => `
		On ${d.datetime.toLocaleString('en', {
      dateStyle: 'full',
      timeStyle: 'short',
    })},
		I made <a href="${d.url}" target="_blank">${
      i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'
    }</a>.
		I edited ${d.totalLines} lines across ${
      d3.rollups(
        d.lines,
        (D) => D.length,
        (d) => d.file,
      ).length
    } files.
		Then I looked over all I had made, and I saw that it was very good.
	`,
  );

  
  function onStepEnter(response) {
    const scrolledCommit = response.element.__data__.datetime;
  
    const filtered = commits.filter((d) => d.datetime <= scrolledCommit);
  
    updateScatterPlot(data, filtered);
    updateCommitInfo(data, filtered);
    updateFileDisplay(filtered);
  
    // highlight current story step (optional)
    d3.selectAll('.step').classed('active-step', false);
    d3.select(response.element).classed('active-step', true);
  }
  
  const scroller = scrollama();
  scroller
    .setup({
      container: '#scrolly-1',
      step: '#scrolly-1 .step',
    })
    .onStepEnter(onStepEnter);

    function onFilesStepEnter(response) {
      let commit = response.element.__data__;
      updateFileDisplay([commit]); // show only this commit’s files
    }
    
    const fileScroller = scrollama();
    fileScroller
      .setup({
        container: '#files-scrolly',
        step: '#files-scrolly .step',
      })
      .onStepEnter(onFilesStepEnter);