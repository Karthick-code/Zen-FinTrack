// import React from "react";
// import { useAuth } from "../../context/AuthContext.jsx";
// import {
//   Wallet,
//   Receipt,
//   BarChart3,
//   PiggyBank,
//   LifeBuoy,
//   Users,
//   ShieldCheck,
//   LogOut,
//   PlusCircle,
// } from "lucide-react";

// export const Navbar = ({ activeTab, setActiveTab, onOpenNewTxModal }) => {
//   const { user, logout } = useAuth();
//   const isAdmin = user?.role === "ADMIN";

//   return (
//     <header className="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE7E0] sticky top-0 z-40 text-[#353531] shadow-[0_2px_12px_-4px_rgba(67,76,62,0.06)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo & Tagline */}
//           <div
//             className="flex items-center space-x-3 cursor-pointer"
//             onClick={() =>
//               setActiveTab(isAdmin ? "admin-overview" : "dashboard")
//             }
//           >
//             {/* <div className="w-10 h-10 rounded-xl bg-[#434C3E] text-[#FDFBF7] flex items-center justify-center shadow-md text-xl font-bold font-serif">
//               ₹
//             </div> */}
//             {/* inserting logo */}
//             <div>
//               <img
//                 src="https://res.cloudinary.com/dw94vpvkd/image/upload/v1787311376/Zen_FinTrack_lfyzcv.png"
//                 alt="Zen FinTrack"
//                 className="w-10 h-10 rounded-xl"
//               />
//             </div>
//             {/*  */}
//             <div>
//               <div className="flex items-center space-x-2">
//                 <span className="font-serif font-bold text-lg tracking-tight text-[#353531]">
//                   Zen FinTrack
//                 </span>
//                 {isAdmin ? (
//                   <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30 rounded-full flex items-center gap-1">
//                     <ShieldCheck className="w-3 h-3" /> Master Admin
//                   </span>
//                 ) : (
//                   <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-[#434C3E]/10 text-[#434C3E] border border-[#434C3E]/20 rounded-full">
//                     User
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs text-[#7A756D] font-medium">
//                 Simple tracking. Smarter saving.
//               </p>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav className="hidden md:flex items-center space-x-1">
//             {!isAdmin ? (
//               <>
//                 <button
//                   onClick={() => setActiveTab("dashboard")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "dashboard"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <Wallet className="w-4 h-4" />
//                   Dashboard
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("transactions")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "transactions"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <Receipt className="w-4 h-4" />
//                   Transactions
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("reports")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "reports"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <BarChart3 className="w-4 h-4" />
//                   Reports
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("savings")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "savings"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <PiggyBank className="w-4 h-4" />
//                   Savings
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("support")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "support"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <LifeBuoy className="w-4 h-4" />
//                   Support
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={() => setActiveTab("admin-overview")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "admin-overview"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <BarChart3 className="w-4 h-4" />
//                   Admin Overview
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("admin-users")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "admin-users"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <Users className="w-4 h-4" />
//                   User Management
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("admin-support")}
//                   className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
//                     activeTab === "admin-support"
//                       ? "bg-[#434C3E] text-white shadow-sm"
//                       : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
//                   }`}
//                 >
//                   <LifeBuoy className="w-4 h-4" />
//                   Support Helpdesk
//                 </button>
//               </>
//             )}
//           </nav>

//           {/* Right actions */}
//           <div className="flex items-center space-x-3">
//             {!isAdmin && onOpenNewTxModal && (
//               <button
//                 onClick={onOpenNewTxModal}
//                 className="bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
//               >
//                 <PlusCircle className="w-4 h-4" />
//                 <span className="hidden sm:inline">Record Transaction</span>
//                 <span className="sm:hidden">Record</span>
//               </button>
//             )}

//             <div className="hidden lg:flex flex-col text-right">
//               <span className="text-xs font-semibold text-[#353531]">
//                 {user?.name}
//               </span>
//               <span className="text-[11px] text-[#7A756D]">{user?.email}</span>
//             </div>

//             <button
//               onClick={logout}
//               title="Logout"
//               className="p-2 rounded-xl text-[#7A756D] hover:text-[#BC5F4F] hover:bg-[#EBE7E0]/60 transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Mobile secondary navigation */}
//         <div className="md:hidden flex items-center space-x-2 py-2.5 overflow-x-auto scrollbar-none border-t border-[#EBE7E0]">
//           {!isAdmin ? (
//             <>
//               <button
//                 onClick={() => setActiveTab("dashboard")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "dashboard"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setActiveTab("transactions")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "transactions"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Transactions
//               </button>
//               <button
//                 onClick={() => setActiveTab("reports")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "reports"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Reports
//               </button>
//               <button
//                 onClick={() => setActiveTab("savings")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "savings"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Savings
//               </button>
//               <button
//                 onClick={() => setActiveTab("support")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "support"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Support
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setActiveTab("admin-overview")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "admin-overview"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Admin Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab("admin-users")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "admin-users"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Users
//               </button>
//               <button
//                 onClick={() => setActiveTab("admin-support")}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
//                   activeTab === "admin-support"
//                     ? "bg-[#434C3E] text-white"
//                     : "text-[#7A756D]"
//                 }`}
//               >
//                 Support
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };


