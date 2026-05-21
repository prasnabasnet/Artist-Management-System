"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Music, Disc3, Heart } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function DashboardHome() {
  const stats = {
    totalUsers: 120,
    totalArtists: 35,
    totalSongs: 410,
    totalLikes: 9200,
  };

  const topBySongs = [
    { name: "Drake", value: 32 },
    { name: "Taylor Swift", value: 28 },
    { name: "The Weeknd", value: 24 },
  ];

  const topByListeners = [
    { name: "Taylor Swift", value: 950000 },
    { name: "Drake", value: 870000 },
    { name: "Ed Sheeran", value: 720000 },
  ];

  const topByLikes = [
    { name: "Ariana Grande", value: 15000 },
    { name: "Drake", value: 14000 },
    { name: "The Weeknd", value: 12000 },
  ];

  const barData = {
    labels: topBySongs.map((a) => a.name),
    datasets: [
      {
        label: "Songs",
        data: topBySongs.map((a) => a.value),
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: topByListeners.map((a) => a.name),
    datasets: [
      {
        data: topByListeners.map((a) => a.value),
        backgroundColor: ["#10b981", "#6366f1", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Music Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Insights and performance overview of your artists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[180px]">
        <Card className="col-span-1 shadow-md">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <p className="text-muted-foreground text-sm">Total Users</p>
              <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
            </div>
            <Users className="text-indigo-500" size={28} />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <p className="text-muted-foreground text-sm">Total Artists</p>
              <h2 className="text-3xl font-bold">{stats.totalArtists}</h2>
            </div>
            <Music className="text-green-500" size={28} />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <p className="text-muted-foreground text-sm">Total Songs</p>
              <h2 className="text-3xl font-bold">{stats.totalSongs}</h2>
            </div>
            <Disc3 className="text-pink-500" size={28} />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <p className="text-muted-foreground text-sm">Total Likes</p>
              <h2 className="text-3xl font-bold">{stats.totalLikes}</h2>
            </div>
            <Heart className="text-red-500" size={28} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 row-span-2 shadow-md">
          <CardContent className="p-6 h-full">
            <h3 className="font-semibold mb-4">Top Artists by Song Count</h3>
            <Bar data={barData} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 row-span-2 shadow-md">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="font-semibold mb-6 text-lg">
              Top Artists by Listeners
            </h3>

            <div className="flex flex-1 items-center gap-8">
              <div className="w-1/2 flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      maintainAspectRatio: false,
                      cutout: "65%",
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {topByListeners.map((artist, index) => {
                  const colors = ["#10b981", "#6366f1", "#f59e0b"];
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index] }}
                        />
                        <span className="font-medium">{artist.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {(artist.value / 1000).toFixed(0)}k
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Top Artists by Likes</h3>
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Artist</th>
                <th className="text-left p-3">Likes</th>
              </tr>
            </thead>
            <tbody>
              {topByLikes.map((artist, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{artist.name}</td>
                  <td className="p-3 font-medium">
                    {artist.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
