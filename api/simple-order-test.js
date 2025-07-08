// File: api/simple-order-test.js
// Direct order test that you can call via browser URL

export default async function handler(req, res) {
  try {
    // Test data for COD order
    const testOrderData = {
      customerData: {
        name: 'Test Customer',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address, Test Street',
        city: 'Mumbai',
        pincode: '400001'
      },
      productData: {
        variantId: 'gid://shopify/ProductVariant/48670466490679', // You'll need a real variant ID
        price: 100,
        title: 'Test Product'
      },
      paymentMethod: 'cod'
    };

    // Create order in Shopify
    const shopifyOrder = await createShopifyOrder(testOrderData);

    res.json({
      success: true,
      message: 'Test order created successfully!',
      order: {
        id: shopifyOrder.id,
        orderNumber: shopifyOrder.order_number,
        total: shopifyOrder.total_price,
        customer: shopifyOrder.customer,
        financialStatus: shopifyOrder.financial_status
      },
      testData: testOrderData
    });

  } catch (error) {
    console.error('Order test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack?.substring(0, 500)
    });
  }
}

async function createShopifyOrder(orderData) {
  const orderPayload = {
    order: {
      line_items: [{
        variant_id: extractVariantId(orderData.productData.variantId),
        quantity: 1,
        price: orderData.productData.price.toString()
      }],
      customer: {
        first_name: orderData.customerData.name.split(' ')[0] || 'Customer',
        last_name: orderData.customerData.name.split(' ').slice(1).join(' ') || '',
        email: orderData.customerData.email,
        phone: orderData.customerData.phone
      },
      shipping_address: {
        first_name: orderData.customerData.name.split(' ')[0] || 'Customer',
        last_name: orderData.customerData.name.split(' ').slice(1).join(' ') || '',
        address1: orderData.customerData.address,
        city: orderData.customerData.city,
        zip: orderData.customerData.pincode,
        phone: orderData.customerData.phone,
        country: 'India',
        country_code: 'IN'
      },
      billing_address: {
        first_name: orderData.customerData.name.split(' ')[0] || 'Customer',
        last_name: orderData.customerData.name.split(' ').slice(1).join(' ') || '',
        address1: orderData.customerData.address,
        city: orderData.customerData.city,
        zip: orderData.customerData.pincode,
        phone: orderData.customerData.phone,
        country: 'India',
        country_code: 'IN'
      },
      financial_status: 'pending',
      tags: 'quick-checkout,test-order,cod',
      note: 'Test order created via Quick Checkout API'
    }
  };

  const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/admin/api/2023-10/orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    },
    body: JSON.stringify(orderPayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.order;
}

function extractVariantId(variantId) {
  if (typeof variantId === 'string' && variantId.includes('gid://')) {
    return variantId.split('/').pop();
  }
  return variantId;
}
