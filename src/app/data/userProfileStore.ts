import { useSyncExternalStore } from 'react';
import { activityLevelOptions, type UserProfile, userProfile as defaultUserProfile } from './mockData';
import { normalizeGoal } from './profileInsights';

const STORAGE_KEY = 'gymup:user-profile';
const listeners = new Set<() => void>();

function resolveActivityLevel(label: string) {
  return (
    activityLevelOptions.find((option) => option.label === label) ??
    activityLevelOptions.find((option) => option.label === defaultUserProfile.activityLevel) ??
    activityLevelOptions[0]
  );
}

function normalizeUserProfile(profile: UserProfile): UserProfile {
  const activity = resolveActivityLevel(profile.activityLevel);
  const firstName = profile.firstName.trim() || defaultUserProfile.firstName;
  const lastName = profile.lastName.trim() || defaultUserProfile.lastName;

  return {
    ...profile,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    goal: normalizeGoal(profile.goal.trim() || defaultUserProfile.goal),
    trainingLevel: profile.trainingLevel.trim() || defaultUserProfile.trainingLevel,
    memberSince: profile.memberSince.trim() || defaultUserProfile.memberSince,
    activityLevel: activity.label,
    activityFactor: activity.factor,
    activityDescription: activity.description,
  };
}

function loadStoredProfile() {
  if (typeof window === 'undefined') {
    return normalizeUserProfile(defaultUserProfile);
  }

  try {
    const rawProfile = window.localStorage.getItem(STORAGE_KEY);
    if (!rawProfile) {
      return normalizeUserProfile(defaultUserProfile);
    }

    const parsedProfile = JSON.parse(rawProfile) as Partial<UserProfile>;
    return normalizeUserProfile({ ...defaultUserProfile, ...parsedProfile });
  } catch {
    return normalizeUserProfile(defaultUserProfile);
  }
}

let currentUserProfile = loadStoredProfile();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function persistUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getUserProfile() {
  return currentUserProfile;
}

export function subscribeUserProfile(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUserProfile() {
  return useSyncExternalStore(subscribeUserProfile, getUserProfile, getUserProfile);
}

export function updateUserProfile(updates: Partial<UserProfile>) {
  currentUserProfile = normalizeUserProfile({ ...currentUserProfile, ...updates });
  persistUserProfile(currentUserProfile);
  notifyListeners();
  return currentUserProfile;
}
