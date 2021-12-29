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
import {
	getStorage,
	ref,
	uploadBytesResumable,
	UploadMetadata,
	UploadTask,
	getDownloadURL,
	listAll,
} from 'firebase/storage';

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

const fireStorage = getStorage();

const firebaseStorage = () => {
	const uploadFile = (
		userId: string,
		fileName: string,
		buffer: Buffer,
		metadata?: UploadMetadata
	): UploadTask => {
		const path = userId + '/' + fileName;
		const reference = ref(fireStorage, path);

		const task = uploadBytesResumable(
			reference,
			buffer,
			metadata
		) as UploadTask;

		return task;
	};

	const listRemoteMedia = (userId: string) => {
		const reference = ref(fireStorage, userId);
		return listAll(reference);
	};

	const getDownloadUrlFromFileName = (userId: string, fileName: string) => {
		const reference = ref(fireStorage, userId + '/' + fileName);
		return getDownloadURL(reference);
	};

	return {
		uploadFile,
		getDownloadURL,
		getDownloadUrlFromFileName,
		listRemoteMedia,
	};
};

const storage = firebaseStorage();

export { auth, storage };
