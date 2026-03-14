import { create } from "zustand";

interface User {
  id: string;
  email: string;
  credits_balance: number;
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail_url?: string;
  prompt?: string;
  created_at: string;
}

interface GenerationJob {
  id: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  status: "pending" | "processing" | "completed" | "failed";
  result_url?: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateCredits: (credits: number) => void;

  // Media library
  mediaItems: MediaItem[];
  setMediaItems: (items: MediaItem[]) => void;
  addMediaItem: (item: MediaItem) => void;
  removeMediaItem: (id: string) => void;

  // Generation jobs
  activeJobs: GenerationJob[];
  addJob: (job: GenerationJob) => void;
  updateJob: (id: string, updates: Partial<GenerationJob>) => void;
  removeJob: (id: string) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  updateCredits: (credits) =>
    set((state) => ({
      user: state.user ? { ...state.user, credits_balance: credits } : null,
    })),

  // Media library
  mediaItems: [],
  setMediaItems: (mediaItems) => set({ mediaItems }),
  addMediaItem: (item) =>
    set((state) => ({ mediaItems: [item, ...state.mediaItems] })),
  removeMediaItem: (id) =>
    set((state) => ({
      mediaItems: state.mediaItems.filter((m) => m.id !== id),
    })),

  // Generation jobs
  activeJobs: [],
  addJob: (job) =>
    set((state) => ({ activeJobs: [...state.activeJobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      activeJobs: state.activeJobs.map((j) =>
        j.id === id ? { ...j, ...updates } : j
      ),
    })),
  removeJob: (id) =>
    set((state) => ({
      activeJobs: state.activeJobs.filter((j) => j.id !== id),
    })),

  // UI
  sidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
