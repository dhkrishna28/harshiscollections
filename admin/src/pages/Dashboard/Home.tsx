import PageMeta from "../../components/common/PageMeta";
import OrderStats from "../../components/ecommerce/OrderStats";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="Admin Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* <div className="col-span-12">
          <EcommerceStats />
        </div> */}
        
        <div className="col-span-12">
          <OrderStats />
        </div>
        
        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
