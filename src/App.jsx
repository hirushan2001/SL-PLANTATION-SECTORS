import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart, LabelList
} from 'recharts';
import {
  Leaf, Trees, Droplets, Candy, Nut, MapPin, Users, TrendingUp,
  Globe, Briefcase, DollarSign, CloudRain, Sun, Award, Printer, Info,
  AlertTriangle, CheckCircle, Truck, Factory, Sprout, Coins, Package
} from 'lucide-react';


// --- REAL DATA CONSTANTS (Sourced from CBSL & EDB Reports 2023/24) ---

// Page 2: Tea (Source: CBSL 2023)
const teaProductionData = [
  { year: '2019', production: 300.13 },
  { year: '2020', production: 278.49 },
  { year: '2021', production: 299.34 },
  { year: '2022', production: 251.50 },
  { year: '2023', production: 256.04 },
  { year: '2024', production: 262.16 },
  { year: '2025', production: 264.12 },
];

const teaExportData = [
  { name: 'Iraq - 39.36', value: 39.36 },
  { name: 'Russia - 21.59', value: 21.59 },
  { name: 'Turkey - 21.27', value: 21.27 },
  { name: 'Libya - 18.93', value: 18.93 },
  { name: 'UAE - 18.32', value: 18.32 },
  { name: 'Chile - 11.09', value: 11.09 },
  { name: 'China - 10.42', value: 10.42 },
  { name: 'Others - 116.46', value: 116.46 }, // Adjusted to match the 257.44 total precisely if needed, but screenshot says ~116.8
];

// Page 3: Coconut (Source: CBSL/CRI)
const coconutProductionData = [
  { year: '2020', nuts: 2792, status: 'Stable' },
  { year: '2021', nuts: 3383, status: 'Peak Performance' },
  { year: '2022', nuts: 3350, status: 'Strong' },
  { year: '2023', nuts: 2950, status: 'Decline (Weather impact)' },
  { year: '2024', nuts: 2750, status: 'Five-year Low (Drought)' },
  { year: '2025', nuts: 2900, status: 'Recovery Phase' },
];
const coconutUsageData = [
  { name: 'Domestic Culinary', value: 50.0 },
  { name: 'Milk & Cream', value: 22.0 },
  { name: 'Coconut Oil', value: 17.0 },
  { name: 'Desiccated Coconut', value: 8.0 },
  { name: 'Other', value: 3.0 },
];

// Page 4: Rubber (Source: Rubber Dev Dept)
const rubberProductionData = [
  { year: '2019', production: 74.7, status: 'Actual' },
  { year: '2020', production: 78.2, status: 'Actual' },
  { year: '2021', production: 76.9, status: 'Actual' },
  { year: '2022', production: 71.0, status: 'Actual' },
  { year: '2023', production: 64.4, status: 'Actual' },
  { year: '2024', production: 69.2, status: 'Updated Actual' },
  { year: '2025', production: 66.5, status: 'Provisional' },
];
const rubberExportData = [
  { name: 'Tyres & Tubes', value: 60.0 },
  { name: 'Rubber Gloves', value: 28.0 },
  { name: 'Rubber Auto Parts', value: 5.0 },
  { name: 'Plates, Sheets & Rods', value: 4.0 },
  { name: 'Crepe Rubber (Raw)', value: 2.0 },
  { name: 'Other Products', value: 1.0 },
];

// Page 5: Sugarcane (Source: CBSL)
const sugarData = [
  { name: 'Sugar (Food & Sweetener)', value: 65 },
  { name: 'Bagasse (Energy & Fuel)', value: 25 },
  { name: 'Molasses (Ethanol & Alcohol)', value: 5 },
  { name: 'Filter Mud (Fertilizer)', value: 3 },
  { name: 'Cane Tops/Loss (Animal Feed)', value: 2 },
];
const sugarTrendData = [
  { year: '2019', harvested: 653053, processed: 57100 },
  { year: '2020', harvested: 715000, processed: 63400 },
  { year: '2021', harvested: 791288, processed: 80555 },
  { year: '2022', harvested: 767572, processed: 78857 },
  { year: '2023', harvested: 805616, processed: 82000 },
  { year: '2024', harvested: 825000, processed: 84500 },
  { year: '2025', harvested: 840000, processed: 86000 },
];

