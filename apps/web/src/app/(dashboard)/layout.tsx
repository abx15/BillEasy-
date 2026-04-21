// Dashboard Layout - Sidebar + topbar layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar Placeholder */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">BillEasy</h2>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2 text-sm text-gray-600">Navigation</div>
            {/* Navigation items will be added here */}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Topbar Placeholder */}
          <header className="bg-white shadow-sm">
            <div className="px-4 py-4">
              <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
