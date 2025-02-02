document.getElementById("quoteDisplay");
newQuoteButton = document.getElementById("newQuote");

// Array to store quote objects
let quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    category: "Motivation",
  },
  {
    text: "The best way to predict the future is to invent it.",
    category: "Innovation",
  },
];

// Load quotes from localStorage on page load
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  displayQuotes(); // Display the loaded quotes
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quoteDisplay) {
    quoteDisplay.innerHTML = `
            <p>"${randomQuote.text}"</p>
            <p><em>- ${randomQuote.category}</em></p>
        `;
  }
}

// Store the last displayed quote in sessionStorage
sessionStorage.setItem("lastRandomQuote", JSON.stringify(randomQuote));

// Function to create and display the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  if (formContainer) {
    formContainer.innerHTML = `
            <h3>Add a New Quote</h3>
            <form id="addQuoteForm">
                <label for="quoteText">Quote:</label>
                <textarea id="quoteText" placeholder="Enter the quote" required></textarea>
                <label for="quoteCategory">Category:</label>
                <input type="text" id="quoteCategory" placeholder="Enter the category" required>
                <button type="submit">Add Quote</button>
            </form>
        `;

    // Add event listener to the form
    const addQuoteForm = document.getElementById("addQuoteForm");
    if (addQuoteForm) {
      addQuoteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const quoteText = document.getElementById("quoteText").value;
        const quoteCategory = document.getElementById("quoteCategory").value;

        if (quoteText && quoteCategory) {
          // Add the new quote to the array
          quotes.push({ text: quoteText, category: quoteCategory });

          // Clear the form
          addQuoteForm.reset();

          // Show a success message
          alert("Quote added successfully!");
        } else {
          alert("Please fill out both fields.");
        }
      });
    }
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to initialize the application
function init() {
  // Create a container for the random quote display
  const quoteDisplay = document.createElement("div");
  quoteDisplay.id = "quoteDisplay";
  document.body.appendChild(quoteDisplay);

  // Create a button to show a random quote
  const randomQuoteBtn = document.createElement("button");
  randomQuoteBtn.textContent = "Show Random Quote";
  randomQuoteBtn.addEventListener("click", showRandomQuote);
  document.body.appendChild(randomQuoteBtn);
  // Create a container for the "Add Quote" form

  // Create a container for the quotes list
  const quotesList = document.createElement("ul");
  quotesList.id = "quotesList";
  document.body.appendChild(quotesList);

  // Create a container for the "Add Quote" form
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  document.body.appendChild(formContainer);

  // Create a button to show the "Add Quote" form
  const addQuoteBtn = document.createElement("button");
  addQuoteBtn.textContent = "Add New Quote";
  addQuoteBtn.addEventListener("click", createAddQuoteForm);
  document.body.appendChild(addQuoteBtn);

  // Create a button to export quotes
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.addEventListener("click", exportQuotes);
  document.body.appendChild(exportBtn);
}
// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", init);
