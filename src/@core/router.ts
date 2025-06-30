import {createBrowserRouter} from "react-router";
import App from "../App";
import Overview from "../pages/Overview";
import Post from "../pages/Post";

const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            { index: true, Component: Overview },
            { path: 'post/:id', Component: Post },
        ]
    }
]);

export default router;
