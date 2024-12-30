let cookieCount = 0;

// Add click event listener to the cookie image
document.getElementById("cookie").addEventListener("click", () => {
  cookieCount++;
  document.getElementById("cookie-count").textContent = cookieCount;
});