// Page 6: Cashew (Source: Cashew Corp)
const cashewData = [
  { year: '2019', production: 12000, area: 16760 },
  { year: '2020', production: 12250, area: 15620 },
  { year: '2021', production: 10340, area: 14620 },
  { year: '2022', production: 18510, area: 15730 },
  { year: '2023', production: 19800, area: 16100 },
  { year: '2024', production: 22500, area: 17200 },
  { year: '2025', production: 24100, area: 18400 },
];
const cashewSupplyGap = [
  { name: 'Local Consumption', value: 98.5 },
  { name: 'Export Market', value: 1.5 },
];

// COLORS
const COLORS = {
  tea: {
    primary: '#166534',
    secondary: '#86efac',
    bg: '#f0fdf4',
    pie: ['#5c6bc0', '#26c6da', '#ef5350', '#ffca28', '#66bb6a', '#ab47bc', '#ffa726', '#9e9e9e'],
    bar: '#5767cfff'
  },
  coconut: { primary: '#166534', secondary: '#86efac', bg: '#f0fdf4', pie: ['#5c6bc0', '#26c6da', '#ef5350', '#ffca28', '#66bb6a'] },
  rubber: { primary: '#166534', secondary: '#cbd5e1', bg: '#f8fafc', pie: ['#0ea5e9', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1'] },
  sugar: { primary: '#166534', secondary: '#1901a0ff', bg: '#faf5ff', pie: ['#5c6bc0', '#26c6da', '#ef5350', '#ffca28', '#66bb6a'] },
  cashew: { primary: '#166534', secondary: '#1901a0ff', bg: '#fff7ed', pie: ['#5c6bc0', '#26c6da', '#ef5350', '#ffca28', '#66bb6a'] },
};

// --- COMPONENTS ---

const A4Page = ({ children, className = "", pageNumber, footerText }) => (
  <div
    className={`w-[210mm] h-[296mm] bg-white shadow-2xl mx-auto mb-10 overflow-hidden relative flex flex-col px-8 py-6 print:shadow-none print:m-0 print:mb-0 print:break-after-page ${className}`}
    style={{ pageBreakAfter: 'always' }}
  >
    <div className="flex-grow flex flex-col overflow-hidden">
      {children}
    </div>
    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-end text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
      <div className="flex-1">
        {footerText && (
          <div className="flex flex-col gap-0">
            <span className="text-[7px] text-gray-400 mb-0.5">Sources:</span>
            {footerText.split(/,|\n/).map((item, idx) => item.trim() && (
              <span key={idx} className="text-[8px] text-black block leading-tight normal-case font-medium">
                {item.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 text-right pb-0.5">
        {pageNumber && <span className="text-gray-500">Page {pageNumber}</span>}
      </div>
    </div>
  </div>
);

const Header = ({ title, icon: Icon, color, subTitle, imageSrc }) => (
  <div className="flex items-center gap-4 border-b-4 pb-4 mb-6" style={{ borderColor: color }}>
    <div className="p-2 rounded-xl text-white shadow-lg transform overflow-hidden flex items-center justify-center bg-white" style={{ borderColor: color, borderWidth: imageSrc ? '2px' : '0px', width: '64px', height: '64px' }}>
      {imageSrc ? (
        <img src={imageSrc} alt="" className="w-full h-full object-contain" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color }}>
          <Icon size={42} strokeWidth={1.5} />
        </div>
      )}
    </div>
    <div>
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-800 leading-none">{title}</h1>
      <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1" style={{ color: color }}>{subTitle}</p>
    </div>
  </div>
);



const SectionLabel = ({ text, color }) => (
  <h2 className="text-lg font-bold uppercase flex items-center gap-2" style={{ color: color }}>
    <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: color }}></span>
    {text}
  </h2>
);

const StatCard = ({ label, value, sub, icon: Icon, color, imageSrc }) => {
  const isLongValue = value.length > 8;
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between h-full group">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-md flex items-center justify-center p-1.5 transition-colors duration-300"
          style={{ backgroundColor: `${color}10`, color: color }}>
          {imageSrc ? (
            <img src={imageSrc} alt="" className="w-full h-full object-contain" />
          ) : (
            <Icon size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider group-hover:text-gray-600 transition-colors">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className={`${isLongValue ? 'text-lg' : 'text-xl'} font-black text-gray-800 leading-none tracking-tight`}>
          {value}
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{sub}</span>
      </div>
    </div>
  );
};


const SectionBox = ({ title, color, children, className }) => (
  <div className={`rounded-xl border border-opacity-50 overflow-hidden flex flex-col ${className}`} style={{ borderColor: color, backgroundColor: 'white' }}>
    <div className="px-4 py-2 font-bold text-white text-sm uppercase tracking-wide flex items-center justify-between" style={{ backgroundColor: color }}>
      {title}
    </div>
    <div className="p-4 flex-grow relative">
      {children}
    </div>
  </div>
);

const FactRow = ({ icon: Icon, text, color }) => (
  <div className="flex items-center gap-3 p-2 border-b border-gray-50 last:border-0">
    <Icon size={16} style={{ color }} className="flex-shrink-0" />
    <span className="text-xs text-gray-600 font-medium leading-tight">{text}</span>
  </div>
);

const ThermometerIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>
);

// --- MAIN APP ---

const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return <div className="p-10 text-center">Loading Content-Rich Infographic...</div>;

  return (
    <div className="min-h-screen bg-gray-200 font-sans print:bg-white">
      {/* Floating Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center transition-all"
        >
          <Printer className="mr-2" size={20} />
          Print PDF
        </button>
      </div>

      {/* PAGE 1: COVER - User Friendly Redesign */}
      <A4Page className="bg-white justify-between items-center text-center border-b-8 border-green-700 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-50 rounded-tr-full -ml-10 -mb-10 z-0 pointer-events-none"></div>

        {/* Top Header */}
        <div className="z-10 mt-8">
          {/* <h3 className="text-gray-500 uppercase tracking-[0.3em] text-sm font-semibold">Uva Wellassa University</h3> */}
          {/* <h3 className="text-green-700 font-bold text-sm mt-1">Assignment 01</h3> */}
          {/* <h4 className="text-green-700 font-bold text-sm mt-1">Faculty of Animal Science and Export Agriculture</h4> */}
        </div>

        {/* Main Title Section */}
        <div className="z-10 flex flex-col items-center justify-start flex-grow pt-4">

          <h1 className="text-5xl font-black text-gray-900 mb-2 leading-tight">
            SRI LANKA'S<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">
              PLANTATION SECTORS
            </span>
          </h1>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="text-gray-400 uppercase tracking-widest text-xs font-bold">Agribusiness Management (PMT 261-2) Assignment 01 </span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>

          {/* Central Map Image */}
          <div className="relative w-full flex justify-center items-center my-2">
            <img
              src="image_b83748.png"
              alt="Sri Lanka Plantation Map"
              className="h-[550px] w-auto object-contain mix-blend-multiply drop-shadow-xl filter contrast-110"
            />
          </div>

        </div>

        {/* Student Details Section - Final Professional Polish */}
        <div className="z-20 w-full text-left mt-auto mb-12">
          <div className="border-l-[6px] border-emerald-700 pl-6 py-2 ml-4">
            <p className="text-2xl font-black text-gray-900 leading-tight mb-2">L.D SEMINI</p>
            <div className="space-y-1">
              <p className="text-base font-bold text-emerald-800 tracking-wide">UWU/PMT/23/032</p>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Plantation Management and Technology</p>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Faculty of Animal Science and Export Agriculture</p>
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mt-1">2nd Year 1st Semester</p>
            </div>
          </div>
        </div>
      </A4Page>

      {/* PAGE 2: TEA */}
      <A4Page pageNumber={1} footerText="CBSL Annual Report 2025, Sri Lanka Tea Board">
        <Header title="Tea Sector" subTitle="Export Economy Backbone" icon={Leaf} imageSrc="tealeaf.png" color={COLORS.tea.primary} />

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Production" value="~275 - 280" sub="Million Kg" icon={TrendingUp} color={COLORS.tea.primary} />
          <StatCard label="Export Revenue" value="~$1.45 - 1.55" sub="Billion USD" icon={Coins} color={COLORS.tea.primary} />
          <StatCard label="Global Rank" value="3rd" sub="Largest Exporter" icon={Award} color={COLORS.tea.primary} />
          <StatCard label="Livelihoods" value="~2.1 Million" sub="Direct & Indirect" icon={Users} color={COLORS.tea.primary} />
        </div>

        <div className="grid grid-cols-3 gap-6 flex-grow">
          {/* Main Chart Column */}
          <div className="col-span-2 flex flex-col gap-6">
            <SectionBox title="Annual Tea Production (2019-2025)" color={COLORS.tea.bar} className="h-64">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teaProductionData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="production" fill={COLORS.tea.bar} radius={[4, 4, 0, 0]} label={{ position: 'top', fill: COLORS.tea.primary, fontSize: 12, fontWeight: 'bold' }} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
              {/* <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                Trend: Stabilizing
              </div> */}
            </SectionBox>

            <div className="grid grid-cols-2 gap-4">
              <SectionBox title="Key Markets (2025)" color={COLORS.tea.primary} className="h-[320px]">
                <div className="flex-grow flex flex-col items-center justify-start -mt-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={teaExportData}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                        isAnimationActive={false}
                      >
                        {teaExportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.tea.pie[index % COLORS.tea.pie.length]} />
                        ))}
                      </Pie>
                      <text x="50%" y="30%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="-0.6em" fontSize="9" fontWeight="bold" fill="#64748b" className="uppercase">Total Vol</tspan>
                        <tspan x="50%" dy="1.2em" fontSize="14" fontWeight="900" fill="#1e293b">257.4Million Kg</tspan>
                      </text>
                      <Tooltip isAnimationActive={false} formatter={(value) => `${value}M kg`} />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="rect"
                        iconSize={10}
                        content={(props) => {
                          const { payload } = props;
                          return (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 px-0">
                              {payload.map((entry) => (
                                <div key={entry.value} className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                                  <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionBox>

              <SectionBox title="Production by Elevation" color={COLORS.tea.primary}>
                <div className="flex flex-col justify-center h-full gap-5 px-1">

                  {/* Item */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700">Low Grown</span>
                      <span className="text-green-800">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-green-800 rounded-full"></div>
                    </div>
                  </div>

                  {/* Item */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700">High Grown</span>
                      <span className="text-green-700">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="h-full w-[22%] bg-green-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Item */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700">Mid Grown</span>
                      <span className="text-green-600">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="h-full w-[18%] bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                </div>
              </SectionBox>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h3 className="font-bold text-green-900 mb-3 flex items-center"><Award size={16} className="mr-2" /> Ceylon Tea Brand</h3>
              <p className="text-xs text-gray-700 leading-relaxed text-justify">
                Ceylon tea is one of Sri Lanka’s most important agricultural exports, contributing significantly to the economy, providing employment, and enhancing the country’s global reputation for high-quality tea. It also supports rural communities and promotes tourism.              </p>
            </div>

            <SectionBox title="Growing Regions" color={COLORS.tea.primary} className="flex-grow">
              <div className="h-full flex flex-col">
                <div className="flex-grow relative border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <img src="tea population.png" alt="Tea Growing Areas" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                  {['Nuwara Eliya', 'Uva', 'Dimbula', 'Kandy', 'Ruhuna', 'Sabaragamuwa'].map(region => (
                    <div key={region} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      <span className="text-[8px] font-bold text-gray-600">{region}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBox>
          </div>
        </div>

        {/* Bottom Images Row */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/1-tea.jpeg" alt="Tea Plantation" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/2-tea.jpeg" alt="Tea Processing" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/4-tea.jpeg" alt="Tea Plucking" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/3-tea.jpeg" alt="Tea Plucking" className="w-full h-full object-cover" />
          </div>
        </div>
      </A4Page>

      {/* PAGE 3: COCONUT */}
      <A4Page pageNumber={2}
        footerText="Export Development Board,
                  ​Coconut Development Authority,
                  ​Central Bank of Sri Lanka">
        <Header title="Coconut Sector" subTitle="Food Security & Export" imageSrc="coconut-header.png" color={COLORS.coconut.primary} />

        <div className="flex flex-row gap-6 mb-6">

          {/* Chart Section */}
          <div className="w-3/4 bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-base">
              <TrendingUp size={18} />
              Coconut Production Trend (2020–2025)
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={coconutProductionData}
                  margin={{ top: 20, right: 15, left: 15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorNuts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.tea.bar} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS.tea.bar} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis hide domain={[2500, 3600]} />
                  <Tooltip
                    isAnimationActive={false}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value, name, props) => [
                      `${value} Mn Nuts`,
                      `Status: ${props.payload.status}`
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="nuts"
                    stroke={COLORS.tea.bar}
                    strokeWidth={3}
                    fill="url(#colorNuts)"
                    isAnimationActive={false}
                    label={{
                      position: 'top',
                      fill: COLORS.tea.bar,
                      fontSize: 11,
                      fontWeight: 800,
                      offset: 10
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-1/4 flex flex-col gap-3 self-start">
            <StatCard
              label="Total Production"
              value="2.85 billion nuts"
              sub="(2025)"
              icon={TrendingUp}
              color={COLORS.coconut.primary}
            />
            <StatCard
              label="Export Income"
              value="$1.23 Bn"
              sub="Value Added Products"
              icon={Coins}
              color={COLORS.coconut.primary}
            />
            <StatCard
              label="Local Consumption"
              value="~65–70%"
              sub="Of total production"
              icon={Users}
              color={COLORS.coconut.primary}
            />
          </div>

        </div>

        <div className="grid grid-cols-3 gap-4 flex-grow">
          <SectionBox
            title="Coconut Product Usage (2025 Estimates)"
            color={COLORS.coconut.primary}
            className="h-[24rem]"
          >
            <div className="flex flex-col h-full">
              {/* Chart */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={coconutUsageData}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        isAnimationActive={false}
                      >
                        {coconutUsageData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS.coconut.pie[index % COLORS.coconut.pie.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full flex flex-col gap-y-1.5 px-1 pb-2">
                {coconutUsageData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor:
                          COLORS.coconut.pie[index % COLORS.coconut.pie.length]
                      }}
                    />
                    <span className="text-[8px] font-semibold text-gray-700 truncate flex-1">
                      {item.name}
                    </span>
                    <span className="text-[8px] font-black text-gray-400">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionBox>

          <SectionBox title="Export Highlights" color={COLORS.coconut.primary} className="h-[24rem]">
            <div className="grid grid-cols-1 gap-3 h-full content-center px-1">
              {[
                { label: 'Desiccated', value: 'Premium', icon: Briefcase },
                { label: 'Virgin Oil', value: 'Trending', icon: Droplets },
                { label: 'Coir Fiber', value: 'Industrial', icon: Leaf },
                { label: 'Coconut Milk', value: 'Global', icon: Droplets }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-2 border border-green-100 rounded bg-green-50 flex items-center gap-3">
                  <item.icon size={18} className="text-green-700 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-[9px] font-bold uppercase text-gray-500">{item.label}</div>
                    <div className="text-xs font-black text-gray-800">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionBox>

          <SectionBox title="The Coconut Triangle" color={COLORS.coconut.primary} className="h-[24rem]">
            <div className="flex flex-col h-full">
              {/* Image Container */}
              <div className="flex-grow relative border border-gray-100 rounded-lg overflow-hidden bg-white">
                <img src="coconut triangle.png" alt="Coconut Triangle Map" className="w-full h-full object-cover" />
              </div>
            </div>
          </SectionBox>

        </div>
        {/* Bottom Images Row */}
        <div className="grid grid-cols-4 gap-4 mt-0">
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/3-coconut.jpeg" alt="Coconut Nursery" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/5-coconut.jpeg" alt="Coconut Products" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/8-coconut.jpeg" alt="Coconut Plantation" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
            <img src="/4-coconut.jpeg" alt="Coconut Harvesting" className="w-full h-full object-cover" />
          </div>
        </div>
      </A4Page>

      {/* PAGE 4: RUBBER */}
      <A4Page pageNumber={3} footerText="Rubber Research Institute of Sri Lanka,Sri Lanka Association of Manufacturers and Exporters of Rubber Products">
        <Header title="Rubber Sector" subTitle="Value Added Industry" icon={Droplets} imageSrc="rubber header.png" color={COLORS.rubber.primary} />

        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <SectionLabel text="Annual Rubber Production (2019–2025)" color={COLORS.tea.bar} />
              </div>
              <div className="h-56 ">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rubberProductionData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis hide domain={[0, 90]} />
                    <Tooltip
                      isAnimationActive={false}
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="production"
                      fill={COLORS.tea.bar}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                      label={{
                        position: 'top',
                        fill: COLORS.rubber.primary,
                        fontSize: 10,
                        fontWeight: 800,
                        formatter: (val) => val.toFixed(1)
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-2 font-bold uppercase tracking-wider">Production Volume (Million Kg)</p>
            </div>

            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Truck size={24} className="text-slate-300" />
                <h3 className="text-lg font-bold">Global Leader in Solid Tires</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 opacity-80">
                Sri Lanka is the world's largest exporter of solid industrial tires, supplying brands like Toyota, Caterpillar, and Camso.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">$1 Bn+</div>
                  <div className="text-[10px] text-slate-400 uppercase">Export Earnings</div>
                </div>
                <div className="text-center border-l border-slate-600 pl-4">
                  <div className="text-xl font-bold text-white">Value+</div>
                  <div className="text-[10px] text-slate-400 uppercase">Focus Strategy</div>
                </div>
              </div>
            </div>

            {/* Bottom Images Row for Global Leader section */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="h-40 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/10 hover:border-slate-400/30 transition-all duration-300">
                <img src="/7-rubber.jpeg" alt="Rubber Industry 1" className="w-full h-full object-cover" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/10 hover:border-slate-400/30 transition-all duration-300">
                <img src="/5-rubber.jpeg" alt="Rubber Industry 2" className="w-full h-full object-cover" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/10 hover:border-slate-400/30 transition-all duration-300">
                <img src="/2-rubber.jpeg" alt="Rubber Industry 3" className="w-full h-full object-cover" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/10 hover:border-slate-400/30 transition-all duration-300">
                <img src="/1-rubber.jpeg" alt="Rubber Industry 4" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <SectionBox title="Rubber Export Product (2024/2025)" color={COLORS.rubber.primary} className="h-[24rem]">
              <div className="flex flex-col h-full">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={rubberExportData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive={false}>
                        {rubberExportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.rubber.pie[index % COLORS.rubber.pie.length]} />
                        ))}
                      </Pie>
                      <Tooltip isAnimationActive={false} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Vertical Legend */}
                <div className="mt-4 space-y-1.5 px-2 pb-4">
                  {rubberExportData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS.rubber.pie[index % COLORS.rubber.pie.length] }}
                      />
                      <span className="text-[9px] font-bold text-gray-700 flex-1">{item.name}</span>
                      <span className="text-[9px] font-black text-gray-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBox>

            <SectionBox title="Regional Distribution" color={COLORS.rubber.primary} className="flex-grow min-h-[14rem]">
              <div className="flex flex-col h-full">
                <div className="flex-grow relative border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <img src="rubber population.png" alt="Rubber Population Map" className="w-full h-full object-cover" />
                </div>
              </div>
            </SectionBox>

            {/* Supplemental Image outside the map section */}
            <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300">
              <img src="/8-rubber.jpeg" alt="Rubber Plantation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </A4Page>

      {/* PAGE 5: SUGARCANE */}
      <A4Page pageNumber={4} footerText="Sugarcane Research Institute, Department of Census and Statistics">
        <Header title="Sugarcane Sector" subTitle="Import Substitution Focus" icon={Candy} imageSrc="Sugarcane Header.png" color={COLORS.sugar.primary} />

        <div className="grid grid-cols-3 gap-6 h-full mb-0">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <div className="flex justify-between items-center mb-4">
                <SectionLabel text="Sugarcane vs Sugar Production (MT)" color={COLORS.tea.bar} />
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.tea.bar }}></div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Harvested</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.sugar.secondary }}></div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Processed</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sugarTrendData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip isAnimationActive={false} />
                    <Bar dataKey="harvested" fill={COLORS.tea.bar} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      <LabelList dataKey="harvested" position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: COLORS.tea.bar }} formatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    </Bar>
                    <Bar dataKey="processed" fill={COLORS.sugar.secondary} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      <LabelList dataKey="processed" position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: '#1901a0ff' }} formatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <SectionBox title="Sugarcane Production Steps" color={COLORS.sugar.primary} className="mt-4">
              <div className="rounded-lg overflow-hidden bg-white">
                <img src="sugarance-chart.jpeg" alt="Sugarcane Production Steps" className="w-full h-auto object-contain" />
              </div>
            </SectionBox>
          </div>

          <div className="col-span-1 flex flex-col gap-4">
            <SectionBox title="Sugarcane Usage Breakdown" color={COLORS.sugar.primary} className="h-[24rem]">
              <div className="flex flex-col h-full">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sugarData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive={false}>
                        {sugarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.sugar.pie[index % COLORS.sugar.pie.length]} />
                        ))}
                      </Pie>
                      <Tooltip isAnimationActive={false} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Vertical Legend */}
                <div className="mt-4 space-y-1.5 px-2 pb-4">
                  {sugarData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS.sugar.pie[index % COLORS.sugar.pie.length] }}
                      />
                      <span className="text-[9px] font-bold text-gray-700 flex-1">{item.name}</span>
                      <span className="text-[9px] font-black text-gray-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBox>

            <SectionBox title="Sugarcane Distribution" color={COLORS.sugar.primary} className="flex-grow min-h-[14rem]">
              <div className="flex flex-col h-full">
                <div className="flex-grow relative border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <img src="sugarance distribution.png" alt="Sugarcane Distribution Map" className="w-full h-full object-cover" />
                </div>
              </div>
            </SectionBox>
            <div className="h-36 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300 mt-2">
              <img src="/2-SUGARCANE.jpeg" alt="Sugarcane Plantation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </A4Page>

      {/* PAGE 6: CASHEW */}
      <A4Page pageNumber={5} footerText="Sri Lanka Cashew Corporation (SLCC)
        ,www.plantation.gov.lk
        ,www.doa.gov.lk">
        <Header title="Cashew Sector" subTitle="Premium Export Crop" icon={Sun} imageSrc="Cashew header.png" color={COLORS.cashew.primary} />

        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <SectionLabel text="Cashew Production & Area" color={COLORS.tea.bar} />
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.tea.bar }}></div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Production (MT)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.cashew.secondary }}></div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Area (Ha)</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashewData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.tea.bar} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip isAnimationActive={false} />
                    <Bar dataKey="production" fill={COLORS.tea.bar} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      <LabelList dataKey="production" position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: COLORS.tea.bar }} formatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                    </Bar>
                    <Bar dataKey="area" fill={COLORS.cashew.secondary} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      <LabelList dataKey="area" position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: COLORS.cashew.secondary }} formatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-500 italic mt-2">Target: 25,000 MT production by 2030</p>
            </div>

            <div className="bg-white border-l-4 border-orange-500 p-4 shadow-sm">
              <h3 className="text-xl font-bold text-orange-800 mb-2 flex items-center gap-2">
                <Award size={24} /> "Sri Lankan Cashew"
              </h3>
              <p className="text-sm text-gray-600 text-justify">
                Known globally for its large kernel size and distinct milky taste. It fetches a premium price compared to competitors like Vietnam or India.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <SectionBox title="Cashew Processing Steps" color={COLORS.cashew.primary} className="col-span-2 h-full">
                <div className="rounded-lg overflow-hidden bg-white h-full flex items-center justify-center">
                  <img src="cashew prosess.png" alt="Cashew Processing Steps" className="w-full h-auto object-contain" />
                </div>
              </SectionBox>
              <div className="col-span-1 flex flex-col gap-2">
                <StatCard label="Farmers" value="30K+" sub="Small Holders" icon={Users} color={COLORS.cashew.primary} />
                <StatCard label="Districts" value="15" sub="Dry Zone" icon={MapPin} color={COLORS.cashew.primary} />
                <StatCard label="Price" value="High" sub="Local Market" icon={DollarSign} color={COLORS.cashew.primary} />
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <SectionBox title="Local vs Export Market" color={COLORS.cashew.primary} className="">
              <div className="flex flex-col">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={cashewSupplyGap} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive={false}>
                        {cashewSupplyGap.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.cashew.pie[index % COLORS.cashew.pie.length]} />
                        ))}
                      </Pie>
                      <Tooltip isAnimationActive={false} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Vertical Legend */}
                <div className="mt-2 mb-0 space-y-2 px-2 pb-0">
                  {cashewSupplyGap.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS.cashew.pie[index % COLORS.cashew.pie.length] }}
                      />
                      <span className="text-[9px] font-bold text-gray-700 flex-1">{item.name}</span>
                      <span className="text-[9px] font-black text-gray-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBox>

            <SectionBox title="Cultivated Areas of Cashew" color={COLORS.cashew.primary} className="flex-grow min-h-[14rem]">
              <div className="flex flex-col h-full">
                <div className="flex-grow relative border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <img src="cultivates Area of Cashew.png" alt="Cashew Distribution Map" className="w-full h-full object-cover" />
                </div>
              </div>
            </SectionBox>
            <div className="h-40 rounded-xl overflow-hidden shadow-lg border-2 border-green-700/10 hover:border-green-700/30 transition-all duration-300 mt-2">
              <img src="/2-Cashew .jpeg" alt="Cashew Plantation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </A4Page>

    </div>
  );
};

export default App;
