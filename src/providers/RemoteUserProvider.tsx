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

	useEffect(() => {
		const authListenerUnsubscribe = auth.listenForAuthChanges((user) => {
			setCurrentUser(user ? { uid: user.uid, email: user.email! } : undefined);
		});

		return () => authListenerUnsubscribe();
	}, []);

	return (
		<RemoteUserContext.Provider value={{ remoteUser: currentUser }}>
			{children}
		</RemoteUserContext.Provider>
	);
};

export default RemoteUserProvider;
