const seedVehicles = [
  { id: 'toyota-premio', name: 'Toyota Premio', type: 'sedan', seats: 5, luggage: '2 large bags', transmission: 'Automatic', driver: 'Available on request', bestFor: 'Airport pickups and easy city days', price: 145000, available: true, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'], features: 'Fuel efficient · Bluetooth' },
  { id: 'toyota-fielder', name: 'Toyota Fielder', type: 'sedan', seats: 5, luggage: '3 large bags', transmission: 'Automatic', driver: 'Available on request', bestFor: 'Kampala errands with extra boot space', price: 125000, available: true, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'], features: 'Large boot · Bluetooth' },
  { id: 'mazda-cx5', name: 'Mazda CX-5', type: 'suv', seats: 5, luggage: '3 large bags', transmission: 'Automatic', driver: 'Available on request', bestFor: 'Family trips and mixed road conditions', price: 220000, available: true, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'], features: 'Cruise control · AWD' },
  { id: 'toyota-rav4', name: 'Toyota RAV4', type: 'suv', seats: 5, luggage: '3 large bags', transmission: 'Automatic', driver: 'Available on request', bestFor: 'Weekend getaways with the family', price: 195000, available: true, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80'], features: 'Apple CarPlay · AWD' },
  { id: 'toyota-hiace', name: 'Toyota Hiace', type: 'van', seats: 14, luggage: '8 large bags', transmission: 'Manual', driver: 'Driver recommended', bestFor: 'Friends, teams, and small group tours', price: 350000, available: true, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464219782431-426ba794f59b?auto=format&fit=crop&w=1200&q=80'], features: '14 seats · Spacious' },
  { id: 'toyota-coaster', name: 'Toyota Coaster', type: 'van', seats: 22, luggage: '14 large bags', transmission: 'Manual', driver: 'Driver required', bestFor: 'Large groups, church trips, and events', price: 480000, available: false, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'], features: '22 seats · Group travel' }
];

const typeLabels = { sedan: 'Sedans', suv: 'SUVs', van: 'Vans' };
const typeHints = {
  sedan: 'A calm choice for airport pickups and city travel.',
  suv: 'Extra room when the family or bags come along.',
  van: 'For friends, teams, and larger groups.'
};
const storageKeys = { vehicles: 'esrom-ridez-vehicles', bookings: 'esrom-ridez-bookings' };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ugx = new Intl.NumberFormat('en-UG');
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let extras = { driverDaily: 80000, childSeat: 20000, oneWay: 50000 };
let vehicles = mergeVehicles(readStorage(storageKeys.vehicles, seedVehicles));
let bookings = readStorage(storageKeys.bookings, []);
let activeFilter = 'all';
let apiReady = false;
let adminKey = sessionStorage.getItem('esrom-admin-key') || '';

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function saveStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function mergeVehicles(stored) {
  const list = Array.isArray(stored) ? stored : [];
  return seedVehicles.map((seed) => {
    const found = list.find((item) => item.id === seed.id);
    if (!found) return structuredClone(seed);
    return {
      ...structuredClone(seed),
      price: Number(found.price) > 0 ? Number(found.price) : seed.price,
      available: typeof found.available === 'boolean' ? found.available : seed.available
    };
  });
}
function formatUGX(value) { return `UGX ${ugx.format(value)}`; }
function formatDate(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }); }
function rentalDays(start, end) { return Math.max(1, Math.ceil((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000)); }
function showToast(message, kind = '') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.toggle('error', kind === 'error');
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 5200);
}
function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
function vehicleImages(vehicle) { return vehicle.images?.length ? vehicle.images : [vehicle.image]; }

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (adminKey) headers['x-admin-key'] = adminKey;
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.');
    error.payload = data;
    error.status = response.status;
    throw error;
  }
  return data;
}

function quoteFromForm(vehicle, form) {
  const start = form.pickupDate?.value;
  const end = form.returnDate?.value;
  const days = start && end && end >= start ? rentalDays(start, end) : 1;
  const driverRequired = vehicle.driver === 'Driver required';
  const includeDriver = driverRequired || Boolean(form.includeDriver?.checked);
  const includeChildSeat = Boolean(form.includeChildSeat?.checked);
  const oneWay = form.pickupLocation?.value !== form.returnLocation?.value;
  const vehicleSubtotal = days * vehicle.price;
  const driverTotal = includeDriver ? days * extras.driverDaily : 0;
  const childSeatTotal = includeChildSeat ? extras.childSeat : 0;
  const oneWayTotal = oneWay ? extras.oneWay : 0;
  return { days, vehicleSubtotal, includeDriver, driverTotal, includeChildSeat, childSeatTotal, oneWay, oneWayTotal, total: vehicleSubtotal + driverTotal + childSeatTotal + oneWayTotal };
}

function renderFleet() {
  const seats = $('#seatFilter')?.value || 'all';
  const maxPrice = Number($('#priceFilter')?.value || 0);
  const filtered = vehicles.filter((vehicle) => (
    (activeFilter === 'all' || vehicle.type === activeFilter)
    && (seats === 'all' || vehicle.seats >= Number(seats))
    && (!maxPrice || vehicle.price <= maxPrice)
  ));
  $('#resultCount').textContent = `${filtered.length} car${filtered.length === 1 ? '' : 's'} found`;
  $$('.filter-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.filter === activeFilter));
  if (!filtered.length) {
    $('#vehicleGrid').innerHTML = '<div class="empty-state">No cars match those filters. Try widening your search.</div>';
    return;
  }
  const groups = activeFilter === 'all' ? ['sedan', 'suv', 'van'] : [activeFilter];
  $('#vehicleGrid').innerHTML = groups.map((type) => {
    const items = filtered.filter((vehicle) => vehicle.type === type);
    if (!items.length) return '';
    return `<section class="fleet-group"><div class="fleet-group-head"><h3>${typeLabels[type]}</h3><p>${typeHints[type]}</p></div><div class="vehicle-grid">${items.map(vehicleCard).join('')}</div></section>`;
  }).join('');
}

function vehicleCard(vehicle) {
  return `<article class="vehicle-card" data-open="${vehicle.id}">
    <div class="vehicle-image"><img src="${vehicle.image}" alt="${vehicle.name}"><span class="vehicle-type">${vehicle.type}</span>${!vehicle.available ? '<span class="unavailable">Currently unavailable</span>' : ''}</div>
    <div class="vehicle-info">
      <div class="vehicle-name-row"><h3>${vehicle.name}</h3><div class="vehicle-price">${formatUGX(vehicle.price)}<small>per day</small></div></div>
      <p class="best-for">${vehicle.bestFor}</p>
      <div class="specs"><span>${vehicle.seats} seats</span><span>${vehicle.luggage}</span><span>${vehicle.transmission}</span><span>${vehicle.driver}</span></div>
      <div class="card-bottom"><span class="feature-line">${vehicle.features}</span><button class="card-button" type="button" data-open="${vehicle.id}" ${!vehicle.available ? 'disabled' : ''}>${vehicle.available ? 'See details ↗' : 'Unavailable'}</button></div>
    </div>
  </article>`;
}

function openDetails(vehicleId) {
  const vehicle = vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) return;
  if (!vehicle.available) return showToast('This car is currently unavailable. Pick another one, or write to us and we will help.', 'error');
  const images = vehicleImages(vehicle);
  const driverRequired = vehicle.driver === 'Driver required';
  $('#modalContent').innerHTML = `
    <div class="details-layout">
      <div>
        <div class="gallery" data-gallery>
          ${images.map((src, index) => `<img class="gallery-slide${index === 0 ? ' active' : ''}" src="${src}" alt="${vehicle.name}, photo ${index + 1}">`).join('')}
          ${images.length > 1 ? `<button type="button" class="gallery-nav prev" aria-label="Previous photo">‹</button><button type="button" class="gallery-nav next" aria-label="Next photo">›</button><div class="gallery-dots">${images.map((_, index) => `<button type="button" class="gallery-dot${index === 0 ? ' active' : ''}" data-dot="${index}" aria-label="Show photo ${index + 1}"></button>`).join('')}</div>` : ''}
        </div>
        <p class="eyebrow">${typeLabels[vehicle.type]} · Uganda</p>
        <h2 id="modalTitle">${vehicle.name}</h2>
        <p class="modal-intro">${vehicle.bestFor}. ${vehicle.seats} seats · ${vehicle.luggage} · ${vehicle.transmission}.</p>
        <p class="details-price"><strong>${formatUGX(vehicle.price)}</strong><span>daily rate, UGX</span></p>
        <div class="specs details-specs"><span>${vehicle.seats} seats</span><span>${vehicle.luggage}</span><span>${vehicle.transmission}</span><span>${vehicle.driver}</span></div>
      </div>
      <form class="booking-form" id="bookingForm">
        <div class="form-grid">
          <label>Full name<input name="name" required placeholder="Your name" autocomplete="name"></label>
          <label>Email address<input name="email" type="email" required placeholder="you@example.com" autocomplete="email"></label>
        </div>
        <div class="form-grid">
          <label>Phone number<input name="phone" type="tel" required placeholder="+256 700 000 000"></label>
          <label>Pickup location<select name="pickupLocation"><option>Kampala</option><option>Entebbe</option><option>Jinja</option></select></label>
        </div>
        <div class="form-grid">
          <label>Pickup date<input name="pickupDate" id="pickupDate" type="date" required></label>
          <label>Pickup time<input name="pickupTime" type="time" value="09:00" required></label>
        </div>
        <div class="form-grid">
          <label>Return date<input name="returnDate" id="returnDate" type="date" required></label>
          <label>Return time<input name="returnTime" type="time" value="17:00" required></label>
        </div>
        <label>Return location<select name="returnLocation"><option>Kampala</option><option>Entebbe</option><option>Jinja</option></select></label>
        <label>Anything we should know?<textarea name="requests" rows="3" placeholder="Flight number, child seat colour, extra stops..."></textarea></label>
        <div class="extras">
          <label class="check"><input type="checkbox" name="includeDriver" ${driverRequired ? 'checked disabled' : ''}> ${driverRequired ? `A driver is included for the ${vehicle.name}` : 'Add a driver'} — ${formatUGX(extras.driverDaily)} per day</label>
          <label class="check"><input type="checkbox" name="includeChildSeat"> Add a child seat — ${formatUGX(extras.childSeat)} for the trip</label>
        </div>
        <div class="price-note"><strong>What you are sending</strong><span>This is a request, not a confirmed booking. We email you a copy straight away, check the dates, then write again to confirm or suggest another car. Fuel and any deposit are agreed before pickup.</span></div>
        <div class="estimate-lines" id="estimateLines"></div>
        <div class="booking-summary"><div><small>Estimated total (UGX)</small><strong id="estimate"></strong></div><small id="dayEstimate"></small></div>
        <button class="button button-accent" type="submit" id="submitBooking">Send booking request <span>↗</span></button>
        <p class="form-note">After you send this, look for an email from Esrom Ridez with your booking reference, the exact car name, dates, locations, and this estimate.</p>
      </form>
    </div>`;
  openModal();
  bindGallery($('[data-gallery]'));
  const today = new Date().toISOString().split('T')[0];
  const searchPickup = $('#searchPickup')?.value;
  const searchStart = $('#searchPickupDate')?.value;
  const searchEnd = $('#searchReturnDate')?.value;
  $('#pickupDate').min = today;
  $('#returnDate').min = today;
  if (searchPickup) $('#bookingForm [name="pickupLocation"]').value = searchPickup;
  if (searchPickup) $('#bookingForm [name="returnLocation"]').value = searchPickup;
  if (searchStart) $('#pickupDate').value = searchStart;
  if (searchEnd) $('#returnDate').value = searchEnd;
  const form = $('#bookingForm');
  const refresh = () => updateEstimate(vehicle, form);
  ['change', 'input'].forEach((eventName) => form.addEventListener(eventName, refresh));
  $('#pickupDate').addEventListener('change', () => { $('#returnDate').min = $('#pickupDate').value; refresh(); });
  form.addEventListener('submit', (event) => submitBooking(event, vehicle));
  refresh();
}

function updateEstimate(vehicle, form) {
  const quote = quoteFromForm(vehicle, form);
  $('#estimateLines').innerHTML = `
    <div><span>Daily rate for the ${vehicle.name}</span><strong>${formatUGX(vehicle.price)}</strong></div>
    <div><span>Vehicle × ${quote.days} day${quote.days === 1 ? '' : 's'}</span><strong>${formatUGX(quote.vehicleSubtotal)}</strong></div>
    ${quote.includeDriver ? `<div><span>Driver × ${quote.days} day${quote.days === 1 ? '' : 's'}</span><strong>${formatUGX(quote.driverTotal)}</strong></div>` : ''}
    ${quote.includeChildSeat ? `<div><span>Child seat</span><strong>${formatUGX(quote.childSeatTotal)}</strong></div>` : ''}
    ${quote.oneWay ? `<div><span>Different return location</span><strong>${formatUGX(quote.oneWayTotal)}</strong></div>` : '<div><span>Return to the same location</span><strong>UGX 0</strong></div>'}`;
  $('#estimate').textContent = formatUGX(quote.total);
  $('#dayEstimate').textContent = `${quote.days} rental day${quote.days === 1 ? '' : 's'}`;
}

function bindGallery(root) {
  if (!root) return;
  const slides = [...root.querySelectorAll('.gallery-slide')];
  const dots = [...root.querySelectorAll('.gallery-dot')];
  if (slides.length < 2) return;
  let index = 0;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  root.querySelector('.prev')?.addEventListener('click', (event) => { event.preventDefault(); show(index - 1); });
  root.querySelector('.next')?.addEventListener('click', (event) => { event.preventDefault(); show(index + 1); });
  dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.dot))));
}

