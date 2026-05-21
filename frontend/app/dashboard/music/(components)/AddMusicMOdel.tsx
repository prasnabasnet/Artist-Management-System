"use client";

import { useState, useEffect } from "react";
import { Music, musicService, MusicPayload } from "@/services/music.service";
import { artistService, Artist } from "@/services/artist.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface AddMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  musicToEdit?: Music | null;
  onUpdate?: (id: number, data: Partial<MusicPayload>) => void;
}

export default function AddMuiscModal({
  open,
  onOpenChange,
  musicToEdit = null,
  onUpdate,
}: AddMusicModalProps) {
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const { showToast } = useToast();

  const [form, setForm] = useState<MusicPayload>({
    artistId: "",       // ✅ camelCase
    title: "",
    albumName: "",      // ✅ camelCase
    genre: "RNB",       // ✅ uppercase to match GraphQL enum
  });

  const fetchArtists = async () => {
    try {
      const res = await artistService.getArtists(1, 1000);
      setArtists(res.rows ?? []);   // ✅ was res.data
    } catch {
      showToast({ message: "Failed to load artists", type: "error" });
    }
  };

  useEffect(() => {
    if (musicToEdit) {
      setForm({
        artistId: String(musicToEdit.artist.id),  // ✅ nested artist object
        title: musicToEdit.title,
        albumName: musicToEdit.albumName,          // ✅ camelCase
        genre: musicToEdit.genre.toUpperCase(),
      });
    } else {
      setForm({ artistId: "", title: "", albumName: "", genre: "RNB" });
    }
    if (open) fetchArtists();
  }, [musicToEdit, open]);

  const handleChange = <K extends keyof MusicPayload>(
    field: K,
    value: MusicPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (musicToEdit && onUpdate) {
        await musicService.updateMusic(musicToEdit.id, form);
        showToast({ message: "Music Updated", type: "success" });
        onUpdate(musicToEdit.id, form);
      } else {
        await musicService.createMusic(form);
        showToast({ message: "Music Created", type: "success" });
      }
      onOpenChange(false);
    } catch {
      showToast({
        message: musicToEdit ? "Failed to update music" : "Failed to create music",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg space-y-6">
        <DialogHeader>
          <DialogTitle>{musicToEdit ? "Edit Music" : "Add New Music"}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Label className="mb-3">Artist</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.artistId}
              onChange={(e) => handleChange("artistId", e.target.value)}
              required
            >
              <option value="">Select Artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={String(artist.id)}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Title</Label>
            <Input
              placeholder="Music Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Album Name</Label>
            <Input
              placeholder="Album Name"
              value={form.albumName}
              onChange={(e) => handleChange("albumName", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Genre</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
            >
              <option value="RNB">R&B</option>
              <option value="COUNTRY">Country</option>
              <option value="CLASSICAL">Classical</option>
              <option value="ROCK">Rock</option>
              <option value="JAZZ">Jazz</option>
              <option value="POP">Pop</option>
              <option value="HIP_HOP">Hip Hop</option>
              <option value="BLUES">Blues</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading
              ? musicToEdit ? "Updating..." : "Creating..."
              : musicToEdit ? "Update Music" : "Create Music"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}