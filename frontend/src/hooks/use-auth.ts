import { clearCookies } from '@/lib/auth-actions';
import { UserType } from '@/types';
import { create } from 'zustand';

interface useStoreAuthInterface {
    user: UserType | null
    onLogin: (user: UserType) => void
    onLogout: () => void
}

export const useAuth = create<useStoreAuthInterface>((set) => ({
    user: null,
    onLogin: (user: UserType) => set({ user: user }),
    onLogout: async () => {
        localStorage.clear()
        set({ user: null })
        await clearCookies()
    }

}))