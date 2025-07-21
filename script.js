const addressInput = document.getElementById('addressInput');
const dropdown = document.getElementById('dropdown');
const validateBtn = document.getElementById('validateBtn');
const validationMessage = document.getElementById('validationMessage');

let timeout = null;

addressInput.addEventListener('input', function () {
  clearTimeout(timeout);

  validationMessage.textContent = '';

  const query = addressInput.value.trim();
  if (!query) {
    dropdown.style.display = 'none';
    return;
  }

  timeout = setTimeout(() => {
    fetchCompletions(query);
  }, 300); // Debounce 300ms
});

async function fetchCompletions(query) {
  const requestData = {
    q: query
  };

  try {
    const response = await fetch('https://dr238d0s7i.execute-api.ap-southeast-2.amazonaws.com/dev/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    showDropdown(data.completions || []);
  } catch (error) {
    console.error('Error fetching completions:', error);
  }
}

function showDropdown(completions) {
  dropdown.innerHTML = '';
  if (completions.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  completions.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.a;
    div.addEventListener('click', () => {
      addressInput.value = item.a;
      dropdown.style.display = 'none';
    });
    dropdown.appendChild(div);
  });

  dropdown.style.display = 'block';
}

validateBtn.addEventListener('click', async function () {
  const address = addressInput.value.trim();
  if (!address) {
    validationMessage.textContent = 'Please enter an address';
    validationMessage.style.color = 'red';
    return;
  }


  const requestData = { q: address };

  try {
    const response = await fetch('https://dr238d0s7i.execute-api.ap-southeast-2.amazonaws.com/dev/verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (data.matched === true) {
      validationMessage.textContent = '✅ Valid address!';
      validationMessage.style.color = 'limegreen';
    } else {
      validationMessage.textContent = '❌ Not a valid address';
      validationMessage.style.color = 'crimson';
    }
  } catch (error) {
    console.error('Error validating address:', error);
    validationMessage.textContent = '⚠️ Validation failed. Please try again later.';
    validationMessage.style.color = 'orange';
  }
});

// Hide dropdown if clicking outside input or dropdown
document.addEventListener('click', (event) => {
  const isClickInside = addressInput.contains(event.target) || dropdown.contains(event.target);
  if (!isClickInside) {
    dropdown.style.display = 'none';
  }
});

