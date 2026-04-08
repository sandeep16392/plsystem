import { useState } from "react";
import { useAuthStore } from "./stores/authStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";

type Page = "login" | "register" | "groups" | "create-group" | "group-detail";

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [page, setPage] = useState<Page>("login");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  if (!isAuthenticated) {
    if (page === "register") {
      return <Register onSwitch={() => setPage("login")} />;
    }
    return <Login onSwitch={() => setPage("register")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* App header */}
      <header className="bg-primary-600 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold" data-testid="app-header">SplitWise</h1>
        <div className="flex items-center gap-3">
          <span data-testid="current-user" className="text-sm">{user?.display_name}</span>
          <button data-testid="logout-btn" onClick={() => { logout(); setPage("login"); }} className="text-sm underline">
            Logout
          </button>
        </div>
      </header>

      {/* Page content */}
      {page === "groups" || (page === "login" && isAuthenticated) ? (
        <Groups
          onSelect={(id) => { setSelectedGroupId(id); setPage("group-detail"); }}
          onCreateNew={() => setPage("create-group")}
        />
      ) : page === "create-group" ? (
        <CreateGroup
          onCreated={() => setPage("groups")}
          onBack={() => setPage("groups")}
        />
      ) : page === "group-detail" && selectedGroupId ? (
        <GroupDetail
          groupId={selectedGroupId}
          onBack={() => setPage("groups")}
        />
      ) : (
        <Groups
          onSelect={(id) => { setSelectedGroupId(id); setPage("group-detail"); }}
          onCreateNew={() => setPage("create-group")}
        />
      )}
    </div>
  );
}

export default App;
