const SHEET_ID = '15tWTpzUhwAZBxP8rzMm-lH6X3HT6qE-JNE0-fXKtEcA';
const SHEET_NAME = 'Sheet1';
const API_KEY = 'AIzaSyAsXLnI_RlBMWDfDb-_WCHHZsh_XUI2LE0';

async function fetchProjects() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/15tWTpzUhwAZBxP8rzMm-lH6X3HT6qE-JNE0-fXKtEcA/values/Sheet1?key=AIzaSyAsXLnI_RlBMWDfDb-_WCHHZsh_XUI2LE0`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values.slice(1); // Skip the header row
}

function generateProjectList(projects, containerId) {
    const container = document.getElementById(containerId);
    const ul = document.createElement('ul');
    projects.forEach(project => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('data-project', project[0]); // Project ID
        a.textContent = project[1]; // Project Name
        li.appendChild(a);
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function generateProjectContent(project) {
    const photos = project[5].split(',').map(photoUrl => `<img src="${photoUrl.trim()}" alt="${project[1]}">`).join('');
    return `
        <h2>${project[1]}</h2>
        <p>${project[3]}</p>
        ${photos}
        <iframe src="${project[4]}" frameborder="0" allowfullscreen></iframe>
    `;
}

function toggleDropdown(id) {
    let dropdown = document.getElementById(id);
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block"; // Show dropdown
    } else {
        dropdown.style.display = "none"; // Hide dropdown
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const projects = await fetchProjects();
    const seeProjects = projects.filter(project => project[2] === 'see');
    const hearProjects = projects.filter(project => project[2] === 'hear');

    // Automatically show the dropdowns on page load for the corresponding page
    const seeProjectsDropdown = document.getElementById('see-projects');
    const hearProjectsDropdown = document.getElementById('hear-projects');
    
    if (document.body.classList.contains('see-page') && seeProjectsDropdown) {
        seeProjectsDropdown.style.display = "block";
        generateProjectList(seeProjects, 'see-projects');
    }
    
    if (document.body.classList.contains('hear-page') && hearProjectsDropdown) {
        hearProjectsDropdown.style.display = "block";
        generateProjectList(hearProjects, 'hear-projects');
    }

    // Handle project links
    const projectContent = document.getElementById("project-content");

    document.addEventListener("click", function (e) {
        if (e.target.matches("a[data-project]")) {
            e.preventDefault(); // Prevent default link behavior

            const projectId = e.target.getAttribute("data-project");
            const project = projects.find(p => p[0] === projectId);

            // Load project content dynamically
            projectContent.innerHTML = generateProjectContent(project);
        }
    });
});