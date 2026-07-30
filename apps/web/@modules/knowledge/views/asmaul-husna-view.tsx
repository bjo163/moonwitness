"use client"

import { useState, useEffect } from "react"
import { 
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  PieChart,
  Activity,
  Layers,
  Globe,
  Database,
  Info,
  CheckCircle2,
  Clock
} from "lucide-react"


export function AsmaulHusnaView() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState("01")
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState("")
  const [asmaulHusnaData, setAsmaulHusnaData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)
    
    fetch('/api/asmaul-husna')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
           const formattedData = json.data.map((item: any) => ({
              id: item.number.toString().padStart(2, '0'),
              arabic: item.name_arabic,
              transliteration: item.name_latin,
              meaning: item.translation_id || '—',
              ref: item.quran_reference || 'Asmaul Husna',
              root: '—'
           }))
           setAsmaulHusnaData(formattedData)
        }
        setIsLoading(false)
      })
      .catch(err => {
         console.error(err)
         setIsLoading(false)
      })

    return () => clearInterval(interval)
  }, [])

  if (!mounted || isLoading) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-indigo-500 font-mono text-sm tracking-widest">INITIALIZING DATABASE...</div>

  const timeString = now.toISOString().split("T")[1].split(".")[0]
  const activeItem = asmaulHusnaData.find(x => x.id === activeId) || asmaulHusnaData[0]
  
  // Apply Search Filter
  const filteredData = asmaulHusnaData.filter(item => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.transliteration?.toLowerCase().includes(q) ||
      item.meaning?.toLowerCase().includes(q) ||
      item.arabic?.includes(q)
    )
  })
  
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-[#020813] text-[#8F9FB3] font-sans min-h-screen p-4 selection:bg-indigo-500/30 flex flex-col">
      <div className="max-w-[1800px] mx-auto space-y-4 flex-1 flex flex-col w-full">
        
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-widest uppercase text-lg">
                  DIVINE ATTRIBUTES — 99 SACRED NAMES
                </h1>
                <p className="text-[10px] mt-1 text-[#8F9FB3] max-w-2xl">
                  Explore the 99 Divine Names and Attributes of Allah SWT — represented as cosmic runic archetypes with Calligraphy Arabic, Latin Transliteration, Translations, and Quranic References.
                </p>
              </div>
           </div>
           <div className="flex items-center gap-6 shrink-0 pt-1">
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">OPERATION MODE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">DIVINE-ATTRIBUTES-SCAN</div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">SYSTEM STATUS</div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </div>
             </div>
             <div className="text-center pl-4 opacity-70 mix-blend-screen scale-150 transform translate-y-2 pointer-events-none">
                <img src="/assets/asmaul_husna_header.png" className="w-16 h-16 object-cover rounded-full" alt="Calligraphy" style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 60%)' }} />
             </div>
           </div>
        </div>

        {/* ═══ TOP STATS ROW ═══ */}
        <div className="flex gap-4 border border-white/5 rounded-xl bg-[#040C1A] overflow-hidden shrink-0">
           
           <div className="flex-1 p-4 flex items-center gap-6 border-r border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex-1">
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">TOTAL NAMES</div>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-mono text-white font-bold leading-none">99</span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">SACRED NAMES</span>
                 </div>
              </div>
              <div className="w-20 h-20 absolute -right-2 opacity-50 mix-blend-screen pointer-events-none group-hover:scale-110 transition-transform">
                 <img src="/assets/asmaul_husna_header.png" className="w-full h-full object-cover rounded-full" style={{ maskImage: 'radial-gradient(circle at center, black 50%, transparent 65%)', WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 65%)' }} />
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                 <BookOpen className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">QURANIC REFERENCES</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">280+</div>
                 <div className="text-[8px] uppercase tracking-widest text-amber-500">AYAT</div>
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-arabic">
                 الرن
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">ROOT LETTERS</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">4</div>
                 <div className="text-[8px] uppercase tracking-widest text-purple-400">PRIMARY RADICALS</div>
              </div>
           </div>

           <div className="flex-1 p-4 flex items-center gap-4 border-r border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff]">
                 <Layers className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">MEANING CATEGORIES</div>
                 <div className="text-xl font-mono text-white font-bold leading-none mb-1">18</div>
                 <div className="text-[8px] uppercase tracking-widest text-[#00aaff]">CATEGORIES</div>
              </div>
           </div>

           <div className="flex-[1.5] p-4 flex items-center justify-between border-r border-white/5">
              <div className="text-center w-full">
                 <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-2">DIVINE ESSENCE</div>
                 <div className="text-amber-500 font-arabic text-xl mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ
                 </div>
                 <div className="text-[9px] text-white">He is Allah, the One and Only.</div>
                 <div className="text-[8px] text-[#8F9FB3]">(Al-Baqarah 2:255)</div>
              </div>
           </div>

           <div className="p-4 flex flex-col justify-center text-right pr-6 min-w-[120px]">
              <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-2">LAST UPDATED</div>
              <div className="text-white font-mono text-[10px] font-bold">12 AUG 2026</div>
              <div className="text-[#8F9FB3] font-mono text-[9px]">{timeString} UTC+0</div>
           </div>

        </div>

        {/* ═══ MAIN THREE COLUMNS ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[500px]">
           
           {/* ◄ LEFT: CATEGORIES & STATS (Col 1-2) */}
           <div className="lg:col-span-2 flex flex-col gap-4">
              
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex-1">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> DIVINE CATEGORIES
                 </div>
                 <div className="space-y-1">
                   {[
                     { n: "Essence & Existence", v: 12 },
                     { n: "Attributes of Mercy", v: 21 },
                     { n: "Attributes of Majesty", v: 21 },
                     { n: "Attributes of Power", v: 16 },
                     { n: "Attributes of Knowledge", v: 11 },
                     { n: "Attributes of Will", v: 10 },
                     { n: "Attributes of Life", v: 5 },
                     { n: "Attributes of Perfection", v: 3 },
                   ].map((x, i) => (
                     <div key={i} className="flex justify-between items-center py-1.5 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors group">
                        <div className="flex items-center gap-2">
                           <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-purple-400 transition-colors" />
                           <span className="text-[9px] uppercase tracking-widest text-[#8F9FB3] group-hover:text-white">{x.n}</span>
                        </div>
                        <span className="text-amber-500 font-mono text-[9px]">{x.v}</span>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[8px] font-bold tracking-widest uppercase text-white transition-colors flex justify-between items-center px-4">
                    LIHAT SEMUA KATEGORI <ChevronRight className="w-3 h-3 text-[#00aaff]" />
                 </button>
              </div>

              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    <PieChart className="w-3.5 h-3.5 text-[#00aaff]" /> QURANIC COVERAGE
                 </div>
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center relative shrink-0" 
                         style={{ background: 'conic-gradient(from 0deg, #8b5cf6 0% 50%, #10b981 50% 80%, #0ea5e9 80% 100%)' }}>
                       <div className="absolute inset-[3px] bg-[#040C1A] rounded-full flex flex-col items-center justify-center">
                          <span className="text-white font-mono font-bold text-sm leading-none">280+</span>
                          <span className="text-[6px] uppercase tracking-widest text-[#8F9FB3] mt-0.5">AYAT</span>
                       </div>
                    </div>
                    <div className="space-y-2 flex-1">
                       <div className="flex justify-between items-center text-[8px] tracking-widest uppercase">
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Langsung</div>
                          <div className="text-white font-mono">144</div>
                       </div>
                       <div className="flex justify-between items-center text-[8px] tracking-widest uppercase">
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Tidak Langsung</div>
                          <div className="text-white font-mono">92</div>
                       </div>
                       <div className="flex justify-between items-center text-[8px] tracking-widest uppercase">
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00aaff]"/> Asosiasi</div>
                          <div className="text-white font-mono">44</div>
                       </div>
                    </div>
                 </div>
                 <div className="border-t border-white/10 pt-3 space-y-1.5">
                    <div className="text-[7px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-2">REFERENSI UTAMA</div>
                    <div className="flex justify-between items-center text-[8px] text-[#8F9FB3]"><span className="flex items-center gap-1"><BookOpen className="w-2.5 h-2.5"/> Al-Quran</span><span className="text-white font-mono">280+ Ayat</span></div>
                    <div className="flex justify-between items-center text-[8px] text-[#8F9FB3]"><span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5"/> As-Sunnah</span><span className="text-white font-mono">200+ Hadis</span></div>
                    <div className="flex justify-between items-center text-[8px] text-[#8F9FB3]"><span className="flex items-center gap-1"><Info className="w-2.5 h-2.5"/> Tafsir Ulama</span><span className="text-white font-mono">50+ Kitab</span></div>
                 </div>
              </div>

           </div>

           {/* ■ CENTER: MAIN GRID (Col 3-9) */}
           <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Search & Filters */}
              <div className="flex gap-2">
                 <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9FB3]" />
                    <input 
                      type="text" 
                      placeholder="Cari Nama atau Arti..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#040C1A] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-[#8F9FB3] focus:outline-none focus:border-indigo-500/50 transition-colors" 
                    />
                 </div>
                 <select className="bg-[#040C1A] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#8F9FB3] focus:outline-none focus:border-indigo-500/50">
                    <option>Semua Kategori</option>
                 </select>
                 <select className="bg-[#040C1A] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#8F9FB3] focus:outline-none focus:border-indigo-500/50">
                    <option>Semua Huruf</option>
                 </select>
                 <select className="bg-[#040C1A] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#8F9FB3] focus:outline-none focus:border-indigo-500/50">
                    <option>Urutkan: Abjad</option>
                 </select>
                 <div className="flex bg-[#040C1A] border border-white/10 rounded-lg p-1 gap-1">
                    <button className="px-2.5 py-1.5 bg-[#00aaff]/20 text-[#00aaff] rounded"><LayoutGrid className="w-4 h-4" /></button>
                    <button className="px-2.5 py-1.5 text-[#8F9FB3] hover:text-white transition-colors rounded"><List className="w-4 h-4" /></button>
                 </div>
              </div>

              {/* Grid of Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 min-h-[500px] content-start">
                 {paginatedData.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-[#8F9FB3] py-20">
                       <Search className="w-10 h-10 mb-4 opacity-20" />
                       <p className="text-xs uppercase tracking-widest">Tidak ada nama yang cocok dengan "{searchQuery}"</p>
                    </div>
                 ) : (
                   paginatedData.map((item) => (
                      <div 
                        key={item.id} 
                      onClick={() => setActiveId(item.id)}
                      className={`relative bg-[#040C1A] border rounded-xl p-3 flex flex-col items-center text-center cursor-pointer transition-all group overflow-hidden ${activeId === item.id ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.15)] z-10' : 'border-white/5 hover:border-white/20 hover:bg-white/5 hover:scale-[1.02]'}`}
                    >
                       {activeId === item.id && <div className="absolute inset-0 bg-indigo-500/10 mix-blend-screen pointer-events-none" />}
                       
                       <div className="w-full flex justify-between items-start mb-2 relative z-10">
                          <span className={`font-mono text-sm font-bold ${activeId === item.id ? 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]' : 'text-[#8F9FB3]'}`}>{item.id}</span>
                          <Star className={`w-3.5 h-3.5 ${activeId === item.id ? 'text-amber-400' : 'text-white/20 group-hover:text-white/40'}`} />
                       </div>
                       
                       <div className={`text-4xl font-arabic mb-3 mt-1 transition-all ${activeId === item.id ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'}`}>
                          {item.arabic}
                       </div>
                       
                       <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors ${activeId === item.id ? 'text-[#00aaff]' : 'text-indigo-400'}`}>
                          {item.transliteration}
                       </div>
                       <div className="text-[9px] text-white/90 mb-3 leading-tight line-clamp-2">
                          {item.meaning}
                       </div>
                       <div className="text-[7px] text-[#8F9FB3] font-mono tracking-widest mt-auto w-full pt-2 border-t border-white/5">
                          {item.ref}
                       </div>
                    </div>
                 )))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-2 p-3 bg-[#040C1A] border border-white/10 rounded-xl">
                 <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                       const pageNum = i + 1;
                       return (
                         <button 
                           key={pageNum}
                           onClick={() => setCurrentPage(pageNum)}
                           className={`w-7 h-7 rounded border font-mono text-[10px] font-bold ${currentPage === pageNum ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'border-white/10 text-[#8F9FB3] hover:text-white hover:bg-white/5'}`}
                         >
                           {pageNum}
                         </button>
                       )
                    })}
                    
                    {totalPages > 5 && <span className="w-7 h-7 flex items-center justify-center text-[#8F9FB3]">...</span>}
                    {totalPages > 5 && (
                      <button onClick={() => setCurrentPage(totalPages)} className={`w-7 h-7 rounded border font-mono text-[10px] font-bold ${currentPage === totalPages ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'border-white/10 text-[#8F9FB3] hover:text-white hover:bg-white/5'}`}>
                         {totalPages}
                      </button>
                    )}
                    
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronRight className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-[#8F9FB3] hover:text-white hover:bg-white/5 disabled:opacity-50"><ChevronsRight className="w-3.5 h-3.5" /></button>
                 </div>
                 <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                    Tampilkan 
                    <select 
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className="bg-transparent border border-white/10 rounded px-2 py-1 focus:outline-none"
                    >
                       <option value={15}>15</option>
                       <option value={30}>30</option>
                       <option value={99}>99</option>
                    </select>
                    per halaman
                 </div>
              </div>

           </div>

           {/* ► RIGHT: DETAIL PANEL (Col 10-12) */}
           <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex-1 relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                 
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-6 border-b border-white/10 pb-3 relative z-10">
                    <Star className="w-3.5 h-3.5 text-indigo-400" /> DETAIL NAMA ALLAH
                 </div>

                 <div className="text-center mb-8 relative z-10">
                    <div className="text-6xl font-arabic text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-4 leading-tight">{activeItem.arabic}</div>
                    <div className="text-lg font-bold tracking-widest uppercase text-[#00aaff] mb-1 drop-shadow-[0_0_10px_rgba(0,170,255,0.4)]">{activeItem.transliteration}</div>
                    <div className="text-sm text-white font-bold">{activeItem.meaning}</div>
                 </div>

                 <div className="space-y-4 mb-6 relative z-10 flex-1">
                    {[
                      { l: "Kategori", v: "Rahmah (Kasih Sayang)" },
                      { l: "Arti", v: activeItem.meaning },
                      { l: "Transliterasi", v: activeItem.transliteration },
                      { l: "Jumlah Huruf", v: activeItem.arabic.replace(/[^a-zA-Z\u0600-\u06FF]/g, "").length.toString() },
                      { l: "Akar Kata", v: activeItem.root, f: "font-arabic text-base text-amber-400" },
                      { l: "Tipe", v: "Sifat Allah (Musta'li)" },
                      { l: "Quranic Reference", v: "57 Ayat" },
                      { l: "Urutan", v: `${activeItem.id} dari 99` },
                    ].map((x, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
                         <span className="text-[#8F9FB3] tracking-widest">{x.l}</span>
                         <span className={`text-white ${x.f || 'font-mono'}`}>{x.v}</span>
                      </div>
                    ))}
                 </div>

                 <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative z-10 mb-6">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[8px] font-bold tracking-widest uppercase text-indigo-400">REFERENSI QURAN</span>
                       <span className="text-[8px] font-bold tracking-widest text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded">57 Ayat <ChevronRight className="w-2.5 h-2.5 inline" /></span>
                    </div>
                    <div className="text-[9px] text-[#8F9FB3] mb-1">Contoh:</div>
                    <div className="text-center font-arabic text-lg text-white mb-2 leading-loose">
                       {activeItem.id === '01' ? "الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنسَانَ" : "وَهُوَ الْعَزِيزُ الْحَكِيمُ"}
                    </div>
                    <div className="text-[9px] text-white/80 text-center italic mb-2">
                       {activeItem.id === '01' ? 'Ar-Rahman. "Allah Yang Maha Pengasih. Yang telah mengajarkan Al-Quran. Dia menciptakan manusia."' : 'Dan Dialah Yang Maha Perkasa lagi Maha Bijaksana.'}
                    </div>
                    <div className="text-[8px] font-mono text-indigo-400 text-center tracking-widest">
                       {activeItem.id === '01' ? "(QS. Ar-Rahman: 1-3)" : activeItem.ref}
                    </div>
                 </div>

                 <div className="relative z-10">
                    <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-3">HUBUNGAN TEMATIK</div>
                    <div className="flex flex-wrap gap-2">
                       {["Kasih Sayang", "Kelembutan", "Rahmah Universal", "Pengampunan", "Kebaikan"].map(tag => (
                         <span key={tag} className="px-2 py-1 rounded border border-white/10 text-[8px] tracking-widest text-[#8F9FB3] hover:text-white hover:border-indigo-500/50 cursor-pointer transition-colors">
                            {tag}
                         </span>
                       ))}
                    </div>
                 </div>

              </div>
           </div>

        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
           
           {/* Hijaiyah Patterns */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" /> POLA HURUF HIJAIYAH
              </div>
              <div className="flex-1 space-y-4">
                 <div>
                    <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-2">Distribusi Awal Huruf</div>
                    <div className="flex gap-2">
                       <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center font-arabic text-lg text-white">ح</div>
                       <div className="w-8 h-8 rounded border border-[#00aaff]/30 bg-[#00aaff]/10 flex items-center justify-center font-arabic text-lg text-[#00aaff]">م</div>
                       <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center font-arabic text-lg text-white">ن</div>
                       <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center font-arabic text-lg text-white">ل</div>
                       <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center font-arabic text-lg text-white">-</div>
                    </div>
                 </div>
                 <div>
                    <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-2">Dominant Patterns</div>
                    <div className="flex gap-4">
                       <div className="text-[9px] text-[#00aaff] font-bold">41 (AL-) أَلْ</div>
                       <div className="text-[9px] text-purple-400 font-bold">24 (AL-MU) الْمُ</div>
                       <div className="text-[9px] text-amber-500 font-bold">18 (AL-) ٱلْ</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Stats Donut */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <PieChart className="w-3.5 h-3.5 text-[#00aaff]" /> STATISTIK KATEGORI
              </div>
              <div className="flex items-center gap-4 flex-1">
                 <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'conic-gradient(from 0deg, #0ea5e9 0% 21%, #8b5cf6 21% 42%, #10b981 42% 58%, #f59e0b 58% 74%, #ec4899 74% 85%, #64748b 85% 100%)' }}>
                    <div className="w-14 h-14 bg-[#040C1A] rounded-full" />
                 </div>
                 <div className="space-y-1.5 flex-1 text-[8px] tracking-widest">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0ea5e9]"/> <span className="text-white">Rahmah (Kasih Sayang)</span></div><span className="text-[#8F9FB3] font-mono">21 (21.2%)</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"/> <span className="text-white">Jalalah (Kebesaran)</span></div><span className="text-[#8F9FB3] font-mono">21 (21.2%)</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10b981]"/> <span className="text-white">Kamal (Kesempurnaan)</span></div><span className="text-[#8F9FB3] font-mono">16 (16.2%)</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"/> <span className="text-white">Quwwah (Kekuatan)</span></div><span className="text-[#8F9FB3] font-mono">16 (16.2%)</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ec4899]"/> <span className="text-white">Ilm (Pengetahuan)</span></div><span className="text-[#8F9FB3] font-mono">11 (11.1%)</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#64748b]"/> <span className="text-white">Lainnya</span></div><span className="text-[#8F9FB3] font-mono">14 (14.1%)</span></div>
                 </div>
              </div>
           </div>

           {/* Tadabbur Insight */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <Info className="w-3.5 h-3.5 text-amber-500" /> TADABBUR INSIGHT
              </div>
              <div className="flex-1 flex flex-col justify-center">
                 <p className="text-[10px] text-white/90 italic leading-relaxed mb-4">
                    "Mengenal Asmaul Husna adalah perjalanan mengenal Dzat yang Maha Sempurna. Setiap nama adalah kunci menuju pemahaman yang lebih dalam tentang kebesaran dan kasih sayang-Nya."
                 </p>
                 <div className="text-right text-[9px] font-bold tracking-widest uppercase text-amber-500">
                    — Ibnu Qayyim Al-Jauziyah
                 </div>
              </div>
           </div>

           {/* Tips Tadabbur */}
           <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-40 opacity-20 mix-blend-screen pointer-events-none group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
                 <img src="/assets/sacred_geometry.png" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3 relative z-10">
                 <Activity className="w-3.5 h-3.5 text-emerald-500" /> TIPS TADABBUR HARIAN
              </div>
              <div className="space-y-3 flex-1 relative z-10">
                 {[
                   "Pilih 1 nama setiap hari",
                   "Pelajari artinya dan hayati maknanya",
                   "Cari ayat yang berkaitan",
                   "Amalkan dalam kehidupan",
                   "Bagikan kebaikan"
                 ].map((tip, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="text-[9px] text-white/90">{tip}</span>
                   </div>
                 ))}
              </div>
           </div>

        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex justify-between items-center pt-2 px-2 text-[7px] uppercase tracking-widest text-[#8F9FB3] shrink-0">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> CONNECTED TO KNOWLEDGE DATABASE</div>
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
