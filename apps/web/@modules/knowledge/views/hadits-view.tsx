"use client"

import { useState, useEffect } from "react"
import { 
  Search, Filter, LayoutGrid, List, Star, ChevronRight, ChevronLeft,
  ChevronsLeft, ChevronsRight, BookOpen, PieChart, Activity, Layers, Globe,
  Database, Info, CheckCircle2, Clock, Bookmark, Link, Quote, Book, ShieldCheck,
  AlertTriangle, XCircle, Cross, Flame
} from "lucide-react"

// --- Data mapped dynamically from Supabase API ---

const compendiums = [
  { n: "Sahih al-Bukhari", v: "7,275", c: "bg-emerald-500" },
  { n: "Sahih Muslim", v: "4,341", c: "bg-emerald-500" },
  { n: "Sunan Abu Dawud", v: "4,804", c: "bg-blue-500" },
  { n: "Jami' at-Tirmidhi", v: "3,955", c: "bg-amber-500" },
  { n: "Sunan an-Nasa'i", v: "5,618", c: "bg-blue-500" },
  { n: "Sunan Ibn Majah", v: "4,256", c: "bg-blue-500" },
  { n: "Muwatta Malik", v: "2,363", c: "bg-emerald-500" },
  { n: "Sunan ad-Darimi", v: "3,401", c: "bg-blue-500" },
  { n: "Musnad Ahmad", v: "29,750", c: "bg-red-500" },
  { n: "Sunan al-Bayhaqi", v: "15,125", c: "bg-amber-500" },
  { n: "Sunan ad-Daraqutni", v: "5,277", c: "bg-red-500" },
  { n: "Sunan al-Kubra (Nasa'i)", v: "10,327", c: "bg-blue-500" },
  { n: "Jami' Ibn Hibban", v: "8,957", c: "bg-emerald-500" },
  { n: "Mustadrak al-Hakim", v: "6,666", c: "bg-amber-500" },
]

