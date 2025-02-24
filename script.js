const SHEET_ID = '15tWTpzUhwAZBxP8rzMm-lH6X3HT6qE-JNE0-fXKtEcA';
const SHEET_NAME = 'Sheet1';
const API_KEY = 'AIzaSyAsXLnI_RlBMWDfDb-_WCHHZsh_XUI2LE0';

async function fetchProjects() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // Debugging: check structure
    return data.values.slice(1); // Skip header row
}

function generateProjectList(projects, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content
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
    const videoEmbed = project[4] ? `<iframe src="${project[4]}" frameborder="0" allowfullscreen></iframe>` : photos.split('</img>')[0];

    return `
        ${videoEmbed}
        <h2>${project[1]}</h2>
        <p>${project[3]}</p>
        ${photos}
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
    console.log(projects); // Debugging: check structure

    const seeProjects = projects.filter(project => project[2] === 'see');
    const hearProjects = projects.filter(project => project[2] === 'hear');

    const seeProjectsDropdown = document.getElementById('see-projects');
    const hearProjectsDropdown = document.getElementById('hear-projects');

    function resetDropdowns() {
        if (seeProjectsDropdown) seeProjectsDropdown.style.display = "none";
        if (hearProjectsDropdown) hearProjectsDropdown.style.display = "none";
    }

    if (document.body.classList.contains('see-page')) {
        resetDropdowns();
        if (seeProjectsDropdown) {
            seeProjectsDropdown.style.display = "block";
            generateProjectList(seeProjects, 'see-projects');
        }
    }

    if (document.body.classList.contains('hear-page')) {
        resetDropdowns();
        if (hearProjectsDropdown) {
            hearProjectsDropdown.style.display = "block";
            generateProjectList(hearProjects, 'hear-projects');
        }
    }

    // Ensure clicking a "see" or "hear" button loads the correct page
    document.querySelectorAll('.work-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const page = button.getAttribute('data-page');
            if (page === 'see') window.location.href = 'see.html';
            if (page === 'hear') window.location.href = 'hear.html';
        });
    });

    // Preload default content in #project-content
    const projectContent = document.getElementById("project-content");
    if (projectContent) {
        projectContent.innerHTML = `
            <h2>Select a Project</h2>
            <p>Click on a project from the list to view details here.</p>
        `;
    }

    // Load project content dynamically
    document.addEventListener("click", function (e) {
        if (e.target.matches("a[data-project]")) {
            e.preventDefault();
            const projectId = e.target.getAttribute("data-project");
            const project = projects.find(p => p[0] === projectId);
            projectContent.innerHTML = generateProjectContent(project);
        }
    });
});