import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Wallet,
  Receipt,
  BarChart3,
  PiggyBank,
  LifeBuoy,
  Users,
  ShieldCheck,
  LogOut,
  PlusCircle,
} from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab, onOpenNewTxModal }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE7E0] sticky top-0 z-40 text-[#353531] shadow-[0_2px_12px_-4px_rgba(67,76,62,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            TOP HEADER
        ============================================================ */}
        <div className="flex items-center justify-between min-h-16 py-2 gap-3">
          {/* ==========================================================
              LOGO & TAGLINE
          ========================================================== */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0 min-w-0"
            onClick={() =>
              setActiveTab(isAdmin ? "admin-overview" : "dashboard")
            }
          >
            {/* Logo */}
            <img
              src="https://res.cloudinary.com/dw94vpvkd/image/upload/v1787311376/Zen_FinTrack_lfyzcv.png"
              alt="Zen FinTrack"
              className="w-10 h-10 rounded-xl shrink-0"
            />

            {/* Brand text */}
            <div className="min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                {/* App name */}
                <span className="font-serif font-bold text-lg tracking-tight text-[#353531] whitespace-nowrap">
                  Zen FinTrack
                </span>

                {/* Role badge */}
                {isAdmin ? (
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold uppercase bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30 rounded-full items-center gap-1 whitespace-nowrap shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    Master Admin
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold uppercase bg-[#434C3E]/10 text-[#434C3E] border border-[#434C3E]/20 rounded-full whitespace-nowrap shrink-0">
                    User
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="hidden sm:block text-xs text-[#7A756D] font-medium whitespace-nowrap">
                Simple tracking. Smarter saving.
              </p>
            </div>
          </div>

          {/* ==========================================================
              DESKTOP NAVIGATION
              
              IMPORTANT:
              Uses xl instead of md so the full navigation only appears
              when there is enough horizontal space.
          ========================================================== */}
          <nav className="hidden xl:flex items-center space-x-1 shrink-0">
            {!isAdmin ? (
              <>
                {/* Dashboard */}
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "dashboard"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <Wallet className="w-4 h-4 shrink-0" />
                  Dashboard
                </button>

                {/* Transactions */}
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "transactions"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <Receipt className="w-4 h-4 shrink-0" />
                  Transactions
                </button>

                {/* Reports */}
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "reports"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  Reports
                </button>

                {/* Savings */}
                <button
                  onClick={() => setActiveTab("savings")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "savings"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <PiggyBank className="w-4 h-4 shrink-0" />
                  Savings
                </button>

                {/* Support */}
                <button
                  onClick={() => setActiveTab("support")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "support"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 shrink-0" />
                  Support
                </button>
              </>
            ) : (
              <>
                {/* Admin Overview */}
                <button
                  onClick={() => setActiveTab("admin-overview")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "admin-overview"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  Admin Overview
                </button>

                {/* User Management */}
                <button
                  onClick={() => setActiveTab("admin-users")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "admin-users"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  User Management
                </button>

                {/* Support Helpdesk */}
                <button
                  onClick={() => setActiveTab("admin-support")}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "admin-support"
                      ? "bg-[#434C3E] text-white shadow-sm"
                      : "text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60"
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 shrink-0" />
                  Support Helpdesk
                </button>
              </>
            )}
          </nav>

          {/* ==========================================================
              RIGHT ACTIONS
          ========================================================== */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Record Transaction */}
            {!isAdmin && onOpenNewTxModal && (
              <button
                onClick={onOpenNewTxModal}
                className="bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />

                <span className="hidden sm:inline">
                  Record Transaction
                </span>

                <span className="sm:hidden">Record</span>
              </button>
            )}

            {/* User information - Desktop only */}
            <div className="hidden lg:flex flex-col text-right max-w-[180px]">
              <span className="text-xs font-semibold text-[#353531] truncate">
                {user?.name}
              </span>

              <span className="text-[11px] text-[#7A756D] truncate">
                {user?.email}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-[#7A756D] hover:text-[#BC5F4F] hover:bg-[#EBE7E0]/60 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================
            MOBILE / TABLET SECONDARY NAVIGATION
            
            Visible below xl.
            Horizontally scrollable so navigation never wraps/breaks.
        ============================================================ */}
        <div className="xl:hidden flex items-center space-x-2 py-2.5 overflow-x-auto scrollbar-none border-t border-[#EBE7E0]">
          {!isAdmin ? (
            <>
              {/* Dashboard */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "dashboard"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Dashboard
              </button>

              {/* Transactions */}
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "transactions"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Transactions
              </button>

              {/* Reports */}
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "reports"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Reports
              </button>

              {/* Savings */}
              <button
                onClick={() => setActiveTab("savings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "savings"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Savings
              </button>

              {/* Support */}
              <button
                onClick={() => setActiveTab("support")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "support"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Support
              </button>
            </>
          ) : (
            <>
              {/* Admin Overview */}
              <button
                onClick={() => setActiveTab("admin-overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "admin-overview"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Admin Overview
              </button>

              {/* Users */}
              <button
                onClick={() => setActiveTab("admin-users")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "admin-users"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Users
              </button>

              {/* Support */}
              <button
                onClick={() => setActiveTab("admin-support")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === "admin-support"
                    ? "bg-[#434C3E] text-white"
                    : "text-[#7A756D]"
                }`}
              >
                Support
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};