#!/usr/bin/env node

/**
 * API Route Validator
 * 
 * This script checks all API routes to ensure they:
 * 1. Exist as files
 * 2. Export proper HTTP methods (GET, POST, PUT, DELETE)
 * 3. Return NextResponse.json() format
 * 
 * Usage: npm run validate:routes
 */

const fs = require("fs");
const path = require("path");

const APP_API_DIR = path.join(__dirname, "../app/api");

function findAllRouteFiles(dir = APP_API_DIR) {
  const files = [];

  function walk(currentPath, relativePath = "") {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else if (entry.name === "route.ts") {
        files.push({
          path: fullPath,
          relativePath: path.dirname(relPath),
          url: "/" + path.dirname(relPath).replace(/\\/g, "/"),
        });
      }
    }
  }

  walk(dir);
  return files;
}

function validateRouteFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const issues = [];
  const methods = [];

  // Check for export statements
  const exportPattern = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
  let match;
  while ((match = exportPattern.exec(content)) !== null) {
    methods.push(match[1]);
  }

  // Check for NextResponse imports
  if (!content.includes("NextResponse")) {
    issues.push("Missing NextResponse import");
  }

  // Check for NextResponse.json usage
  if (!content.includes("NextResponse.json")) {
    issues.push("No NextResponse.json() usage found");
  }

  // Check for res.send or res.json (Express patterns in Next.js API routes)
  if (content.includes("res.send(") || content.includes("res.json(")) {
    issues.push("Using Express response object (res.send/res.json) instead of NextResponse");
  }

  // Check for HTML-like patterns
  if (
    content.includes("<!DOCTYPE") ||
    (content.includes("<html") && !content.includes("printWindow"))
  ) {
    issues.push("Contains HTML tags in API route");
  }

  return {
    methods: methods.length > 0 ? methods : ["No methods exported"],
    issues,
    isValid: issues.length === 0 && methods.length > 0,
  };
}

function main() {
  console.log("🔍 Validating API Routes...\n");

  const routes = findAllRouteFiles();
  if (routes.length === 0) {
    console.log("❌ No route files found!");
    process.exit(1);
  }

  console.log(`Found ${routes.length} route files:\n`);

  let validCount = 0;
  let issueCount = 0;
  const allIssues = [];

  for (const route of routes) {
    const validation = validateRouteFile(route.path);
    const isValid = validation.isValid;

    if (isValid) {
      validCount++;
      console.log(`✅ ${route.url}`);
      console.log(`   Methods: ${validation.methods.join(", ")}\n`);
    } else {
      issueCount++;
      console.log(`❌ ${route.url}`);
      console.log(`   Methods: ${validation.methods.join(", ")}`);
      validation.issues.forEach((issue) => {
        console.log(`   ⚠️  ${issue}`);
        allIssues.push({
          route: route.url,
          issue,
          file: route.path,
        });
      });
      console.log("");
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Summary: ${validCount} valid, ${issueCount} with issues\n`);

  if (allIssues.length > 0) {
    console.log("Issues to fix:\n");
    allIssues.forEach((item) => {
      console.log(`  Route: ${item.route}`);
      console.log(`  Issue: ${item.issue}`);
      console.log(`  File: ${item.file}\n`);
    });
    process.exit(1);
  } else {
    console.log("✅ All API routes are valid!\n");
    process.exit(0);
  }
}

main();
