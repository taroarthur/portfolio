function toggleDropdown(id) {
    let dropdown = document.getElementById(id);
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "flex"; // Show dropdown
    } else {
        dropdown.style.display = "none"; // Hide dropdown
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a[data-page]");
    const mainContent = document.getElementById("main-content"); // Main content area

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent full page reload

            const page = link.getAttribute("data-page");

            // Start color transition
            document.body.classList.add("transitioning");

            // Fetch new content
            fetch(`${page}.html`)
                .then(response => response.text())
                .then(data => {
                    // Extract content from fetched HTML (assuming it's inside <main>)
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = data;
                    const newContent = tempDiv.querySelector("#main-content").innerHTML;

                    // Replace content
                    mainContent.innerHTML = newContent;

                    // Change body class to match the new page
                    document.body.className = page;

                    // End transition
                    setTimeout(() => {
                        document.body.classList.remove("transitioning");
                    }, 500); // Match transition time
                });
        });
    });
});