function openModal() {
  const backdrop = $('#modalBackdrop');
  backdrop.classList.remove('closing');
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => backdrop.classList.add('shown'));
}
function closeModal() {
  const backdrop = $('#modalBackdrop');
  backdrop.classList.remove('shown');
  backdrop.setAttribute('aria-hidden', 'true');
  if (reduceMotion) {
    backdrop.classList.remove('open', 'closing');
    return;
  }
  backdrop.classList.add('closing');
  setTimeout(() => backdrop.classList.remove('open', 'closing'), 280);
}

async function submitBooking(event, vehicle) {
  event.preventDefault();
  const form = event.currentTarget;
  const pickupDate = form.pickupDate.value;
  const returnDate = form.returnDate.value;
  if (returnDate < pickupDate) return showToast('Return date must be on or after pickup date.', 'error');
  const payload = {
    vehicleId: vehicle.id,
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    pickupDate,
    returnDate,
    pickupTime: form.pickupTime.value,
    returnTime: form.returnTime.value,
    pickupLocation: form.pickupLocation.value,
    returnLocation: form.returnLocation.value,
    requests: form.requests.value.trim(),
    includeDriver: vehicle.driver === 'Driver required' || form.includeDriver.checked,
    includeChildSeat: form.includeChildSeat.checked
  };
  const button = $('#submitBooking');
  button.disabled = true;
  button.textContent = 'Sending request…';
  try {
    if (!apiReady) throw new Error('The booking service is not running. Start the Esrom Ridez server, then try again. Your email has not been sent.');
    const result = await api('/api/bookings', { method: 'POST', body: JSON.stringify(payload) });
    if (!result.emailSent) throw new Error(result.error || 'The email did not send.');
    bookings = [result.booking, ...bookings.filter((item) => item.reference !== result.booking.reference)];
    saveStorage(storageKeys.bookings, bookings);
    showBookingConfirmation(result.booking, result.previews, true);
    renderAdmin();
  } catch (error) {
    const saved = error.payload?.booking;
    if (saved) {
      bookings = [saved, ...bookings.filter((item) => item.reference !== saved.reference)];
      saveStorage(storageKeys.bookings, bookings);
      showBookingConfirmation(saved, null, false, error.message);
      renderAdmin();
    } else {
      showToast(error.message, 'error');
      button.disabled = false;
      button.innerHTML = 'Send booking request <span>↗</span>';
    }
  }
}

