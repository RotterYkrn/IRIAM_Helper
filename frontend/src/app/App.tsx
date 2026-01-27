import "../index.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import CreateEndurancePage from "./pages/CreateEndurancePage";
import ProjectPage from "./pages/ProjectPage";
import TopPage from "./pages/TopPage";

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route
                    path="/"
                    element={<TopPage />}
                />

                <Route
                    path="/projects/create/endurance"
                    element={<CreateEndurancePage />}
                />

                <Route
                    path="/projects/:projectId"
                    element={<ProjectPage />}
                />

                <Route
                    path="*"
                    element={<div>404 - Not Found</div>}
                />
            </Route>
        </Routes>
    );
};

export default App;
