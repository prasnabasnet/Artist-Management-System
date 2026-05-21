"use client";

import { useEffect, useState } from "react";
import { musicService, Music } from "@/services/music.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Trash2, Edit } from "lucide-react";
import AddMuiscModal from "./(components)/AddMusicMOdel";

export default function MusicPage() {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast();

  const fetchMusic = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const res = await musicService.getAllMusic(pageNumber, limit);
      setMusicList(res.rows);        // ✅ was res.data
      setTotal(res.totalRows);       // ✅ was res.total
    } catch (err: any) {
      showToast({ message: err.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this music?");
    if (!confirmed) return;
    try {
      await musicService.deleteMusic(id);
      setMusicList((prev) => prev.filter((m) => m.id !== id));
      showToast({ message: "Music removed successfully", type: "success" });
    } catch (err: any) {
      showToast({ message: err.message || "Something went wrong", type: "error" });
    }
  };

  const handleEdit = (music: Music) => {
    setSelectedMusic(music);
    setIsModalOpen(true);
  };

  const handleUpdate = (id: number, data: Partial<Music>) => {
    setMusicList((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  useEffect(() => {
    if (!isModalOpen) fetchMusic(page);
  }, [page, isModalOpen]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Music</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Music</Button>
      </div>

      <AddMuiscModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedMusic(null);
        }}
        musicToEdit={selectedMusic}
        onUpdate={handleUpdate}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(musicList) && musicList.length > 0 ? (
              musicList.map((music) => (
                <TableRow key={music.id}>
                  <TableCell>{music.title}</TableCell>
                  <TableCell>{music.albumName}</TableCell>   {/* ✅ camelCase */}
                  <TableCell>{music.genre}</TableCell>
                  <TableCell>{music.artist.name}</TableCell> {/* ✅ nested artist */}
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(music)}
                      className="mr-2"
                    >
                      <Edit size={20} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(music.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                  {loading ? "Loading..." : "No music found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end mt-4 space-x-4">
          <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>  {/* ✅ fixed pagination */}
          <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}