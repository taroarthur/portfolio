document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a"); // Select all links

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            if (link.hostname === window.location.hostname && link.getAttribute("href") !== "#") {
                e.preventDefault(); // Prevent default link behavior

                document.body.style.opacity = "0"; // Start fade out

                setTimeout(() => {
                    window.location.href = link.href; // Redirect after fade-out
                }, 500); // Match timing to CSS transition
            }
        });
    });
});
