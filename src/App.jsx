
import { Outlet, Link } from "react-router-dom"
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

function App() {

  return (
    <SidebarProvider>
      <div className="flex h-screen ">

        <Sidebar collapsible="icon">

          {/* Header */}
          <SidebarHeader className="text-right p-4">
            <p className="group-data-[collapsible=icon]:hidden">الإدارة</p>
            <p className="hidden group-data-[collapsible=icon]:block"></p>
          </SidebarHeader>

          {/* Content */}
          <SidebarContent>

            <SidebarGroup >
              <SidebarGroupContent>

                <SidebarMenu>
                  <SidebarMenuItem>

                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <Home />
                        <span>الرئيسية</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <Users />
                        <span>المستخدمين</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <Settings />
                        <span>الإعدادات</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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

            <button className="w-full text-sm bg-black text-white py-1 rounded group-data-[collapsible=icon]:hidden">
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
