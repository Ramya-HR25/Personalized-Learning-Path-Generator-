import { courseCategories, generateAllCourses } from "./courseCatalogGenerator.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspacesDir = path.join(__dirname, '../data/quiz_workspaces');

// Comprehensive quiz question banks for each chapter
// Each chapter has 25+ questions organized by purpose:
// - general: Default questions (backward compatible)
// - interview preparation: Concept + logic-based questions
// - academic learning: Theory-based questions  
// - building projects: Scenario-based questions

export const quizQuestionBanks = {
  // Python Chapter 1: Python Foundations
  "python-ch1": {
    general: [
    {
      id: "python-ch1-q1",
      prompt: "What is the correct way to create a variable in Python?",
      options: ["variable x = 5", "x = 5", "int x = 5", "var x = 5"],
      correctIndex: 1,
      explanation: "In Python, you simply assign a value to a name using the = operator. No keyword like 'var' or type declaration is needed. Python is dynamically typed."
    },
    {
      id: "python-ch1-q2",
      prompt: "Which of the following is an immutable data type in Python?",
      options: ["List", "Dictionary", "Set", "Tuple"],
      correctIndex: 3,
      explanation: "Tuples are immutable, meaning once created, their elements cannot be changed. Lists, dictionaries, and sets are all mutable."
    },
    {
      id: "python-ch1-q3",
      prompt: "What does the len() function do?",
      options: ["Returns the length of an object", "Converts to integer", "Creates a list", "Deletes an object"],
      correctIndex: 0,
      explanation: "len() returns the number of items in a container object like strings, lists, tuples, or dictionaries."
    },
    {
      id: "python-ch1-q4",
      prompt: "Which symbol is used for single-line comments in Python?",
      options: ["//", "/*", "#", "--"],
      correctIndex: 2,
      explanation: "Python uses the # symbol for single-line comments. Unlike C/Java which use // or /* */."
    },
    {
      id: "python-ch1-q5",
      prompt: "What is the output of: print(type([]))?",
      options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
      correctIndex: 1,
      explanation: "Square brackets [] create a list in Python. The type() function returns the class type of the object."
    },
    {
      id: "python-ch1-q6",
      prompt: "Which method adds an element to the end of a list?",
      options: ["add()", "append()", "insert()", "extend()"],
      correctIndex: 1,
      explanation: "append() adds a single element to the end of a list. add() is for sets, insert() adds at a specific position, and extend() adds multiple elements."
    },
    {
      id: "python-ch1-q7",
      prompt: "What is the correct syntax for an if-else statement in Python?",
      options: ["if x > 5: ... else: ...", "if (x > 5) then ... else ...", "if x > 5 { ... } else { ... }", "if x > 5 then: ... else: ..."],
      correctIndex: 0,
      explanation: "Python uses colons (:) after if/else conditions and indentation for blocks, not parentheses or curly braces."
    },
    {
      id: "python-ch1-q8",
      prompt: "What does the range(5) function generate?",
      options: ["0, 1, 2, 3, 4, 5", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "5, 4, 3, 2, 1"],
      correctIndex: 2,
      explanation: "range(5) generates numbers from 0 to 4 (5 numbers total). It starts at 0 by default and excludes the end value."
    },
    {
      id: "python-ch1-q9",
      prompt: "Which data type is used to store key-value pairs in Python?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      correctIndex: 2,
      explanation: "Dictionaries store data as key-value pairs using curly braces {}. Example: {'name': 'John', 'age': 30}"
    },
    {
      id: "python-ch1-q10",
      prompt: "What is the output of: print(2 ** 3)?",
      options: ["6", "8", "5", "9"],
      correctIndex: 1,
      explanation: "The ** operator is exponentiation in Python. 2 ** 3 means 2 raised to the power of 3, which equals 8."
    },
    {
      id: "python-ch1-q11",
      prompt: "How do you define a function in Python?",
      options: ["function myFunc():", "def myFunc():", "define myFunc():", "func myFunc():"],
      correctIndex: 1,
      explanation: "Functions in Python are defined using the 'def' keyword followed by the function name and parentheses."
    },
    {
      id: "python-ch1-q12",
      prompt: "What does the 'return' keyword do in a function?",
      options: ["Prints a value", "Exits the function and returns a value", "Stops the program", "Creates a variable"],
      correctIndex: 1,
      explanation: "The return statement exits the function and passes a value back to the caller. Without return, a function returns None."
    },
    {
      id: "python-ch1-q13",
      prompt: "Which loop is used to iterate over a sequence in Python?",
      options: ["while loop only", "for loop only", "Both for and while loops", "do-while loop"],
      correctIndex: 2,
      explanation: "Python supports both 'for' loops (for iterating over sequences) and 'while' loops (for condition-based iteration). Python doesn't have do-while loops."
    },
    {
      id: "python-ch1-q14",
      prompt: "What is string slicing? What does 'hello'[1:4] return?",
      options: ["'hell'", "'ell'", "'ello'", "'hel'"],
      correctIndex: 1,
      explanation: "String slicing extracts a substring. [1:4] starts at index 1 (inclusive) and ends at index 4 (exclusive), giving 'ell'."
    },
    {
      id: "python-ch1-q15",
      prompt: "Which operator checks if two values are equal in Python?",
      options: ["=", "==", "===", "equals"],
      correctIndex: 1,
      explanation: "The == operator checks equality. A single = is for assignment. Python doesn't use === like JavaScript."
    },
    {
      id: "python-ch1-q16",
      prompt: "What is the purpose of the 'break' statement?",
      options: ["Stops the entire program", "Exits the current loop", "Skips one iteration", "Continues to next iteration"],
      correctIndex: 1,
      explanation: "break immediately terminates the loop it's in and continues with the code after the loop."
    },
    {
      id: "python-ch1-q17",
      prompt: "What does the 'continue' statement do in a loop?",
      options: ["Exits the loop", "Skips to the next iteration", "Restarts the loop", "Stops the program"],
      correctIndex: 1,
      explanation: "continue skips the rest of the current iteration and jumps to the next iteration of the loop."
    },
    {
      id: "python-ch1-q18",
      prompt: "How do you create a multi-line string in Python?",
      options: ["Using single quotes", "Using double quotes only", "Using triple quotes (''' or \"\"\")", "Using backslashes"],
      correctIndex: 2,
      explanation: "Triple quotes (''' or \"\"\") allow strings to span multiple lines and preserve formatting."
    },
    {
      id: "python-ch1-q19",
      prompt: "What is a Python module?",
      options: ["A built-in function", "A file containing Python code", "A variable type", "A loop structure"],
      correctIndex: 1,
      explanation: "A module is a .py file containing Python definitions, statements, and functions that can be imported and reused."
    },
    {
      id: "python-ch1-q20",
      prompt: "How do you import a module named 'math'?",
      options: ["include math", "import math", "using math", "require math"],
      correctIndex: 1,
      explanation: "The 'import' keyword is used to load modules in Python. Example: import math"
    },
    {
      id: "python-ch1-q21",
      prompt: "What is the output of: print(10 % 3)?",
      options: ["3", "1", "3.33", "0"],
      correctIndex: 1,
      explanation: "The % (modulo) operator returns the remainder. 10 divided by 3 is 3 with remainder 1."
    },
    {
      id: "python-ch1-q22",
      prompt: "Which method converts a string to uppercase?",
      options: [".upper()", ".uppercase()", ".toUpper()", ".capitalize()"],
      correctIndex: 0,
      explanation: ".upper() converts all characters in a string to uppercase. .capitalize() only capitalizes the first character."
    },
    {
      id: "python-ch1-q23",
      prompt: "What is a list comprehension?",
      options: ["A way to understand lists", "A concise way to create lists", "A list method", "A type of loop"],
      correctIndex: 1,
      explanation: "List comprehensions provide a concise syntax to create lists. Example: [x*2 for x in range(5)]"
    },
    {
      id: "python-ch1-q24",
      prompt: "What does the 'in' keyword check?",
      options: ["Variable type", "Membership in a sequence", "File existence", "Function parameters"],
      correctIndex: 1,
      explanation: "The 'in' keyword checks if a value exists in a sequence (list, tuple, string, etc.). Returns True or False."
    },
    {
      id: "python-ch1-q25",
      prompt: "What is the correct way to handle errors in Python?",
      options: ["if-else blocks", "try-except blocks", "catch-throw blocks", "error-handling blocks"],
      correctIndex: 1,
      explanation: "Python uses try-except blocks for exception handling. Code that might fail goes in try, and error handling goes in except."
    },
    {
      id: "python-ch1-q26",
      prompt: "What is the difference between '==' and 'is' in Python?",
      options: ["No difference", "'==' checks value, 'is' checks identity", "'is' checks value, '==' checks identity", "Both check identity"],
      correctIndex: 1,
      explanation: "'==' checks if values are equal, while 'is' checks if two variables reference the exact same object in memory."
    }
    ],
    "interview preparation": [
      // Concept + logic-based questions for interview prep
      {
        id: "python-ch1-interview-q1",
        prompt: "What is the difference between deep copy and shallow copy in Python?",
        options: ["No difference", "Deep copy creates independent clone, shallow copy references nested objects", "Shallow copy is faster", "Deep copy only works with lists"],
        correctIndex: 1,
        explanation: "Deep copy creates a completely independent object, while shallow copy creates a new object but keeps references to nested objects."
      }
    ],
    "academic learning": [
      // Theory-based questions for academic learning
      {
        id: "python-ch1-academic-q1",
        prompt: "Who created Python and what was the design philosophy?",
        options: ["James Gosling - Write once run anywhere", "Guido van Rossum - Readability and simplicity", "Bjarne Stroustrup - Performance", "Dennis Ritchie - Low-level control"],
        correctIndex: 1,
        explanation: "Guido van Rossum created Python with a focus on code readability and simplicity, evident in its use of indentation and clear syntax."
      }
    ],
    "building projects": [
      // Scenario-based questions for project development
      {
        id: "python-ch1-project-q1",
        prompt: "You're building a configuration manager. Which data structure is best for storing key-value settings?",
        options: ["List", "Tuple", "Dictionary", "Set"],
        correctIndex: 2,
        explanation: "Dictionaries are ideal for key-value pairs like configuration settings, allowing fast lookup and updates by key name."
      }
    ]
  },

  // Python Chapter 2: Applied Python
  "python-ch2": {
    general: [
    {
      id: "python-ch2-q1",
      prompt: "Which function is used to open a file in Python?",
      options: ["open()", "file()", "read()", "load()"],
      correctIndex: 0,
      explanation: "open() is the built-in function to open files. It returns a file object. Example: file = open('data.txt', 'r')"
    },
    {
      id: "python-ch2-q2",
      prompt: "What does the 'r' mode in open('file.txt', 'r') mean?",
      options: ["Read mode", "Write mode", "Append mode", "Create mode"],
      correctIndex: 0,
      explanation: "'r' opens the file in read-only mode. 'w' is for writing, 'a' for appending, and 'x' for exclusive creation."
    },
    {
      id: "python-ch2-q3",
      prompt: "Which method reads all lines from a file?",
      options: ["read()", "readline()", "readlines()", "fetch()"],
      correctIndex: 2,
      explanation: "readlines() reads all lines and returns them as a list. read() reads the entire file as a string. readline() reads one line."
    },
    {
      id: "python-ch2-q4",
      prompt: "What is JSON used for?",
      options: ["Styling web pages", "Data interchange format", "Database management", "Image processing"],
      correctIndex: 1,
      explanation: "JSON (JavaScript Object Notation) is a lightweight data format used for storing and exchanging data between systems."
    },
    {
      id: "python-ch2-q5",
      prompt: "Which module is used to work with JSON in Python?",
      options: ["json", "xml", "csv", "data"],
      correctIndex: 0,
      explanation: "The json module provides methods like json.dumps() to convert to JSON and json.loads() to parse JSON."
    },
    {
      id: "python-ch2-q6",
      prompt: "What does json.dumps() do?",
      options: ["Reads JSON from file", "Converts Python object to JSON string", "Parses JSON to Python", "Deletes JSON data"],
      correctIndex: 1,
      explanation: "json.dumps() (dump string) serializes a Python object into a JSON formatted string."
    },
    {
      id: "python-ch2-q7",
      prompt: "What does json.loads() do?",
      options: ["Converts JSON string to Python object", "Writes JSON to file", "Creates JSON file", "Validates JSON"],
      correctIndex: 0,
      explanation: "json.loads() (load string) parses a JSON string and converts it into a Python object (dict, list, etc.)."
    },
    {
      id: "python-ch2-q8",
      prompt: "Which library is commonly used for making HTTP requests in Python?",
      options: ["http", "requests", "urllib3 only", "fetch"],
      correctIndex: 1,
      explanation: "The 'requests' library is the most popular for HTTP requests. It provides simple methods like requests.get() and requests.post()."
    },
    {
      id: "python-ch2-q9",
      prompt: "What does requests.get(url) return?",
      options: ["JSON data", "Response object", "HTML string", "Status code only"],
      correctIndex: 1,
      explanation: "requests.get() returns a Response object containing status_code, headers, and content. Use .json() to get JSON data."
    },
    {
      id: "python-ch2-q10",
      prompt: "How do you check if a request was successful (status 200)?",
      options: ["response.success", "response.status_code == 200", "response.ok", "Both B and C"],
      correctIndex: 3,
      explanation: "Both response.status_code == 200 and response.ok (which checks if status < 400) work to verify success."
    },
    {
      id: "python-ch2-q11",
      prompt: "What is the purpose of the 'with' statement when working with files?",
      options: ["Creates a new file", "Automatically closes the file", "Reads file faster", "Compresses the file"],
      correctIndex: 1,
      explanation: "The 'with' statement ensures the file is automatically closed when the block exits, even if an error occurs."
    },
    {
      id: "python-ch2-q12",
      prompt: "Which mode opens a file for writing and creates it if it doesn't exist?",
      options: ["'r'", "'w'", "'a'", "'x'"],
      correctIndex: 1,
      explanation: "'w' mode opens for writing and creates the file if it doesn't exist. It overwrites existing content."
    },
    {
      id: "python-ch2-q13",
      prompt: "What is automation in Python?",
      options: ["Making code faster", "Automating repetitive tasks with scripts", "Creating GUIs", "Building websites"],
      correctIndex: 1,
      explanation: "Automation uses Python scripts to perform repetitive tasks automatically, saving time and reducing errors."
    },
    {
      id: "python-ch2-q14",
      prompt: "Which library is used for web scraping in Python?",
      options: ["requests only", "BeautifulSoup", "matplotlib", "numpy"],
      correctIndex: 1,
      explanation: "BeautifulSoup is a popular library for parsing HTML and XML documents, commonly used with requests for web scraping."
    },
    {
      id: "python-ch2-q15",
      prompt: "What is an API?",
      options: ["A Python library", "Application Programming Interface", "A database type", "A web framework"],
      correctIndex: 1,
      explanation: "API (Application Programming Interface) allows different software systems to communicate and exchange data."
    },
    {
      id: "python-ch2-q16",
      prompt: "What HTTP method is used to retrieve data from an API?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correctIndex: 1,
      explanation: "GET is used to retrieve/request data from a server. POST sends data, PUT updates, and DELETE removes."
    },
    {
      id: "python-ch2-q17",
      prompt: "What is the purpose of error handling in file operations?",
      options: ["Makes code faster", "Prevents crashes when files don't exist", "Compresses files", "Encrypts data"],
      correctIndex: 1,
      explanation: "Error handling (try-except) prevents program crashes when files are missing, inaccessible, or corrupted."
    },
    {
      id: "python-ch2-q18",
      prompt: "Which exception is raised when a file is not found?",
      options: ["ValueError", "FileNotFoundError", "TypeError", "IOError only"],
      correctIndex: 1,
      explanation: "FileNotFoundError is raised when trying to open a file that doesn't exist at the specified path."
    },
    {
      id: "python-ch2-q19",
      prompt: "What is a relative file path?",
      options: ["Full path from root", "Path relative to current directory", "URL path", "Database path"],
      correctIndex: 1,
      explanation: "A relative path is relative to the current working directory, not the root. Example: './data/file.txt'"
    },
    {
      id: "python-ch2-q20",
      prompt: "How do you write data to a file?",
      options: ["file.read()", "file.write()", "file.append()", "file.save()"],
      correctIndex: 1,
      explanation: "file.write() writes a string to the file. The file must be opened in write ('w') or append ('a') mode."
    },
    {
      id: "python-ch2-q21",
      prompt: "What is the os module used for?",
      options: ["Operating system interactions", "Math operations", "Web requests", "Database queries"],
      correctIndex: 0,
      explanation: "The os module provides functions for interacting with the operating system, like file paths, directories, and environment variables."
    },
    {
      id: "python-ch2-q22",
      prompt: "Which method closes an open file?",
      options: ["file.end()", "file.close()", "file.stop()", "file.finish()"],
      correctIndex: 1,
      explanation: "file.close() closes the file and frees up system resources. Using 'with' statement auto-closes files."
    },
    {
      id: "python-ch2-q23",
      prompt: "What is a REST API?",
      options: ["A Python library", "An API using HTTP methods and JSON", "A database", "A testing framework"],
      correctIndex: 1,
      explanation: "REST API uses HTTP methods (GET, POST, PUT, DELETE) and typically exchanges data in JSON format."
    },
    {
      id: "python-ch2-q24",
      prompt: "What does the enumerate() function do?",
      options: ["Counts items", "Returns index and value pairs", "Sorts a list", "Filters a list"],
      correctIndex: 1,
      explanation: "enumerate() returns pairs of (index, value) when iterating, useful for loops needing both position and item."
    },
    {
      id: "python-ch2-q25",
      prompt: "How do you handle multiple exceptions in Python?",
      options: ["Multiple try blocks", "Multiple except blocks", "Multiple catch blocks", "Multiple error blocks"],
      correctIndex: 1,
      explanation: "You can use multiple except blocks to handle different exception types differently."
    },
    {
      id: "python-ch2-q26",
      prompt: "What is the purpose of the finally block?",
      options: ["Runs only if error occurs", "Runs regardless of error", "Runs only if no error", "Stops execution"],
      correctIndex: 1,
      explanation: "The finally block always executes after try-except, whether an error occurred or not. Used for cleanup operations."
    }
    ]
  },

  // Web Development Chapter 1: Web Basics
  "web-ch1": {
    general: [
    {
      id: "web-ch1-q1",
      prompt: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
      correctIndex: 0,
      explanation: "HTML stands for Hyper Text Markup Language. It's the standard markup language for creating web pages."
    },
    {
      id: "web-ch1-q2",
      prompt: "Which HTML tag is used for the largest heading?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      correctIndex: 2,
      explanation: "<h1> defines the most important/largest heading. <h6> is the smallest. <head> is for metadata, not headings."
    },
    {
      id: "web-ch1-q3",
      prompt: "What is the correct HTML element for inserting a line break?",
      options: ["<break>", "<lb>", "<br>", "<newline>"],
      correctIndex: 2,
      explanation: "<br> is the line break element in HTML. It's a self-closing tag that creates a new line."
    },
    {
      id: "web-ch1-q4",
      prompt: "Which attribute specifies the URL in an anchor tag?",
      options: ["src", "link", "href", "url"],
      correctIndex: 2,
      explanation: "The href (hypertext reference) attribute specifies the URL for links. Example: <a href='https://example.com'>"
    },
    {
      id: "web-ch1-q5",
      prompt: "What is semantic HTML?",
      options: ["HTML with colors", "HTML that clearly describes its meaning", "HTML with JavaScript", "Old HTML versions"],
      correctIndex: 1,
      explanation: "Semantic HTML uses tags that clearly describe their meaning (e.g., <article>, <nav>, <footer>) instead of generic <div>."
    },
    {
      id: "web-ch1-q6",
      prompt: "Which tag is used to define an unordered list?",
      options: ["<ol>", "<list>", "<ul>", "<dl>"],
      correctIndex: 2,
      explanation: "<ul> creates an unordered (bulleted) list. <ol> is for ordered (numbered) lists. List items use <li>."
    },
    {
      id: "web-ch1-q7",
      prompt: "What is the purpose of the alt attribute in images?",
      options: ["Image alignment", "Alternative text for accessibility", "Image size", "Image border"],
      correctIndex: 1,
      explanation: "The alt attribute provides alternative text when images can't be displayed, crucial for accessibility and SEO."
    },
    {
      id: "web-ch1-q8",
      prompt: "Which HTML5 element is used for navigation links?",
      options: ["<div>", "<nav>", "<navigation>", "<menu>"],
      correctIndex: 1,
      explanation: "<nav> is a semantic HTML5 element specifically for navigation sections containing links."
    },
    {
      id: "web-ch1-q9",
      prompt: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      correctIndex: 1,
      explanation: "CSS stands for Cascading Style Sheets. It's used to style and layout web pages."
    },
    {
      id: "web-ch1-q10",
      prompt: "Which CSS property controls text size?",
      options: ["text-size", "font-size", "text-style", "font-weight"],
      correctIndex: 1,
      explanation: "font-size sets the size of text. font-weight controls boldness. text-style isn't a valid CSS property."
    },
    {
      id: "web-ch1-q11",
      prompt: "What is Flexbox used for?",
      options: ["Database queries", "One-dimensional layouts", "3D animations", "Server routing"],
      correctIndex: 1,
      explanation: "Flexbox is a CSS layout model for arranging items in rows or columns (one dimension) with flexible sizing."
    },
    {
      id: "web-ch1-q12",
      prompt: "Which CSS property creates space inside an element?",
      options: ["margin", "padding", "border", "spacing"],
      correctIndex: 1,
      explanation: "Padding creates space inside an element (between content and border). Margin creates space outside."
    },
    {
      id: "web-ch1-q13",
      prompt: "What is the CSS box model?",
      options: ["A JavaScript framework", "Content + Padding + Border + Margin", "A database model", "An HTML structure"],
      correctIndex: 1,
      explanation: "The box model describes every HTML element as a box with: content, padding, border, and margin layers."
    },
    {
      id: "web-ch1-q14",
      prompt: "Which display value makes an element a flex container?",
      options: ["display: block", "display: flex", "display: inline", "display: grid"],
      correctIndex: 1,
      explanation: "display: flex activates Flexbox layout for the container and its direct children (flex items)."
    },
    {
      id: "web-ch1-q15",
      prompt: "What is responsive web design?",
      options: ["Fast-loading websites", "Designs that adapt to different screen sizes", "Websites with animations", "Interactive websites"],
      correctIndex: 1,
      explanation: "Responsive design ensures websites look good on all devices (desktop, tablet, mobile) using flexible layouts and media queries."
    },
    {
      id: "web-ch1-q16",
      prompt: "Which CSS property is used for responsive design with breakpoints?",
      options: ["@media", "@responsive", "@breakpoint", "@screen"],
      correctIndex: 0,
      explanation: "@media queries apply different CSS rules based on device characteristics like screen width."
    },
    {
      id: "web-ch1-q17",
      prompt: "What is the viewport meta tag used for?",
      options: ["Setting page title", "Controlling layout on mobile browsers", "Adding favicon", "Loading fonts"],
      correctIndex: 1,
      explanation: "The viewport meta tag controls how a webpage is displayed on mobile devices, essential for responsive design."
    },
    {
      id: "web-ch1-q18",
      prompt: "Which unit is relative to the font-size of the root element?",
      options: ["px", "em", "rem", "%"],
      correctIndex: 2,
      explanation: "rem (root em) is relative to the root element's font-size. em is relative to the parent element's font-size."
    },
    {
      id: "web-ch1-q19",
      prompt: "What is the purpose of CSS Grid?",
      options: ["One-dimensional layouts", "Two-dimensional layouts", "Text styling", "Form validation"],
      correctIndex: 1,
      explanation: "CSS Grid creates two-dimensional layouts with rows and columns, more complex than Flexbox's one-dimensional approach."
    },
    {
      id: "web-ch1-q20",
      prompt: "Which HTML tag is used to link external CSS?",
      options: ["<script>", "<style>", "<link>", "<css>"],
      correctIndex: 2,
      explanation: "<link rel='stylesheet' href='style.css'> in the <head> section links external CSS files."
    },
    {
      id: "web-ch1-q21",
      prompt: "What is accessibility (a11y) in web development?",
      options: ["Website speed", "Making websites usable by everyone", "Mobile-friendly design", "Security features"],
      correctIndex: 1,
      explanation: "Web accessibility ensures websites are usable by people with disabilities through proper semantics, alt text, keyboard navigation, etc."
    },
    {
      id: "web-ch1-q22",
      prompt: "Which ARIA attribute makes elements accessible?",
      options: ["aria-label", "class", "id", "style"],
      correctIndex: 0,
      explanation: "ARIA (Accessible Rich Internet Applications) attributes like aria-label provide additional context for screen readers."
    },
    {
      id: "web-ch1-q23",
      prompt: "What is mobile-first design?",
      options: ["Designing for desktop first", "Designing for mobile devices first", "Creating mobile apps", "Using only mobile CSS"],
      correctIndex: 1,
      explanation: "Mobile-first design starts with mobile styles and adds complexity for larger screens using min-width media queries."
    },
    {
      id: "web-ch1-q24",
      prompt: "Which CSS property controls the spacing between flex items?",
      options: ["margin", "gap", "spacing", "padding"],
      correctIndex: 1,
      explanation: "The gap property sets spacing between flex or grid items without affecting outer margins."
    },
    {
      id: "web-ch1-q25",
      prompt: "What is the purpose of the <main> tag?",
      options: ["Site-wide footer", "Unique content of the document", "Navigation menu", "Head section"],
      correctIndex: 1,
      explanation: "The <main> element represents the dominant content of the <body>. It should be unique to the document."
    },
    {
      id: "web-ch1-q26",
      prompt: "Which pseudo-class targets elements on hover?",
      options: [":active", ":hover", ":focus", ":visited"],
      correctIndex: 1,
      explanation: ":hover applies styles when a user's cursor is over an element. :active is during click, :focus when selected."
    }
  ],

  // Web Development Chapter 2: Frontend to Backend
  "web-ch2": [
    {
      id: "web-ch2-q1",
      prompt: "What is the DOM?",
      options: ["A database", "Document Object Model", "A CSS framework", "A server"],
      correctIndex: 1,
      explanation: "DOM (Document Object Model) is a tree-like representation of HTML that JavaScript can manipulate to update the page."
    },
    {
      id: "web-ch2-q2",
      prompt: "Which method selects an element by ID?",
      options: ["document.querySelector()", "document.getElementById()", "Both A and B", "document.findElement()"],
      correctIndex: 2,
      explanation: "Both getElementById('id') and querySelector('#id') work. querySelector is more versatile with CSS selectors."
    },
    {
      id: "web-ch2-q3",
      prompt: "What is an event listener in JavaScript?",
      options: ["A function that waits for user actions", "A CSS property", "A server request", "A database query"],
      correctIndex: 0,
      explanation: "Event listeners wait for events (clicks, keypresses, etc.) and execute callback functions when triggered."
    },
    {
      id: "web-ch2-q4",
      prompt: "Which method adds an event listener?",
      options: ["element.listen()", "element.addEventListener()", "element.onEvent()", "element.click()"],
      correctIndex: 1,
      explanation: "addEventListener('event', callback) attaches event handlers. Example: button.addEventListener('click', handler)"
    },
    {
      id: "web-ch2-q5",
      prompt: "What is the fetch() API used for?",
      options: ["Styling pages", "Making network requests", "Managing state", "Building components"],
      correctIndex: 1,
      explanation: "fetch() is the modern way to request data from an API or server asynchronously."
    },
    {
      id: "web-ch2-q6",
      prompt: "What is JSON?",
      options: ["A programming language", "A data format (JavaScript Object Notation)", "A database engine", "A CSS preprocessor"],
      correctIndex: 1,
      explanation: "JSON is a lightweight data-interchange format used to exchange data between a server and a web application."
    },
    {
      id: "web-ch2-q7",
      prompt: "What does 'async' do when added to a function?",
      options: ["Makes it run faster", "Ensures it returns a Promise", "Prevents errors", "Hides the function"],
      correctIndex: 1,
      explanation: "The 'async' keyword ensures that the function always returns a Promise and allows the use of 'await' inside it."
    },
    {
      id: "web-ch2-q8",
      prompt: "What is a REST API?",
      options: ["A database type", "A standard for client-server communication", "A frontend library", "A server operating system"],
      correctIndex: 1,
      explanation: "REST (Representational State Transfer) is an architectural style for providing standards between computer systems on the web."
    },
    {
      id: "web-ch2-q9",
      prompt: "Which HTTP method is used to send data to create a resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctIndex: 1,
      explanation: "POST is used to send data to a server to create/update a resource."
    },
    {
      id: "web-ch2-q10",
      prompt: "What is a database schema?",
      options: ["The color of the database", "The structural design of the data", "A backup of the data", "A type of server"],
      correctIndex: 1,
      explanation: "A schema defines how data is organized within a relational database, including tables and relationships."
    }
    ]
  },

  // Frontend Chapter 1: UI Craft
  "fe-ch1": {
    general: [
    {
      id: "fe-ch1-q1",
      prompt: "What are Design Tokens?",
      options: ["UI components", "Platform-agnostic design variables", "Image assets", "Icon sets"],
      correctIndex: 1,
      explanation: "Design tokens are the visual atoms of a design system (colors, spacing, etc.) stored as data."
    },
    {
      id: "fe-ch1-q2",
      prompt: "What is the purpose of a Design System?",
      options: ["To make code longer", "To ensure visual consistency and reusability", "To replace developers", "To slow down design"],
      correctIndex: 1,
      explanation: "Design systems provide a collection of reusable components and standards to build consistent products faster."
    },
    {
      id: "fe-ch1-q3",
      prompt: "What is a 'component' in modern frontend frameworks?",
      options: ["A database table", "An independent, reusable piece of UI", "A CSS file", "A browser extension"],
      correctIndex: 1,
      explanation: "Components are the fundamental building blocks of UI in frameworks like React, Vue, and Angular."
    },
    {
      id: "fe-ch1-q4",
      prompt: "What is 'Accessibility' (A11y) in UI design?",
      options: ["Fast loading", "Ensuring products are usable by people with disabilities", "Good SEO", "Beautiful colors"],
      correctIndex: 1,
      explanation: "Accessibility means designing and coding so that people with various disabilities can perceive, understand, and interact with the web."
    },
    {
      id: "fe-ch1-q5",
      prompt: "What is a 'Layout' in UI design?",
      options: ["The color scheme", "The arrangement of visual elements on a page", "The font choice", "The image resolution"],
      correctIndex: 1,
      explanation: "Layout refers to the spatial arrangement of components, text, and images to create a hierarchy and flow."
    }
    ]
  },

  // Frontend Chapter 2: Performance and Product Thinking
  "fe-ch2": {
    general: [
    {
      id: "fe-ch2-q1",
      prompt: "What is 'Lazy Loading'?",
      options: ["Loading everything at once", "Loading resources only when they are needed", "Stopping page loads", "A slow internet connection"],
      correctIndex: 1,
      explanation: "Lazy loading improves performance by delaying the loading of non-critical resources until they enter the viewport."
    },
    {
      id: "fe-ch2-q2",
      prompt: "What is 'Critical CSS'?",
      options: ["CSS for the entire site", "CSS required to render the above-the-fold content", "CSS with errors", "Important styling rules"],
      correctIndex: 1,
      explanation: "Critical CSS is the minimum set of styles needed to display the first part of the page the user sees."
    },
    {
      id: "fe-ch2-q3",
      prompt: "What is the 'Product Thinking' mindset?",
      options: ["Just writing code", "Solving user problems and meeting business goals", "Using the latest technology", "Building features as fast as possible"],
      correctIndex: 1,
      explanation: "Product thinking focuses on the 'why' behind a feature, ensuring it provides actual value to users and the business."
    }
    ]
  },

  // Backend Chapter 1: API Design
  "be-ch1": {
    general: [
    {
      id: "be-ch1-q1",
      prompt: "What does 'Stateless' mean in REST APIs?",
      options: ["The server stores user data", "Each request contains all information needed to process it", "The API never changes", "The server is offline"],
      correctIndex: 1,
      explanation: "Statelessness means the server does not store session state; every request must be self-contained."
    },
    {
      id: "be-ch1-q2",
      prompt: "What is an 'Endpoint' in an API?",
      options: ["The end of the code", "A specific URL where a resource can be accessed", "A type of database", "A server crash"],
      correctIndex: 1,
      explanation: "An endpoint is a specific route or URL in an API that performs a specific function (e.g., /api/users)."
    },
    {
      id: "be-ch1-q3",
      prompt: "What is the purpose of HTTP Status Codes?",
      options: ["To style the response", "To indicate the outcome of a request", "To encrypt data", "To name the server"],
      correctIndex: 1,
      explanation: "Status codes (like 200, 404, 500) tell the client if the request was successful, failed, or requires further action."
    },
    {
      id: "be-ch1-q4",
      prompt: "What is 'Payload' in an API request?",
      options: ["The speed of the request", "The data being sent in the body of the request", "The server's location", "The API's name"],
      correctIndex: 1,
      explanation: "The payload is the actual data (usually JSON) sent from the client to the server in a POST or PUT request."
    }
    ]
  },

  // Technical Skills Chapter 1: Engineering Toolkit
  "ts-ch1": {
    general: [
    {
      id: "ts-ch1-q1",
      prompt: "What is the purpose of Version Control (like Git)?",
      options: ["Writing code faster", "Tracking and managing changes to code over time", "Running code in the cloud", "Designing user interfaces"],
      correctIndex: 1,
      explanation: "Version control systems allow developers to track changes, revert to previous states, and collaborate on the same codebase without overwriting each other's work."
    },
    {
      id: "ts-ch1-q2",
      prompt: "What is a 'Branch' in Git?",
      options: ["A copy of the entire database", "An independent line of development", "A folder on your computer", "A remote server"],
      correctIndex: 1,
      explanation: "A branch in Git is an independent line of development. You can create a branch to work on a new feature or fix a bug without affecting the main ('master' or 'main') codebase."
    },
    {
      id: "ts-ch1-q3",
      prompt: "What does 'CLI' stand for?",
      options: ["Code Line Interface", "Command Line Interface", "Computer Logic Integration", "Centralized Library Index"],
      correctIndex: 1,
      explanation: "CLI (Command Line Interface) is a text-based interface used to interact with software and operating systems by typing commands."
    },
    {
      id: "ts-ch1-q4",
      prompt: "What is the benefit of Automated Testing?",
      options: ["It replaces developers", "It catches bugs early and ensures code reliability", "It makes the website look better", "It reduces the need for a database"],
      correctIndex: 1,
      explanation: "Automated testing runs scripts to verify that code works as expected. It helps catch regressions early, improves confidence in code changes, and saves time compared to manual testing."
    },
    {
      id: "ts-ch1-q5",
      prompt: "In debugging, what is a 'Stack Trace'?",
      options: ["A list of all files in a project", "A report of active function calls at a specific point in time", "A type of data structure", "A styling guide"],
      correctIndex: 1,
      explanation: "A stack trace is a report that shows the hierarchy of function calls that were active when an error occurred, helping developers pinpoint where and why the code failed."
    }
    ]
  }
};

