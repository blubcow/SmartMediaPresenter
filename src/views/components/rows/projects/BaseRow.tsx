import React from 'react';
import { Row, Box, Text } from '../../../../smpUI/components';
import { IRowProps } from '../../../../smpUI/components/Row';
import useStyles from './styles';

interface IBaseRowProps extends IRowProps {
	title?: string;
	info?: string;
	// TODO: create type for IconBadge: "type IconBadgeType = IconBadge" and use this type here rather than the Element type
	iconBadge?: React.ReactNode;
}

const BaseRow: React.FC<IBaseRowProps> = (props) => {
	const { title, info, iconBadge: IconBadge, rootContainerStyle } = props;
	const classes = useStyles();

	return (
		<Row {...props}>
			<Box className={classes.container} clickable {...props}>
				<Box className={classes.textContainer}>
					{title && <Text fontWeight='bold'>{title}</Text>}
					{info && (
						<Text className={classes.infoLabel} variant='body2'>
							{info}
						</Text>
					)}
				</Box>
				{IconBadge}
			</Box>
		</Row>
	);
};

export default BaseRow;
