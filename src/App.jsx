
import { Sidebar, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'

function App() {

  return (
    <SidebarProvider>
      <div className="flex h-screen f">

        <Sidebar />

        <main className="flex-1 p-6 ">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        </main>

      </div>
    </SidebarProvider>
  )
}

export default App
