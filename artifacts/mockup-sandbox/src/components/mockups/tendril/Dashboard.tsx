import React from "react";
import {
  Leaf,
  Plus,
  Search,
  Bell,
  Sun,
  Calendar,
  Layers,
  Inbox,
  Settings,
  LogOut,
  MoreHorizontal,
  Check,
  Pause,
  SkipForward,
  Pin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const COLORS = {
  primary: "#8B8FE8",
  soft: "#E8E9FB",
  deep: "#5A5FCF",
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  textInk: "#1A1B2E",
  textNeutral: "#5A5C6B",
  textLight: "#9AA0B4",
};

function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-8 w-8 rounded-[10px] bg-[#8B8FE8] flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight text-[#1A1B2E]">
            Tendril
          </span>
        </div>

        {/* Quick Add */}
        <button className="w-full bg-[#8B8FE8] hover:bg-[#5A5FCF] text-white h-11 rounded-full font-medium flex items-center justify-center gap-2 transition-colors mb-8 shadow-sm">
          <Plus className="w-4 h-4" />
          Quick add
        </button>

        {/* Workspace Nav */}
        <div className="mb-6">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-[#9AA0B4] mb-3">
            Workspace
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[#E8E9FB] text-[#1A1B2E] font-medium"
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#8B8FE8]" />
                <span className="text-sm">Today</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-[#5A5C6B] hover:bg-gray-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#9AA0B4]" />
                <span className="text-sm">Upcoming</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-[#5A5C6B] hover:bg-gray-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#9AA0B4]" />
                <span className="text-sm">Projects</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-[#5A5C6B] hover:bg-gray-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-5 h-5 text-[#9AA0B4]" />
                <span className="text-sm">Inbox</span>
              </div>
              <span className="bg-gray-100 text-[#5A5C6B] text-xs font-semibold px-2 py-0.5 rounded-full">
                3
              </span>
            </a>
          </nav>
        </div>

        {/* More Nav */}
        <div>
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-[#9AA0B4] mb-3">
            More
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-[#5A5C6B] hover:bg-gray-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#9AA0B4]" />
                <span className="text-sm">Notifications</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-[#5A5C6B] hover:bg-gray-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#9AA0B4]" />
                <span className="text-sm">Settings</span>
              </div>
            </a>
          </nav>
        </div>
      </div>

      {/* User Card */}
      <div className="flex items-center justify-between px-2 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 rounded-full border border-gray-100">
            <AvatarImage src="" />
            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-bold">
              AM
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-[#1A1B2E]">Alex Mercer</span>
        </div>
        <LogOut className="w-4 h-4 text-[#9AA0B4]" />
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="h-[80px] flex items-center justify-between px-8 border-b border-gray-100">
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0B4]" />
        <input
          type="text"
          placeholder="Search Tendril..."
          className="w-full h-10 pl-10 pr-4 bg-gray-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#8B8FE8]/50 transition-all font-['Inter'] text-[#1A1B2E] placeholder:text-[#9AA0B4]"
        />
      </div>

      <div className="flex items-center gap-5">
        <span className="text-sm font-medium text-[#9AA0B4]">
          Wednesday, March 23
        </span>
        <button className="relative p-2 rounded-full text-[#5A5C6B] hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
        </button>
        <Avatar className="w-9 h-9 border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarImage src="" />
          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-bold">
            AM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function HeroBand() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="bg-[#E8E9FB] rounded-[24px] p-6 flex items-center justify-between mx-8 mt-6">
      <div>
        <div className="text-sm font-medium text-[#5A5FCF] mb-1">Today's focus</div>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#1A1B2E]">
          3 tasks · 2 hours of deep work
        </h1>
      </div>
      <div className="flex items-center gap-2 bg-white/50 p-2 rounded-2xl backdrop-blur-sm">
        {days.map((day, i) => {
          const isToday = i === 2; // Wed
          const hasTask = [0, 2, 3, 4].includes(i);
          return (
            <div
              key={day}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-xl transition-colors ${
                isToday ? "bg-[#8B8FE8] text-white shadow-sm" : "text-[#5A5C6B]"
              }`}
            >
              <span className={`text-[11px] font-semibold ${isToday ? "text-white" : "text-[#9AA0B4]"}`}>
                {day}
              </span>
              <div className="h-1 flex items-center mt-0.5">
                {hasTask && (
                  <div
                    className={`w-1 h-1 rounded-full ${
                      isToday ? "bg-white" : "bg-[#8B8FE8]"
                    }`}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksCard() {
  const tasks = [
    { title: "Draft Q2 retro deck", project: "Marketing", due: "Today", completed: true },
    { title: "Sign vendor contract", project: "Ops", due: "Today", completed: false },
    { title: "Review keynote outline", project: "Product", due: "Tomorrow", completed: false },
    { title: "Sync with research team", project: "Research", due: "Tomorrow", completed: false },
    { title: "Send sponsor invoices", project: "Finance", due: "Fri", completed: false },
  ];

  return (
    <div className="bg-white rounded-[24px] p-7 shadow-[0_2px_8px_rgba(26,27,46,0.04)] border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#1A1B2E]">
            Tasks
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8E9FB] text-[#5A5FCF]">
            5 today
          </span>
        </div>
        <button className="text-[#9AA0B4] hover:text-[#5A5C6B] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <button
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  task.completed
                    ? "bg-[#8B8FE8] border-[#8B8FE8] text-white"
                    : "border-gray-300 group-hover:border-[#8B8FE8] text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span
                className={`text-sm font-medium ${
                  task.completed
                    ? "text-[#9AA0B4] line-through"
                    : "text-[#1A1B2E]"
                }`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded text-[#5A5C6B] bg-gray-50 border border-gray-100">
                {task.project}
              </span>
              <span
                className={`text-xs font-semibold ${
                  task.due === "Today" ? "text-[#8B8FE8]" : "text-[#9AA0B4]"
                }`}
              >
                {task.due}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PinnedNotesCard() {
  const notes = [
    {
      title: "Research handoff",
      preview: "pasted the keynote outline link",
    },
    {
      title: "Q2 OKRs",
      preview: "finalize by Friday with leadership",
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-7 shadow-[0_2px_8px_rgba(26,27,46,0.04)] border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#1A1B2E]">
          Pinned notes
        </h2>
        <button className="text-[#9AA0B4] hover:text-[#5A5C6B] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {notes.map((note, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#E8E9FB] transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#8B8FE8] mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[#1A1B2E] mb-1">
                  {note.title}
                </h3>
                <p className="text-xs text-[#5A5C6B] leading-relaxed">
                  {note.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-gray-200 text-sm font-medium text-[#5A5C6B] hover:text-[#1A1B2E] hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
        <Pin className="w-4 h-4" />
        Pin a note
      </button>
    </div>
  );
}

function ProjectsCard() {
  const projects = [
    { name: "Brand refresh", tasks: 12, progress: 60, color: "bg-orange-100 text-orange-500" },
    { name: "Q2 launch", tasks: 28, progress: 35, color: "bg-blue-100 text-blue-500" },
    { name: "Hiring sprint", tasks: 7, progress: 80, color: "bg-emerald-100 text-emerald-500" },
    { name: "Internal tooling", tasks: 15, progress: 20, color: "bg-purple-100 text-purple-500" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-7 shadow-[0_2px_8px_rgba(26,27,46,0.04)] border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#1A1B2E]">
          Projects
        </h2>
        <button className="text-[#9AA0B4] hover:text-[#5A5C6B] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {projects.map((proj, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${proj.color}`}>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1A1B2E]">
                  {proj.name}
                </h3>
                <p className="text-xs text-[#9AA0B4] mt-0.5">
                  {proj.tasks} tasks
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-1/3 justify-end">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8B8FE8] rounded-full" 
                  style={{ width: `${proj.progress}%` }} 
                />
              </div>
              <div className="flex -space-x-2 flex-shrink-0">
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-[10px]">A</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">B</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-5 py-3 rounded-xl bg-gray-50 text-sm font-medium text-[#5A5C6B] hover:text-[#1A1B2E] hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        New project
      </button>
    </div>
  );
}

function FocusSessionCard() {
  return (
    <div className="bg-white rounded-[24px] p-7 shadow-[0_2px_8px_rgba(26,27,46,0.04)] border border-gray-100 flex flex-col h-full items-center justify-between relative overflow-hidden">
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#1A1B2E]">
            Focus session
          </h2>
          <p className="text-xs text-[#9AA0B4] font-medium mt-0.5">
            Deep work · Pomodoro
          </p>
        </div>
        <button className="text-[#9AA0B4] hover:text-[#5A5C6B] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex flex-col items-center justify-center w-48 h-48 my-4 z-10">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-gray-100"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-[#8B8FE8]"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="552.92"
            strokeDashoffset="276.46" // 50%
          />
        </svg>
        <div className="text-center mt-2">
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-[#1A1B2E] tracking-tight">
            24:18
          </span>
          <p className="text-sm font-medium text-[#9AA0B4] mt-1">of 50:00</p>
        </div>
      </div>

      <div className="text-center mb-6 z-10">
        <h3 className="font-semibold text-sm text-[#1A1B2E]">Draft Q2 retro deck</h3>
        <span className="inline-block px-2 py-0.5 mt-1.5 rounded text-xs font-medium text-[#5A5FCF] bg-[#E8E9FB]">
          Marketing
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6 z-10">
        <button className="px-6 py-2.5 bg-[#8B8FE8] hover:bg-[#5A5FCF] text-white rounded-full font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
          <Pause className="w-4 h-4 fill-current" />
          Pause
        </button>
        <button className="px-6 py-2.5 border border-gray-200 text-[#5A5C6B] hover:bg-gray-50 rounded-full font-medium text-sm transition-colors flex items-center gap-2">
          <SkipForward className="w-4 h-4" />
          Skip
        </button>
      </div>

      <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-center text-xs font-medium text-[#9AA0B4] z-10">
        3 of 4 sessions today · 2h 15m focused
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E8E9FB] rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 flex items-center justify-center font-['Inter']">
      {/* App Container */}
      <div className="w-full max-w-[1280px] h-[860px] bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex overflow-hidden ring-1 ring-black/5">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto">
            <HeroBand />
            
            <div className="p-8">
              <div className="max-w-[1000px] mx-auto space-y-6">
                
                {/* Top Row */}
                <div className="grid grid-cols-12 gap-6 h-[340px]">
                  <div className="col-span-8">
                    <TasksCard />
                  </div>
                  <div className="col-span-4">
                    <PinnedNotesCard />
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-12 gap-6 h-[440px]">
                  <div className="col-span-7">
                    <ProjectsCard />
                  </div>
                  <div className="col-span-5">
                    <FocusSessionCard />
                  </div>
                </div>
                
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
