import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkillBridge App Error Caught by Boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E0C22] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#181534] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-extrabold text-white">Something went wrong</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              SkillBridge encountered an unexpected rendering error. We have automatically preserved your session state.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleHome}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 transition flex items-center gap-1.5 border border-white/10"
              >
                <Home size={13} />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
