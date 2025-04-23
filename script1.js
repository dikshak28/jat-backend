  $(document).ready(function(){
  $(window).scroll(function(){
  if($(window).scrollTop() > 60 ){
  $('.my-navbar').addClass('navbar-scroll');
  }
  else{
  $('.my-navbar').removeClass('navbar-scroll');
  }
  });
  });
  // Get the API URL from the config (fallback to localhost if config not loaded)
  const apiBaseUrl = window.appConfig ? window.appConfig.API_BASE_URL : 'https://jat-backend.vercel.app';
  const apiUrl = `${apiBaseUrl}/`;
  
  // Log the request URL
  console.log('📤 Sending request to:', apiUrl);
  
  // Create a status element to show connection status
  const statusElement = document.createElement('div');
  statusElement.style.position = 'fixed';
  statusElement.style.bottom = '10px';
  statusElement.style.right = '10px';
  statusElement.style.padding = '5px 10px';
  statusElement.style.borderRadius = '5px';
  statusElement.style.fontSize = '12px';
  statusElement.style.color = '#fff';
  statusElement.style.zIndex = '9999';
  
  // Add the element to the body
  document.body.appendChild(statusElement);
  
  // Update status function
  function updateStatus(isConnected, message) {
    statusElement.textContent = message;
    statusElement.style.backgroundColor = isConnected ? '#28a745' : '#dc3545';
    // Hide after 5 seconds
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 5000);
  }
  
  // Make the API call with better error handling
  fetch(apiUrl) // Uses dynamic API URL based on environment
  .then(response => {
    if (!response.ok) {
      console.error('❌ Error response:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    console.log("✅ Response from backend:", data);
    updateStatus(true, `Connected to ${apiBaseUrl}`);
  })
  .catch(error => {
    console.error("❌ Error fetching data:", error.message);
    updateStatus(false, `Failed to connect to ${apiBaseUrl}`);
  });