const QUIZ_PURPOSE_KEYS = [
  "general",
  "job preparation",
  "skill development",
  "building projects",
  "academic learning",
  "interview preparation",
  "career switch",
  "competitive exams"
];

const QUIZ_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const PURPOSE_PROMPTS = {
  general: {
    concept: (subject, chapterTitle, topicTitle) =>
      `In ${subject}, which concept is explicitly covered under "${topicTitle}" in the chapter "${chapterTitle}"?`,
    topic: (subtopic) => `Which topic in this chapter contains the subtopic "${subtopic}"?`,
    resource: (subtopic) => `Which chapter resource is the best match for reviewing "${subtopic}"?`
  },
  "job preparation": {
    concept: (subject, _chapterTitle, topicTitle) =>
      `For job preparation in ${subject}, which concept from "${topicTitle}" should you explain clearly in an assessment or interview?`,
    topic: (subtopic) => `Which topic should you revise if an interviewer asks you about "${subtopic}"?`,
    resource: (subtopic) => `Which resource would help you get job-ready on "${subtopic}"?`
  },
  "skill development": {
    concept: (_subject, _chapterTitle, topicTitle) =>
      `For skill development, which concept from "${topicTitle}" should be practiced repeatedly?`,
    topic: (subtopic) => `Which topic should you revisit to strengthen the skill of "${subtopic}"?`,
    resource: (subtopic) => `Which resource best supports repeated practice for "${subtopic}"?`
  },
  "building projects": {
    concept: (subject, _chapterTitle, topicTitle) =>
      `While building a project with ${subject}, which concept from "${topicTitle}" is a direct implementation step?`,
    topic: (subtopic) => `Which topic should you study before implementing a feature that depends on "${subtopic}"?`,
    resource: (subtopic) => `Which resource is the most useful implementation reference for "${subtopic}"?`
  },
  "academic learning": {
    concept: (_subject, chapterTitle, topicTitle) =>
      `In the academic study of "${chapterTitle}", which concept is formally listed under "${topicTitle}"?`,
    topic: (subtopic) => `Which topic should appear in your academic notes for the subtopic "${subtopic}"?`,
    resource: (subtopic) => `Which resource is the best structured reference for studying "${subtopic}"?`
  },
  "interview preparation": {
    concept: (_subject, _chapterTitle, topicTitle) =>
      `For interview preparation, which concept from "${topicTitle}" should you recall first in a step-by-step answer?`,
    topic: (subtopic) => `If an interviewer asks about "${subtopic}", which topic should anchor your explanation?`,
    resource: (subtopic) => `Which resource should you cite first when answering questions about "${subtopic}"?`
  },
  "career switch": {
    concept: (subject, _chapterTitle, topicTitle) =>
      `If you are switching into ${subject}, which concept from "${topicTitle}" should you learn first?`,
    topic: (subtopic) => `Which topic best helps a career-switch learner understand "${subtopic}"?`,
    resource: (subtopic) => `Which resource is the best bridge into hands-on understanding of "${subtopic}"?`
  },
  "competitive exams": {
    concept: (_subject, _chapterTitle, topicTitle) =>
      `For a competitive exam, which concept from "${topicTitle}" is a likely direct recall question?`,
    topic: (subtopic) => `Which topic should you revise if an exam asks about "${subtopic}"?`,
    resource: (subtopic) => `Which resource is the fastest revision source for "${subtopic}"?`
  }
};

