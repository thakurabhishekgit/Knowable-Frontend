
"use client";

import { useState, useEffect } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    universityName: '',
    password: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        universityName: parsedUser.universityName || '',
        password: '' // Password field should be empty for security
      });
      setPreviewUrl(parsedUser.profilePictureUrl);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    const payload = {
        username: formData.username,
        email: formData.email,
        universityName: formData.universityName,
    };
    
    // Only include the password if the user entered a new one
    if (formData.password) {
        payload.password = formData.password;
    }


    try {
      const updatedUser = await api.put(`/api/users/updateUser/${user.id}`, payload);
      
      // We need to preserve the token from the original user object
      const newUserData = { ...updatedUser, token: user.token };
      
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handlePictureUpdate = async (e) => {
    e.preventDefault();
    if (!profilePictureFile || !user || !user.id) return;

    const pictureFormData = new FormData();
    pictureFormData.append('profilePicture', profilePictureFile);

    try {
      const updatedUser = await api.patch(`/api/users/updateProfilePicture/${user.id}`, pictureFormData);

       // We need to preserve the token from the original user object
      const newUserData = { ...updatedUser, token: user.token };

      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      setPreviewUrl(newUserData.profilePictureUrl); // Update preview with the new final URL
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile picture", error);
    }
  };


  if (!user) {
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your avatar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePictureUpdate} className="space-y-4">
                <div className="flex justify-center">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={previewUrl || "https://placehold.co/100x100.png"} alt={user.username} data-ai-hint="profile" />
                        <AvatarFallback className="text-5xl">{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="profilePicture">New Picture</Label>
                    <Input id="profilePicture" type="file" accept="image/*" onChange={handlePictureChange} />
                </div>
                <Button type="submit" disabled={!profilePictureFile}>Upload Picture</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="universityName">University</Label>
                  <Input id="universityName" name="universityName" value={formData.universityName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Leave blank to keep current password" value={formData.password} onChange={handleInputChange} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
