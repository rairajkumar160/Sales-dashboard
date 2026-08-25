export interface SalesDashboardData {
  totalOrders: number;
  totalSales: number;
  totalDiscount: number;
  netSales: number;
  averageOrderValue: number;
  chartData: Array<{
    name: string;
    sales: number;
    orders: number;
    discount: number;
  }>;
}

interface DaySummary {
  date: string;
  totalOrders: number;
  totalSales: number;
  totalDiscount: number;
  netSales: number;
  averageOrderValue: number;
}

async function fetchSingleDaySales(supabaseUrl: string, supabaseKey: string, dateStr: string): Promise<DaySummary> {
  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/get_sales_dashboard`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_date: dateStr }),
  });

  if (!response.ok) {
    let errorMsg = `API Request failed for ${dateStr} with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // Ignore json parse error
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();

  let record: any = null;
  if (Array.isArray(data)) {
    if (data.length > 0) {
      record = data[0];
    }
  } else if (data && typeof data === 'object') {
    record = data;
  }

  if (!record) {
    return {
      date: dateStr,
      totalOrders: 0,
      totalSales: 0,
      totalDiscount: 0,
      netSales: 0,
      averageOrderValue: 0,
    };
  }

  // Handle standard nested "summary" object returned by the RPC function
  const summary = record.summary || record;

  const totalOrders = parseFloat(summary.total_orders ?? summary.orders ?? summary.orders_count ?? 0);
  const totalSales = parseFloat(summary.total_sales ?? summary.sales ?? summary.gross_sales ?? 0);
  const totalDiscount = parseFloat(summary.total_discount ?? summary.discount ?? summary.discounts ?? 0);
  const netSales = parseFloat(summary.net_sales ?? (totalSales - totalDiscount));
  const averageOrderValue = parseFloat(summary.average_order_value ?? summary.avg_order_value ?? summary.aov ?? (totalOrders > 0 ? netSales / totalOrders : 0));

  return {
    date: dateStr,
    totalOrders: isNaN(totalOrders) ? 0 : totalOrders,
    totalSales: isNaN(totalSales) ? 0 : totalSales,
    totalDiscount: isNaN(totalDiscount) ? 0 : totalDiscount,
    netSales: isNaN(netSales) ? 0 : netSales,
    averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue,
  };
}

export async function fetchSalesDashboard(dateStr: string): Promise<SalesDashboardData> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    throw new Error(
      'Supabase configuration is missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }

  // Generate last 7 days ending on dateStr to create a trend chart
  const dates: string[] = [];
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed month
  const day = parseInt(parts[2], 10);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(year, month, day - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  // Fetch data in parallel
  const results = await Promise.all(
    dates.map((d) => fetchSingleDaySales(supabaseUrl, supabaseKey, d))
  );

  // The primary KPI cards display metrics of the selected date (the last item)
  const selectedDay = results[results.length - 1];

  // Map the 7-day details into chart data
  const chartData = results.map((r) => {
    const p = r.date.split('-');
    const formattedLabel = `${p[1]}/${p[2]}`; // MM/DD
    return {
      name: formattedLabel,
      sales: r.totalSales,
      orders: r.totalOrders,
      discount: r.totalDiscount,
    };
  });

  return {
    totalOrders: selectedDay.totalOrders,
    totalSales: selectedDay.totalSales,
    totalDiscount: selectedDay.totalDiscount,
    netSales: selectedDay.netSales,
    averageOrderValue: selectedDay.averageOrderValue,
    chartData,
  };
}

