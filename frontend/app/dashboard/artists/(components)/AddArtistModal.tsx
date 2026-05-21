"use client";

import { useState, useEffect } from "react";
import { Artist, artistService } from "@/services/artist.service";
import { userService, UserOption } from "@/services/user.service";
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

type ArtistForm = {
  name: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  firstReleaseYear: string;
  noOfAlbumsReleased: string;
  userId: string;  // ✅ added
};

interface AddArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistToEdit?: Artist | null;
  onUpdate?: (id: number, data: Partial<ArtistForm>) => void;
}

export default function AddArtistModal({
  open,
  onOpenChange,
  artistToEdit = null,
  onUpdate,
}: AddArtistModalProps) {
  const [loading, setLoading] = useState(false);
  const [artistUsers, setArtistUsers] = useState<UserOption[]>([]);  // ✅ added
  const { showToast } = useToast();

  const [form, setForm] = useState<ArtistForm>({
    name: "",
    dob: "",
    gender: "MALE",
    address: "",
    firstReleaseYear: "",
    noOfAlbumsReleased: "",
    userId: "",  // ✅ added
  });

  useEffect(() => {
    if (open) {
      // ✅ fetch artist users when modal opens
      userService.getArtistUsers()
        .then(setArtistUsers)
        .catch(() => showToast({ message: "Failed to load users", type: "error" }));
    }

    if (artistToEdit) {
      setForm({
        name: artistToEdit.name,
        dob: artistToEdit.dob,
        gender: artistToEdit.gender.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
        address: artistToEdit.address,
        firstReleaseYear: String(artistToEdit.firstReleaseYear),
        noOfAlbumsReleased: String(artistToEdit.noOfAlbumsReleased),
        userId: "",
      });
    } else {
      setForm({
        name: "",
        dob: "",
        gender: "MALE",
        address: "",
        firstReleaseYear: "",
        noOfAlbumsReleased: "",
        userId: "",
      });
    }
  }, [artistToEdit, open]);

  const handleChange = <K extends keyof ArtistForm>(
    field: K,
    value: ArtistForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        firstReleaseYear: Number(form.firstReleaseYear),
        noOfAlbumsReleased: Number(form.noOfAlbumsReleased),
        ...(form.userId ? { userId: form.userId } : {}),  // ✅ only include if selected
      };

      if (artistToEdit && onUpdate) {
        await artistService.updateArtist(artistToEdit.id, payload);
        showToast({ message: "Artist Updated", type: "success" });
        onUpdate(artistToEdit.id, form);
      } else {
        await artistService.createArtist(payload);
        showToast({ message: "Artist Created", type: "success" });
      }
      onOpenChange(false);
    } catch (err: any) {
      showToast({
        message: err.message || (artistToEdit ? "Failed to update artist" : "Failed to create artist"),
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
          <DialogTitle>{artistToEdit ? "Edit Artist" : "Add New Artist"}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Label className="mb-3">Name</Label>
            <Input
              placeholder="Artist Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Date of Birth</Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Gender</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value as "MALE" | "FEMALE" | "OTHER")
              }
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Address</Label>
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">First Release Year</Label>
            <Input
              type="number"
              placeholder="2008"
              value={form.firstReleaseYear}
              onChange={(e) => handleChange("firstReleaseYear", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-3">Number of Albums Released</Label>
            <Input
              type="number"
              placeholder="20"
              value={form.noOfAlbumsReleased}
              onChange={(e) => handleChange("noOfAlbumsReleased", e.target.value)}
            />
          </div>

          {/* ✅ user dropdown — only show when creating, not editing */}
          {!artistToEdit && (
            <div className="flex flex-col">
              <Label className="mb-3">Link to User Account (optional)</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
              >
                <option value="">-- Select user --</option>
                {artistUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading
              ? artistToEdit ? "Updating..." : "Creating..."
              : artistToEdit ? "Update Artist" : "Create Artist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}