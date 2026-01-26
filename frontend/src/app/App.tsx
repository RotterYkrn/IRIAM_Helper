import "../index.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import CreateEndurancePage from "./pages/CreateEndurancePage";
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
                    path="*"
                    element={<div>404 - Not Found</div>}
                />
            </Route>
        </Routes>
    );
};

export default App;
