import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, BookOpen} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <div className="navbar bg-base-200/50 backdrop-blur-md sticky top-0 z-50 border-b border-base-300 px-4 sm:px-8">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl gap-2 font-bold tracking-tight">
            <Activity className="text-primary" />
            Atomic Rate Limiter
          </Link>
        </div>
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1 font-medium">
            <li>
              <Link 
                to="/" 
                className={cn("rounded-lg", location.pathname === "/" ? "bg-base-300 text-primary" : "")}
              >
                <Activity size={18} />
                Showcase
              </Link>
            </li>
            <li>
              <Link 
                to="/docs" 
                className={cn("rounded-lg", location.pathname === "/docs" ? "bg-base-300 text-primary" : "")}
              >
                <BookOpen size={18} />
                Docs
              </Link>
            </li>
          </ul>
          {/* <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-circle btn-ghost">
            <Terminal size={20} />
          </a> */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content mt-auto border-t border-base-300">
        <div>
          <p className="font-medium">
            Powered by <span className="text-primary font-bold">Redis</span> & <span className="text-secondary font-bold">Express</span>
          </p>
          <p className="opacity-70 text-sm mt-2">© 2026 - High-Performance Sliding Window Log</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
