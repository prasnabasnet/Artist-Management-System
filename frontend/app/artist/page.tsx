"use client";

import { useEffect, useState } from "react";
import { artistService, Artist } from "@/services/artist.service";
import { musicService, Music } from "@/services/music.service";
import { tokenService } from "@/lib/token";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, Music as MusicIcon, User } from "lucide-react";

export default function ArtistDashboard() {
  const [profile, setProfile] = useState<Artist | null>(null);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [totalMusic, setTotalMusic] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, musicData] = await Promise.all([
          artistService.getMyProfile(),
          musicService.getMyMusic(1, 10),
        ]);
        setProfile(profileData);
        setMusicList(musicData.rows);
        setTotalMusic(musicData.totalRows);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    tokenService.clearToken();
    window.location.href = "/login";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading your profile...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Artist Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{profile?.name}</span>
          <Button variant="ghost" className="text-red-500" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold">My Profile</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profile?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{profile?.dob}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{profile?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{profile?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">First Release Year</p>
                <p className="font-medium">{profile?.firstReleaseYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Albums Released</p>
                <p className="font-medium">{profile?.noOfAlbumsReleased}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Music Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MusicIcon size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold">My Music ({totalMusic})</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {musicList.length > 0 ? (
                  musicList.map((music) => (
                    <TableRow key={music.id}>
                      <TableCell>{music.title}</TableCell>
                      <TableCell>{music.albumName}</TableCell>
                      <TableCell>{music.genre}</TableCell>
                      <TableCell>
                        {new Date(music.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                      No music found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}