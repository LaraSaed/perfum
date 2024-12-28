
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
  
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
  
      clearErrors();
  
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const mobile = document.getElementById('mobile').value.trim();
      const address = document.getElementById('address').value.trim();
      const age = document.getElementById('age').value.trim();
      const hobbies = document.getElementById('hobbies').value.trim();
      const country = document.getElementById('country').value;
      const message = document.getElementById('message').value.trim();
  
      let isValid = true;
  
      if (firstName.length < 2) {
        showError('firstNameError');
        isValid = false;
      }
  
      if (lastName.length < 2) {
        showError('lastNameError');
        isValid = false;
      }
  
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError('emailError');
        isValid = false;
      }
  
      const mobilePattern = /^[0-9]{10}$/; 
      if (!mobilePattern.test(mobile)) {
        showError('mobileError');
        isValid = false;
      }
  
      if (address.length < 5) {
        showError('addressError');
        isValid = false;
      }
  
      const numericAge = parseInt(age, 10);
      if (isNaN(numericAge) || numericAge < 1 || numericAge > 120) {
        showError('ageError');
        isValid = false;
      }
  
      if (hobbies.length < 3) {
        showError('hobbiesError');
        isValid = false;
      }
  
      if (country === "") {
        showError('countryError');
        isValid = false;
      }
  
      if (message.length < 10) {
        showError('messageError');
        isValid = false;
      }
  
      if (isValid) {
        
        alert("Thank you for contacting us!\nWe will get back to you shortly.");
        
        contactForm.reset();
      }
    });
  
    function showError(elementId) {
      const errorElement = document.getElementById(elementId);
      if (errorElement) {
        errorElement.style.display = 'block';
      }
    }
  
    function clearErrors() {
      const errorElements = document.querySelectorAll('.error');
      errorElements.forEach(el => { el.style.display = 'none'; });
    }
  });
  