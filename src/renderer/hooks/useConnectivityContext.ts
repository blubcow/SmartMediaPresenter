import { useContext } from 'react';
import { ConnectivityContext } from '../providers/ConnectivityProvider';

const useConnectivityContext = () => {
	const context = useContext(ConnectivityContext) as {
		connected: boolean;
	};

	if (!context)
		throw new Error(
			'useConnectivityContext hook has to be called inside of an ConnectivtyProvider!'
		);

	return context;
};

export default useConnectivityContext;
