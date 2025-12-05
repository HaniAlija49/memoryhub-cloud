/**
 * Plan Configuration Validation Script
 *
 * Validates that plan configuration matches Dodo Payments product catalog.
 * Run this script before deploying to ensure pricing and product IDs are correct.
 *
 * Usage: npm run validate:plans
 */

import { PLANS } from "../config/plans";
import { env } from "../lib/env";

interface DodoProduct {
  id: string;
  name: string;
  price: number; // in cents
  interval: "month" | "year";
}

async function fetchDodoProduct(productId: string): Promise<DodoProduct | null> {
  const apiKey = env.DODO_API_KEY;
  const mode = env.DODO_MODE || "test";
  const baseUrl = mode === "live"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";

  try {
    const response = await fetch(`${baseUrl}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const product = await response.json();
    return {
      id: product.product_id,
      name: product.name,
      price: product.price,
      interval: product.payment_interval,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

async function validatePlanConfig() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     Plan Configuration Validation                            ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`Mode: ${env.DODO_MODE || "test"}`);
  console.log();

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if Dodo credentials are configured
  if (!env.DODO_API_KEY) {
    console.error("❌ DODO_API_KEY not configured!");
    process.exit(1);
  }

  for (const [planId, plan] of Object.entries(PLANS)) {
    if (planId === "free") {
      console.log(`✓ ${plan.name} (free plan - no validation needed)`);
      continue;
    }

    console.log(`\n📦 Validating plan: ${plan.name} (${planId})`);

    // Validate monthly product
    if (plan.providers.dodo?.monthly) {
      const productId = plan.providers.dodo.monthly;
      console.log(`  Checking monthly product: ${productId}`);

      const product = await fetchDodoProduct(productId);

      if (!product) {
        errors.push(`❌ ${planId}: Monthly product ${productId} not found in Dodo`);
        console.log(`    ❌ Product not found`);
      } else {
        const expectedPrice = plan.pricing.monthly;

        if (product.price !== expectedPrice) {
          errors.push(
            `❌ ${planId}: Price mismatch! Config: $${expectedPrice / 100}, Dodo: $${product.price / 100}`
          );
          console.log(`    ❌ Price mismatch: Expected $${expectedPrice / 100}, got $${product.price / 100}`);
        } else {
          console.log(`    ✅ Price correct: $${expectedPrice / 100}`);
        }

        if (product.interval !== "month") {
          warnings.push(`⚠️  ${planId}: Monthly product has interval "${product.interval}"`);
          console.log(`    ⚠️  Interval is "${product.interval}", expected "month"`);
        } else {
          console.log(`    ✅ Interval correct: monthly`);
        }
      }
    } else {
      warnings.push(`⚠️  ${planId}: No monthly product ID configured`);
      console.log(`  ⚠️  No monthly product configured`);
    }

    // Validate yearly product
    if (plan.providers.dodo?.yearly) {
      const productId = plan.providers.dodo.yearly;
      console.log(`  Checking yearly product: ${productId}`);

      const product = await fetchDodoProduct(productId);

      if (!product) {
        errors.push(`❌ ${planId}: Yearly product ${productId} not found in Dodo`);
        console.log(`    ❌ Product not found`);
      } else {
        const expectedPrice = plan.pricing.yearly;

        if (product.price !== expectedPrice) {
          errors.push(
            `❌ ${planId}: Price mismatch! Config: $${expectedPrice / 100}, Dodo: $${product.price / 100}`
          );
          console.log(`    ❌ Price mismatch: Expected $${expectedPrice / 100}, got $${product.price / 100}`);
        } else {
          console.log(`    ✅ Price correct: $${expectedPrice / 100}`);
        }

        if (product.interval !== "year") {
          warnings.push(`⚠️  ${planId}: Yearly product has interval "${product.interval}"`);
          console.log(`    ⚠️  Interval is "${product.interval}", expected "year"`);
        } else {
          console.log(`    ✅ Interval correct: yearly`);
        }
      }
    } else {
      warnings.push(`⚠️  ${planId}: No yearly product ID configured`);
      console.log(`  ⚠️  No yearly product configured`);
    }
  }

  // Print summary
  console.log("\n" + "═".repeat(64));
  console.log("\n📊 VALIDATION SUMMARY\n");

  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log();
  }

  if (errors.length === 0) {
    console.log("✅ All plan configurations are valid!");
    console.log("   All prices match Dodo product catalog.");
    console.log();
    process.exit(0);
  } else {
    console.log("❌ Validation failed with errors:\n");
    errors.forEach((err) => console.log(`   ${err}`));
    console.log();
    console.log("Fix these errors before deploying to production!");
    console.log();
    process.exit(1);
  }
}

// Run validation
validatePlanConfig().catch((error) => {
  console.error("\n❌ Validation script failed:", error);
  process.exit(1);
});
