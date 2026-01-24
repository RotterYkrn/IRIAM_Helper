import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

function App() {
    const [time, setTime] = useState("");

    useEffect(() => {
        supabase.rpc("now").then(({ data }) => setTime(data));
    }, []);

    return <div>Supabase time: {time}</div>;
}
export default App;
