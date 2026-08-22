import React from 'react'
import MASAAApp from './masaa-app.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MASAA App Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
          <div className="max-w-md w-full space-y-4 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">MASAA Session Notice</h2>
            <p className="text-xs text-slate-400">A session data mismatch was detected. Resetting session data will restore application functionality.</p>
            {this.state.error && (
              <div className="text-left text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-red-400 overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('masaa_session');
                window.location.reload();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition shadow-lg">
              Reset Session &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MASAAApp />
    </ErrorBoundary>
  )
}
