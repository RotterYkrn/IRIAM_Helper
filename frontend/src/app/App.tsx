import "../index.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import CreateEndurancePage from "./pages/CreateEndurancePage";
import CreateMultiEndurancePage from "./pages/CreateMultiEndurancePage";
import EnduranceProjectPage from "./pages/EnduranceProjectPage";
import EnterEnduranceDetailPage from "./pages/EnterEnduranceDetailPage";
import EnterEnduranceTopPage from "./pages/EnterEnduranceTopPage";
import MultiEnduranceProjectPage from "./pages/MultiEnduranceProjectPage";
import TopPage from "./pages/TopPage";

import { AppProvider } from "@/contexts/apps/AppProvider";

const App = () => {
    return (
        <AppProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        path="/"
                        element={<TopPage />}
                    />

                    <Route
                        path="/enter-endurance"
                        element={<EnterEnduranceTopPage />}
                    />

                    <Route
                        path="/enter-endurance/:unitId"
                        element={<EnterEnduranceDetailPage />}
                    />

                    <Route
                        path="/projects/create/endurance"
                        element={<CreateEndurancePage />}
                    />

                    <Route
                        path="/projects/create/multi-endurance"
                        element={<CreateMultiEndurancePage />}
                    />

                    <Route
                        path="/projects/endurance/:projectId"
                        element={<EnduranceProjectPage />}
                    />

                    <Route
                        path="/projects/multi-endurance/:projectId"
                        element={<MultiEnduranceProjectPage />}
                    />

                    <Route
                        path="*"
                        element={<div>404 - Not Found</div>}
                    />
                </Route>
            </Routes>
        </AppProvider>
    );
};

export default App;
