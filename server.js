require('dotenv').config();
const express = require('express');
const path = require('path');
const { extras, datesOverlap, quoteBooking } = require('./lib/vehicles');
const { readStore, writeStore, resetStore } = require('./lib/store');
const email = require('./lib/email');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_KEY = process.env.ADMIN_KEY || '';

app.use(express.json({ limit: '200kb' }));
app.use((req, res, next) => {
  const blocked = /^\/(\.env|data\/|lib\/|scripts\/|node_modules\/|server\.js|package(-lock)?\.json)/i.test(req.path);
  if (blocked) return res.status(404).end();
  next();
});
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  index: 'index.html',
  dotfiles: 'deny'
}));

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) return next();
  const header = req.get('x-admin-key') || '';
  if (header !== ADMIN_KEY) return res.status(401).json({ ok: false, error: 'Staff login key is incorrect.' });
  next();
}

function makeReference() {
  return `ER-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

app.get('/api/health', async (_req, res) => {
  try {
    const transport = await email.verifyTransport();
    res.json({ ok: true, brand: 'Esrom Ridez', email: transport });
  } catch (error) {
    console.error('[health] email verify failed:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/fleet', (_req, res) => {
  const store = readStore();
  res.json({ ok: true, vehicles: store.vehicles, extras });
});

app.get('/api/bookings', requireAdmin, (_req, res) => {
  res.json({ ok: true, bookings: readStore().bookings });
});

app.post('/api/bookings', async (req, res) => {
  const body = req.body || {};
  const required = ['name', 'email', 'phone', 'pickupDate', 'returnDate', 'pickupTime', 'returnTime', 'pickupLocation', 'returnLocation', 'vehicleId'];
  const missing = required.filter((key) => !String(body[key] || '').trim());
  if (missing.length) {
    return res.status(400).json({ ok: false, error: 'Please complete every required field before sending your request.' });
  }
  if (body.returnDate < body.pickupDate) {
    return res.status(400).json({ ok: false, error: 'Return date must be on or after pickup date.' });
  }

  const store = readStore();
  const vehicle = store.vehicles.find((item) => item.id === body.vehicleId);
  if (!vehicle) return res.status(404).json({ ok: false, error: 'We could not find that car.' });
  if (!vehicle.available) return res.status(409).json({ ok: false, error: 'That car is currently unavailable. Please pick another one.' });

  const conflict = store.bookings.some((booking) => (
    booking.vehicleId === vehicle.id
    && booking.status !== 'cancelled'
    && datesOverlap(body.pickupDate, body.returnDate, booking.pickupDate, booking.returnDate)
  ));
  if (conflict) {
    return res.status(409).json({ ok: false, error: 'Those dates are already requested for this car. Please choose different dates.' });
  }

  const quote = quoteBooking(vehicle, body);
  const booking = {
    reference: makeReference(),
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    pickupDate: body.pickupDate,
    returnDate: body.returnDate,
    pickupTime: body.pickupTime,
    returnTime: body.returnTime,
    pickupLocation: body.pickupLocation,
    returnLocation: body.returnLocation,
    requests: String(body.requests || '').trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...quote
  };

  store.bookings.push(booking);
  writeStore(store);

  try {
    const customer = await email.sendCustomerRequest(booking);
    const admin = await email.sendAdminNotification(booking);
    res.status(201).json({
      ok: true,
      emailSent: true,
      booking,
      previews: {
        customer: customer.previewUrl,
        admin: admin.previewUrl
      }
    });
  } catch (error) {
    console.error('[bookings] email failed after saving request', booking.reference, error.message);
    res.status(502).json({
      ok: false,
      emailSent: false,
      booking,
      error: `Your request ${booking.reference} was saved, but we could not send the confirmation email. Please call +256 704 221 808 or write to us and quote this reference. Details: ${error.message}`
    });
  }
});

app.patch('/api/bookings/:reference', requireAdmin, async (req, res) => {
  const status = req.body?.status;
  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'Status must be confirmed or cancelled.' });
  }
  const store = readStore();
  const booking = store.bookings.find((item) => item.reference === req.params.reference);
  if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found.' });
  if (booking.status !== 'pending') {
    return res.status(409).json({ ok: false, error: 'This request has already been updated.' });
  }
  booking.status = status;
  writeStore(store);
  try {
    const result = await email.sendStatusUpdate(booking);
    res.json({ ok: true, emailSent: true, booking, preview: result.previewUrl });
  } catch (error) {
    console.error('[bookings] status email failed', booking.reference, error.message);
    res.status(502).json({
      ok: false,
      emailSent: false,
      booking,
      error: `The booking was marked ${status}, but the customer email did not send. ${error.message}`
    });
  }
});

app.patch('/api/vehicles/:id', requireAdmin, (req, res) => {
  const store = readStore();
  const vehicle = store.vehicles.find((item) => item.id === req.params.id);
  if (!vehicle) return res.status(404).json({ ok: false, error: 'Vehicle not found.' });
  if (req.body.price != null) {
    const price = Number(req.body.price);
    if (!(price > 0)) return res.status(400).json({ ok: false, error: 'Daily rate must be greater than zero.' });
    vehicle.price = price;
  }
  if (typeof req.body.available === 'boolean') vehicle.available = req.body.available;
  writeStore(store);
  res.json({ ok: true, vehicle });
});

app.post('/api/reset', requireAdmin, (_req, res) => {
  const store = resetStore();
  res.json({ ok: true, vehicles: store.vehicles, bookings: store.bookings });
});

app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const customerEmail = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();
  if (!name || !customerEmail || !message) {
    return res.status(400).json({ ok: false, error: 'Please include your name, email, and a short message.' });
  }
  try {
    await email.sendContactMessage({ name, email: customerEmail, message });
    res.json({ ok: true, emailSent: true });
  } catch (error) {
    console.error('[contact] email failed:', error.message);
    res.status(502).json({ ok: false, emailSent: false, error: `We could not send that message. ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Esrom Ridez running at http://localhost:${PORT}`);
  if (!process.env.ADMIN_EMAIL) console.warn('[email] ADMIN_EMAIL is missing. Booking notifications will fail until it is set.');
  if (!email.hasSmtpConfig()) console.warn('[email] SMTP is not set. Development will use Ethereal test delivery.');
});
