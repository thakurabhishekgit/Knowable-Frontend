
"use client";

import { useState, useEffect } from 'react';
import { AppLayout } from "@/components/app-layout";
import { SettingsLayout } from "@/components/settings-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

const getUserId = (user) => {
    return user?.id || null;
}

function ProfileForm() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    universityName: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        universityName: parsedUser.universityName || '',
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const userId = getUserId(user);
    if (!userId) {
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not find user ID. Please log in again." });
        return;
    }

    const payload = {
        username: formData.username,
        email: formData.email,
        universityName: formData.universityName,
    };
    
    try {
      const updatedUser = await api.put(`/api/users/updateUser/${userId}`, payload);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleProfileUpdate} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="max-w-sm" />
          <p className="text-sm text-muted-foreground">
            This will be your public display name.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="max-w-sm" />
           <p className="text-sm text-muted-foreground">
            Your email address for login and notifications.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="universityName">University</Label>
          <Input id="universityName" name="universityName" value={formData.universityName} onChange={handleInputChange} className="max-w-sm" />
           <p className="text-sm text-muted-foreground">
            The university you are affiliated with.
          </p>
        </div>
         <div className="space-y-2">
          <Label>Profile Picture</Label>
           <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profilePictureUrl || "https://placehold.co/100x100.png"} alt={user.username} data-ai-hint="profile" />
              <AvatarFallback className="text-2xl">{getInitials(user.username)}</AvatarFallback>
            </Avatar>
            <ProfilePictureForm user={user} setUser={setUser} />
          </div>
        </div>
        <Button type="submit">Update profile</Button>
      </form>
    </div>
  )
}

function ProfilePictureForm({ user, setUser }) {
  const { toast } = useToast();
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user?.profilePictureUrl) {
      setPreviewUrl(user.profilePictureUrl);
    }
  }, [user]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePictureUpdate = async (e) => {
    e.preventDefault();
    const userId = getUserId(user);
    if (!profilePictureFile) return;
    
    if (!userId) {
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not find user ID. Please log in again." });
        return;
    }

    const pictureFormData = new FormData();
    pictureFormData.append('profilePicture', profilePictureFile);

    try {
      const updatedUserWithPic = await api.patch(`/api/users/updateProfilePicture/${userId}`, pictureFormData);
      
      localStorage.setItem('user', JSON.stringify(updatedUserWithPic));
      setUser(updatedUserWithPic);
      setPreviewUrl(updatedUserWithPic.profilePictureUrl);
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
      setProfilePictureFile(null); // Reset file input state
    } catch (error) {
      console.error("Failed to update profile picture", error);
    }
  };

  return (
     <form onSubmit={handlePictureUpdate} className="flex items-center gap-4">
      <Input id="profilePicture" type="file" accept="image/*" onChange={handlePictureChange} className="max-w-xs" />
      <Button type="submit" disabled={!profilePictureFile}>
        {profilePictureFile ? 'Save' : 'Change'}
      </Button>
    </form>
  )
}


export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsLayout>
        <ProfileForm />
      </SettingsLayout>
    </AppLayout>
  );
}
