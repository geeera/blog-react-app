import {AsyncThunk, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import {db} from "../../firebase";

export interface Post {
    id: string;
    title: string;
    description: string;
    image: string;
}

const mockPost = {
    id: '1',
        title: 'My First Post',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida aliquet nisi quis mollis. Integer pellentesque ante sed elit bibendum mattis. Quisque convallis venenatis faucibus. Vivamus orci lorem, rutrum id tristique non, sodales non turpis. Mauris sapien leo, volutpat a gravida sed, interdum vulputate est. In nec eros a orci pulvinar viverra vitae id est. Pellentesque id luctus enim. Integer sed lacus quis tortor malesuada efficitur. Cras id lobortis tortor, et blandit diam. Ut vitae scelerisque purus. Cras eget est ac lorem laoreet consectetur. Vestibulum id leo in ligula dictum rhoncus.',
    image: ''
}

const mockPosts: Post[] = [
    mockPost,
    { ...mockPost , id: '2' },
    { ...mockPost , id: '3' },
    { ...mockPost , id: '4' },
]

export interface PostsState {
    posts: Post[];
}

const initialState: PostsState = {
    posts: [],
}

const postsCollection = collection(db, "posts");

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await getDocs(postsCollection);
        return response.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    },
);

interface PostCreationData {
    title: string;
    description: string;
    image: string;
}

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (data: PostCreationData) => {
        const newPost = await addDoc(postsCollection, {
            title: data.title,
            description: data.description,
            image: data.image,
        });

        return { ...data, id: newPost.id };
    },
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId: string) => {
        const postDoc = doc(db, "posts", postId);
        await deleteDoc(postDoc);

        return { id: postId };
    },
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async (data: Post) => {
        const postDoc = doc(db, "posts", data.id);
        await updateDoc(postDoc, { ...data });

        return data;
    },
)

export const findPost = createAsyncThunk(
    'posts/findPost',
    async (postId: string) => {
        const postRef = doc(db, "posts", postId);
        const result = await getDoc(postRef);
        return result.data() as Post;
    },
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Posts pipeline
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {})
            // Create Post pipeline
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {})
            // Delete Post pipeline
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(post => post.id !== action.payload.id);
            })
            // Update Post pipeline
            .addCase(updatePost.fulfilled, (state, action) => {
                state.posts = state.posts.map(post => {
                    if (post.id === action.payload.id) {
                        return action.payload;
                    }
                    return post;
                });
            })
            // Find Post pipeline
            .addCase(findPost.fulfilled, (state, action) => {})
    },
})

export const {} = postsSlice.actions
export default postsSlice.reducer
