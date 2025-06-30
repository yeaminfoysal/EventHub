import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
// import HomeLayout from "../layout/HomeLayout";
import NotFound from "../Pages/NotFound";
import Home from "../Pages/Home";
import Events from "../Pages/Events";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import PrivateRouter from "../components/PrivateRouter";
import AddEvent from "../Pages/AddEvent";


export const Router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                path: '/',
                Component: Home
            },
            {
                path: '/events',
                // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
                element: <PrivateRouter>
                    <Events></Events>
                </PrivateRouter>
            },
            {
                path: '/add-event',
                // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
                element: <PrivateRouter>
                    <AddEvent></AddEvent>
                </PrivateRouter>
            },
            {
                path: '/my-events',
                // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
                element: <Events></Events>
            },
            {
                path: '/register',
                // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
                element: <Register />
            },
            {
                path: '/login',
                // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
                element: <Login />
            },
            // {
            //     path: '/view-details/:id',
            //     // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
            //     element: <PrivateRouter>
            //         <BookDetailsPage></BookDetailsPage>
            //     </PrivateRouter>
            // },
            // {
            //     path: "/add-book",
            //     element: <PrivateRouter>
            //         <AddBook></AddBook>
            //     </PrivateRouter>
            // },
            // {
            //     path: "/all-Book",
            //     // loader: () => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books`),
            //     element: <PrivateRouter>
            //         <AllBookPage></AllBookPage>
            //     </PrivateRouter>
            // },
            // {
            //     path: "/Borrowed-Books/:email",
            //     // loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/Borrow/${params.email}`),
            //     element: <PrivateRouter>
            //         <BorrowedBooks></BorrowedBooks>
            //     </PrivateRouter>
            // },
            // {
            //     path: '/login',
            //     Component: Login
            // },
            // {
            //     path: "/register",
            //     Component: Register
            // },
            // {
            //     path: "/update-book/:id",
            //     loader: ({ params }) => fetch(`https://assignment-11-server-zeta-orcin.vercel.app/books/${params.id}`),
            //     element: <PrivateRouter>
            //         <UpdateBookPage></UpdateBookPage>
            //     </PrivateRouter>
            // },

        ],

    },
    {
        path: "*",
        Component: NotFound
    },
])