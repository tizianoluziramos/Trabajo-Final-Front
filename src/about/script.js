document.addEventListener("DOMContentLoaded", () => {
  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "1") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
