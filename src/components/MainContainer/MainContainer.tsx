import React, {ReactNode} from 'react';
import {Container, ContainerProps, makeStyles} from '@material-ui/core';

type MainContainerProps = ContainerProps & {
	header?: ReactNode;
	footer?: ReactNode;
}

export default function MainContainer({children, header, footer}: MainContainerProps) {
	const classes = useStyles();
	return (
		<Container className={classes.mainContainer}>
			<Container maxWidth="md" className={classes.innerContainer}>
				{header}
				<Container className={classes.childrenContainer}>{children}</Container>
				<div className={classes.footerContainer}>
					{footer}
				</div>
			</Container>
		</Container>
	);
};

const useStyles = makeStyles(theme => ({
	mainContainer: {
		position: 'relative',
		height: '100vh',
		width: '100vw',
		padding: 0
	},
	innerContainer: {
		background: theme.palette.background.paper,
		height: '100vh',
		position: 'relative',
		padding: 0
	},
	childrenContainer: {
		height: 'calc(100vh - 8rem)',
		overflow: 'auto'
	},
	footerContainer: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%',
	}
}));
