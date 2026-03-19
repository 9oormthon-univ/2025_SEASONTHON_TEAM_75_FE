import * as L from "@routes/partner/ScanLoadingStyle";
import Lottie from "lottie-react";
import loadingAnimation from "@assets/search.json";
import apiClient from "@utils/apiClient";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScanLoading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRequesting = useRef(false);
  const { userCouponId, qrToken } =
    (location.state as { userCouponId: number; qrToken: string }) || {};

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    style: { width: "350px" },
  };

  useEffect(() => {
    if (!userCouponId || !qrToken) {
      navigate("/partner/scan/fail", {
        state: { message: "유효하지 않은 QR 데이터입니다." },
        replace: true,
      });
      return;
    }

    const handleProcess = async () => {
      if (isRequesting.current) return;
      isRequesting.current = true;

      try {
        const getRes = await apiClient.get(`/api/v1/my/coupons/qr`, {
          params: { userCouponId, qrToken },
        });

        const couponInfo = getRes.data.data;

        if (couponInfo.usability.status !== "AVAILABLE") {
          navigate("/partner/scan/fail", {
            state: {
              message:
                couponInfo.usability.reason || "사용할 수 없는 쿠폰입니다.",
            },
            replace: true,
          });
          return;
        }

        const patchRes = await apiClient.patch(
          `/api/v1/partner/user-coupons/${userCouponId}`,
        );

        navigate("/partner/scan/success", {
          state: { couponData: couponInfo },
          replace: true,
        });
      } catch (error: any) {
        console.error("처리 중 에러 발생:", error);
        navigate("/partner/scan/fail", {
          state: {
            message:
              error.response?.data?.message || "처리 중 오류가 발생했습니다.",
          },
          replace: true,
        });
      }
    };

    handleProcess();
  }, [userCouponId, qrToken, navigate]);

  return (
    <L.Container>
      <Lottie {...lottieOptions} />
      <L.Text>
        QR을 확인하고 있어요...<div>잠시만 기다려주세요</div>
      </L.Text>
    </L.Container>
  );
};

export default ScanLoading;
