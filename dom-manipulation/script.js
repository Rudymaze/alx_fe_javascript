document.getElementById("quoteDisplay");
newQuoteButton = document.getElementById("newQuote");

// Array to store quote objects
let quotes = [];

// Function to fetch quotes from JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Map the fetched data to our quote format
    quotes = data.map((post) => ({
      text: post.title,
      category: `User ${post.userId}`, // Use userId as the category
    }));

    // Save the fetched quotes to localStorage
    saveQuotes();

    // Display the fetched quotes
    displayQuotes();
    populateCategoryFilter();
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// Function to periodically fetch quotes
function startPeriodicFetching(interval = 5000) {
  fetchQuotesFromServer(); // Fetch immediately
  setInterval(fetchQuotes, interval); // Fetch periodically
}

// Function to post a new quote to JSONPlaceholder
async function postQuote(newQuote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newQuote.text,
        body: newQuote.category,
        userId: 1, // Simulate a user ID
      }),
    });
    const data = await response.json();
    console.log("Quote posted:", data);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

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

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    // Get all unique categories from the quotes array
    const categories = [...new Set(quotes.map((quote) => quote.category))];

    // Clear the dropdown and add the default "All" option
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    // Add each category as an option
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
}

// Function to filter quotes by category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    const selectedCategory = categoryFilter.value;
    displayQuotes(selectedCategory); // Display quotes filtered by the selected category
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
