import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, CheckCircle2, Clock, ServerCrash, Crown, Activity } from 'lucide-react';

type RequestLog = {
  id: string;
  timestamp: number;
  type: 'standard' | 'premium';
  status: number;
  remaining?: string | null;
  reset?: string | null;
  message?: string;
};

export default function Home() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isLoading, setIsLoading] = useState<'standard' | 'premium' | null>(null);

  const makeRequest = useCallback(async (type: 'standard' | 'premium') => {
    setIsLoading(type);
    const start = Date.now();
    try {
      const res = await fetch(`http://localhost:3001/api/${type}`);
      const data = await res.json().catch(() => null);
      
      const newLog: RequestLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        type,
        status: res.status,
        remaining: res.headers.get('X-RateLimit-Remaining'),
        reset: res.headers.get('X-RateLimit-Reset'),
        message: data?.message || (res.status === 429 ? 'Rate Limit Exceeded' : 'Success'),
      };

      setLogs(prev => [newLog, ...prev].slice(0, 20)); // Keep last 20
    } catch (err) {
      console.error(err);
      const newLog: RequestLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        type,
        status: 500,
        message: 'Network Error',
      };
      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }
    // Artificial small delay for UI smoothness if very fast
    const elapsed = Date.now() - start;
    if (elapsed < 150) {
      await new Promise(r => setTimeout(r, 150 - elapsed));
    }
    setIsLoading(null);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Hero Section */}
      <div className="hero rounded-3xl bg-base-200/50 p-10 overflow-hidden relative border border-base-300 shadow-xl">
        {/* Decorative Background Gradients */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full"></div>
        
        <div className="hero-content text-center z-10 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              Live Demonstration
            </h1>
            <p className="py-2 text-lg opacity-80 leading-relaxed mb-8">
              Experience the <strong>Sliding Window Log</strong> algorithm in real-time. 
              Click the endpoints below to fire requests to our Express backend. 
              Notice how precise the boundaries are handled without the edge-case flaws of fixed-window limiters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary" /> Endpoints
          </h2>
          
          {/* Standard Endpoint Card */}
          <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-primary/5 transition-all">
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                <span className="flex items-center gap-2"><Zap className="text-blue-500" /> Standard API</span>
                <div className="badge badge-primary badge-outline">5 req / 10s</div>
              </h2>
              <p className="text-sm opacity-70 mb-4 text-left">Strictly limited for standard users.</p>
              <div className="card-actions justify-end mt-auto">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => makeRequest('standard')}
                  disabled={isLoading === 'standard'}
                >
                  {isLoading === 'standard' ? <span className="loading loading-spinner"></span> : 'Send GET Request'}
                </button>
              </div>
            </div>
          </div>

          {/* Premium Endpoint Card */}
          <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-secondary/5 transition-all">
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                <span className="flex items-center gap-2"><Crown className="text-amber-500" /> Premium API</span>
                <div className="badge badge-secondary badge-outline">10 req / 5s</div>
              </h2>
              <p className="text-sm opacity-70 mb-4 text-left">Higher limits and faster reset windows for premium users.</p>
              <div className="card-actions justify-end mt-auto">
                <button 
                  className="btn btn-secondary w-full"
                  onClick={() => makeRequest('premium')}
                  disabled={isLoading === 'premium'}
                >
                  {isLoading === 'premium' ? <span className="loading loading-spinner"></span> : 'Send GET Request'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="text-primary" /> Real-time Log
            </h2>
            <div className="text-xs opacity-50 font-mono">Last 20 requests</div>
          </div>
          
          <div className="bg-base-300 rounded-2xl p-4 overflow-y-auto h-[450px] border border-base-content/5 shadow-inner">
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center opacity-40 py-20"
                  >
                    <ServerCrash size={48} className="mb-4" />
                    <p>No requests yet. Fire away!</p>
                  </motion.div>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`p-4 rounded-xl shadow-sm border flex items-center gap-4 ${
                        log.status === 200 
                          ? 'bg-success/10 border-success/20' 
                          : 'bg-error/10 border-error/20'
                      }`}
                    >
                      <div className="shrink-0">
                        {log.status === 200 ? (
                          <CheckCircle2 className="text-success" size={28} />
                        ) : (
                          <ShieldAlert className="text-error" size={28} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                            {log.type === 'standard' ? <Zap size={14} /> : <Crown size={14} />}
                            {log.type}
                          </span>
                          <span className={`badge badge-sm font-mono ${log.status === 200 ? 'badge-success' : 'badge-error'}`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="text-xs opacity-70 font-mono truncate">
                          {log.message}
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-xs font-mono bg-base-100/50 p-2 rounded-lg">
                        <div className="opacity-60 mb-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        {log.remaining !== undefined && (
                          <div className={Number(log.remaining) === 0 ? 'text-error font-bold' : 'text-primary'}>
                            Rem: {log.remaining || 0}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