function showBookingConfirmation(booking, previews, emailSent, errorMessage) {
  const previewLink = previews?.customer
    ? `<p class="form-note">Test inbox preview: <a href="${previews.customer}" target="_blank" rel="noopener">open the message we just sent</a></p>`
    : '';
  $('#modalContent').innerHTML = `
    <p class="eyebrow">${emailSent ? 'Request received' : 'Request saved'}</p>
    <h2 id="modalTitle">${emailSent ? `Thanks, ${booking.name.split(' ')[0]}.` : 'We could not email you yet.'}</h2>
    <p class="modal-intro">${emailSent
      ? 'A confirmation email is on its way with this reference. We will check the dates and write again when the booking is confirmed or if we need to suggest another car — usually within one business day.'
      : errorMessage}</p>
    <div class="confirmation-card">
      <strong>${booking.reference}</strong>
      <span>${booking.vehicleName}</span>
      <span>${formatDate(booking.pickupDate)} to ${formatDate(booking.returnDate)} · ${booking.pickupLocation} → ${booking.returnLocation}</span>
      <strong>${formatUGX(booking.total)} estimated total</strong>
    </div>
    ${previewLink}
    <p class="form-note">${emailSent
      ? 'If the email is not in your inbox, check spam, then reply to hello@esromridez.ug with this reference.'
      : 'Please call +256 704 221 808 and quote the reference. We have not claimed that an email was sent.'}</p>
    <button class="button button-dark" id="doneConfirmation" type="button">Done</button>`;
  openModal();
  $('#doneConfirmation').addEventListener('click', closeModal);
  if (emailSent) showToast(`Request ${booking.reference} received. Check your email for the ${booking.vehicleName}.`);
  else showToast(errorMessage, 'error');
}