function uniqueItems(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildOptions(correct, pool = [], fallback = []) {
  const options = [correct];

  for (const option of [...pool, ...fallback]) {
    if (!option || options.includes(option) || option === correct) {
      continue;
    }

    options.push(option);
    if (options.length === 4) {
      break;
    }
  }

  while (options.length < 4) {
    options.push(`${correct} review ${options.length}`);
  }

  return options;
}

function rotateOptions(options = [], index = 0) {
  if (!options.length) {
    return options;
  }

  const shift = index % options.length;
  return options.slice(shift).concat(options.slice(0, shift));
}

function createQuestion(id, prompt, correct, distractors, fallbackOptions, explanation, index) {
  const options = rotateOptions(buildOptions(correct, distractors, fallbackOptions), index);
  return {
    id,
    prompt,
    options,
    correctIndex: options.indexOf(correct),
    explanation
  };
}

function adaptQuestionForLevel(question, level, purpose, index) {
  if (level === "Beginner") {
    return {
      ...question,
      id: `${question.id}-beginner-${index + 1}`
    };
  }

  if (level === "Intermediate") {
    return {
      ...question,
      id: `${question.id}-intermediate-${index + 1}`,
      prompt: `${question.prompt}`,
      explanation: `${question.explanation} This intermediate version expects you to connect the concept to its surrounding topic.`
    };
  }

  return {
    ...question,
    id: `${question.id}-advanced-${index + 1}`,
    prompt:
      purpose === "building projects"
        ? `${question.prompt} Choose the most implementation-critical answer.`
        : purpose === "interview preparation"
          ? `${question.prompt} Choose the strongest interview-ready answer.`
          : `${question.prompt} Choose the most technically precise answer.`,
    explanation: `${question.explanation} This advanced version expects precise recall and stronger reasoning.`,
    options: rotateOptions(question.options, index + 1)
  };
}

function buildSubjectCategoryMap() {
  return Object.entries(courseCategories).reduce((accumulator, [category, subjects]) => {
    subjects.forEach((subject) => {
      accumulator[subject] = category;
    });
    return accumulator;
  }, {});
}

function normalizeLegacyEntry(entry) {
  if (!entry) {
    return {};
  }

  if (Array.isArray(entry)) {
    return { general: entry };
  }

  return entry;
}

function buildGeneratedPurposeQuestions(subject, chapter, purpose) {
  const prompts = PURPOSE_PROMPTS[purpose] || PURPOSE_PROMPTS.general;
  const topics = chapter.topics || [];
  const topicTitles = uniqueItems(topics.map((topic) => topic.title));
  const subtopics = uniqueItems(topics.flatMap((topic) => topic.subtopics || []));
  const resourceTitles = uniqueItems(topics.flatMap((topic) => (topic.resources || []).map((resource) => resource.title)));
  const fallbackOptions = uniqueItems([chapter.title, ...topicTitles, ...subtopics, ...resourceTitles]);
  const questions = [];

  const entries = topics.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic, index) => ({
      topicTitle: topic.title,
      subtopic,
      resourceTitle: topic.resources?.[index % Math.max(topic.resources?.length || 1, 1)]?.title ||
        topic.resources?.[0]?.title ||
        `${topic.title} resource`
    }))
  );

  entries.forEach((entry, index) => {
    const otherSubtopics = subtopics.filter((item) => item !== entry.subtopic);
    const otherTopics = topicTitles.filter((item) => item !== entry.topicTitle);
    const otherResources = resourceTitles.filter((item) => item !== entry.resourceTitle);

    questions.push(
      createQuestion(
        `${chapter.id}-${purpose.replace(/\s+/g, "-")}-concept-${questions.length + 1}`,
        prompts.concept(subject, chapter.title, entry.topicTitle),
        entry.subtopic,
        otherSubtopics,
        fallbackOptions,
        `"${entry.subtopic}" is one of the listed subtopics under "${entry.topicTitle}" in this chapter.`,
        index
      )
    );

    questions.push(
      createQuestion(
        `${chapter.id}-${purpose.replace(/\s+/g, "-")}-topic-${questions.length + 1}`,
        prompts.topic(entry.subtopic),
        entry.topicTitle,
        otherTopics,
        fallbackOptions,
        `"${entry.subtopic}" belongs to the topic "${entry.topicTitle}" in this chapter.`,
        index + 1
      )
    );

    questions.push(
      createQuestion(
        `${chapter.id}-${purpose.replace(/\s+/g, "-")}-resource-${questions.length + 1}`,
        prompts.resource(entry.subtopic),
        entry.resourceTitle,
        otherResources,
        fallbackOptions,
        `"${entry.resourceTitle}" is attached to the topic that covers "${entry.subtopic}", so it is the closest study resource here.`,
        index + 2
      )
    );
  });

  topics.forEach((topic, index) => {
    const leadSubtopic = topic.subtopics?.[0] || topic.title;
    const otherTopics = topicTitles.filter((item) => item !== topic.title);
    const otherSubtopics = subtopics.filter((item) => item !== leadSubtopic);

    questions.push(
      createQuestion(
        `${chapter.id}-${purpose.replace(/\s+/g, "-")}-chapter-focus-${questions.length + 1}`,
        `Which topic in "${chapter.title}" should be studied if you want to master "${leadSubtopic}"?`,
        topic.title,
        otherTopics,
        fallbackOptions,
        `"${leadSubtopic}" is explicitly grouped under "${topic.title}" in "${chapter.title}".`,
        index + 3
      )
    );

    questions.push(
      createQuestion(
        `${chapter.id}-${purpose.replace(/\s+/g, "-")}-support-${questions.length + 1}`,
        `Which concept is explicitly paired with "${leadSubtopic}" inside the topic "${topic.title}"?`,
        topic.subtopics?.[1] || leadSubtopic,
        otherSubtopics,
        fallbackOptions,
        `${topic.subtopics?.[1] || leadSubtopic} appears alongside "${leadSubtopic}" in the topic "${topic.title}".`,
        index + 4
      )
    );
  });

  return questions;
}

