/**
 * Network connectivity test utility
 * Use this to diagnose network issues
 */

export async function testInternetConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🔍 Testing internet connection...');
    
    // Test: Can we reach Google?
    const googleResponse = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    
    console.log('✅ Google reachable:', googleResponse.ok);
    
    return {
      success: true,
      message: 'Internet connection is working!',
      details: {
        googleReachable: googleResponse.ok,
      },
    };
  } catch (error) {
    console.error('❌ Network test failed:', error);
    return {
      success: false,
      message: 'No internet connection detected',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function testBackendConnection(baseUrl: string): Promise<{
  success: boolean;
  message: string;
  statusCode?: number;
}> {
  try {
    console.log(`🔍 Testing backend at: ${baseUrl}`);
    
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123',
      }),
    });
    
    // Any response (even 401/404/500) means server is reachable
    console.log(`✅ Backend responded with status: ${response.status}`);
    
    return {
      success: true,
      message: `Backend is reachable! Status: ${response.status}`,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      return {
        success: false,
        message: 'Backend server is not running or not accessible',
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