function renderAdmin() {
  $('#vehicleTable').innerHTML = vehicles.map((vehicle) => `<tr><td><strong>${vehicle.name}</strong></td><td>${vehicle.type}</td><td><input type="number" value="${vehicle.price}" data-price="${vehicle.id}" aria-label="${vehicle.name} daily price"></td><td class="${vehicle.available ? 'availability' : 'availability off'}">${vehicle.available ? 'Available' : 'Unavailable'}</td><td><button class="small-button" data-availability="${vehicle.id}">${vehicle.available ? 'Set unavailable' : 'Set available'}</button></td></tr>`).join('');
  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;
  $('#adminStats').innerHTML = `<div class="stat"><strong>${pending}</strong><small>Pending requests</small></div><div class="stat"><strong>${confirmed}</strong><small>Confirmed bookings</small></div><div class="stat"><strong>${vehicles.filter((vehicle) => vehicle.available).length}/${vehicles.length}</strong><small>Cars available</small></div>`;
  $('#bookingList').innerHTML = bookings.length
    ? bookings.slice().reverse().map((booking) => `<div class="booking-row"><div><strong>${booking.reference} · ${booking.name}</strong><small>${booking.vehicleName} · ${formatDate(booking.pickupDate)} to ${formatDate(booking.returnDate)} · ${formatUGX(booking.total)}</small></div><div class="booking-actions"><span class="status ${booking.status}">${booking.status}</span>${booking.status === 'pending' ? `<button class="small-button" data-status="confirmed" data-reference="${booking.reference}">Confirm</button><button class="small-button" data-status="cancelled" data-reference="${booking.reference}">Cancel</button>` : ''}</div></div>`).join('')
    : '<p class="modal-intro">No booking requests yet.</p>';
}

