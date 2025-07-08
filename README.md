=== README.md ===
# Shopify Quick Checkout API

This API handles quick checkout orders for Shopify stores using Razorpay payments.

## Endpoints

- `POST /api/shopify-order` - Create orders
- `GET /api/health-check` - API health status
- `GET /api/stats` - Usage statistics

## Environment Variables Required

- `SHOPIFY_DOMAIN` - Your Shopify store domain
- `SHOPIFY_ADMIN_ACCESS_TOKEN` - Shopify Admin API token
- `RAZORPAY_KEY_ID` - Razorpay Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay Secret Key

## Deployment

Deployed on Vercel. Auto-deploys from main branch.
