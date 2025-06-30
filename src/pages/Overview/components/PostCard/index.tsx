import React, {useState} from "react";
import {deletePost, Post} from "../../../../@core/store/posts/posts.reducer";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, Slide,
    Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DetailsIcon from '@mui/icons-material/Details';
import {useAppDispatch} from "../../../../@core/store";
import PostForm from "../PostForm";
import {TransitionProps} from "@mui/material/transitions";
import {useNavigate} from "react-router";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const PostCard = (props: Post) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isOpenConfirmDialog, setConfirmDialogState] = useState(false);
    const [isOpenUpdatePostDialog, setUpdatePostDialogState] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isOpenDescription, setDescriptionState] = useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleDeletePost = () => {
        dispatch(deletePost(props.id)).then(() => {
            setConfirmDialogState(false)
        })
    }

    const navigateToPostDetail = () => {
        handleClose();
        navigate(`/post/${props.id}`);
    }

    return <Card sx={{ maxWidth: 325, height: 'max-content' }} variant="outlined">
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
                list: {
                    'aria-labelledby': 'basic-button',
                },
            }}
        >
            <MenuItem onClick={() => {
                handleClose();
                setUpdatePostDialogState(true);
            }}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={navigateToPostDetail}>
                <ListItemIcon>
                    <DetailsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Details</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setConfirmDialogState(true)}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error"/>
                </ListItemIcon>
                <ListItemText color="error">Delete</ListItemText>
            </MenuItem>
        </Menu>

        {/* Delete confirm dialog */}
        <Dialog fullWidth open={isOpenConfirmDialog} onClose={() => setConfirmDialogState(false)}>
            <DialogTitle>Are You sure?</DialogTitle>
            <DialogActions>
                <Button onClick={() => setConfirmDialogState(false)}>Cancel</Button>
                <Button onClick={handleDeletePost}>Apply</Button>
            </DialogActions>
        </Dialog>

        {/* Update post dialog */}
        <Dialog
        open={isOpenUpdatePostDialog}
        slots={{
            transition: Transition,
        }}
        keepMounted
        onClose={() => setUpdatePostDialogState(false)}
        aria-describedby="alert-dialog-slide-description"
        >
        <DialogTitle>Post form</DialogTitle>
        <DialogContent>
            <PostForm
                onCancel={() => setUpdatePostDialogState(false)}
                post={props}
            />
        </DialogContent>
    </Dialog>

        <CardHeader
            title={props.title}
            action={
                <IconButton aria-label="settings" onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
            }
        />
        {props.image && <CardMedia
            component="img"
            height="194"
            image={props.image}
        />}
        <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }} onClick={() => setDescriptionState(true)}>
                { props.description.length > 100 && !isOpenDescription ? `${props.description.substring(0, 97).trim()}...` : props.description }
            </Typography>
        </CardContent>
    </Card>;
}

export default PostCard;