export function HaditsPortalView() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState("0")
  const [now, setNow] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  const [hadithData, setHadithData] = useState<any[]>([])
  const [totalHadiths, setTotalHadiths] = useState(187642)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/hadiths?page=${currentPage}&limit=20`)
      .then(res => res.json())
      .then(json => {
         if (json.success && json.data) {
            const formatted = json.data.map((item: any) => {
               const g = (item.grade || '').toLowerCase()
               let c = 'emerald'
               if(g.includes('hasan')) c = 'blue'
               else if(g.includes('daif') || g.includes('weak')) c = 'amber'
               else if(g.includes('mawdhu') || g.includes('fabricated')) c = 'red'

               return {
                  id: item.id?.toString() || '0',
                  grade: item.grade || 'SAHIH',
                  arabic: item.text_ar || item.text_arabic || '...',
                  translation: item.matan_id || item.text_en || item.text_id || '...',
                  ref: `${(item.book_slug || 'Book').replace(/-/g, ' ')} • ${item.number || '?'}`,
                  topic: 'General Topic',
                  quran: '—',
                  color: c,
                  raw: item
               }
            })
            setHadithData(formatted)
            setTotalHadiths(json.total || 187642)
            if (formatted.length > 0) setActiveId(formatted[0].id)
         }
         setIsLoading(false)
      })
      .catch(err => {
         console.error(err)
         setIsLoading(false)
      })
  }, [currentPage])

  if (!mounted || isLoading) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-blue-500 font-mono text-sm tracking-widest">INITIALIZING SUPABASE CONNECTION...</div>

  const timeString = now.toISOString().split("T")[1].split(".")[0]
  
  const activeItem = hadithData.find(x => x.id === activeId) || hadithData[0] || null
  const totalPages = Math.max(1, Math.ceil(totalHadiths / 20))

  const filteredData = hadithData.filter(item => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return item.translation.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q) || item.ref.toLowerCase().includes(q)
  })

  return (
    <div className="bg-[#020813] text-[#8F9FB3] font-sans min-h-screen p-4 selection:bg-blue-500/30 flex flex-col">
      <div className="max-w-[1800px] mx-auto space-y-4 flex-1 flex flex-col w-full">
        
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4 shrink-0 relative overflow-hidden">
           <div className="absolute top-0 right-10 w-96 h-32 bg-blue-500/5 blur-[100px] pointer-events-none" />
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                 <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-widest uppercase text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  PROPHETIC TRADITIONS & HADITH COMPENDIUMS
                </h1>
                <p className="text-[10px] mt-1 text-[#8F9FB3] max-w-2xl">
                  Explore authentic Hadiths of Prophet Muhammad PBUH (14 Canonical Compendiums) and Oral Traditions clarifying divine scriptures from Torah (Mishna), Psalms (Tasbih), and Gospel (Didache of 12 Apostles).
                </p>
              </div>
           </div>
           <div className="flex items-center gap-6 shrink-0 pt-1 relative z-10">
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">OPERATION MODE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">HADITH-COMPENDIUM-SCAN</div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">SYSTEM STATUS</div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1.5 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">LAST UPDATE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest font-mono">12 AUG 2026 • {timeString} UTC+0</div>
             </div>
             <div className="text-center opacity-90 mix-blend-screen scale-150 transform translate-y-1 -translate-x-4 pointer-events-none">
                <img src="/assets/hadith_header.png" className="w-16 h-16 object-cover rounded-full" alt="Calligraphy" style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 60%)' }} />
             </div>
           </div>
        </div>

        {/* ═══ TOP STATS ROW ═══ */}
        <div className="flex gap-4 border border-white/5 rounded-xl bg-[#040C1A] overflow-hidden shrink-0 shadow-lg">
           
           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5 relative overflow-hidden group hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                 <Book className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">TOTAL HADITHS</div>
                 <div className="text-2xl font-mono text-white font-bold leading-none mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">30,800</div>
                 <div className="text-[8px] uppercase tracking-widest text-blue-400">NARRATIONS</div>
              </div>
           </div>

           <div className="flex-[1.2] p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">SAHIH (AUTHENTIC)</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">13,757</div>
                 <div className="text-[9px] font-mono text-emerald-500">44.66%</div>
              </div>
           </div>

           <div className="flex-[1.2] p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">HASAN (GOOD)</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">17,043</div>
                 <div className="text-[9px] font-mono text-blue-500">55.33%</div>
              </div>
           </div>

           <div className="flex-[1.2] p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                 <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">DA'IF (WEAK)</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">0</div>
                 <div className="text-[9px] font-mono text-amber-500">0.00%</div>
              </div>
           </div>

           <div className="flex-[1.2] p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                 <XCircle className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">MAWDHU' (FABRICATED)</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">0</div>
                 <div className="text-[9px] font-mono text-red-500">0.00%</div>
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                 <BookOpen className="w-4 h-4" />
              </div>
              <div>
                 <div className="text-lg font-mono text-white font-bold leading-none mb-1">14</div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] max-w-[80px]">CANONICAL COMPENDIUMS</div>
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <Cross className="w-4 h-4" />
              </div>
              <div>
                 <div className="text-lg font-mono text-white font-bold leading-none mb-1">12</div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] max-w-[80px]">APOSTLES TRADITIONS</div>
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff]">
                 <BookOpen className="w-4 h-4" />
              </div>
              <div>
                 <div className="text-[7px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">QURAN REFERENCES</div>
                 <div className="text-lg font-mono text-white font-bold leading-none mb-1">2,381</div>
                 <div className="text-[7px] uppercase tracking-widest text-[#00aaff]">VERSES LINKED</div>
              </div>
           </div>

        </div>

        {/* ═══ MAIN THREE COLUMNS ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[550px]">
           
           {/* ◄ LEFT: FILTERS & COMPENDIUMS (Col 1-2) */}
           <div className="lg:col-span-2 flex flex-col gap-4">
              
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4">
                    BROWSE & FILTER
                 </div>
                 <div className="space-y-3">
                    <div className="relative">
                       <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9FB3]" />
                       <input 
                         type="text" 
                         placeholder="Search hadith, keyword..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-[#020813] border border-white/10 rounded px-8 py-2 text-[10px] text-white placeholder:text-[#8F9FB3] focus:border-blue-500/50 outline-none" 
                       />
                    </div>
                    {[
                      { l: "Topic / Theme", v: "All Topics" },
                      { l: "Compendium", v: "All Compendiums" },
                      { l: "Grade / Status", v: "All Grades" },
                      { l: "Quran Reference", v: "All References" },
                      { l: "Language", v: "All Languages" }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                         <span className="text-[9px] text-[#8F9FB3]">{f.l}</span>
                         <select className="bg-transparent text-[9px] text-white text-right focus:outline-none cursor-pointer hover:text-blue-400">
                            <option>{f.v}</option>
                         </select>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                       <button className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors">RESET</button>
                       <button className="flex-[1.5] py-2 rounded bg-blue-600 hover:bg-blue-500 text-[9px] font-bold tracking-widest text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2">SEARCH <ChevronRight className="w-3 h-3"/></button>
                    </div>
                 </div>
              </div>

              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex-1 flex flex-col">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4">
                    14 CANONICAL COMPENDIUMS
                 </div>
                 <div className="space-y-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                   {compendiums.map((x, i) => (
                     <div key={i} className="flex justify-between items-center py-1 hover:bg-white/5 rounded cursor-pointer transition-colors group px-1">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${x.c} shadow-[0_0_5px_currentColor]`} />
                           <span className="text-[9px] text-[#8F9FB3] group-hover:text-white transition-colors">{x.n}</span>
                        </div>
                        <span className="text-[#8F9FB3] font-mono text-[9px]">{x.v}</span>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-3 py-1.5 text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] hover:text-white border border-white/10 rounded transition-colors">
                    VIEW ALL COMPENDIUMS
                 </button>
              </div>

           </div>

           {/* ■ CENTER: HADITH GRID (Col 3-9) */}
           <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                 <button className="px-6 py-2.5 text-[9px] font-bold tracking-widest border-b-2 border-blue-500 text-blue-400 bg-blue-500/5">HADITH BROWSER</button>
                 <button className="px-6 py-2.5 text-[9px] font-bold tracking-widest border-b-2 border-transparent text-[#8F9FB3] hover:text-white hover:bg-white/5 transition-colors">ORAL TRADITIONS</button>
                 <button className="px-6 py-2.5 text-[9px] font-bold tracking-widest border-b-2 border-transparent text-[#8F9FB3] hover:text-white hover:bg-white/5 transition-colors">QURANIC CONNECTIONS</button>
              </div>

              {/* Sub-header */}
              <div className="flex justify-between items-center">
                 <div className="text-[10px] text-[#8F9FB3]">Showing <span className="text-white">{(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalHadiths)}</span> of <span className="font-mono text-white">{totalHadiths.toLocaleString()}</span> Hadiths</div>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                       Sort by:
                       <select className="bg-[#020813] border border-white/10 rounded px-2 py-1 focus:outline-none text-white">
                          <option>Relevance</option>
                       </select>
                    </div>
                    <div className="flex bg-[#020813] border border-white/10 rounded p-0.5 gap-0.5">
                       <button className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded"><LayoutGrid className="w-3.5 h-3.5" /></button>
                       <button className="px-2 py-1 text-[#8F9FB3] hover:text-white transition-colors rounded"><List className="w-3.5 h-3.5" /></button>
                    </div>
                 </div>
              </div>

              {/* Grid of Hadiths */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start flex-1">
                 {filteredData.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveId(item.id)}
                      className={`relative bg-[#040C1A] border rounded-xl p-3.5 flex flex-col cursor-pointer transition-all group overflow-hidden ${activeId === item.id ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] z-10' : 'border-white/5 hover:border-white/20 hover:bg-white/5 hover:translate-y-[-2px]'}`}
                    >
                       <div className="w-full flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-[8px] font-bold text-white border border-white/10">{item.id}</div>
                             <span className={`text-[7px] font-bold tracking-widest px-1.5 py-0.5 rounded border border-${item.color}-500/30 text-${item.color}-400 bg-${item.color}-500/10`}>{item.grade}</span>
                          </div>
                          <Bookmark className={`w-3.5 h-3.5 ${activeId === item.id ? 'text-amber-400' : 'text-white/20 hover:text-white/60'}`} />
                       </div>
                       
                       <div className="text-xl font-arabic text-center mb-4 text-amber-500/90 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] leading-relaxed h-[60px] flex items-center justify-center overflow-hidden">
                          <span className="line-clamp-2">{item.arabic}</span>
                       </div>
                       
                       <div className="text-[9px] text-white/90 text-center mb-4 italic leading-relaxed h-[45px] overflow-hidden">
                          <span className="line-clamp-3">{item.translation}</span>
                       </div>
                       
                       <div className="mt-auto space-y-1.5 border-t border-white/5 pt-3 uppercase">
                          <div className="text-[8px] text-[#8F9FB3] font-mono tracking-widest">{item.ref}</div>
                          <div className="text-[8px] text-[#8F9FB3]">Topic: <span className="text-white/80">{item.topic}</span></div>
                          <div className="text-[8px] text-[#8F9FB3]">Quran Ref: <span className="text-blue-400 cursor-pointer hover:underline">{item.quran}</span></div>
                       </div>

                       <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                          <button className="text-[#8F9FB3] hover:text-amber-400 transition-colors"><Bookmark className="w-3 h-3"/></button>
                          <button className="text-[#8F9FB3] hover:text-blue-400 transition-colors"><Link className="w-3 h-3"/></button>
                          <button className="text-[#8F9FB3] hover:text-emerald-400 transition-colors"><Quote className="w-3 h-3"/></button>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-2 p-2.5 bg-[#040C1A] border border-white/10 rounded-xl">
                 <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-[10px] font-bold">{currentPage}</button>
                    {currentPage < totalPages && <button onClick={() => setCurrentPage(currentPage + 1)} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 font-mono text-[10px]">{currentPage + 1}</button>}
                    {currentPage + 1 < totalPages && <button onClick={() => setCurrentPage(currentPage + 2)} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 font-mono text-[10px]">{currentPage + 2}</button>}
                    {currentPage + 2 < totalPages && <span className="w-7 h-7 flex items-center justify-center text-[#8F9FB3]">...</span>}
                    {currentPage + 2 < totalPages && <button onClick={() => setCurrentPage(totalPages)} className="w-auto px-2 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 font-mono text-[10px]">{totalPages}</button>}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronRight className="w-3.5 h-3.5" /></button>
                 </div>
                 <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                    Show: 
                    <select className="bg-transparent border border-white/10 rounded px-2 py-1 focus:outline-none">
                       <option>20</option>
                    </select>
                    per page
                 </div>
              </div>

           </div>

           {/* ► RIGHT: DETAIL PANEL (Col 10-12) */}
           <div className="lg:col-span-3 flex flex-col gap-4">
              
              {/* Insight Panel */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden h-[300px]">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                 
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/10 pb-3 relative z-10 shrink-0">
                    QUICK HADITH INSIGHT
                 </div>

                 {activeItem ? (
                   <>
                     <div className="text-center mb-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col justify-center">
                        <div className="text-2xl font-arabic text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] mb-3 leading-relaxed">
                           {activeItem.arabic}
                        </div>
                        <div className="text-sm text-white italic">
                           "{activeItem.translation}"
                        </div>
                     </div>

                     <div className="flex flex-col items-center justify-center gap-2 text-[8px] text-[#8F9FB3] font-mono shrink-0 uppercase border-t border-white/10 pt-3 mt-auto">
                        <span className={`px-2 py-1 rounded border border-${activeItem.color}-500/30 text-${activeItem.color}-400 bg-${activeItem.color}-500/10 tracking-widest font-sans font-bold`}>{activeItem.grade}</span>
                        {activeItem.ref} 
                     </div>
                   </>
                 ) : (
                   <div className="flex-1 flex items-center justify-center text-[#8F9FB3] text-[9px] uppercase tracking-widest">
                      Select a hadith to view insight
                   </div>
                 )}
              </div>

              {/* Quranic Reference */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex-1 flex flex-col">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-[#00aaff] mb-4 border-b border-white/10 pb-3">
                    QURANIC REFERENCE
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center">
                    <div className="text-xl font-arabic text-white text-center mb-3 leading-loose drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                       إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ
                    </div>
                    <div className="text-[9px] font-mono text-[#8F9FB3] text-center mb-3 uppercase">
                       Innama yuwaffa as-sabiruna ajrahum bi-ghayri hisabin
                    </div>
                    <div className="text-[10px] text-white/80 text-center italic mb-4">
                       "Indeed, the patient will be given their reward without account."
                    </div>
                    <div className="text-[9px] font-bold tracking-widest text-[#00aaff] text-center mb-4">
                       (Az-Zumar: 10)
                    </div>
                 </div>
                 
                 <button className="w-full py-2 bg-[#00aaff]/10 hover:bg-[#00aaff]/20 border border-[#00aaff]/30 rounded text-[9px] font-bold tracking-widest text-[#00aaff] transition-colors">
                    VIEW VERSE CONTEXT
                 </button>
              </div>

              {/* Related Themes */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-3">
                    RELATED THEMES
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {["Sincerity", "Intention", "Worship", "Ikhlas", "Actions", "Accountability"].map(tag => (
                      <span key={tag} className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] tracking-widest text-[#8F9FB3] hover:text-white hover:border-blue-500/50 cursor-pointer transition-colors">
                         {tag}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Apostles Oral Traditions */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-indigo-400 mb-3 border-b border-white/10 pb-3">
                    APOSTLES ORAL TRADITIONS
                 </div>
                 <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between items-center text-[9px]">
                       <div className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Torah (Mishna)</div>
                       <div className="text-[#8F9FB3] font-mono">156 Traditions</div>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                       <div className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Psalms (Tasbih)</div>
                       <div className="text-[#8F9FB3] font-mono">98 Traditions</div>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                       <div className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Gospel (Didache)</div>
                       <div className="text-[#8F9FB3] font-mono">72 Traditions</div>
                    </div>
                 </div>
                 <button className="w-full py-1.5 border border-white/10 rounded text-[8px] font-bold tracking-widest text-[#8F9FB3] hover:text-white transition-colors">
                    EXPLORE ALL TRADITIONS
                 </button>
              </div>

           </div>

        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0 mt-2">
           
           {/* Hadith Quality Distribution */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 HADITH QUALITY DISTRIBUTION
              </div>
              <div className="flex items-center gap-4 flex-1">
                 <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                      style={{ background: 'conic-gradient(from 0deg, #10b981 0% 45%, #3b82f6 45% 100%)' }}>
                    <div className="w-14 h-14 bg-[#040C1A] rounded-full" />
                 </div>
                 <div className="space-y-2 flex-1 text-[8px] tracking-widest">
                    <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> <span className="text-white/90">Sahih (Authentic)</span></div><span className="text-[#8F9FB3] font-mono">44.66%</span></div>
                    <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> <span className="text-white/90">Hasan (Good)</span></div><span className="text-[#8F9FB3] font-mono">55.33%</span></div>
                    <div className="flex justify-between items-center opacity-30"><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> <span className="text-white/90">Da'if (Weak)</span></div><span className="text-[#8F9FB3] font-mono">0%</span></div>
                    <div className="flex justify-between items-center opacity-30"><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/> <span className="text-white/90">Mawdhu' (Fabricated)</span></div><span className="text-[#8F9FB3] font-mono">0%</span></div>
                 </div>
              </div>
           </div>

           {/* Top Hadith Topics */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/10 pb-3">
                 TOP HADITH TOPICS
              </div>
              <div className="space-y-2 flex-1 text-[9px]">
                 <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-white"><ShieldCheck className="w-3 h-3 text-emerald-500"/> Faith & Belief</div><span className="text-[#8F9FB3] font-mono">24,681</span></div>
                 <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-white"><Star className="w-3 h-3 text-amber-500"/> Worship & Prayer</div><span className="text-[#8F9FB3] font-mono">18,742</span></div>
                 <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-white"><CheckCircle2 className="w-3 h-3 text-blue-500"/> Character & Morality</div><span className="text-[#8F9FB3] font-mono">22,915</span></div>
                 <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-white"><BookOpen className="w-3 h-3 text-purple-400"/> Knowledge & Education</div><span className="text-[#8F9FB3] font-mono">15,338</span></div>
                 <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-white"><Globe className="w-3 h-3 text-[#00aaff]"/> Social Relations</div><span className="text-[#8F9FB3] font-mono">28,441</span></div>
              </div>
              <button className="w-full mt-2 py-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] hover:text-white border-t border-white/10 pt-2 transition-colors">VIEW ALL TOPICS</button>
           </div>

           {/* Hadith Timeline & Stats */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white">HADITH TIMELINE</div>
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400">STATISTICS</div>
              </div>
              <div className="flex flex-1">
                 {/* Timeline */}
                 <div className="flex-1 flex justify-between pr-4 border-r border-white/10 relative">
                    <div className="absolute top-2 left-2 right-2 h-px bg-white/10" />
                    {[
                      { y: "610", t: "Revelation Period" },
                      { y: "622", t: "Hijrah (Madinah)" },
                      { y: "632", t: "Passing of Prophet ؐ" },
                      { y: "650+", t: "Compilation Begins" }
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 relative z-10 w-12">
                         <div className="w-3 h-3 rounded-full bg-[#040C1A] border-2 border-blue-500 mb-1" />
                         <span className="text-[10px] text-white font-bold font-mono">{step.y}</span>
                         <span className="text-[7px] text-[#8F9FB3] text-center leading-tight">{step.t}</span>
                      </div>
                    ))}
                 </div>
                 {/* Stats Mini */}
                 <div className="flex-1 pl-4 grid grid-cols-2 gap-y-3 gap-x-2">
                    <div>
                       <Database className="w-3.5 h-3.5 text-blue-500 mb-1" />
                       <div className="text-white font-mono font-bold text-[10px]">30,800</div>
                       <div className="text-[7px] text-[#8F9FB3] uppercase tracking-widest">Total Hadiths</div>
                    </div>
                    <div>
                       <Link className="w-3.5 h-3.5 text-[#00aaff] mb-1" />
                       <div className="text-white font-mono font-bold text-[10px]">2,381</div>
                       <div className="text-[7px] text-[#8F9FB3] uppercase tracking-widest">Quran Links</div>
                    </div>
                    <div>
                       <Layers className="w-3.5 h-3.5 text-purple-400 mb-1" />
                       <div className="text-white font-mono font-bold text-[10px]">65,432</div>
                       <div className="text-[7px] text-[#8F9FB3] uppercase tracking-widest">Unique Chains</div>
                    </div>
                    <div>
                       <Book className="w-3.5 h-3.5 text-amber-500 mb-1" />
                       <div className="text-white font-mono font-bold text-[10px]">14</div>
                       <div className="text-[7px] text-[#8F9FB3] uppercase tracking-widest">Compendiums</div>
                    </div>
                 </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 text-[8px] font-bold tracking-widest text-[#8F9FB3]">
                 <button className="hover:text-white">VIEW INTERACTIVE TIMELINE</button>
                 <button className="hover:text-white">VIEW FULL STATISTICS</button>
              </div>
           </div>

           {/* Learning Path */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 opacity-10 mix-blend-screen pointer-events-none group-hover:scale-110 group-hover:opacity-30 transition-all duration-700">
                 <img src="/assets/sacred_geometry.png" className="w-full h-full object-cover" />
              </div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-emerald-500 mb-4 border-b border-white/10 pb-3 relative z-10">
                 LEARNING PATH
              </div>
              <div className="space-y-3 flex-1 relative z-10">
                 <div>
                    <div className="flex justify-between text-[9px] mb-1">
                       <span className="text-[#8F9FB3]">Beginner: <span className="text-white">Essential 40 Hadith</span></span>
                       <span className="font-mono text-[#8F9FB3]">40/40</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full" /></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] mb-1">
                       <span className="text-[#8F9FB3]">Intermediate: <span className="text-white">Thematic Study</span></span>
                       <span className="font-mono text-[#8F9FB3]">12/30</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[40%]" /></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] mb-1">
                       <span className="text-[#8F9FB3]">Advanced: <span className="text-white">Chain Analysis</span></span>
                       <span className="font-mono text-[#8F9FB3]">5/20</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[25%]" /></div>
                 </div>
              </div>
              <button className="w-full mt-3 py-1.5 text-[8px] font-bold tracking-widest text-[#8F9FB3] hover:text-white border-t border-white/10 pt-2 transition-colors relative z-10 text-right">CONTINUE LEARNING</button>
           </div>

        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex justify-between items-center pt-2 px-2 text-[7px] uppercase tracking-widest text-[#8F9FB3] shrink-0">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> CONNECTED TO DIVINE KNOWLEDGE NETWORK</div>
           </div>
           <div className="tracking-[0.3em] font-bold opacity-50">"WHEN THE MOON WITNESSES, WE SHARE MESSAGES."</div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> DATA SYNCHRONIZED</div>
              <div className="flex items-center gap-1.5"><Clock className="w-2.5 h-2.5" /> <span className="text-white font-mono">{timeString} UTC+0</span></div>
           </div>
        </div>

      </div>
    </div>
  )
}
