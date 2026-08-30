/**
 * API Diagnostic Utility
 * Use this to diagnose JSON parsing errors
 * 
 * Usage:
 * import { diagnoseFetch } from "@/utils/apiDiagnostics";
 * const data = await diagnoseFetch("/api/user/profile");
 */

export async function diagnoseFetch(url: string, options: RequestInit = {}) {
  try {
    console.log(`[API] Fetching: ${url}`);
    console.log(`[API] Method: ${options.method || "GET"}`);
    
    const response = await fetch(url, options);
    
    console.log(`[API] Status: ${response.status} ${response.statusText}`);
    console.log(`[API] Content-Type: ${response.headers.get("content-type")}`);
    
    // Check if response is ok
    if (!response.ok) {
      console.error(`[API] Error: HTTP ${response.status}`);
      
      // Try to get more details
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        console.error(`[API] Error Data:`, errorData);
        throw new Error(errorData.error || errorData.err || "API Error");
      } else {
        const text = await response.text();
        console.error(`[API] Response (first 500 chars):`, text.substring(0, 500));
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    // Check content type
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error(`[API] Invalid Content-Type: ${contentType}`);
      console.error(`[API] Response (first 500 chars):`, text.substring(0, 500));
      throw new Error(`Expected JSON but got ${contentType}`);
    }
    
    // Parse JSON
    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
    
  } catch (error) {
    console.error(`[API] Failed:`, error.message);
    throw error;
  }
}

/**
 * Batch test multiple API endpoints
 * 
 * Usage:
 * await testAllApis();
 */
export async function testAllApis() {
  const endpoints = [
    { url: "/api/user/profile", method: "GET", name: "User Profile" },
    { url: "/api/user/cardorder", method: "GET", name: "User Card Orders" },
    { url: "/api/user/cartreceipt", method: "GET", name: "User Cart Receipts" },
    { url: "/api/admin/cardbulkorder", method: "GET", name: "Admin Card Bulk Order" },
    { url: "/api/admin/cardqueue", method: "GET", name: "Admin Card Queue" },
    { url: "/api/user/orders", method: "GET", name: "User Orders" },
  ];

  console.log(`\n[DIAGNOSTIC] Testing ${endpoints.length} API endpoints...\n`);

  const results = [];
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint.name}`);
      const data = await diagnoseFetch(endpoint.url, {
        method: endpoint.method,
      });
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: "✅ OK",
        message: "Responds with valid JSON",
      });
    } catch (error) {
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: "❌ FAILED",
        message: error.message,
      });
    }
  }

  console.log("\n[DIAGNOSTIC] Results:\n");
  console.table(results);
  
  return results;
}

/**
 * Check if a URL returns JSON
 */
export async function isJsonResponse(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json") ?? false;
  } catch {
    return false;
  }
}

/**
 * Safely parse JSON with error handling
 */
export async function safeJsonParse(response) {
  try {
    const contentType = response.headers.get("content-type");
    
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", {
        status: response.status,
        contentType,
        preview: text.substring(0, 200),
      });
      throw new Error(
        `Expected JSON but received ${contentType || "unknown"} response. ` +
        `Status: ${response.status}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error("JSON parse error:", error.message);
    throw error;
  }
}
