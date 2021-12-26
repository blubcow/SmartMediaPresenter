import { useContext } from 'react';
import { RemoteUserContext } from '../providers/RemoteUserProvider';
import { RemoteUser } from '../types/remote';

const useRemoteUserContext = () => {
	const context = useContext(RemoteUserContext) as {
		remoteUser?: RemoteUser;
		userLoggedIn?: boolean;
	};

	if (!context)
		throw new Error(
			'useRemoteUserContext hook has to be called inside of an RemoteUserProvider!'
		);

	return context;
};

export default useRemoteUserContext;
