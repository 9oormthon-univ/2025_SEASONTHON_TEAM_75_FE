import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Analytics } from "@vercel/analytics/react";
import GlobalStyle from "@styles/GlobalStyle";
import Layout from "@styles/Layout";
import Home from "@routes/home/Home";
import Splash from "@routes/onboarding/Splash";
import Login from "@routes/onboarding/Login";
import ProfileSetting from "@routes/onboarding/ProfileSetting";
import Location from "@routes/location/Location";
import LocationSearch from "@routes/location/LocationSearch";
import Scan from "@routes/scan/Scan";
import ScanLoading from "@routes/scan/ScanLoading";
import ScanFail from "@routes/scan/ScanFail";
import ScanResult from "@routes/scan/ScanResult";
import Chat from "@routes/chat/Chat";
import History from "@routes/history/History";
import HistoryEdit from "@routes/history/HistoryEdit";
import Setting from "@routes/setting/Setting";
import NotFound from "@routes/NotFound";
import theme from "@styles/theme";
import ProfileComplete from "@routes/onboarding/ProfileComplete";
import Feedback from "@routes/setting/Feedback";
import PartnerHome from "@routes/partner/Home";
import Usage from "@routes/partner/Usage";
import QRScan from "@routes/partner/Scan";
import QRScanLoading from "@routes/partner/ScanLoading";
import QRScanFail from "@routes/partner/ScanFail";
import QRScanSuccess from "@routes/partner/ScanSuccess";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { useAuthActions, useAuthStatus } from "@stores/authStore";
import { useDistrictActions } from "@stores/userDistrictStore";

function AuthInitializer() {
  const status = useAuthStatus();
  const { checkAuth } = useAuthActions();
  const { fetchDistricts } = useDistrictActions();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (status === "loading") {
        const result = await checkAuth();
        if (result === "invalid_token") {
          if (window.confirm("로그인 정보가 만료되었습니다.")) {
            navigate("/login");
          }
        }
      }
    };
    init();

    if (status === "member" || status === "guest") {
      fetchDistricts();
    }
  }, [status, checkAuth, fetchDistricts, navigate]);

  return null;
}

function PartnerGuard() {
  const status = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "partner") {
      alert("파트너 로그인이 필요한 서비스입니다.");
      navigate("/partner");
    }
  }, [status, navigate]);

  if (status !== "partner") return null;

  return <Outlet />;
}

function App() {
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
    libraries: ["services"],
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AuthInitializer />
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <Layout showNavbar={false}>
                    <Splash />
                  </Layout>
                }
              />
              <Route
                path="login"
                element={
                  <Layout showNavbar={false}>
                    <Login />
                  </Layout>
                }
              />
            </Route>
            <Route path="/profile">
              <Route
                index
                element={
                  <Layout showNavbar={false}>
                    <ProfileSetting />
                  </Layout>
                }
              />
              <Route
                path="complete"
                element={
                  <Layout showNavbar={false}>
                    <ProfileComplete />
                  </Layout>
                }
              />
            </Route>
            <Route path="/location">
              <Route
                index
                element={
                  <Layout showNavbar={false}>
                    <Location />
                  </Layout>
                }
              />
              <Route
                path="search"
                element={
                  <Layout showNavbar={false}>
                    <LocationSearch />
                  </Layout>
                }
              />
            </Route>
            <Route
              path="/home"
              element={
                <Layout showNavbar={true}>
                  <Home />
                </Layout>
              }
            />
            <Route path="/scan">
              <Route
                index
                element={
                  <Layout showNavbar={false}>
                    <Scan />
                  </Layout>
                }
              />
              <Route
                path="loading"
                element={
                  <Layout showNavbar={false}>
                    <ScanLoading />
                  </Layout>
                }
              />
              <Route
                path="fail"
                element={
                  <Layout showNavbar={false}>
                    <ScanFail />
                  </Layout>
                }
              />
              <Route
                path="result/:id"
                element={
                  <Layout showNavbar={true}>
                    <ScanResult />
                  </Layout>
                }
              />
            </Route>
            <Route
              path="/chat"
              element={
                <Layout showNavbar={false}>
                  <Chat />
                </Layout>
              }
            />
            <Route path="/history">
              <Route
                index
                element={
                  <Layout showNavbar={true}>
                    <History />
                  </Layout>
                }
              />
              <Route
                path="edit"
                element={
                  <Layout showNavbar={false}>
                    <HistoryEdit />
                  </Layout>
                }
              />
            </Route>
            <Route path="/setting">
              <Route
                index
                element={
                  <Layout showNavbar={true}>
                    <Setting />
                  </Layout>
                }
              />
              <Route
                path="feedback"
                element={
                  <Layout showNavbar={false}>
                    <Feedback />
                  </Layout>
                }
              />
            </Route>
            <Route path="/partner">
              <Route
                index
                element={
                  <Layout showNavbar={true}>
                    {/* 파트너용 시작 화면으로 교체 */}
                    <Feedback />
                  </Layout>
                }
              />
              <Route element={<PartnerGuard />}>
                <Route
                  path="home"
                  element={
                    <Layout showNavbar={false}>
                      <PartnerHome />
                    </Layout>
                  }
                />
                <Route
                  path="scan"
                  element={
                    <Layout showNavbar={false}>
                      <QRScan />
                    </Layout>
                  }
                />
                <Route
                  path="scan/loading"
                  element={
                    <Layout showNavbar={false}>
                      <QRScanLoading />
                    </Layout>
                  }
                />
                <Route
                  path="scan/fail"
                  element={
                    <Layout showNavbar={false}>
                      <QRScanFail />
                    </Layout>
                  }
                />
                <Route
                  path="scan/success"
                  element={
                    <Layout showNavbar={false}>
                      <QRScanSuccess />
                    </Layout>
                  }
                />
                <Route
                  path="usage"
                  element={
                    <Layout showNavbar={false}>
                      <Usage />
                    </Layout>
                  }
                />
              </Route>
            </Route>
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
      <Analytics />
    </>
  );
}

export default App;
