# Esrom Ridez

Car rental website for Kampala, Entebbe, and Jinja. Prices are in **UGX**.

## Run locally

1. Copy `.env.example` to `.env` and set SMTP plus `ADMIN_EMAIL`.
2. Install and start:

```bash
npm install
npm start
```

Open http://localhost:3000

Without SMTP, development uses an Ethereal test inbox so messages are accepted and previewable, not delivered to public mailboxes. Production requires `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` on the server. Never put those values in `script.js`.

## Booking emails

Each request sends:

1. A customer copy with the exact car name, reference, dates, locations, and UGX estimate.
2. An admin notification with customer details.
3. A later customer email when staff confirm or cancel the request.

If sending fails, the site shows an error and the server logs the failure. It does not claim an email was sent.

Test the provider with:

```bash
npm run test:email
```

Set `TEST_CUSTOMER_EMAIL` in `.env` to an inbox you can check.

## Fleet

The listed cars stay exactly as named:

- Toyota Premio, Toyota Fielder (sedans)
- Mazda CX-5, Toyota RAV4 (SUVs)
- Toyota Hiace, Toyota Coaster (vans)
