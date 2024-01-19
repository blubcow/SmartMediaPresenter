export const getFormattedDate = (timestamp: number): string => {
	const date = new Date(timestamp);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();

	return `${day}.${month}.${year} ${hour < 10 ? '0' + hour : hour}:${
		minute < 10 ? '0' + minute : minute
	}`;
};
