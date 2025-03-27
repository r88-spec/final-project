//preloader
const preloader = document.getElementById("preloader")
window.addEventListener("load", hidePreloader())
function hidePreloader() {
  preloader.style.display = "none"
}

//shortcut 
const shortcut_home=document.getElementsByClassName("button1")
function shortcut(){
  window.location.href = "market.html";
}

  
//login form
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const toggleLinks = document.querySelectorAll(".message a");

  // Hide register form initially
  registerForm.style.display = "none";

  toggleLinks.forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          if (loginForm.style.display === "none") {
              loginForm.style.display = "block";
              registerForm.style.display = "none";
          } else {
              loginForm.style.display = "none";
              registerForm.style.display = "block";
          }
      });
  });

  // Register button functionality
  document.querySelector(".register-form button").addEventListener("click", function (event) {
      event.preventDefault();
      
      const username = document.querySelector(".register-form input[placeholder='Username']").value;
      const email = document.querySelector(".register-form input[placeholder='Email Address']").value;
      const password = document.querySelector(".register-form input[placeholder='Password']").value;

      if (username && email && password) {
          // Store user credentials in local storage
          localStorage.setItem("user", JSON.stringify({ username, email, password }));
          alert("Account created successfully!");

          // Switch to login form after registration
          loginForm.style.display = "block";
          registerForm.style.display = "none";
      } else {
          alert("Please fill in all fields.");
      }
  });

  // Login button functionality
  document.querySelector(".login-form button").addEventListener("click", function (event) {
      event.preventDefault();
      
      const loginUsername = document.querySelector(".login-form input[placeholder='Username']").value;
      const loginPassword = document.querySelector(".login-form input[placeholder='Password']").value;
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser && storedUser.username === loginUsername && storedUser.password === loginPassword) {
          alert("Login successful!");
          // Redirect or perform any action after successful login
      } else {
          alert("Invalid username or password.");
      }
  });
});






//search form
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".form-control");
  const searchForm = document.querySelector(".d-flex");
  const marketDiv = document.getElementById("market");
  searchForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      const searchTerm = searchInput.value.trim().toLowerCase();
      filterCoins(searchTerm);
  });
  function filterCoins(searchTerm) {
      const coinCards = document.querySelectorAll(".coin-card");
      coinCards.forEach(coinCard => {
          const coinName = coinCard.querySelector("h3").textContent.toLowerCase();
          if (coinName.includes(searchTerm)) {
              coinCard.style.display = "block"; // Show matching coins
          } else {
              coinCard.style.display = "none"; // Hide non-matching coins
          }
      });
  }
});
const marketDiv = document.getElementById("market");
// const favoritesList = document.getElementById("favorites-list");
const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
// // Load favorites from localStorage
// let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
// Fetch and display crypto market
fetch(COINGECKO_API)
  .then((response) => response.json())
  .then((data) => displayCoins(data))
  .catch((error) => console.error("Error fetching data:", error));
function displayCoins(coins) {
  marketDiv.innerHTML = ""; // Clear previous results
  coins.forEach((coin) => {
    const coinCard = document.createElement("div");
    coinCard.className = "coin-card";
    coinCard.innerHTML = `
      <h3>${coin.name}</h3>
      <p>Price: $${coin.current_price.toLocaleString()}</p>
      <button class="toggle-btn">\u25BC Show Graph</button>
      <button class="favorite-btn" data-coin="${coin.id}">⭐</button>
      <div class="chart-container" style="display: none;">
        <canvas id="${coin.id}-chart" width="400" height="200"></canvas>
      </div>
    `;
    // Append coin card to the market div
    marketDiv.appendChild(coinCard);
    // Toggle graph visibility
    const toggleButton = coinCard.querySelector(".toggle-btn");
    const chartContainer = coinCard.querySelector(".chart-container");
    toggleButton.addEventListener("click", () => {
      chartContainer.style.display = chartContainer.style.display === "none" ? "block" : "none";
      if (chartContainer.style.display === "block") {
        showCoinGraph(coin.id, `${coin.id}-chart`);
      }
    });

  function showCoinGraph(coinId, chartId) {
  fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
    .then((response) => response.json())
    .then((data) => {
      const prices = data.prices.map((point) => point[1]);
      const labels = data.prices.map((point) => new Date(point[0]).toLocaleDateString());
      const ctx = document.getElementById(chartId).getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Price (USD)",
              data: prices,
              borderColor: "#007bff",
              fill: false,
            },
          ],
        },
      });
    });
  }
})}  

