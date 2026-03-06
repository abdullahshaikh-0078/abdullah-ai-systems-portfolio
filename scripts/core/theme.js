const toggle = document.getElementById("as-theme-toggle");

const savedTheme = localStorage.getItem("as-theme");

if (savedTheme === "light") {
    document.body.classList.add("as-light-theme");
    toggle.checked = true;
}

toggle.addEventListener("change", () => {

    document.body.classList.toggle("as-light-theme");

    if (document.body.classList.contains("as-light-theme")) {
        localStorage.setItem("as-theme", "light");
    } else {
        localStorage.setItem("as-theme", "dark");
    }

});