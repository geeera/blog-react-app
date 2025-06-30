import {Button, Card, CardContent, CircularProgress, Fab, Stack, TextField} from '@mui/material';
import React, {FC, useRef, useState} from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import './PostForm.css'
import {useAppDispatch} from "../../../../@core/store";
import {createPost, Post, updatePost} from "../../../../@core/store/posts/posts.reducer";

export const PostSchema = z
    .object({
        title: z.string().nonempty('Field can\'t be empty'),
        description: z
            .string().nonempty('Description can\'t be empty').nonempty('Field can\'t be empty'),
        image: z.any()
    });

type FormData = z.infer<typeof PostSchema>;

interface PostFormProps {
    onCancel: () => void;
    post?: Post;
}

const PostForm: FC<PostFormProps> = ({ onCancel, ...props }) => {
    const [isLoading, setLoadingState] = useState(false);
    const dispatch = useAppDispatch();
    const imagePickerRef = useRef<HTMLInputElement>(null);
    const initialValues = props?.post
        ? { title: props.post.title, description: props.post.description, image: props.post.image }
        : { title: '', description: '', image: '' };
    const { register, handleSubmit, reset, formState: { errors }, setValue, getValues, control } = useForm<FormData>({
        defaultValues: initialValues,
        resolver: zodResolver(PostSchema)
    });
    const [uploadState, setUploadState] = React.useState("initial");

    const handleUploadClick = (event: any) => {
        setUploadState("pending");
        var file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                if (reader) {
                    console.log(reader.result);
                    setValue('image', reader.result);
                    setUploadState("uploaded");
                }
            };
        }
    };

    const onSubmit = (data: any) => {
        if (isLoading) {
            return;
        }
        setLoadingState(true);
        const action = props?.post ? updatePost : createPost;
        const validData = props?.post ? { ...data, id: props.post.id } : data;
        dispatch(action(validData)).then(() => {
            setLoadingState(false);
            handleClose();
        });
    }

    const handleClose = () => {
        reset();
        onCancel();
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction='column' spacing={2} sx={{ minWidth: 325 }}>
            <TextField
                id="standard-basic"
                label="Title"
                variant="standard"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register('title', { required: true })}
            />
            <TextField
                label="Description"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description', { required: true })}
            />
            <Card>
                <CardContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundImage: getValues('image') ? `url(${getValues('image')})` : null,
                        minHeight: 195,
                        "& .show-on-hover": {
                            opacity: 0,
                            transition: '.4s'
                        },
                        "&:hover .show-on-hover": {
                            opacity: 1
                        },
                    }}
                    className={`picker ${uploadState}`}
                >
                    <input
                        accept="image/jpeg,image/png,image/tiff,image/webp"
                        id="contained-button-file"
                        name="preview"
                        type="file"
                        onChange={handleUploadClick}
                        disabled={uploadState === "pending"}
                        ref={imagePickerRef}
                        style={{ opacity: 0, position: 'absolute' }}
                    />
                    <label
                        htmlFor="contained-button-file"
                        className={uploadState === 'uploaded' ? 'show-on-hover' : ''}
                    >
                        { uploadState === 'pending'
                            ? <CircularProgress />
                            : <Fab component="span">
                                <AddPhotoAlternateIcon />
                            </Fab> }
                    </label>
                </CardContent>
            </Card>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <Button variant="text" color='error' onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color='primary' onClick={handleSubmit(onSubmit)}>Confirm</Button>
            </Stack>
        </Stack>
    </form>;
};

export default PostForm;
