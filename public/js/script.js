let counter = 1;

setInterval(() => {
  document.getElementById('radio' + counter).checked = true;
  counter++;
  if (counter > 4) {
    counter = 1;
  }
}, 4000); // Change every 4 seconds
