// File: api/test-order.js
// Simple test to check environment variables and basic functionality

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check environment variables
    const envCheck = {
      SHOPIFY_DOMAIN: !!process.env.SHOPIFY_DOMAIN,
      SHOPIFY_ADMIN_ACCESS_TOKEN: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET
    };

    // Count missing variables
    const missingVars = Object.entries(envCheck).filter(([key, value]) => !value);
    
    if (missingVars.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars.map(([key]) => key),
        envCheck
      });
    }

    // If POST request, test basic order data
    if (req.method === 'POST') {
      const { customerData, productData, paymentMethod } = req.body;
      
      if (!customerData || !productData) {
        return res.status(400).json({
          success: false,
          error: 'Missing customerData or productData'
        });
      }

      // Simulate order creation (without actually calling Shopify)
      const mockOrder = {
        id: 'test_' + Date.now(),
        order_number: '#TEST001',
        customer: customerData,
        product: productData,
        payment_method: paymentMethod,
        created_at: new Date().toISOString()
      };

      return res.json({
        success: true,
        message: 'Environment variables are set correctly!',
        envCheck,
        mockOrder,
        note: 'This is a test response. Real Shopify integration will work once env vars are set.'
      });
    }

    // GET request - just show env status
    res.json({
      success: true,
      message: 'Test API is working',
      envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
