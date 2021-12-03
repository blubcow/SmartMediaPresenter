import React, { useState, useEffect } from 'react';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { Box, Text, Button } from '../../smpUI/components';
import { FullScreen } from 'react-full-screen';
import { SinglePresentation } from '../../shared/types/presentation';
import SlideBox from '../components/SlideBox';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import useStyles from './styles';
import { formatTimer } from '../../util/Formatter';

interface IPresenttionModeProps {
	handle: any;
	presentation: SinglePresentation;
}

const PresentationMode: React.FC<IPresenttionModeProps> = (props) => {
	const { handle, presentation } = props;

	return (
		<FullScreen handle={handle}>
			{handle.active && <Content presentation={presentation} />}
		</FullScreen>
	);
};

const Content = ({ presentation }: { presentation: SinglePresentation }) => {
	const { slideNumber, nextSlide, previousSlide, terminatePresentationMode } =
		usePresentationMode();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [presentationTimer, setPresentationTimer] = useState<number>(0);
	const [slideTimer, setSlideTimer] = useState<number>(0);
	const classes = useStyles();

	const triggerNext = () => {
		if (slideNumber < presentation.slides.length - 1) {
			nextSlide();
		}
	};

	const triggerBack = () => {
		if (slideNumber > 0) {
			previousSlide();
		}
	};

	useEffect(() => {
		setPresentationTimer(0);
		setSlideTimer(0);

		const presInterval = setInterval(() => {
			setPresentationTimer((curr) => curr + 1);
		}, 1000);
		const slideInterval = setInterval(() => {
			setSlideTimer((curr) => curr + 1);
		}, 1000);
	}, []);

	useEffect(() => {
		setSlideTimer(0);
	}, [slideNumber]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			e.preventDefault();
			switch (e.key) {
				case 'Escape':
					terminatePresentationMode();
					break;
				case 'ArrowLeft':
					triggerBack();
					break;
				case 'ArrowRight':
					triggerNext();
					break;
				default:
					break;
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
		};
	});

	return (
		<Box className={classes.container}>
			<Box className={classes.upperBox}>
				<Box className={classes.upperLeftBox}>
					<SlideBox
						slide={presentation.slides[slideNumber]}
						presentationFrameEditingEnabled={false}
					/>
					<Box className={classes.spacer} />
					<Box className={classes.controlsContainer}>
						<Button
							variant='contained'
							onClick={() => {
								if (slideNumber > 0) previousSlide();
							}}
						>
							{t('back')}
						</Button>
						<Box className={classes.slideCounterContainer}>
							<Text variant='h6'>{`${t('slide')} ${slideNumber + 1} ${t(
								'of'
							)} ${presentation.slides.length} ${t('slides')}`}</Text>
						</Box>
						<Button
							variant='contained'
							onClick={() => {
								if (slideNumber < presentation.slides.length - 1) nextSlide();
							}}
						>
							{t('next')}
						</Button>
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.upperRightBox}>
					<Box className={classes.timerContainer}>
						<Text variant='h5'>{t('presentationTime')}</Text>
						<Text variant='h4'>{formatTimer(presentationTimer)}</Text>
					</Box>
					<Box className={classes.spacer} />
					<Box className={classes.timerContainer}>
						<Text variant='h5'>{t('slideTime')}</Text>
						<Text variant='h4'>{formatTimer(slideTimer)}</Text>
					</Box>
				</Box>
			</Box>
			<Divider orientation='horizontal' />
			<Box className={classes.lowerBox}>
				<Text variant='h6'>{t('notes')}</Text>
				<Divider orientation='horizontal' />
				<Box className={classes.notesContainer}>
					<Text className={classes.notes}>
						{presentation.slides[slideNumber].settings?.notes}
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default PresentationMode;