// added now 
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const toggleLinks = document.querySelectorAll(".message a");
  const loginPage = document.querySelector(".login-page");
  // Create a profile section
  const profileSection = document.createElement("div");
  profileSection.classList.add("profile-page");
  profileSection.style.display = "none"; // Hide initially
  profileSection.innerHTML = `
      <h2>Welcome to Your Profile Page</h2>
      <p>You're successfully logged in!</p>
      <h3>Your Favorite Cryptos</h3>
      <ul id="favorites-list"></ul>
  `;
  loginPage.appendChild(profileSection);
  // Hide register form initially
  registerForm.style.display = "none";
  toggleLinks.forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          if (this.textContent.includes("Create An Account")) {
              loginForm.style.display = "none";
              registerForm.style.display = "block";
          } else {
              loginForm.style.display = "block";
              registerForm.style.display = "none";
          }
      });
  });
  // Function to show profile page and display favorites
  function showProfilePage() {
      loginPage.style.display = "none";
      profileSection.style.display = "block";
      displayFavorites();
  }
  // Function to display favorites
  function displayFavorites() {
      const favoritesList = document.getElementById("favorites-list");
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favoritesList.innerHTML = "";
      favorites.forEach((fav) => {
          const listItem = document.createElement("li");
          listItem.textContent = fav.name;
          favoritesList.appendChild(listItem);
      });
  }
  // Register button functionality
  document.querySelector(".register-form button").addEventListener("click", function (event) {
      event.preventDefault();
      
      const username = document.querySelector(".register-form input[placeholder='Username']").value;
      const email = document.querySelector(".register-form input[placeholder='Email Address']").value;
      const password = document.querySelector(".register-form input[placeholder='Password']").value;
      if (username && email && password) {
          // Store user credentials in local storage
          localStorage.setItem("user", JSON.stringify({ username, email, password }));
          alert("Account created successfully!");
          console.log("Account Created Succesfully");
          // Redirect to profile page
          showProfilePage();
      } else {
          alert("Please fill in all fields.");
      }
  });
  // Login button functionality using Auth0
  document.querySelector(".login-form button").addEventListener("click", function (event) {
      event.preventDefault();
      login();
  });
});              
// Auth0 login function
const login = async () => {
  await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
  });
};










// news api / finnnhub

const apiKey = 'cva6hfhr01qshflgcu1gcva6hfhr01qshflgcu20'; // Replace with your actual API key

// Function to check if the current page is home.html
function isHomePage() {
    return window.location.pathname.includes("home.html");
}

