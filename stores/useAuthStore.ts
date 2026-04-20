import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useFavoritesStore } from './useFavoritesStore';

WebBrowser.maybeCompleteAuthSession();

type Estado = 'idle' | 'cargando' | 'ok' | 'error';

type AuthState = {
  user: User | null;
  session: Session | null;
  estado: Estado;
  error: string | null;
  init: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

let subscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  estado: 'idle',
  error: null,

  init: async () => {
    if (subscription) return;
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session ?? null,
      user: data.session?.user ?? null,
      estado: 'ok',
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session: session ?? null, user: session?.user ?? null });
      if (event === 'SIGNED_IN') {
        const favs = useFavoritesStore.getState();
        await favs.mergeLocalToServer();
        await favs.fetchFromServer();
      }
      if (event === 'SIGNED_OUT') {
        useFavoritesStore.getState().clearMemory();
      }
    });
    subscription = sub.subscription;

    if (data.session?.user) {
      useFavoritesStore.getState().fetchFromServer();
    }
  },

  signInWithGoogle: async () => {
    set({ estado: 'cargando', error: null });
    try {
      const redirectTo =
        Platform.OS === 'web'
          ? window.location.origin + '/auth/callback'
          : Linking.createURL('/auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) throw error;

      if (Platform.OS === 'web') {
        set({ estado: 'ok' });
        return;
      }

      if (!data?.url) throw new Error('OAuth URL no recibida');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') {
        set({ estado: 'idle' });
        return;
      }

      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.replace(/^#/, '') || url.search);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) throw new Error('Tokens no recibidos en callback');

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (sessionError) throw sessionError;
      set({ estado: 'ok' });
    } catch (e: any) {
      set({ estado: 'error', error: e?.message ?? 'Error desconocido' });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, estado: 'idle' });
  },
}));
