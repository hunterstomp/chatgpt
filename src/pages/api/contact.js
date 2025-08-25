export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const projectType = formData.get('projectType');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Here you would typically:
    // 1. Send an email notification
    // 2. Store in a database
    // 3. Send to a CRM like HubSpot
    // 4. Log the contact for follow-up

    console.log('Contact form submission:', {
      name,
      email,
      company,
      projectType,
      message,
      timestamp: new Date().toISOString()
    });

    // For now, just return success
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Something went wrong. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
