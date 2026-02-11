import "../index.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import CreateEndurancePage from "./pages/CreateEndurancePage";
import EnduranceProjectPage from "./pages/EnduranceProjectPage";
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
                    path="/projects/endurance/:projectId"
                    element={<EnduranceProjectPage />}
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
