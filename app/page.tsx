import Chart from "@/components/homePage/Chart";
import Card from "@/components/homePage/Card";
import MyLineChart from "@/components/homePage/MyLineChart";
import ChartPie from "@/components/homePage/ChartPie";

export default function Home() {
  return (
    <div className="container m-auto">
      <div className="grid grid-cols-1 grid-cols-3">
        <button className="border p-1 hover:bg-gray-200">+ Category</button>
        <button className="border p-1 hover:bg-gray-200">+ Income</button>
        <button className="border p-1 hover:bg-gray-200">- Expense</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <Card title="Total Income" value={500} />
        <Card title="Total Expense" value={300} />
        <Card title="Current Balance" value={200} />
        <Card title="Profit or Loss" value={-100} />
      </div>
      <div className="grid grid-cols-1 grid-cols-2 gap-3 mt-5">
        <Chart />
        <ChartPie />
        {/* <MyLineChart /> */}
      </div>
    </div>
  );
}
