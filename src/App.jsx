import { Outlet, NavLink, useLocation, Link, useNavigate } from "react-router-dom"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger
} from './components/ui/sidebar'
import {
  Home, Users, Settings, ChevronDown, UserCircle, CreditCard, ShieldCheck,
  Briefcase, Globe, Wifi, LogOut, CreditCardIcon, ArrowUpRight, Users2,
  Bell, MessageSquare,
} from "lucide-react"
import { Separator } from "./components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./components/ui/collapsible"
import './index.css'
import { useState } from "react"
import { Network } from "lucide-react"
import { Layers } from "lucide-react"
import { Zap } from "lucide-react"
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useGetUser } from "./api/user"


function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const cookies = Cookie();
  const token = cookies.get("token");

  let userRole = null;
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
      userRole = decoded.role;
    } catch (error) {
      console.error(error);
    }
  }

  const { data: userData, isLoading } = useGetUser(userId);
  const user = userData?.user || userData;


  // open close collapsible
  const [openGroups, setOpenGroups] = useState(() => {
    const saved = localStorage.getItem("open_sidebar_groups");
    return saved ? JSON.parse(saved) : [];
  });
  const toggleGroup = (title) => {
    setOpenGroups((prev) => {
      const next = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      localStorage.setItem("open_sidebar_groups", JSON.stringify(next));
      return next;
    });
  };


  const menuGroups = [
    // for admin only
    {
      title: "إدارة المستخدمين", adminOnly: true, icon: <Users />, items: [
        { title: "قائمة المستخدمين", path: "/users", icon: <UserCircle size={20} /> },
      ]
    },
    // for all users
    {
      title: "إدارة الشبكات",
      icon: <Network size={22} />,
      items: [
        { title: "شبكات الانترنت", path: "/networks", icon: <Globe size={20} /> },
        { title: "نقاط الإنترنت", path: "/access-points", icon: <Wifi size={20} /> }

      ]
    },
    {
      title: "إدارة الباقات",
      icon: <Layers size={22} />,
      items: [
        { title: "باقات الإنترنت", path: "/plans", icon: <Zap size={20} /> }
      ]
    },
    {
      title: "إدارة الاشتراكات", icon: <Users />, items: [
        { title: "قائمة الزبائن", path: "/customers", icon: <Users2 size={20} /> },
        { title: "اشتراكات الزبائن", path: "/subscriptions", icon: <CreditCard size={20} /> },
      ]
    },
    {
      title: "إدارة الموظفين", icon: <Briefcase />, items: [
        { title: "قائمة الموظفين", path: "/employees", icon: <Users size={20} /> },
        { title: "قائمة الصلاحيات", path: "/permissions", icon: <ShieldCheck size={20} /> },
        { title: "صلاحيات الموظفين", path: "/employees-permissions", icon: <ShieldCheck size={20} /> },
      ]
    },
    {
      title: "المالية", icon: <CreditCardIcon />, items: [
        { title: "المدفوعات", path: "/payments", icon: <CreditCard size={20} /> },
        { title: "المصروفات", path: "/expenses", icon: <ArrowUpRight size={20} className="text-red-500" /> },
        { title: "أنواع المصروفات", path: "/expenses-types", icon: <ArrowUpRight size={20} className="text-red-500" /> },
      ]
    },
  ].filter(group => {
    if (group.adminOnly) {
      return userRole === "admin";
    }
    return true;
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="text-right p-4">
            <Link to={'/'} className="group-data-[collapsible=icon]:hidden font-bold text-xl">الإدارة</Link>
          </SidebarHeader>
          <Separator />
          <SidebarContent className="pt-6">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/"} className="h-12">
                      <NavLink to="/" end className="flex items-center gap-3 w-full p-2 text-xl font-medium">
                        <Home size={24} /> <span>لوحة التحكم</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {menuGroups.map((group, index) => (
                    <Collapsible
                      key={index}
                      className="group/collapsible"
                      open={openGroups.includes(group.title)}
                      onOpenChange={() => toggleGroup(group.title)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="h-12 text-xl font-medium">
                            {group.icon}
                            <span>{group.title}</span>
                            <ChevronDown className="mr-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="mr-4 border-r-2 border-stone-200 gap-2 mt-1">
                            {group.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.path}>
                                <SidebarMenuSubButton asChild isActive={location.pathname === subItem.path} className="h-10">
                                  <NavLink to={subItem.path} className="flex items-center gap-3 text-lg py-2">
                                    {subItem.icon}
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ))}

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/settings"} className="h-10">
                      <NavLink to="/settings" className="flex items-center gap-3 w-full p-2 text-xl font-medium">
                        <Settings size={24} /> <span>الإعدادات</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold font-cairo shadow-inner transition-all">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : "U"
                  )}
                </div>
                <span className="absolute bottom-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                </span>
              </div>

              <div className="group-data-[collapsible=icon]:hidden text-right font-cairo">
                <p className="font-bold text-lg leading-none">
                  {isLoading ? "جاري التحميل..." : (user?.name || "مستخدم مجهول")}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-sm text-green-700 font-bold">متصل الآن</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/logout')}
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-black hover:bg-stone-800 text-white py-2 rounded-md group-data-[collapsible=icon]:hidden font-cairo transition-all shadow-sm active:scale-95"
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* logout */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
            <SidebarTrigger />

            <div className="flex items-center gap-4">

              <button className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors cursor-pointer">
                <MessageSquare size={20} />
              </button>
              <button className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-stone-50 overflow-auto">
            <Outlet />
          </main>
        </div>

      </div>
    </SidebarProvider>
  )
}

export default App