import React, {
	createContext,
	PropsWithChildren,
	useEffect,
	useState,
} from 'react';
import { firebaseConfig } from '../config/firebase.config';
import { auth } from '../models/firebase';
import { RemoteUser } from '../shared/remote.interface';

export const RemoteUserContext = createContext({});

export const RemoteUserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<RemoteUser | undefined>(
		auth.currentUser
			? { uid: auth.currentUser.uid, email: auth.currentUser.email ?? '' }
			: undefined
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userLoggedIn, setUserLoggedIn] = useState<boolean | undefined>();

	useEffect(() => {
		if (firebaseConfig.apiKey === '') {
			setIsLoading(false);
			setUserLoggedIn(false);
			setCurrentUser(undefined);
			return;
		}
		try {
			const authListenerUnsubscribe = auth.listenForAuthChanges((user) => {
				setCurrentUser(
					user ? { uid: user.uid, email: user.email! } : undefined
				);
				setUserLoggedIn(!!user);
				setIsLoading(false);
			});
			return () => authListenerUnsubscribe();
		} catch (error) {
			setCurrentUser(undefined);
			setUserLoggedIn(false);
		}
	}, []);

	return (
		<RemoteUserContext.Provider
			value={{ remoteUser: currentUser, userLoggedIn: userLoggedIn }}
		>
			{isLoading ? <></> : children}
		</RemoteUserContext.Provider>
	);
};
