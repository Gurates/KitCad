import { mockModels } from '../data/mockData';

const NAMESPACE = 'kitcad_downloads_v1';
const LOCAL_STORAGE_KEY = 'kitcad_local_downloads';
const TOTAL_DOWNLOADS_KEY = 'kitcad_total_downloads';
const USER_DOWNLOADS_KEY = 'kitcad_user_downloaded_items';

class DownloadService {
  constructor() {
    this.initLocal();
  }

  initLocal() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      const initialCounts = {};
      let total = 0;
      mockModels.forEach(model => {
        initialCounts[model.id] = model.downloads || 0;
        total += model.downloads || 0;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCounts));
      localStorage.setItem(TOTAL_DOWNLOADS_KEY, total.toString());
    }
    
    if (!localStorage.getItem(USER_DOWNLOADS_KEY)) {
      localStorage.setItem(USER_DOWNLOADS_KEY, JSON.stringify([]));
    }
  }

  getLocalCounts() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  async getCount(modelId) {
    try {
      const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/model_${modelId}`);
      if (response.ok) {
        const data = await response.json();
        return data.count;
      }
    } catch (error) {
      console.warn("CounterAPI fetch failed, using local count.", error);
    }

    const counts = this.getLocalCounts();
    return counts[modelId] || 0;
  }

  async getTotalDownloads() {
    try {
      const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/total_site_downloads`);
      if (response.ok) {
        const data = await response.json();
        return data.count;
      }
    } catch (error) {
      console.warn("CounterAPI total fetch failed, using local total.", error);
    }
    return parseInt(localStorage.getItem(TOTAL_DOWNLOADS_KEY) || '0', 10);
  }

  async incrementCount(modelId) {
    const userDownloads = JSON.parse(localStorage.getItem(USER_DOWNLOADS_KEY)) || [];
    let newCount = 0;

    // Increment model-specific count
    try {
      const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/model_${modelId}/up`);
      if (response.ok) {
        const data = await response.json();
        newCount = data.count;
      }
    } catch (error) {
      console.warn("CounterAPI model increment failed.", error);
    }

    // Increment global total count
    try {
      await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/total_site_downloads/up`);
    } catch (error) {
      console.warn("CounterAPI total increment failed.", error);
    }

    // Fallback to local storage increments
    if (!newCount) {
      const counts = this.getLocalCounts();
      counts[modelId] = (counts[modelId] || 0) + 1;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(counts));
      newCount = counts[modelId];
    }
    
    const localTotal = parseInt(localStorage.getItem(TOTAL_DOWNLOADS_KEY) || '0', 10);
    localStorage.setItem(TOTAL_DOWNLOADS_KEY, (localTotal + 1).toString());

    if (!userDownloads.includes(modelId)) {
      userDownloads.push(modelId);
      localStorage.setItem(USER_DOWNLOADS_KEY, JSON.stringify(userDownloads));
    }

    return newCount;
  }
}

export const downloadService = new DownloadService();
