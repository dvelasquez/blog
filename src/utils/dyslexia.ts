document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-font');
  const isDyslexiaFont = localStorage.getItem('dyslexiaFont') === 'true';

  if (isDyslexiaFont) {
    document.body.classList.add('dyslexia-font');
  }

  toggleButton?.addEventListener('click', function () {
    document.body.classList.toggle('dyslexia-font');
    if (isDyslexiaFont) {
      localStorage.setItem('dyslexiaFont', 'false');
    } else {
      localStorage.setItem('dyslexiaFont', 'true');
    }
  });
});