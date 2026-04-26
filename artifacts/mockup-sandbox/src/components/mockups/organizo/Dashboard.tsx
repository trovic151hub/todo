import React from "react";
import {
  LayoutDashboard,
  ListChecks,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  Circle,
  Briefcase,
  Users,
  Calendar as CalendarIcon,
  Pause,
  Play,
  Clock,
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AccentYellow = "#FFD93D";
const SoftYellow = "#FFF7D6";

function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col justify-between py-8 px-6">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
            AZ
          </div>
          <span className="font-bold text-xl tracking-tight">Organizo</span>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#FFF7D6] text-black font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-full text-gray-500 hover:bg-gray-50 transition-colors font-medium"
          >
            <ListChecks className="w-5 h-5" />
            My tasks
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-full text-gray-500 hover:bg-gray-50 transition-colors font-medium"
          >
            <Bell className="w-5 h-5" />
            Notifications
          </a>
        </nav>
      </div>

      <div className="space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-full text-gray-500 hover:bg-gray-50 transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          Settings
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-full text-gray-500 hover:bg-gray-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </a>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="h-[88px] flex items-center justify-between px-8 border-b border-gray-100">
      <div className="relative w-96">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for task or project..."
          className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <Mail className="w-5 h-5" />
        </button>
        <button className="bg-[#FFD93D] hover:bg-[#F4CE33] text-black h-12 px-6 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          New task
        </button>
      </div>
    </header>
  );
}

function CalendarCard() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  
  // Generating a static calendar grid for March 2022
  const dates = [
    [28, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 1, 2, 3]
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">March 2022</h2>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map((d, i) => (
          <div key={i} className="text-xs font-semibold text-gray-400">
            {d}
          </div>
        ))}
        {dates.flat().map((date, i) => {
          const isPrevMonth = i < 1; // 28
          const isNextMonth = i > 30; // 1, 2, 3
          const isActive = date === 3 && !isPrevMonth && !isNextMonth;
          
          return (
            <div key={i} className="flex justify-center items-center h-8">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                  isActive
                    ? "bg-[#FFD93D] text-black shadow-sm"
                    : isPrevMonth || isNextMonth
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksCard() {
  const tasks = [
    { title: "Finish monthly reporting", due: "Today", completed: true },
    { title: "Contract signing", due: "Today", completed: false },
    { title: "Market overview keyno...", due: "Tomorrow", completed: false },
    { title: "Project research", due: "Tomorrow", completed: false },
    { title: "Prepare invoices", due: "This week", completed: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">My tasks (05)</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <button
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  task.completed
                    ? "bg-[#FFD93D] border-[#FFD93D] text-black"
                    : "border-gray-300 group-hover:border-gray-400 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span
                className={`text-sm font-medium ${
                  task.completed ? "text-gray-400 line-through" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
              {task.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsCard() {
  const comments = [
    {
      title: "Market research",
      text: "Can you review the latest market research data?",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      title: "Market research",
      text: "I've added some notes to the document.",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full flex flex-col">
      <h2 className="font-bold text-lg mb-6">New comments</h2>

      <div className="space-y-4 flex-1">
        {comments.map((comment, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm text-gray-800">{comment.title}</h3>
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {comment.text}
            </p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 rounded-full border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}

function CategoriesCard() {
  const categories = [
    { name: "Work", icon: <Briefcase className="w-4 h-4" />, users: 3 },
    { name: "Family", icon: <Users className="w-4 h-4" />, users: 2 },
    { name: "Freelance work 01", icon: <CalendarIcon className="w-4 h-4" />, users: 1 },
    { name: "Conference planning", icon: <MessageSquare className="w-4 h-4" />, users: 4 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">My categories</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: cat.users }).map((_, j) => (
                <Avatar key={j} className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i}${j}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-3 rounded-full text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Add more
      </button>
    </div>
  );
}

function TrackingCard() {
  const tracking = [
    { title: "Create wireframe", time: "1h 25m 30s", active: true },
    { title: "Slack logo design", time: "30m 18s", active: false },
    { title: "Dashboard design", time: "1h 48m 22s", active: false },
    { title: "Create wireframe", time: "17m 1s", active: false },
    { title: "Mood tracker", time: "15h 5m 58s", active: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full">
      <h2 className="font-bold text-lg mb-6">My tracking</h2>

      <div className="space-y-2">
        {tracking.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
              item.active ? "bg-[#FFF7D6]" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.active ? 'text-yellow-600 bg-yellow-100/50' : 'text-gray-400 bg-gray-100'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${item.active ? "text-gray-900" : "text-gray-700"}`}>
                {item.title}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono font-medium ${item.active ? "text-yellow-700" : "text-gray-500"}`}>
                {item.time}
              </span>
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
                  item.active
                    ? "bg-[#FFD93D] text-black shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.active ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FBF6E2] p-4 flex items-center justify-center font-sans">
      {/* App Container */}
      <div className="w-full max-w-[1280px] h-[860px] bg-white rounded-[32px] shadow-2xl flex overflow-hidden ring-1 ring-black/5">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <TopBar />
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Top Row Grid */}
              <div className="grid grid-cols-12 gap-6 h-[320px]">
                <div className="col-span-4">
                  <CalendarCard />
                </div>
                <div className="col-span-5">
                  <TasksCard />
                </div>
                <div className="col-span-3">
                  <CommentsCard />
                </div>
              </div>

              {/* Bottom Row Grid */}
              <div className="grid grid-cols-12 gap-6 h-[400px]">
                <div className="col-span-5">
                  <CategoriesCard />
                </div>
                <div className="col-span-7">
                  <TrackingCard />
                </div>
              </div>

              {/* Add Widget Link */}
              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Add widget
                </button>
              </div>
              
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
