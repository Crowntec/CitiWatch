/**
 * User Cache Utility
 * 
 * This utility provides a way to cache user profile data locally since the backend
 * doesn't provide a way for regular users to access their own profile data.
 * It stores minimal user info (fullName) by email to help with user experience.
 */

interface CachedUserProfile {
  fullName: string;
  email: string;
  cachedAt: string;
}

const USER_CACHE_KEY = 'citiwatch_user_profiles';
const CACHE_EXPIRY_DAYS = 30; // Cache expires after 30 days

export class UserCache {
  /**
   * Store user profile data in local cache
   */
  static cacheUserProfile(email: string, fullName: string): void {
    try {
      const profiles = this.getAllCachedProfiles();
      const profileKey = email.toLowerCase();
      
      profiles[profileKey] = {
        fullName,
        email,
        cachedAt: new Date().toISOString()
      };
      
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(profiles));
      console.log('Cached user profile for:', email);
    } catch (error) {
      console.warn('Failed to cache user profile:', error);
    }
  }

  /**
   * Retrieve cached user profile data
   */
  static getCachedUserProfile(email: string): CachedUserProfile | null {
    try {
      const profiles = this.getAllCachedProfiles();
      const profileKey = email.toLowerCase();
      const profile = profiles[profileKey];
      
      if (!profile) {
        return null;
      }
      
      // Check if cache is expired
      const cachedDate = new Date(profile.cachedAt);
      const expiryDate = new Date(cachedDate.getTime() + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
      
      if (new Date() > expiryDate) {
        console.log('Cached profile expired for:', email);
        this.removeCachedProfile(email);
        return null;
      }
      
      console.log('Retrieved cached profile for:', email);
      return profile;
    } catch (error) {
      console.warn('Failed to retrieve cached user profile:', error);
      return null;
    }
  }

  /**
   * Remove a specific cached profile
   */
  static removeCachedProfile(email: string): void {
    try {
      const profiles = this.getAllCachedProfiles();
      const profileKey = email.toLowerCase();
      
      if (profiles[profileKey]) {
        delete profiles[profileKey];
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(profiles));
        console.log('Removed cached profile for:', email);
      }
    } catch (error) {
      console.warn('Failed to remove cached user profile:', error);
    }
  }

  /**
   * Clear all cached profiles
   */
  static clearAllProfiles(): void {
    try {
      localStorage.removeItem(USER_CACHE_KEY);
      console.log('Cleared all cached user profiles');
    } catch (error) {
      console.warn('Failed to clear cached user profiles:', error);
    }
  }

  /**
   * Get all cached profiles (internal helper)
   */
  private static getAllCachedProfiles(): Record<string, CachedUserProfile> {
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('Failed to parse cached profiles, clearing cache:', error);
      this.clearAllProfiles();
      return {};
    }
  }
}