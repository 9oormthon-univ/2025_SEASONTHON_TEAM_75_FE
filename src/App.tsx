import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "@styles/GlobalStyle";
import Layout from "@styles/Layout";
import Home from "@routes/home/Home";
import Onboarding from "@routes/onboarding/Onboarding";
import Map from "@routes/map/Location";
import Scan from "@routes/scan/Scan";
import Chat from "@routes/chat/Chat";
import History from "@routes/history/History";
import Setting from "@routes/setting/Setting";
import NotFound from "@routes/NotFound";
import theme from "@styles/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout showNavbar={false}>
                  <Onboarding />
                </Layout>
              }
            />
            <Route
              path="/map"
              element={
                <Layout showNavbar={false}>
                  <Map />
                </Layout>
              }
            />
            <Route
              path="/home"
              element={
                <Layout showNavbar={true}>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/scan"
              element={
                <Layout showNavbar={false}>
                  <Scan />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <Layout showNavbar={true}>
                  <Chat />
                </Layout>
              }
            />
            <Route
              path="/history"
              element={
                <Layout showNavbar={true}>
                  <History />
                </Layout>
              }
            />
            <Route
              path="/setting"
              element={
                <Layout showNavbar={true}>
                  <Setting />
                </Layout>
              }
            />
            <Route
              path="*"
              element={
                <Layout showNavbar={false}>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
