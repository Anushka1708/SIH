import { useState, useEffect } from "react";
import { WifiOff, AlertTriangle, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [networkError, setNetworkError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setNetworkError(null);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleNetworkErr = (e) => {
      if (e.detail?.message) {
        setNetworkError(e.detail.message);
      } else {
        setNetworkError("Unable to communicate with the server. Please check your connection.");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("skillbridge:network-error", handleNetworkErr);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("skillbridge:network-error", handleNetworkErr);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        setIsOffline(false);
        setNetworkError(null);
        window.location.reload();
      }
    }, 600);
  };

  const showBanner = isOffline || Boolean(networkError);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] max-w-md w-[calc(100vw-3rem)] pointer-events-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="network-error-toast bg-white dark:bg-[#0F172A] border-2 border-[#F43F5E] shadow-2xl rounded-2xl p-4 flex items-start justify-between gap-3 text-[#0F172A] dark:text-[#F8FAFC]"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
              {isOffline ? <WifiOff size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div>
              <p className="toast-title text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
                {isOffline ? "You are currently offline" : "Network Connection Issue"}
              </p>
              <p className="toast-message text-xs text-[#E11D48] dark:text-rose-400 font-semibold mt-0.5 leading-snug">
                {isOffline
                  ? "Check your internet connection to continue syncing your competencies."
                  : networkError || "Server unreachable. Retrying might resolve temporary glitches."}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="toast-retry-btn bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
                  <span>{isRetrying ? "Checking..." : "Retry Connection"}</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOffline(false);
              setNetworkError(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition shrink-0"
            title="Dismiss notice"
          >
            <X size={15} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
