import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import {useAppDispatch} from "../../@core/store";
import {findPost, Post as PostData} from "../../@core/store/posts/posts.reducer";
import {
    Card, CardContent, CardHeader, CardMedia,
    IconButton,
    Typography
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Post = () => {
    const { id: postId } = useParams();
    if (!postId) {
        throw new Error('No such post');
    }
    const [currentPost, setCurrentPost] = useState<PostData | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const result = dispatch(findPost(postId))
        result.unwrap().then((post) => {
            setCurrentPost(post);
        })
    }, [postId, dispatch])

    if (!currentPost) {
        return <></>
    }

    return <>
        <Card variant="outlined">
            <CardHeader
                title={currentPost.title}
                avatar={<IconButton
                    aria-label="add"
                    size="large"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon fontSize="inherit" color="primary" />
                </IconButton>}
            />
            {currentPost.image && <CardMedia
                component="img"
                sx={{ height: '50vh' }}
                image={currentPost.image}
            />}
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                    { currentPost.description }
                </Typography>
            </CardContent>
        </Card>
    </>
};

export default Post;
