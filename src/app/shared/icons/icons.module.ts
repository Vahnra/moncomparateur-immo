import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { Home, Menu, Calendar, FileText, ArrowLeft, LogOut, User, Folder, LogIn, UserPlus, Map, MessageSquare, Users, Clipboard, Sliders, Settings, TrendingUp, Mail, Lock, Unlock, Activity, Layers, MoreHorizontal, MoreVertical, Plus } from 'angular-feather/icons';

const icons = {
  Calendar,
  Home,
  Menu,
  FileText,
  ArrowLeft,
  LogOut,
  User,
  Folder,
  LogIn,
  UserPlus,
  Map,
  MessageSquare,
  Users,
  Clipboard,
  Sliders,
  Settings,
  TrendingUp,
  Mail,
  Lock,
  Unlock,
  Activity,
  Layers,
  MoreHorizontal,
  MoreVertical,
  Plus
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