async function loadFromServer() {
  try {
    const fleet = await api('/api/fleet');
    vehicles = mergeVehicles(fleet.vehicles);
    extras = fleet.extras || extras;
    saveStorage(storageKeys.vehicles, vehicles);
    const bookingData = await api('/api/bookings');
    bookings = bookingData.bookings || [];
    saveStorage(storageKeys.bookings, bookings);
    apiReady = true;
  } catch (error) {
    apiReady = false;
    console.warn('Running from saved cars only. Start the server to send booking emails.', error.message);
  }
  renderFleet();
  renderAdmin();
}

$$('.filter-tab').forEach((tab) => tab.addEventListener('click', () => { activeFilter = tab.dataset.filter; renderFleet(); }));
$('#seatFilter').addEventListener('change', renderFleet);
$('#priceFilter').addEventListener('input', renderFleet);
$('#filterToggle').addEventListener('click', () => $('#advancedFilters').classList.toggle('visible'));
$('#vehicleGrid').addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (opener && !event.target.closest('button:disabled')) openDetails(opener.dataset.open);
});
$('#closeModal').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', (event) => { if (event.target.id === 'modalBackdrop') closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
$$('[data-scroll]').forEach((button) => button.addEventListener('click', () => scrollToId(button.dataset.scroll)));
$('#searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const start = $('#searchPickupDate').value;
  const end = $('#searchReturnDate').value;
  if (end < start) return showToast('Return date must be after pickup date.', 'error');
  scrollToId('fleet');
  showToast(`Showing cars for ${$('#searchPickup').value}, ${formatDate(start)} to ${formatDate(end)}.`);
});
$('#contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    await api('/api/contact', { method: 'POST', body: JSON.stringify({ name: form.name.value, email: form.email.value, message: form.message.value }) });
    form.reset();
    showToast('Thanks. Your message has been emailed to the Esrom Ridez team.');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    button.disabled = false;
  }
});
$('#openAdmin').addEventListener('click', () => {
  if (!adminKey) {
    const entered = window.prompt('Staff key (leave blank if none is set on the server):', adminKey) || '';
    adminKey = entered;
    sessionStorage.setItem('esrom-admin-key', adminKey);
  }
  $('#adminView').classList.add('active');
  $('#adminView').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  loadFromServer();
});
$('#closeAdmin').addEventListener('click', () => { $('#adminView').classList.remove('active'); scrollToId('home'); });
$('#vehicleTable').addEventListener('change', async (event) => {
  const input = event.target.closest('[data-price]');
  if (!input) return;
  const vehicle = vehicles.find((item) => item.id === input.dataset.price);
  const price = Number(input.value);
  if (!vehicle || !(price > 0)) return;
  try {
    await api(`/api/vehicles/${vehicle.id}`, { method: 'PATCH', body: JSON.stringify({ price }) });
    vehicle.price = price;
    saveStorage(storageKeys.vehicles, vehicles);
    renderFleet();
    showToast(`${vehicle.name} updated to ${formatUGX(price)} per day.`);
  } catch (error) {
    showToast(error.message, 'error');
  }
});
$('#vehicleTable').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-availability]');
  if (!button) return;
  const vehicle = vehicles.find((item) => item.id === button.dataset.availability);
  try {
    const result = await api(`/api/vehicles/${vehicle.id}`, { method: 'PATCH', body: JSON.stringify({ available: !vehicle.available }) });
    vehicle.available = result.vehicle.available;
    saveStorage(storageKeys.vehicles, vehicles);
    renderFleet();
    renderAdmin();
  } catch (error) {
    showToast(error.message, 'error');
  }
});
$('#bookingList').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-status]');
  if (!button) return;
  try {
    const result = await api(`/api/bookings/${button.dataset.reference}`, { method: 'PATCH', body: JSON.stringify({ status: button.dataset.status }) });
    const booking = bookings.find((item) => item.reference === button.dataset.reference);
    if (booking) booking.status = result.booking.status;
    saveStorage(storageKeys.bookings, bookings);
    renderAdmin();
    if (!result.emailSent) showToast(result.error || 'Status saved, but the customer email did not send.', 'error');
    else showToast(`${result.booking.reference} marked ${result.booking.status}. The customer has been emailed about the ${result.booking.vehicleName}.`);
  } catch (error) {
    showToast(error.message, 'error');
  }
});
$('#resetData').addEventListener('click', async () => {
  try {
    const result = await api('/api/reset', { method: 'POST' });
    vehicles = mergeVehicles(result.vehicles);
    bookings = result.bookings || [];
    saveStorage(storageKeys.vehicles, vehicles);
    saveStorage(storageKeys.bookings, bookings);
    renderFleet();
    renderAdmin();
    showToast('Demo data reset.');
  } catch (error) {
    showToast(error.message, 'error');
  }
});
$('#menuButton').addEventListener('click', () => {
  const nav = $('.main-nav');
  const open = nav.classList.toggle('open');
  $('#menuButton').setAttribute('aria-expanded', String(open));
});

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0];
$('#searchPickupDate').value = tomorrow;
$('#searchReturnDate').value = nextWeek;
renderFleet();
renderAdmin();
loadFromServer();
