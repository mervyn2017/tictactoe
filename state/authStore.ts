import create from 'zustand';

type Credentials = {
    username: string;
    password: string;
};

interface AuthState {
    signedIn: boolean;
    username: string;
    password: string;
    userToken: string;

    signIn(credentials: Credentials): void;
    signOut(): void;
}

export const useAuthStore = create<AuthState>(set => ({
    signedIn: false,
    username: '',
    password: '',
    userToken: '',

    signIn(credentials: Credentials) {
        set(() => ({
            signedIn: true,
            username: credentials.username,
            password: credentials.password
        }));
    },

    signOut() {
        set(() => ({
            signedIn: false,
            username: '',
            password: ''
        }));
    }
}));
