import { AppData, createInitialAppData } from '../data';

const STORAGE_KEY = 'ecoquest.app-data.v1';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

const hasBrowserStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const cloneData = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const isLegacyDemoData = (data: AppData): boolean => {
  const demoUserMatch = data.user.id === 'u1' && data.user.name === 'Miguel Santos';
  const demoMissionMatch = data.missions.some((mission) => mission.id === 'm1');
  return demoUserMatch || demoMissionMatch;
};

export async function loadAppData(): Promise<AppData> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/app-data`);
    if (!response.ok) {
      throw new Error(`Failed to load app data (${response.status})`);
    }

    return (await response.json()) as AppData;
  }

  if (!hasBrowserStorage()) {
    return createInitialAppData();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as AppData;
      if (isLegacyDemoData(parsed)) {
        const resetData = createInitialAppData();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
        return cloneData(resetData);
      }

      return parsed;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const initial = createInitialAppData();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return cloneData(initial);
}

export async function saveAppData(data: AppData): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/app-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save app data (${response.status})`);
    }

    return;
  }

  if (hasBrowserStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
