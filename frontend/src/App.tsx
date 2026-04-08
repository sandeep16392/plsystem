import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen pb-16">
          <Routes>
            <Route path="/" element={<div className="p-4 text-center mt-20"><h1 className="text-2xl font-bold text-primary-600">Splitwise Multi-Currency</h1><p className="text-gray-500 mt-2">Coming soon...</p></div>} />
          </Routes>
        </div>
        {/* Bottom Nav placeholder */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 safe-bottom">
          <button className="flex flex-col items-center min-h-touch min-w-touch justify-center text-primary-600 text-xs font-medium">
            <span className="text-lg">&#9776;</span>
            Groups
          </button>
          <button className="flex flex-col items-center min-h-touch min-w-touch justify-center text-gray-400 text-xs">
            <span className="text-lg">&#9734;</span>
            Friends
          </button>
          <button className="flex flex-col items-center min-h-touch min-w-touch justify-center text-gray-400 text-xs">
            <span className="text-lg">&#43;</span>
            Add
          </button>
          <button className="flex flex-col items-center min-h-touch min-w-touch justify-center text-gray-400 text-xs">
            <span className="text-lg">&#128276;</span>
            Activity
          </button>
          <button className="flex flex-col items-center min-h-touch min-w-touch justify-center text-gray-400 text-xs">
            <span className="text-lg">&#9881;</span>
            Account
          </button>
        </nav>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
