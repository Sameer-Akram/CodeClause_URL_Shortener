
// Function to save the shortened URL to local storage
const saveToLocalStorage = (longUrl, shortUrl) => {
    const previousUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
    previousUrls.push({ longUrl, shortUrl, timestamp: new Date() }); // Add a timestamp property
    localStorage.setItem('shortenedUrls', JSON.stringify(previousUrls));
};

// Function to load the shortened URLs from local storage and display in the history table
const loadHistory = () => {
    const previousUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
    const historyList = document.getElementById('history-list');

    if (previousUrls.length > 0) {
        historyList.innerHTML = previousUrls
            .map((url, index) => {
                const date = new Date();
                const formattedDate = date.toLocaleDateString();
                const daysAgo = Math.floor((date - new Date(url.timestamp)) / (1000 * 60 * 60 * 24));
                return `
                  <tr>
                    <td>${url.longUrl}</td>
                    <td><a href="${url.shortUrl}" target="_blank">${url.shortUrl}</a></td>
                    <td>${formattedDate}</td>
                    <td>${daysAgo} days</td>
                
                  </tr>
                `;
            })
            .join('');
    } else {
        historyList.innerHTML = '<tr><td colspan="5">No history available</td></tr>';
    }
};

// Call loadHistory function to load and display history on page load
loadHistory();

// Function to clear the history of shortened URLs
const clearHistory = () => {
    localStorage.removeItem('shortenedUrls');
    loadHistory();
};
  
  const shortenUrl = async () => {
    const longUrl = document.getElementById('long-url').value.trim();
    const urlError = document.getElementById('url-error');
    const shortUrlContainer = document.getElementById('short-url-container');
    const shortUrlLink = document.getElementById('short-url-link');
    const copyBtn = document.getElementById('copy-btn');
    const loading = document.getElementById('loading');
  
    // Regular expression for URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  
    // Check if the input URL is valid
    const isValidUrl = urlPattern.test(longUrl);
    if (!isValidUrl) {
      urlError.classList.remove('d-none');
      return;
    }
  
    urlError.classList.add('d-none');
    loading.style.display = 'block';
  
    try {
      const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${longUrl}`);
      const data = await response.json();
      const shortUrl = data.result.full_short_link;
  
      shortUrlLink.href = shortUrl;
      shortUrlLink.textContent = shortUrl;
      shortUrlContainer.style.display = 'block';
      loading.style.display = 'none';
  
      // Save the shortened URL to local storage
      saveToLocalStorage(longUrl, shortUrl);
  
      // Clear the input field after shortening
      document.getElementById('long-url').value = '';
  
      // Update the history section with the latest shortened URL
      loadHistory();
    } catch (error) {
      console.error('Error occurred while shortening URL:', error);
      loading.style.display = 'none';
      alert('An error occurred. Please try again later.');
    }
  };
  
  const shortenBtn = document.getElementById('shorten-btn');
  shortenBtn.addEventListener('click', shortenUrl);
  
  // Add event listener to Clear History button
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Add event listener to Copy button
  const copyBtn = document.getElementById('copy-btn');
  copyBtn.addEventListener('click', () => {
    const shortUrlLink = document.getElementById('short-url-link');
    const tempInput = document.createElement('input');
    tempInput.setAttribute('value', shortUrlLink.href);
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('URL copied to clipboard!');
  });
  
  // Clear the error message when the user starts typing
  document.getElementById('long-url').addEventListener('input', () => {
    document.getElementById('url-error').classList.add('d-none');
  });
