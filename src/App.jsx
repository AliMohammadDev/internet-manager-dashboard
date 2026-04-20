
import { Outlet, NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from './components/ui/sidebar'
import { Home, Users, Settings } from "lucide-react"
import { Separator } from "./components/ui/separator"
import './index.css'

function App() {
  const location = useLocation();

  const menuItems = [
    { title: "الرئيسية", path: "/", icon: <Home />, end: true },
    { title: "المستخدمين", path: "/users", icon: <Users />, end: false },
    { title: "الإعدادات", path: "/settings", icon: <Settings />, end: false },
  ];


  return (
    <SidebarProvider>
      <div className="flex h-screen ">

        <Sidebar collapsible="icon">

          {/* Header */}
          <SidebarHeader className="text-right p-4">
            <p className="group-data-[collapsible=icon]:hidden">الإدارة</p>
            <p className="hidden group-data-[collapsible=icon]:block"></p>
          </SidebarHeader>
          <Separator />
          {/* Content */}
          <SidebarContent className="pt-9">

            <SidebarGroup >
              <SidebarGroupContent>

                <SidebarMenu className="gap-4">
                  {menuItems.map((item) => (

                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        className="data-[active=true]:bg-mist-800 data-[active=true]:text-white"
                      >
                        <NavLink to={item.path} end={item.end} className="flex items-center gap-2 w-full p-2">
                          {item.icon}
                          <span className="text-lg">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

              </SidebarGroupContent>
            </SidebarGroup>

          </SidebarContent>

          {/* footer */}
          <SidebarFooter className="p-4 border-t space-y-2">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="group-data-[collapsible=icon]:hidden text-right">
                <p className=" font-medium">Admin</p>
                <p className="text-xs opacity-60">Online</p>
              </div>

            </div>

            <button className="w-full cursor-pointer text-sm bg-black text-white py-1 rounded group-data-[collapsible=icon]:hidden">
              Logout
            </button>

          </SidebarFooter>
        </Sidebar>


        <main className="flex-1 p-6">
          <SidebarTrigger />
          <Outlet />
        </main>

      </div>
    </SidebarProvider>
  )
}

export default App
