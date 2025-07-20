const addressInput = document.getElementById('addressInput');
const dropdown = document.getElementById('dropdown');
const validateBtn = document.getElementById('validateBtn');

let timeout = null;

addressInput.addEventListener('input', function () {
  clearTimeout(timeout);

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
    key: "VXCBGN3KRH7ELMA6YJP9",
    secret: "C9FDAYQTHULJ6KMXEV8G",
    q: query,
    format: "json",
    delivered: "",
    post_box: "",
    rural: "",
    strict: "",
    region_code: "",
    domain: "",
    max: "",
    highlight: "",
    ascii: ""
  };

  try {
    const response = await fetch('https://17iq97ykse.execute-api.ap-southeast-2.amazonaws.com/dev/autocomplete', {
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
    alert('Please enter an address');
    return;
  }

  const requestData = {
    key: "VXCBGN3KRH7ELMA6YJP9",
    secret: "C9FDAYQTHULJ6KMXEV8G",
    format: "json",
    q: address,
    post_box: "0",
    region_code: "1",
    census: "2018",
    domain: "",
    ascii: "1"
  };

  try {
    const response = await fetch('https://17iq97ykse.execute-api.ap-southeast-2.amazonaws.com/dev/verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    alert(`Matched: ${data.matched}, Success: ${data.success}`);
  } catch (error) {
    console.error('Error validating address:', error);
  }
});
