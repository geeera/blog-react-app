import React, {useEffect, useState} from 'react';
import './Overview.css';
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../@core/store";
import PostCard from "./components/PostCard";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Stack, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PostForm from "./components/PostForm";
import { TransitionProps } from '@mui/material/transitions';
import {fetchPosts} from "../../@core/store/posts/posts.reducer";
import Masonry from '@mui/lab/Masonry';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Overview = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const loadedPosts = useSelector((state: RootState) => state.posts.posts);

    useEffect(() => {
        const promise = dispatch(fetchPosts())
        return () => {
            promise.abort();
        }
    }, [dispatch])

    if (!loadedPosts.length) {
        return <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="column"
            useFlexGap
            sx={{ alignItems: "center", justifyContent: "center", height: '80vh' }}
        >
            <Typography variant="h3" gutterBottom>
                Post no found.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                You can create your first post <Button variant="outlined" onClick={() => setOpen(true)}>Create</Button>
            </Typography>
        </Stack>
    }

    const handleClose = () => {
        setOpen(false);
    }

    return <Stack sx={{ padding: '1rem 2rem' }}>
        <Masonry columns={4} spacing={2}>
            { loadedPosts.map((post) => <PostCard key={post.id} { ...post } />) }
        </Masonry>
        <IconButton
            aria-label="add"
            size="large"
            sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
            onClick={() => setOpen(true)}
        >
            <AddCircleOutlineIcon fontSize="inherit" color="primary" />
        </IconButton>

        <Dialog
            open={open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Post form</DialogTitle>
            <DialogContent>
                <PostForm onCancel={handleClose} />
            </DialogContent>
        </Dialog>
    </Stack>;
};

export default Overview;
