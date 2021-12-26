import React, {
	PropsWithChildren,
	useEffect,
	useState,
	createContext,
} from 'react';
import { auth } from '../models/firebase';
import { RemoteUser } from '../types/remote';

export const RemoteUserContext = createContext({});

const RemoteUserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<RemoteUser | undefined>();
	const [userLoggedIn, setUserLoggedIn] = useState<boolean | undefined>();

	useEffect(() => {
		const authListenerUnsubscribe = auth.listenForAuthChanges((user) => {
			setCurrentUser(user ? { uid: user.uid, email: user.email! } : undefined);
			setUserLoggedIn(!!user);
		});

		return () => authListenerUnsubscribe();
	}, []);

	return (
		<RemoteUserContext.Provider
			value={{ remoteUser: currentUser, userLoggedIn: userLoggedIn }}
		>
			{children}
		</RemoteUserContext.Provider>
	);
};

export default RemoteUserProvider;
