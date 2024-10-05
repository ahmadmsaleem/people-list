const form = document.getElementById("addPersonForm");
const nameInput = document.getElementById("nameInput");
const peopleList = document.getElementById("peopleList");

// Fetch initial list from server
fetch("/people")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((person) => {
      addToDOM(person.name);
    });
  });

// Add event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;

  // Send the name to the server via POST
  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        addToDOM(name);
        nameInput.value = ""; // Clear input field
      }
    });
});

// Helper function to add a new name to the DOM
function addToDOM(name) {
  const li = document.createElement("li");
  li.textContent = name;
  peopleList.appendChild(li);
}
