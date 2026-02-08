import { Container } from "@mui/material";

import Header from "./components/Header";
import AppDrawer from "./components/AppDrawer";

export default function App() {
    return <div>
        <Header />
        <AppDrawer />

        <Container maxWidth="sm" sx={{ mt: 4 }}>

        </Container>
    </div>
}
