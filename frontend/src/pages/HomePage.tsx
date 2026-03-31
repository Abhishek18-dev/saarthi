import { Sidebar } from "../components/sidebar";
import { DashboardMain } from "../components/dashboard";

const HomePage = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50 ">
        {/* SIDEBAR: Stays Fixed/Sticky */}
        {/* <Sidebar /> */}

        {/* MAIN CONTENT: This area will scroll independently */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <DashboardMain />
        </main>
      </div>
    </>
  );
};

export default HomePage;
