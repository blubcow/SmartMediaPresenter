import React, {
	PropsWithChildren,
	useEffect,
	useState,
	createContext,
} from 'react';
import { auth } from '../models/firebase';
import { RemoteUser } from '../types/remote';
import LoadingPage from '../views/Loading';

export const RemoteUserContext = createContext({});

const RemoteUserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<RemoteUser | undefined>(
		auth.currentUser
			? { uid: auth.currentUser.uid, email: auth.currentUser.email ?? '' }
			: undefined
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userLoggedIn, setUserLoggedIn] = useState<boolean | undefined>();

	useEffect(() => {
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

export default RemoteUserProvider;
