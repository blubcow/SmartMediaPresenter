import { initializeApp } from 'firebase/app';
import config from '../config/config.firebase';
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut as fireSignOut,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	User,
} from 'firebase/auth';

initializeApp(config);

const fireAuth = getAuth();

const firebaseAuth = () => {
	const createAccount = async (email: string, password: string) =>
		await createUserWithEmailAndPassword(fireAuth, email, password);

	const signIn = async (email: string, password: string) =>
		await signInWithEmailAndPassword(fireAuth, email, password);

	const listenForAuthChanges = (callback: (user?: User) => void) => {
		return onAuthStateChanged(fireAuth, (user) => callback(user ?? undefined));
	};

	const signOut = async () => await fireSignOut(fireAuth);

	return { createAccount, signIn, signOut, listenForAuthChanges };
};
const auth = firebaseAuth();

export { auth };
