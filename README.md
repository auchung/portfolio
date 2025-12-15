# Audrey Chung - Portfolio Website

A modern, responsive portfolio website showcasing data science projects, resume, and professional information.

## 🌟 Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Project Showcase**: Interactive project gallery with search and filtering by year
- **Data Visualizations**: D3.js-powered visualizations including pie charts and scatter plots
- **Resume Section**: Expandable resume sections with professional experience
- **Contact Form**: User-friendly contact form with validation
- **GitHub Integration**: Live GitHub statistics display
- **SEO Optimized**: Meta tags, Open Graph, and structured data for better search visibility
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation, and skip links
- **Dark/Light Theme**: System-aware theme switching with manual override

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/auchung/portfolio.git
   cd portfolio
   ```

2. **Start a local server**
   
   Using Python 3:
   ```bash
   python3 -m http.server 8000
   ```
   
   Using Node.js (with http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000` in your web browser

### GitHub Pages Deployment

The site is configured to work with GitHub Pages. Simply push to the `main` branch and GitHub Pages will automatically deploy the site.

1. Ensure your repository is named `portfolio` (or update `BASE_PATH` in `global.js`)
2. Go to repository Settings → Pages
3. Select the `main` branch as the source
4. Your site will be available at `https://yourusername.github.io/portfolio/`

## 📁 Project Structure

```
portfolio/
├── index.html              # Home page
├── index.js                # Home page JavaScript
├── global.js               # Shared JavaScript utilities
├── style.css               # Global styles
├── lib/
│   └── projects.json       # Project data (JSON)
├── images/                 # Image assets
├── projects/
│   ├── index.html          # Projects page
│   └── projects.js         # Projects page JavaScript
├── resume/
│   └── index.html          # Resume page
├── contact/
│   └── index.html          # Contact page
└── meta/
    ├── index.html          # Meta/analytics page
    ├── main.js             # Meta page JavaScript
    └── loc.csv             # Lines of code data
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Vanilla JavaScript with ES modules
- **D3.js**: Data visualizations and charts
- **Scrollama.js**: Scroll-triggered animations

## 📝 Adding Projects

Edit `lib/projects.json` to add or update projects. Each project should follow this structure:

```json
{
  "title": "Project Title",
  "year": "2025",
  "image": "images/project-image.jpg",
  "alt": "Descriptive alt text",
  "description": "Project description here...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "url": "https://project-url.com"
}
```

Fields:
- `title` (required): Project title
- `year` (required): Project year
- `image` (required): Path to project image
- `alt` (optional): Alt text for image accessibility
- `description` (required): Project description
- `tags` (optional): Array of technology tags
- `url` (optional): Project URL (external links open in new tab)

## 🎨 Customization

### Colors

Edit the CSS custom property in `style.css`:

```css
:root {
  --color-accent: oklch(65% 50% 0); /* Your accent color */
}
```

### Navigation

Edit the `pages` array in `global.js`:

```javascript
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  // Add more pages...
];
```

## 📊 GitHub Stats

The homepage displays live GitHub statistics. The username is hardcoded in `index.js`:

```javascript
const githubData = await fetchGitHubData('auchung');
```

Update this to your GitHub username.

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Skip to main content links
- Focus indicators
- Alt text for images
- Form validation and error messages

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **Email**: auchung@ucsd.edu
- **GitHub**: [github.com/auchung](https://github.com/auchung)

## 🙏 Acknowledgments

- D3.js for powerful data visualization capabilities
- Modern CSS features for responsive design
- UC San Diego Halıcıoğlu Data Science Institute
