import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  isInitialized: false,

  login: ({ user, token }) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      token,
      isInitialized: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      isInitialized: true,
    });
  },

  loadUser: () => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isInitialized: true,
        });
      } else {
        set({
          token: null,
          user: null,
          isInitialized: true,
        });
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      set({
        token: null,
        user: null,
        isInitialized: true,
      });
    }
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
