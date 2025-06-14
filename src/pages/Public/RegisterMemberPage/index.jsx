import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { showInfo } from "../../../components/Toast";
import { useApp } from "../../../context/AppContext";
import { ChevronDown, Info } from "lucide-react";
import LoadingRing from "../../../components/UI/Loading/ring";
import { fetchUserPlan, registerFreePlan, registerPaidPlan, checkPaymentStatus, cancelPayment, check_trial_ability, register_trial_plan } from "../../../services/LocketDioService/getInfoPlans";
import { plans } from "../../../utils/plans";
import { useLocation } from "react-router-dom";
import { LuImageUp } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { RiVideoUploadLine, RiHeart3Fill } from "react-icons/ri";

const formatPrice = (price) =>
  price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`;

const PAYMENT_TIMEOUT = 300; // 5 minutes in seconds
const PAYMENT_START_KEY = 'paymentStartTime';

export default function RegisterMemberPage() {
  const { modal } = useApp();
  const {
    isModalRegMemberOpen,
    setIsModalRegMemberOpen,
    modalData,
    setModalData,
  } = modal;
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const { user, userPlan, setUserPlan, authTokens } = useContext(AuthContext);
  const location = useLocation();
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialEligible, setTrialEligible] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isModalRegMemberOpen && currentOrderId && !paymentStatus?.isFinished) {
      timeoutId = setTimeout(() => {
        handlePaymentExpired();
      }, PAYMENT_TIMEOUT * 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalRegMemberOpen, currentOrderId, paymentStatus?.isFinished]);

  useEffect(() => {
    let intervalId;
    if (isModalRegMemberOpen && currentOrderId && !paymentStatus?.isFinished) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isModalRegMemberOpen, currentOrderId, paymentStatus?.isFinished]);

  useEffect(() => {
    if (isModalRegMemberOpen) {
      const startTime = localStorage.getItem(PAYMENT_START_KEY);
      if (startTime) {
        const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
        const remaining = PAYMENT_TIMEOUT - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          setIsModalRegMemberOpen(false);
        }
      } else {
        setTimeLeft(PAYMENT_TIMEOUT);
      }
    }
  }, [isModalRegMemberOpen]);

  const handlePaymentExpired = async () => {
    try {
      await cancelPayment(currentOrderId);
      showInfo("Phiên thanh toán đã hết hạn. Vui lòng thử lại!");
      setIsModalRegMemberOpen(false);
      setCurrentOrderId(null);
      setPaymentStatus(null);
      setTimeLeft(PAYMENT_TIMEOUT);
      localStorage.removeItem(PAYMENT_START_KEY);
    } catch (error) {
      console.error("Error handling expired payment:", error);
    }
  };

  const handleSelectPlan = async (planId, planName) => {
    if (!user || !authTokens?.idToken) {
      showInfo("Vui lòng đăng nhập để đăng ký gói thành viên!");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn đăng ký gói ${planName}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      
      if (planId === "free") {
        await registerFreePlan(user, authTokens.idToken);
        showInfo(`Bạn đã đăng ký gói ${planName} thành công!`);
        const data = await fetchUserPlan(user.localId);
        if (data) setUserPlan(data);
      } else {
        // Handle paid plans
        const result = await registerPaidPlan(user, planId);
        if (result.success) {
          const startTime = Date.now();
          localStorage.setItem(PAYMENT_START_KEY, startTime);
          setCurrentOrderId(result.order_id);
          setPaymentStatus(null);
          setTimeLeft(PAYMENT_TIMEOUT);
          setModalData({
            ...plans.find(p => p.id === planId),
            qr_code: result.qr_code,
            order_id: result.order_id
          });
          setIsModalRegMemberOpen(true);
        }
      }
    } catch (err) {
      console.error(`❌ Lỗi đăng ký gói ${planName}:`, err);
      showInfo(err.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!currentOrderId) return;

    try {
      setPaymentLoading(true);
      await cancelPayment(currentOrderId);
      showInfo("Đã hủy yêu cầu thanh toán");
      setIsModalRegMemberOpen(false);
      setCurrentOrderId(null);
      setPaymentStatus(null);
      setTimeLeft(PAYMENT_TIMEOUT);
      localStorage.removeItem(PAYMENT_START_KEY);
    } catch (error) {
      console.error("Error canceling payment:", error);
      showInfo(error.message || "Không thể hủy thanh toán. Vui lòng thử lại!");
    } finally {
      setPaymentLoading(false);
    }
  };

  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const handleRefreshPlan = async () => {
    const now = Date.now();
    const debounceDelay = 20 * 1000; // 10 giây

    if (!user || !authTokens?.idToken) return;

    // 👉 Kiểm tra nếu chưa đủ thời gian giữa 2 lần bấm
    if (now - lastRefreshTime < debounceDelay) {
      showInfo("Vui lòng đợi vài giây trước khi cập nhật lại.");
      return;
    }

    setLoading(true);
    setLastRefreshTime(now); // Cập nhật thời điểm bấm nút

    try {
      const data = await fetchUserPlan(authTokens.localId);
      if (data) {
        setUserPlan(data);
        showInfo("Đã cập nhật gói thành công!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật gói:", err);
      showInfo("Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  // Format time left as MM:SS
  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Close modal and clear payment state on route change or page unload
  useEffect(() => {
    const handleUnload = () => {
      setIsModalRegMemberOpen(false);
      setCurrentOrderId(null);
      setPaymentStatus(null);
      setTimeLeft(PAYMENT_TIMEOUT);
      localStorage.removeItem(PAYMENT_START_KEY);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  useEffect(() => {
    // If the user navigates away from this page, close modal and clear payment state
    handleRouteChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function handleRouteChange() {
    setIsModalRegMemberOpen(false);
    setCurrentOrderId(null);
    setPaymentStatus(null);
    setTimeLeft(PAYMENT_TIMEOUT);
    localStorage.removeItem(PAYMENT_START_KEY);
  }

  // Add useEffect to check trial eligibility when component mounts
  useEffect(() => {
    const checkTrialEligibility = async () => {
      if (user?.localId) {
        const eligible = await check_trial_ability(user.localId);
        setTrialEligible(eligible);
      }
    };
    checkTrialEligibility();
  }, [user]);

  // Add trial registration handler
  const handleTrialRegistration = async (planId) => {
    if (!user || !authTokens?.idToken) {
      showInfo("Vui lòng đăng nhập để đăng ký gói dùng thử!");
      return;
    }

    if (!trialEligible) {
      showInfo("Bạn không đủ điều kiện để đăng ký gói dùng thử!");
      return;
    }

    const confirmed = window.confirm(
      "Bạn có chắc muốn đăng ký gói dùng thử 14 ngày?"
    );
    if (!confirmed) return;

    try {
      setTrialLoading(true);
      const success = await register_trial_plan(user.localId);
      
      if (success) {
        showInfo("Đăng ký gói dùng thử thành công!");
        const data = await fetchUserPlan(user.localId);
        if (data) setUserPlan(data);
      } else {
        showInfo("Đăng ký gói dùng thử thất bại. Vui lòng thử lại sau!");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng ký gói dùng thử:", err);
      showInfo(err.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold text-center text-base-content">
        Đăng ký thành viên Locket Kanade
      </h1>
      <div className="text-sm max-w-md mx-auto">
        {/* Nút toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 mx-auto text-blue-600 hover:underline select-none"
        >
          <span className="font-medium flex items-center flex-row">
            <Info className="w-4 mr-1" />{" "}
            {isExpanded ? "Thu gọn" : "Giới thiệu về gói thành viên"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-500 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Nội dung trượt */}
        <div
          className={`overflow-hidden transition-all duration-500 mb-4 z-10 relative ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-base-100 border-2 border-dashed rounded-lg p-4 text-justify shadow mt-3">
            <p>
              Gói thành viên <strong>Locket Kanade</strong> đem đến trải nghiệm đầy
              đủ: đăng ảnh, video, tùy chỉnh theme, cùng nhiều tiện ích độc
              quyền.
            </p>
            <p className="mt-2">
              Giá gói được xây dựng tương xứng với tính năng. 100% doanh thu
              được tái đầu tư cho hạ tầng máy chủ, bảo trì và phát triển tính
              năng mới nhằm phục vụ cộng đồng tốt hơn.
            </p>
            <p className="mt-2 italic text-gray-500">
              Cảm ơn bạn đã đồng hành và ủng hộ Locket Kanade! 💖
            </p>
            <p className="mt-2">
                Sau khi thanh toán xong, hãy đợi vài giây rồi bấm làm mới, nếu chưa thấy plan, liên hệ mình qua discord bên dưới !
            </p>
            <p className="mt-2 italic text-red-1000">
              Nếu có vấn đề gì trong lúc mua hàng, đừng ngần ngại liên hệ tui ở https://discord.gg/atYksnMFaj
            </p>
          </div>
        </div>
      </div>
      {/* 👉 Hiển thị gói hiện tại nếu có */}
      {userPlan && userPlan.plan_info ? (
        <>
          <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl mb-4">
            <div className="card-body p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Left side - Plan Perks */}
              <div className="w-full sm:w-1/3 bg-base-200 p-4 rounded-box">
                <h3 className="text-lg font-semibold text-primary mb-3">Giới hạn gói</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LuImageUp size={27} />
                    <span className="text-sm">
                      Upload ảnh: <span className="font-medium">{userPlan.plan_info.max_image_size || 'Không giới hạn'} MB</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiVideoUploadLine size={27} />
                    <span className="text-sm">
                      Upload video: <span className="font-medium">{userPlan.plan_info.max_video_size || 'Không giới hạn'} MB</span>
                    </span>
                  </div>
                </div>  
              </div>

              {/* Right side - User Info */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                {/* Header: Gói + Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2"><RiHeart3Fill size={25}/> Gói hiện tại</h2>
                  <div className="badge badge-primary">
                    {userPlan.plan_info.name}
                  </div>
                </div>

                {/* Grid Thông tin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🙍‍♂️</span>
                    <span className="font-medium opacity-70">Tên:</span>
                    <span>{user.displayName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">💎</span>
                    <span className="font-medium opacity-70">Gói:</span>
                    <span>
                      {userPlan.plan_info.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaRegClock size={23} />
                    <span className="font-medium opacity-70">Còn lại:</span>
                    <span>
                      {userPlan.end_date ? (
                        (() => {
                          const endDate = new Date(userPlan.end_date);
                          const today = new Date();
                          const diffTime = endDate - today;
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays > 0 ? `${diffDays} ngày` : 'Hết hạn';
                        })()
                      ) : (
                        'Vĩnh viễn'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleRefreshPlan}
              className={`btn btn-primary gap-2 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingRing size={20} stroke={2} />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span>Cập nhật gói</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ❌ Không có gói: Thông báo */}
          <div className="max-w-2xl mx-auto text-center bg-yellow-50 border border-yellow-300 text-yellow-700 p-6 rounded-xl shadow-sm mb-4">
            <p className="text-lg font-medium">Bạn chưa đăng ký gói nào.</p>
            <p className="text-sm text-yellow-600 mt-1">
              Hãy chọn một gói bên dưới để bắt đầu trải nghiệm!
            </p>
          </div>
        </>
      )}

      {/* 👉 Danh sách gói để chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl shadow-md flex flex-col bg-white text-center ${
              userPlan?.plan_id === plan.id ? "ring-4 ring-purple-300" : ""
            }`}
          >
            <h2 
              className="text-xl font-semibold" 
              style={{ 
                color: plan.color || '#9333ea',
                textShadow: `0 0 10px ${plan.color || '#9333ea'}40`
              }}
            >
              {plan.name}
            </h2>
            <p className="text-lg font-bold my-2">{formatPrice(plan.price)}</p>
            <p className="text-sm text-gray-500 mb-3">
              {plan.duration_days > 0
                ? `Hiệu lực: ${plan.duration_days} ngày`
                : "Gói cơ bản miễn phí"}
            </p>
            <ul className="text-sm text-left text-gray-700 space-y-2 flex-1">
              {Object.entries(plan.perks)
                .filter(([perkName, hasAccess]) => hasAccess)
                .map(([perkName], index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-purple-500 font-bold">✔️</span>
                    <span>{perkName}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-4 space-y-2">
              {plan.has_trial_offer && trialEligible ? (
                <button
                  className={`btn w-full ${
                    trialLoading
                      ? "btn-disabled"
                      : "btn-success"
                  }`}
                  onClick={() => handleTrialRegistration(plan.id)}
                  disabled={trialLoading || userPlan?.plan_id === plan.id}
                >
                  {trialLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingRing size={16} stroke={2} />
                      Đang xử lý...
                    </span>
                  ) : userPlan?.plan_id === plan.id ? (
                    "Đang sử dụng"
                  ) : (
                    "Dùng thử 14 ngày"
                  )}
                </button>
              ) : (
                <button
                  className={`btn w-full ${
                    userPlan?.plan_id === plan.id
                      ? "btn-disabled"
                      : "btn-primary"
                  }`}
                  onClick={() => handleSelectPlan(plan.id, plan.name)}
                  disabled={userPlan?.plan_id === plan.id}
                >
                  {userPlan?.plan_id === plan.id
                    ? "Đang sử dụng"
                    : plan.price === 0
                    ? "Bắt đầu miễn phí"
                    : "Chọn gói này"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