function buildPurposeBank(subject, chapter, purpose, legacyQuestions = []) {
  const generatedQuestions = buildGeneratedPurposeQuestions(subject, chapter, purpose);
  const merged = [];
  const seenPrompts = new Set();

  for (const question of [...legacyQuestions, ...generatedQuestions]) {
    const promptKey = question.prompt?.trim().toLowerCase();
    if (!promptKey || seenPrompts.has(promptKey)) {
      continue;
    }

    seenPrompts.add(promptKey);
    merged.push(question);

    if (merged.length === 25) {
      break;
    }
  }

  return merged.slice(0, 25);
}

function buildLevelBanksForPurpose(subject, chapter, purpose, legacyQuestions = []) {
  const baseQuestions = buildPurposeBank(subject, chapter, purpose, legacyQuestions);

  return QUIZ_LEVELS.reduce((accumulator, level) => {
    accumulator[level] = baseQuestions.map((question, index) =>
      adaptQuestionForLevel(structuredClone(question), level, purpose, index)
    );
    return accumulator;
  }, {});
}

function buildCompleteQuizQuestionBanks() {
  const catalog = generateAllCourses();
  const banks = structuredClone(quizQuestionBanks);
  const legacyBanks = structuredClone(quizQuestionBanks);

  const externalWorkspaces = {};
  try {
    if (fs.existsSync(workspacesDir)) {
      const files = fs.readdirSync(workspacesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(workspacesDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const lowerCaseWorkspaces = {};
          if (data.workspaces) {
             for (const key of Object.keys(data.workspaces)) {
                lowerCaseWorkspaces[key.toLowerCase()] = data.workspaces[key];
             }
          }
          externalWorkspaces[data.courseName] = lowerCaseWorkspaces;
        }
      }
    }
  } catch (err) {
    console.error("Failed to load quiz workspaces", err);
  }

  Object.entries(catalog).forEach(([subject, course]) => {
    const courseWorkspace = externalWorkspaces[subject] || {};

    (course.chapters || []).forEach((chapter, chapterIndex) => {
      const normalizedLegacyEntry = normalizeLegacyEntry(legacyBanks[chapter.id]);
      const chapterBank = {};

      QUIZ_PURPOSE_KEYS.forEach((purpose) => {
        const legacyQuestions =
          normalizedLegacyEntry[purpose] ||
          (purpose !== "general" ? normalizedLegacyEntry.general || [] : []);

        const levelBanks = buildLevelBanksForPurpose(subject, chapter, purpose, legacyQuestions);

        if (chapterIndex === 0 && courseWorkspace[purpose.toLowerCase()]) {
           ['Beginner', 'Intermediate', 'Advanced'].forEach(level => {
              const wsQuestions = courseWorkspace[purpose.toLowerCase()][level] || [];
              const mappedQuestions = wsQuestions.map((wq, i) => {
                 const correctIndex = wq.options?.indexOf(wq.answer) || 0;
                 return {
                    id: `${chapter.id}-ws-${purpose.replace(/\\s+/g, '-')}-${level}-${i}`,
                    prompt: wq.question,
                    options: wq.options || [wq.answer],
                    correctIndex: correctIndex >= 0 ? correctIndex : 0,
                    explanation: `Correct answer: ${wq.answer}`
                 };
              });
              
              if (!levelBanks[level]) levelBanks[level] = [];
              levelBanks[level] = [...mappedQuestions, ...levelBanks[level]];
           });
        }

        chapterBank[purpose] = levelBanks;
      });

      banks[chapter.id] = chapterBank;
    });
  });

  return banks;
}

export const completeQuizQuestionBanks = buildCompleteQuizQuestionBanks();
