import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

//dynamic imports
const Page404 = lazy(() => import("../pages/404")),
    MainPage = lazy(() => import("../pages/MainPage/MainPage")),
    ComicsPage = lazy(() => import("../pages/ComicsPage")),
    SingleComicPage = lazy(() => import("../pages/SingleComicPageLayout/SingleComicPage")),
    SingleCharPage = lazy(() => import("../pages/SingleCharPageLayout/SingleCharPage")),
    SinglePage = lazy(() => import("../pages/SinglePage"));

const App = () => {
    return (
        <HelmetProvider>
            <Router>
                <div className="app">
                    <AppHeader />
                    <main>
                        <Suspense fallback={<Spinner />}>
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route path="/comics" element={<ComicsPage />} />
                                <Route
                                    path="/comics/:id"
                                    element={<SinglePage Component={SingleComicPage} dataType="comic" />}
                                />
                                <Route
                                    path="/characters/:id"
                                    element={<SinglePage Component={SingleCharPage} dataType="character" />}
                                />
                                <Route path="*" element={<Page404 />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </HelmetProvider>
    );
};

export default App;