// Run the script only if the user is on home.html
if (isHomePage()) {
    const newsContainer = document.createElement('div');
    newsContainer.id = "crypto-news";
    document.body.appendChild(newsContainer);

    async function fetchCryptoNews() {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/news?category=crypto&token=${apiKey}`);
            const newsData = await response.json();
            
            let newsHTML = '<h2>Latest Crypto News</h2>';
            
            newsData.slice(0, 5).forEach(article => {
                newsHTML += `
                    <div class="news-article">
                        <h3>${article.headline}</h3>
                        <p>${article.summary}</p>
                        <a href="${article.url}" target="_blank">Read More</a>
                    </div>
                    <hr>
                `;
            });

            newsContainer.innerHTML = newsHTML;
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    // Call function on page load
    fetchCryptoNews();
}



const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "cva6hfhr01qshflgcu1gcva6hfhr01qshflgcu20" // Replace this
const finnhubClient = new finnhub.DefaultApi()

// Stock candles
finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, (error, data, response) => {
    console.log(data)
});

//Company News
finnhubClient.companyNews("AAPL", "2020-01-01", "2020-05-01", (error, data, response) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data)
    }
});

// Investor Ownership
let optsLimit = {'limit': 10};
finnhubClient.ownership("AAPL", optsLimit, (error, data, response) => {
    console.log(data)
});

//Aggregate Indicator
finnhubClient.aggregateIndicator("AAPL", "D", (error, data, response) => {
    console.log(data)
});

// Basic financials
finnhubClient.companyBasicFinancials("AAPL", "margin", (error, data, response) => {
    console.log(data)
});

// Company earnings
finnhubClient.companyEarnings("AAPL", {'limit': 10}, (error, data, response) => {
    console.log(data)
});

// Company EPS estimates
finnhubClient.companyEpsEstimates("AAPL", {}, (error, data, response) => {
    console.log(data)
});

// Ebitda Estimates
finnhubClient.companyEbitdaEstimates("AAPL", {"freq": "annual"}, (error, data, response) => {
    console.log(data)
});

// Ebit Estimates
finnhubClient.companyEbitEstimates("AAPL", {"freq": "annual"}, (error, data, response) => {
    console.log(data)
});

// Company executive
finnhubClient.companyExecutive("AAPL", (error, data, response) => {
    console.log(data)
});

// Company peers
finnhubClient.companyPeers("AAPL", (error, data, response) => {
    console.log(data)
});

// Company profile
finnhubClient.companyProfile({'symbol': 'AAPL'}, (error, data, response) => {
    console.log(data)
});
finnhubClient.companyProfile({'isin': 'US0378331005'}, (error, data, response) => {
    console.log(data)
});
finnhubClient.companyProfile({'cusip': '037833100'}, (error, data, response) => {
    console.log(data)
});

//Company profile2
finnhubClient.companyProfile2({'symbol': 'AAPL'}, (error, data, response) => {
    console.log(data)
});

// Revenue Estimates
finnhubClient.companyRevenueEstimates("AAPL", {}, (error, data, response) => {
    console.log(data)
});

// List country
finnhubClient.country((error, data, response) => {
    console.log(data)
});

// Covid-19
finnhubClient.covid19((error, data, response) => {
    console.log(data)
});

// Crypto candles
finnhubClient.cryptoCandles("BINANCE:BTCUSDT", "D", 1590988249, 1591852249, (error, data, response) => {
    console.log(data)
});

// Crypto exchanges
finnhubClient.cryptoExchanges((error, data, response) => {
    console.log(data)
});

//Crypto symbols
finnhubClient.cryptoSymbols("BINANCE", (error, data, response) => {
    console.log(data)
});

// Earnings calendar
finnhubClient.earningsCalendar({"from": "2020-06-01", "to": "2020-06-30"}, (error, data, response) => {
    console.log(data)
});

// Economic code
finnhubClient.economicCode((error, data, response) => {
    console.log(data)
});

// Economic data
finnhubClient.economicData("MA-USA-656880", (error, data, response) => {
    console.log(data)
});

// Filings
finnhubClient.filings({"symbol": "AAPL"}, (error, data, response) => {
    console.log(data)
});

//Financials
finnhubClient.financials("AAPL", "ic", "annual", (error, data, response) => {
    console.log(data)
});

// Financials Reported
finnhubClient.financialsReported({"symbol": "AAPL"}, (error, data, response) => {
    console.log(data)
});

// Forex candles
finnhubClient.forexCandles("OANDA:EUR_USD", "D", 1590988249, 1591852249, (error, data, response) => {
    console.log(data)
});

// Forex exchanges
finnhubClient.forexExchanges((error, data, response) => {
    console.log(data)
});

// Forex rates
finnhubClient.forexRates({"base": "USD"}, (error, data, response) => {
    console.log(data)
});

// Forex symbols
finnhubClient.forexSymbols("OANDA", (error, data, response) => {
    console.log(data)
});

//Fund ownership
finnhubClient.fundOwnership("AAPL", {'limit': 10}, (error, data, response) => {
    console.log(data)
});

// General news
finnhubClient.marketNews("general", {}, (error, data, response) => {
    console.log(data)
});

// Ipo calendar
finnhubClient.ipoCalendar("2020-01-01", "2020-06-15", (error, data, response) => {
    console.log(data)
});

//Major development
finnhubClient.pressReleases("AAPL", {}, (error, data, response) => {
    console.log(data)
});

// News sentiment
finnhubClient.newsSentiment("AAPL", (error, data, response) => {
    console.log(data)
});

// Pattern recognition
finnhubClient.patternRecognition("AAPL", "D", (error, data, response) => {
    console.log(data)
});

// Price target
finnhubClient.priceTarget("AAPL", (error, data, response) => {
    console.log(data)
});

//Quote
finnhubClient.quote("AAPL", (error, data, response) => {
    console.log(data)
});

// Recommendation trends
finnhubClient.recommendationTrends("AAPL", (error, data, response) => {
    console.log(data)
});

// Stock dividends
finnhubClient.stockDividends("KO", "2019-01-01", "2020-06-30", (error, data, response) => {
    console.log(data)
});

// Splits
finnhubClient.stockSplits("AAPL", "2000-01-01", "2020-06-15", (error, data, response) => {
    console.log(data)
});

// Stock symbols
finnhubClient.stockSymbols("US", (error, data, response) => {
    console.log(data)
});

// Support resistance
finnhubClient.supportResistance("AAPL", "D", (error, data, response) => {
    console.log(data)
});

// Technical indicator
finnhubClient.technicalIndicator("AAPL", "D", 1580988249, 1591852249, "macd", {}, (error, data, response) => {
    console.log(data)
});

// Transcripts
finnhubClient.transcripts("AAPL_162777", (error, data, response) => {
    console.log(data)
});

// Transcripts list
finnhubClient.transcriptsList("AAPL", (error, data, response) => {
    console.log(data)
});

// Upgrade/downgrade
finnhubClient.upgradeDowngrade({"symbol": "AAPL"}, (error, data, response) => {
    console.log(data)
});

// Tick Data
finnhubClient.stockTick("AAPL", "2020-03-25", 500, 0, (error, data, response) => {
    console.log(data);
});

// Indices Constituents
finnhubClient.indicesConstituents("^GSPC", (error, data, response) => {
    console.log(data);
});

// Indices Historical Constituents
finnhubClient.indicesHistoricalConstituents("^GSPC", (error, data, response) => {
    console.log(data);
});

// ETFs Profile
finnhubClient.etfsProfile({'symbol': 'SPY'}, (error, data, response) => {
    console.log(data);
});

// ETFs Holdings
finnhubClient.etfsHoldings({'symbol': 'ARKK'}, (error, data, response) => {
    console.log(data);
});

// ETFs Industry Exposure
finnhubClient.etfsSectorExposure('SPY', (error, data, response) => {
    console.log(data);
});

// ETFs Country Exposure
finnhubClient.etfsCountryExposure('SPY', (error, data, response) => {
    console.log(data);
});

// Mutual Funds Profile
finnhubClient.mutualFundProfile({'symbol': 'VTSAX'}, (error, data, response) => {
    console.log(data);
});

// Mutual Funds Holdings
finnhubClient.mutualFundHoldings({'symbol': 'VTSAX'}, (error, data, response) => {
    console.log(data);
});

// Mutual Funds Industry Exposure
finnhubClient.mutualFundSectorExposure('VTSAX', (error, data, response) => {
    console.log(data);
});

// Mutual Funds Country Exposure
finnhubClient.mutualFundCountryExposure('VTSAX', (error, data, response) => {
    console.log(data);
});

// Insider Transactions
finnhubClient.insiderTransactions('AAPL', (error, data, response) => {
    console.log(data);
});

// Revenue Breakdown
finnhubClient.revenueBreakdown({'symbol': 'AAPL'}, (error, data, response) => {
    console.log(data);
});

// Social Sentiment
finnhubClient.socialSentiment('GME', (error, data, response) => {
    console.log(data);
});

// Investment Theme
finnhubClient.investmentThemes('financialExchangesData', (error, data, response) => {
    console.log(data);
});

// Supply Chain
finnhubClient.supplyChainRelationships('AAPL', (error, data, response) => {
    console.log(data);
});

// Company ESG
finnhubClient.companyEsgScore('AAPL', (error, data, response) => {
    console.log(data);
});

// Company Earnings Quality Score
finnhubClient.companyEarningsQualityScore('AAPL', 'quarterly', (error, data, response) => {
    console.log(data);
});

// Crypto Profile
finnhubClient.cryptoProfile('BTC', (error, data, response) => {
    console.log(data);
});

// USPO Patent
finnhubClient.stockUsptoPatent('NVDA', '2021-01-01', '2021-12-31', (error, data, response) => {
    console.log(data);
});

// Visa Application
finnhubClient.stockVisaApplication('AAPL', '2021-01-01', '2021-12-31', (error, data, response) => {
    console.log(data);
});