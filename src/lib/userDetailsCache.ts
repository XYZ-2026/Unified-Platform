// Client-side instant cache and sync helper for User Profile & Details

export interface CachedUserDetails {
  userId?: string;
  userEmail?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  country?: string;
  targetMajor?: string;
  intendedMajor?: string;
  dreamSchool?: string;
  applicationCycle?: string;
  gpa?: string;
  gpaWeighted?: string;
  satScore?: string;
  actScore?: string;
  classRank?: string;
  highSchool?: string;
  extracurriculars?: any;
  userRole?: string;
  financialAid?: boolean;
  updatedAt?: string;
  [key: string]: any;
}

const CACHE_EVENT_NAME = 'wix_user_details_updated';
const PRIMARY_CACHE_KEY = 'abroad_simplified_user_profile_v2';

function sanitizeKey(userKey?: string): string {
  if (!userKey || userKey === 'default' || userKey === 'guest-user') {
    return 'default';
  }
  return userKey.trim().toLowerCase();
}

export function getCachedUserDetails(userKey?: string): CachedUserDetails | null {
  if (typeof window === 'undefined') return null;
  try {
    const sKey = sanitizeKey(userKey);
    
    // 1. Try specific user key
    if (sKey !== 'default') {
      const specificRaw = localStorage.getItem(`abroad_profile_${sKey}`);
      if (specificRaw) {
        return JSON.parse(specificRaw) as CachedUserDetails;
      }
    }

    // 2. Fall back to primary active profile cache
    const primaryRaw = localStorage.getItem(PRIMARY_CACHE_KEY);
    if (primaryRaw) {
      return JSON.parse(primaryRaw) as CachedUserDetails;
    }

    return null;
  } catch (e) {
    console.warn('Failed to read user details from cache:', e);
    return null;
  }
}

export function setCachedUserDetails(userKey: string | undefined, data: Partial<CachedUserDetails>): CachedUserDetails {
  if (typeof window === 'undefined') return data as CachedUserDetails;
  try {
    const sKey = sanitizeKey(userKey);
    const existing = getCachedUserDetails(userKey) || {};

    const merged: CachedUserDetails = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const serialized = JSON.stringify(merged);
    
    // Always update primary cache
    localStorage.setItem(PRIMARY_CACHE_KEY, serialized);

    // Also update specific user key if available
    if (sKey !== 'default') {
      localStorage.setItem(`abroad_profile_${sKey}`, serialized);
    }

    // Dispatch event to notify all mounted components
    window.dispatchEvent(new CustomEvent(CACHE_EVENT_NAME, { detail: merged }));
    return merged;
  } catch (e) {
    console.warn('Failed to set user details in cache:', e);
    return data as CachedUserDetails;
  }
}

export function subscribeToUserDetails(callback: (data: CachedUserDetails) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<CachedUserDetails>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(CACHE_EVENT_NAME, handler);
  return () => {
    window.removeEventListener(CACHE_EVENT_NAME, handler);
  };
}
