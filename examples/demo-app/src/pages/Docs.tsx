import { useState } from 'react';
import { Copy, Terminal, Server, Zap, Layers, Shield, ChevronDown, Check } from 'lucide-react';

export default function Docs() {
  const [activeTab, setActiveTab] = useState('npm');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)]">
      {/* Left Sidebar (Mimicking Prisma Docs Structure) */}
      <aside className="w-full md:w-64 shrink-0 border-r border-base-300 pr-6 py-4 hidden md:block">
        <nav className="space-y-8 sticky top-24">
          
          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-sm text-base-content mb-3">Getting Started</h4>
            <ul className="space-y-1">
              <li>
                <a href="#introduction" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary transition-colors">
                  Introduction
                </a>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="font-bold text-sm text-base-content mb-3">Atomic Limiter</h4>
            <ul className="space-y-1 text-sm text-base-content/70 font-medium">
              <li>
                <a href="#quickstart" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  Quickstart <ChevronDown size={14} className="ml-auto -rotate-90" />
                </a>
              </li>
              <li>
                <a href="#sliding-window" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  Sliding Window Algorithm <ChevronDown size={14} className="ml-auto -rotate-90" />
                </a>
              </li>
              <li>
                <a href="#redis-lua" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  Redis Lua Optimization
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h4 className="font-bold text-sm text-base-content mb-3">Advanced</h4>
            <ul className="space-y-1 text-sm text-base-content/70 font-medium">
              <li>
                <a href="#custom-identifiers" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  Custom Identifiers
                </a>
              </li>
              <li>
                <a href="#fail-open" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  Fail-Open Handling
                </a>
              </li>
              <li>
                <a href="#api-reference" className="flex items-center px-3 py-2 rounded-md hover:bg-base-200 hover:text-base-content transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-10 py-4 max-w-4xl space-y-16">
        
        {/* Intro Section */}
        <section id="introduction">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">Introduction to Atomic Rate Limiter</h1>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline border-base-300 text-xs gap-2">
                <Copy size={14} /> Copy Markdown
              </button>
            </div>
          </div>
          
          <p className="text-lg text-base-content/80 leading-relaxed mb-8">
            Build perfectly precise, highly-concurrent API limits with ease using <strong>Atomic Rate Limiter</strong>.
          </p>

          <p className="text-base-content/80 leading-relaxed mb-6">
            <strong className="text-primary">Atomic Rate Limiter</strong> is an open-source rate-limiting middleware that provides fast, exact, thread-safe request limiting using Redis, natively designed to slip right into Express.js applications.
          </p>

          {/* Code Block with Tabs */}
          <div className="bg-[#0b0f19] rounded-xl border border-base-300 overflow-hidden mb-8 shadow-xl">
            <div className="flex items-center px-4 py-3 border-b border-base-300/50 gap-6 text-sm font-medium">
              {['npm', 'pnpm', 'yarn', 'bun'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize transition-colors ${activeTab === tab ? 'text-primary' : 'text-base-content/50 hover:text-base-content'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 flex justify-between items-center group">
              <code className="text-sm font-mono text-base-content/90">
                {activeTab === 'npm' && 'npm install atomic-rate-limiter ioredis'}
                {activeTab === 'pnpm' && 'pnpm add atomic-rate-limiter ioredis'}
                {activeTab === 'yarn' && 'yarn add atomic-rate-limiter ioredis'}
                {activeTab === 'bun' && 'bun add atomic-rate-limiter ioredis'}
              </code>
              <button 
                onClick={() => handleCopy(`${activeTab} install atomic-rate-limiter ioredis`, 'install')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-base-300 rounded-md"
              >
                {copied === 'install' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <p className="text-base-content/80 leading-relaxed mb-6">
            <strong>ioredis</strong> is required as a peer dependency. The limiter scales to thousands of requests per second, integrates natively with Express, and includes <strong className="text-primary">auto-injected HTTP/1.1 RateLimit headers</strong>.
          </p>

          {/* Quickstart Alternative Code Block */}
          <div className="bg-[#0b0f19] rounded-xl border border-base-300 overflow-hidden mb-10 shadow-xl">
            <div className="px-4 py-3 border-b border-base-300/50 text-sm font-medium text-base-content/50">
              Basic Usage
            </div>
            <div className="p-4 relative group">
              <pre className="text-sm font-mono text-base-content/90 overflow-x-auto"><code className="language-typescript">{`import express from "express";
import Redis from "ioredis";
import { rateLimit } from "atomic-rate-limiter";

const app = express();
const redis = new Redis("redis://localhost:6379");

app.use(rateLimit({
  redis,
  feature: "global-api",
  limit: 100,
  window: 60000 // 1 minute
}));`}</code></pre>
              <button 
                onClick={() => handleCopy(`import express from "express";\nimport Redis from "ioredis";\nimport { rateLimit } from "atomic-rate-limiter";\n\nconst app = express();\nconst redis = new Redis("redis://localhost:6379");\n\napp.use(rateLimit({\n  redis,\n  feature: "global-api",\n  limit: 100,\n  window: 60000\n}));`, 'basic-usage')}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-base-300 rounded-md bg-[#0b0f19]"
              >
                {copied === 'basic-usage' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Cards (Mimicking Prisma Next / DB Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200/40 hover:bg-base-200/60 transition-colors border border-base-300 p-6 rounded-xl flex flex-col gap-3 cursor-pointer">
              <Terminal className="text-primary" size={24} />
              <h3 className="font-bold text-lg">Use Express Middleware</h3>
              <p className="text-sm text-base-content/70">Need a reliable limiter? Get started with our highly optimized Express middleware integration.</p>
            </div>
            <div className="bg-base-200/40 hover:bg-base-200/60 transition-colors border border-base-300 p-6 rounded-xl flex flex-col gap-3 cursor-pointer">
              <Server className="text-secondary" size={24} />
              <h3 className="font-bold text-lg">Bring your own Redis</h3>
              <p className="text-sm text-base-content/70">Already have a Redis cluster? Use Atomic Rate Limiter for a type-safe developer experience and zero race conditions.</p>
            </div>
          </div>
        </section>

        {/* Sliding Window Section */}
        <section id="sliding-window" className="scroll-mt-24 border-t border-base-300 pt-10">
          <h2 className="text-2xl font-bold mb-4">The Sliding Window Log Algorithm</h2>
          <p className="text-base-content/80 leading-relaxed mb-6">
            Fixed window algorithms suffer from spike boundaries (e.g., allowing 200 requests within a 2-second overlap if the limit is 100/min). The <strong>Sliding Window Log</strong> mathematically eliminates this.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex gap-3">
              <Layers className="text-primary shrink-0 mt-1" size={20} />
              <span className="text-base-content/80">Every request timestamp is stored in a Redis Sorted Set (<code className="text-primary">ZSET</code>).</span>
            </li>
            <li className="flex gap-3">
              <Zap className="text-primary shrink-0 mt-1" size={20} />
              <span className="text-base-content/80">Outdated timestamps (outside the current window) are actively pruned on every execution.</span>
            </li>
            <li className="flex gap-3">
              <Shield className="text-primary shrink-0 mt-1" size={20} />
              <span className="text-base-content/80">If the set size is below the limit, the new request is added and allowed. Otherwise, it is dropped.</span>
            </li>
          </ul>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="scroll-mt-24 border-t border-base-300 pt-10">
          <h2 className="text-2xl font-bold mb-4">API Reference</h2>
          <p className="text-base-content/80 leading-relaxed mb-6">
            Detailed configuration options for the <code className="bg-base-300 px-1 rounded">RateLimiterConfig</code> interface.
          </p>
          
          <div className="bg-[#0b0f19] rounded-xl border border-base-300 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-300 bg-base-200/50">
                <tr>
                  <th className="py-3 px-4 font-semibold">Option</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                <tr>
                  <td className="py-3 px-4 font-mono text-primary">redis</td>
                  <td className="py-3 px-4 text-base-content/70">Redis</td>
                  <td className="py-3 px-4"><span className="text-error font-medium text-xs">Required</span></td>
                  <td className="py-3 px-4 text-base-content/80">ioredis instance connection object.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-primary">window</td>
                  <td className="py-3 px-4 text-base-content/70">number</td>
                  <td className="py-3 px-4"><span className="text-error font-medium text-xs">Required</span></td>
                  <td className="py-3 px-4 text-base-content/80">Time window in milliseconds.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-primary">limit</td>
                  <td className="py-3 px-4 text-base-content/70">number</td>
                  <td className="py-3 px-4"><span className="text-error font-medium text-xs">Required</span></td>
                  <td className="py-3 px-4 text-base-content/80">Max requests allowed per window.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-primary">feature</td>
                  <td className="py-3 px-4 text-base-content/70">string</td>
                  <td className="py-3 px-4"><span className="text-error font-medium text-xs">Required</span></td>
                  <td className="py-3 px-4 text-base-content/80">Redis namespace prefix.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-primary">identifier</td>
                  <td className="py-3 px-4 text-base-content/70">Function</td>
                  <td className="py-3 px-4"><code className="font-mono text-xs">req.ip</code></td>
                  <td className="py-3 px-4 text-base-content/80">Callback returning the unique user key.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
