import React, {useMemo, useState} from 'react';
import {
	AppBar,
	fade,
	IconButton,
	IconButtonProps,
	InputBase,
	makeStyles,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MoreVert';
import LightThemeIcon from '@material-ui/icons/Brightness7';
import DarkThemeIcon from '@material-ui/icons/Brightness4';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Close';
import {useAppDispatch, useAppSelector} from '../store/store';
import {selectTodo, todoActions} from '../store/todoSlice';
import {selectTheme, themeActions} from '../store/themeSlice';

const menuId = 'appbar-menu';

enum MenuItemKey {
	theme,
	delete
}

export default function Header() {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const d = useAppDispatch();
	const {darkMode} = useAppSelector(selectTheme('darkMode'));
	const {searchText, idsForDeletion} = useAppSelector(selectTodo('searchText', 'idsForDeletion'))
	const deleteMode = useMemo(() => !!idsForDeletion, [idsForDeletion]);


	const handleMenuClick: IconButtonProps['onClick'] = event => {
		setAnchorEl(event.currentTarget);
	}

	const handleMenuClose = () => {
		setAnchorEl(null);
	}

	const handleMenuItemClick = (forKey: MenuItemKey) => () => {
		handleMenuClose();
		switch (forKey) {
			case MenuItemKey.theme:
				return d(themeActions.toggleTheme());
			case MenuItemKey.delete:
				return d(todoActions.setIdsForDeletion(true));
			default:
				throw new Error('Invalid key for Menu Item Click Handler');
		}
	}

	const handleOnDelete = () => {
		// onDelete();
		d(todoActions.deleteAllSelected());
		handleMenuClose();
		// setDeleteMode(false);
		d(todoActions.setIdsForDeletion(false));
	}

	return (
		<AppBar position="sticky">
			<Toolbar>
				<Typography className={classes.title} variant="h6">Todo App</Typography>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						placeholder="Search…"
						value={searchText}
						onChange={({target}) => d(todoActions.setSearchText(target.value))}
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{'aria-label': 'search'}}
					/>
				</div>
				{deleteMode ? (
					<div>
						<IconButton onClick={handleOnDelete}>
							<DeleteIcon />
						</IconButton>
						<IconButton onClick={() => d(todoActions.setIdsForDeletion(false))}>
							<CancelIcon />
						</IconButton>
					</div>
				) : (
					<div>
						<IconButton aria-label="display more actions"
						            aria-controls={menuId}
						            edge="end"
						            color="inherit"
						            onClick={handleMenuClick}>
							<MenuIcon />
						</IconButton>
						<Menu id={menuId} open={!!anchorEl} anchorEl={anchorEl} anchorOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}} transformOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}} keepMounted onClose={handleMenuClose}>
							<MenuItem key={MenuItemKey.theme} onClick={handleMenuItemClick(MenuItemKey.theme)}>
								{darkMode ?
									<><LightThemeIcon className={classes.menuItemIcon} /> Light</> :
									<><DarkThemeIcon className={classes.menuItemIcon} /> Dark</>}
							</MenuItem>
							<MenuItem key={MenuItemKey.delete} onClick={handleMenuItemClick(MenuItemKey.delete)}>
								<DeleteIcon className={classes.menuItemIcon} /> Delete
							</MenuItem>
						</Menu>
					</div>)}
			</Toolbar>
		</AppBar>
	);
};

const useStyles = makeStyles((theme) => ({
	title: {
		flex: 1
	},
	menuItemIcon: {
		marginRight: '1rem'
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '20ch',
		},
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		// width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
}));
