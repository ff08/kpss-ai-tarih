import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesOffering, type PurchasesPackage } from "react-native-purchases";

export type BillingPlan = "MONTHLY" | "YEARLY";

export type RevenueCatConfig = {
  iosApiKey?: string;
  androidApiKey?: string;
  entitlementId?: string;
  /** RevenueCat dashboard offering id; boşsa current offering kullanılır */
  offeringId?: string;
};

export function getRevenueCatConfig(): Required<Pick<RevenueCatConfig, "entitlementId">> &
  Pick<RevenueCatConfig, "offeringId"> &
  { apiKey: string | null } {
  const iosApiKey = process.env.EXPO_PUBLIC_RC_IOS_API_KEY;
  const androidApiKey = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY;
  const entitlementId = process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? "premium";
  const offeringId = process.env.EXPO_PUBLIC_RC_OFFERING_ID;
  const apiKey = Platform.OS === "ios" ? iosApiKey ?? null : androidApiKey ?? null;
  return { apiKey, entitlementId, offeringId };
}

export function isRevenueCatConfigured(): boolean {
  const c = getRevenueCatConfig();
  return !!c.apiKey && c.entitlementId.length > 0;
}

let configuredForUser: string | null = null;

export async function configureRevenueCat(appUserId: string): Promise<void> {
  const c = getRevenueCatConfig();
  if (!c.apiKey) return;
  if (configuredForUser === appUserId) return;
  Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey: c.apiKey, appUserID: appUserId });
  configuredForUser = appUserId;
}

export function inferPlanFromProductId(productId: string): BillingPlan {
  const p = productId.toLowerCase();
  if (p.includes("year")) return "YEARLY";
  if (p.includes("annual")) return "YEARLY";
  if (p.includes("month")) return "MONTHLY";
  if (p.includes("monthly")) return "MONTHLY";
  // fallback
  return "MONTHLY";
}

export async function getPremiumOffering(): Promise<PurchasesOffering | null> {
  if (!isRevenueCatConfigured()) return null;
  const { offeringId } = getRevenueCatConfig();
  const offerings = await Purchases.getOfferings();
  if (offeringId) {
    return offerings.all[offeringId] ?? null;
  }
  return offerings.current ?? null;
}

export function pickMonthlyYearlyPackages(offering: PurchasesOffering): {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
} {
  const pkgs = offering.availablePackages ?? [];
  let monthly: PurchasesPackage | null = null;
  let yearly: PurchasesPackage | null = null;
  for (const p of pkgs) {
    const id = p.storeProduct.identifier.toLowerCase();
    if (!monthly && (id.includes("month") || p.packageType === "MONTHLY")) monthly = p;
    if (!yearly && (id.includes("year") || id.includes("annual") || p.packageType === "ANNUAL")) yearly = p;
  }
  return { monthly, yearly };
}

export function entitlementFromCustomerInfo(ci: CustomerInfo): {
  isActive: boolean;
  productId: string | null;
  expiresAtIso: string | null;
} {
  const { entitlementId } = getRevenueCatConfig();
  const ent = ci.entitlements?.active?.[entitlementId];
  if (!ent) return { isActive: false, productId: null, expiresAtIso: null };
  const exp = ent.expirationDate ? new Date(ent.expirationDate).toISOString() : null;
  return { isActive: true, productId: ent.productIdentifier ?? null, expiresAtIso: exp };
}

