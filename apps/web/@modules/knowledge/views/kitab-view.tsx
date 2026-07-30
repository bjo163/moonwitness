"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Search,
  Book,
  Globe2,
  Network,
  BrainCircuit,
  Play,
  Pause,
  Bookmark,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User,
  Star,
  CheckCircle2,
  Check
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useGlobalAudio } from "@core/contexts/audio-context"

export function KitabPortalView() {
  const [scriptures, setScriptures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const audio = useGlobalAudio()

  useEffect(() => {
    fetch('/api/scriptures')
      .then(res => res.json())
      .then(data => {
        setScriptures(data.data || [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Error fetching scriptures:", err)
        setIsLoading(false)
      })
  }, [])

  const canonicals = scriptures.filter((s: any) => s.type === 'Canonical')
  const additionals = scriptures.filter((s: any) => s.type === 'Additional')

  // Dynamic calculations
  const totalScriptures = scriptures.length
  const totalVerses = scriptures.reduce((acc: number, s: any) => acc + (s.verses_count || 0), 0)
  const totalProphets = new Set(scriptures.filter((s: any) => s.prophet && s.prophet !== "Unknown").map((s: any) => s.prophet)).size
  
  // Map canonicals from database
  const canonicalCards = canonicals.map((s: any, idx: number) => {
    const isQuran = s.name.includes("Qur'an")
    return {
      id: s.id || idx + 1,
      name: s.name.toUpperCase(),
      original_name: s.original_name?.toUpperCase() || s.name.toUpperCase(),
      image: s.cover_image_url || "/cover_quran.png",
      subtitle: isQuran ? "Final & Preserved" : `Revealed to ${s.prophet}`,
      authentic: s.authenticity_status === "100% Authentic",
      authLabel: s.authenticity_status || "Unknown",
      stats: { 
        col1: isQuran ? "Surah" : "Books", val1: isQuran ? "114" : (s.books_count || "0").toString(), 
        col2: isQuran ? "Ayat" : "Chapters", val2: isQuran ? "6,236" : (s.chapters_count || "0").toString(), 
        col3: isQuran ? "Juz" : "Verses", val3: isQuran ? "30" : (s.verses_count || "0").toString() 
      },
      religion: s.religion || "Unknown",
      color: s.theme_color || "blue"
    }
  })

  const otherScriptures = additionals.slice(0, 8).map((s: any) => ({
    id: s.id,
    name: s.name,
    religion: s.religion,
    texts: s.description || "Sacred Text",
    color: s.theme_color || "blue",
    icon: s.icon || "🪽"
  }))

  return (
    <div className="min-h-screen bg-[#040914] text-white font-sans overflow-x-hidden pb-10 selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 lg:px-6 pt-2 space-y-4">
        
        {/* 1. Flat Hero Banner */}
        <div className="relative w-full h-36 md:h-44 flex flex-col justify-center px-4 md:px-8 border-b border-white/5">
          <div className="absolute inset-0 overflow-hidden rounded-xl opacity-60 mix-blend-screen pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/40 via-[#040914] to-[#040914]" />
             {/* Mocking the glowing earth / book effect */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-500/30 blur-[100px] rounded-[100%]" />
             <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-white/40 blur-[50px] rounded-[100%]" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-amber-500/30 flex items-center justify-center relative group">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                <div className="absolute w-[2px] h-12 md:h-16 bg-gradient-to-t from-amber-200 to-transparent -top-6 md:-top-8 blur-[1px]" />
                <div className="absolute w-[1px] h-24 md:h-32 bg-amber-400/50 -top-12 md:-top-16" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                    CANONICAL SCRIPTURE CODEX
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Ver 2.0
                  </span>
                </div>
                <p className="text-xs text-blue-200/60 font-medium">
                  All Divine Messages, One Knowledge Hub — The Light of Guidance for All Humanity
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 lg:text-right hidden md:block">
              <div className="font-arabic text-2xl md:text-3xl text-white/90 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                وَذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ
              </div>
              <p className="text-[10px] md:text-xs text-white/50 italic max-w-sm ml-auto">
                "This is the Book about which there is no doubt, a guidance for those conscious of Allah."
                <span className="block mt-1 text-[9px] text-blue-400/60 not-italic">(QS. Al-Baqarah 2:2)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: Book, title: "Total Scriptures", value: totalScriptures.toString(), sub: "Manuscripts", color: "blue", isFill: false },
            { icon: Star, title: "Main Divine Sources", value: canonicals.length.toString(), sub: "Canonical", color: "amber", isFill: true },
            { icon: Globe2, title: "Total Languages", value: "120+", sub: "Translations", color: "blue", isFill: false },
            { icon: Network, title: "Verified Verses", value: totalVerses > 0 ? totalVerses.toLocaleString() : "~ 2.4M+", sub: "Cross-References", color: "cyan", isFill: false },
            { icon: BrainCircuit, title: "AI Research", value: "Active", sub: "Semantic Search", color: "purple", isFill: false },
          ].map((stat, i) => (
            <div key={i} className={`bg-[#0A1224] border ${stat.isFill ? 'border-amber-500/50' : 'border-white/5'} rounded-xl p-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group cursor-default shadow-md`}>
              <div className={`w-10 h-10 rounded-full ${stat.isFill ? 'bg-amber-500/20' : `bg-${stat.color}-500/10`} border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 ${stat.isFill ? 'fill-amber-400' : ''}`} />
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider text-white/40 uppercase">{stat.title}</div>
                <div className="text-lg font-black text-white leading-tight">{stat.value}</div>
                <div className="text-[9px] text-white/30">{stat.sub}</div>
              </div>
            </div>
          ))}

          {/* Quran Recitation Player - Fully Functional */}
          <div onClick={() => {
              if (audio.isPlaying) audio.togglePlay()
              else audio.play({ number: 1, name: "Al-Fatihah" })
            }} 
            className="bg-[#0A1224] border border-blue-500/30 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group cursor-pointer shadow-lg hover:border-blue-500/60 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 flex-shrink-0">
              {audio.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[9px] font-bold tracking-wider text-blue-400/80 uppercase">Quran Recitation</div>
              <div className="text-sm font-bold text-white truncate flex items-center gap-2">
                 Al-Fatihah
                 {/* Equalizer Animation */}
                 {audio.isPlaying && (
                    <div className="flex items-center gap-0.5 h-3">
                      <div className="w-0.5 h-full bg-blue-400 animate-[bounce_1s_infinite]" style={{ animationDelay: '0ms' }} />
                      <div className="w-0.5 h-full bg-blue-400 animate-[bounce_1s_infinite]" style={{ animationDelay: '200ms' }} />
                      <div className="w-0.5 h-full bg-blue-400 animate-[bounce_1s_infinite]" style={{ animationDelay: '400ms' }} />
                      <div className="w-0.5 h-full bg-blue-400 animate-[bounce_1s_infinite]" style={{ animationDelay: '100ms' }} />
                    </div>
                 )}
                 {!audio.isPlaying && (
                    <div className="flex items-center gap-0.5 h-3 opacity-30">
                      <div className="w-0.5 h-1 bg-blue-400" />
                      <div className="w-0.5 h-2 bg-blue-400" />
                      <div className="w-0.5 h-1.5 bg-blue-400" />
                      <div className="w-0.5 h-1 bg-blue-400" />
                    </div>
                 )}
              </div>
            </div>
            <div className="text-[9px] font-mono text-blue-300/60 flex-shrink-0">1/114</div>
          </div>
        </div>

        {/* 3. Toolbar (Full Width) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/10 pb-4 pt-2">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10 w-full md:w-auto">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black tracking-widest uppercase">4 MAJOR CANONICAL SCRIPTURES</span>
            <Bookmark className="w-3 h-3 text-white/30 ml-auto md:ml-4" />
          </div>
          
          <div className="flex-1 w-full max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search verses, keywords, topic across all scriptures..."
              className="w-full bg-[#0A1224] border border-white/10 rounded-full pl-11 pr-16 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/50 border border-white/10">Ctrl</kbd>
              <span className="text-[9px] text-white/30">+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/50 border border-white/10">K</kbd>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600/10 text-purple-300 border border-purple-500/30 text-[10px] font-black hover:bg-purple-600/30 transition-all group w-full md:w-auto justify-center">
            <Sparkles className="w-3.5 h-3.5" />
            AI COMPARE
          </button>
        </div>

        {/* 4. Main 3-Column Content Layout */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* LEFT SIDEBAR: MENU */}
          <div className="w-full lg:w-48 flex-shrink-0 space-y-6">
            <div>
              <h3 className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-3 px-2">Knowledge Menu</h3>
              <div className="space-y-1">
                {['Overview', "Qur'an (Kahf)", 'Taurat (Torah)', 'Zabur (Psalms)', 'Injil (Gospel)', 'Other Scriptures'].map((item, i) => (
                  <button key={i} className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${i === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <BookOpen className={`w-3.5 h-3.5 ${i===0 ? 'text-blue-400' : 'text-white/30'}`} />
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-3 px-2">Quick Access</h3>
              <div className="space-y-1">
                {['Ayat of the Day', 'Hadith Collection', 'Daily Adhkar', 'Prophetic Stories', 'Comparative Study', 'Research Lab'].map((item, i) => (
                  <button key={i} className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg text-[11px] font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all`}>
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                       <Star className="w-2 h-2 text-blue-400/50" />
                    </div>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-3 px-2">Filter</h3>
              {['All Languages', 'All Topics', 'All Periods', 'All Traditions'].map((f, i) => (
                 <select key={i} className="w-full bg-[#0A1224] border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white/60 outline-none focus:border-blue-500/50 transition-colors appearance-none">
                   <option>{f}</option>
                 </select>
              ))}
            </div>
          </div>

          {/* CENTER CONTENT: CARDS & INFO */}
          <div className="flex-1 min-w-0 flex flex-col space-y-6">
            
            {/* The 4 Canonical Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {canonicalCards.map((card) => (
                  <div key={card.id} className="bg-[#040914] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl relative group">
                     {/* Number Badge */}
                     <div className="absolute top-3 left-3 w-6 h-6 rounded border border-amber-500/30 flex items-center justify-center text-[10px] font-black text-amber-400 z-20 bg-black/50 backdrop-blur-md">
                        {card.id}
                     </div>
                     {/* Primary Tag */}
                     <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[8px] font-black uppercase z-20 backdrop-blur-md">
                        PRIMARY
                     </div>

                     {/* Image Cover */}
                     <div className="h-44 w-full relative bg-[#0A1224] flex items-center justify-center overflow-hidden border-b border-white/5">
                        <Image src={card.image} alt={card.name} fill className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[2s]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040914] to-transparent opacity-80" />
                     </div>

                     {/* Card Body */}
                     <div className="p-4 flex-1 flex flex-col items-center text-center -mt-8 relative z-10">
                        <h2 className="text-xl font-black tracking-widest text-white drop-shadow-md">{card.name}</h2>
                        <div className={`text-[10px] font-black text-${card.color}-400 tracking-[0.2em] uppercase mb-1`}>{card.original_name}</div>
                        
                        <div className="text-[10px] text-white/50 mb-2">{card.subtitle}</div>
                        
                        {/* Authenticity Badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${card.authentic ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-white/5 border border-white/10 text-white/40'} text-[9px] font-black mb-5`}>
                           {card.authentic ? <CheckCircle2 className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                           {card.authLabel}
                        </div>

                        {/* Stats Grid */}
                        <div className="w-full grid grid-cols-3 gap-1 border-y border-white/10 py-3 mb-4">
                           <div>
                              <div className="text-[8px] text-white/40 uppercase tracking-wider mb-1">{card.stats.col1}</div>
                              <div className="text-xs font-black text-white">{card.stats.val1}</div>
                           </div>
                           <div className="border-x border-white/10">
                              <div className="text-[8px] text-white/40 uppercase tracking-wider mb-1">{card.stats.col2}</div>
                              <div className="text-xs font-black text-white">{card.stats.val2}</div>
                           </div>
                           <div>
                              <div className="text-[8px] text-white/40 uppercase tracking-wider mb-1">{card.stats.col3}</div>
                              <div className="text-xs font-black text-white">{card.stats.val3}</div>
                           </div>
                        </div>

                        {/* Religion Tag */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded bg-${card.color}-500/10 text-[9px] font-bold text-${card.color}-300/80 mb-5 w-full justify-center`}>
                           <Book className="w-3 h-3" />
                           {card.religion}
                        </div>

                        {/* Buttons */}
                        <div className="w-full flex gap-2 mt-auto">
                           <Link href={`/knowledge/kitab/${card.id}`} className={`flex-1 bg-${card.color}-500 text-white py-2 rounded-lg text-[10px] font-black tracking-widest hover:bg-${card.color}-400 transition-colors shadow-lg shadow-${card.color}-500/20 flex items-center justify-center`}>
                              EXPLORE
                           </Link>
                           <button className="flex-1 bg-transparent border border-white/20 text-white/70 py-2 rounded-lg text-[10px] font-black tracking-widest hover:bg-white/5 transition-colors">
                              STUDY
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Bottom Center 4 Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-[#0A1224] border border-white/5 rounded-xl p-4 flex flex-col justify-center gap-2 shadow-lg relative overflow-hidden">
                  <div className="absolute right-[-10%] top-[-10%] w-16 h-16 bg-blue-500/5 rounded-full" />
                  <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">KEY VERSES CROSS-REFERENCES</div>
                  <div className="flex items-center gap-3">
                     <BookOpen className="w-8 h-8 text-blue-500/40" />
                     <div>
                        <div className="text-2xl font-black text-white">5,420</div>
                        <div className="text-[9px] text-white/40">Linked Verses</div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0A1224] border border-white/5 rounded-xl p-4 flex flex-col justify-center gap-2 shadow-lg relative overflow-hidden">
                  <div className="absolute right-[-10%] top-[-10%] w-16 h-16 bg-cyan-500/5 rounded-full" />
                  <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">PROPHETS MENTIONED</div>
                  <div className="flex items-center gap-3">
                     <User className="w-8 h-8 text-cyan-500/40" />
                     <div>
                        <div className="text-2xl font-black text-white">{totalProphets > 0 ? totalProphets : "124"}</div>
                        <div className="text-[9px] text-white/40">Across All Scriptures</div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0A1224] border border-white/5 rounded-xl p-4 flex flex-col justify-center gap-2 shadow-lg relative overflow-hidden">
                  <Star className="absolute right-[-10%] bottom-[-20%] w-20 h-20 text-blue-500/5 rotate-12" />
                  <div className="flex items-center justify-between">
                     <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">UNIVERSAL THEMES</div>
                     <div className="text-lg font-black text-white leading-none">18 <span className="text-[8px] text-white/40 font-normal">Core Values</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 relative z-10 mt-1">
                     {['Tauhid', 'Mercy', 'Justice', 'Guidance', 'Wisdom', 'Life After Death'].map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded border border-blue-500/20 text-[8px] text-blue-300 bg-blue-500/10">
                           {t}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="bg-[#0A1224] border border-white/5 rounded-xl p-4 flex flex-col justify-center gap-2 shadow-lg">
                  <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">STUDY PATH</div>
                  <div className="flex items-center gap-3 mb-1">
                     <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                     </div>
                     <div>
                        <div className="text-xs font-bold text-white">Start Your Journey</div>
                        <div className="text-[9px] text-white/40">Step-by-step Learning</div>
                     </div>
                  </div>
                  <button className="w-full py-1.5 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase text-white/70 hover:bg-white/10 transition-colors mt-1">
                     OPEN LEARNING HUB
                  </button>
               </div>
            </div>

            {/* Other Sacred Scriptures */}
            <div className="bg-[#0A1224] border border-white/5 rounded-xl p-5 shadow-lg">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2">
                     <Bookmark className="w-3 h-3 text-cyan-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">OTHER SACRED SCRIPTURES <span className="text-white/40">(ADDITIONAL)</span></span>
                  </div>
                  <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
                     {['All Traditions', 'Abrahamic', 'Eastern', 'Indigenous', 'Philosophy'].map((t,i) => (
                        <button key={i} className={`px-3 py-1 rounded text-[9px] font-bold border whitespace-nowrap ${i===0 ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/40 hover:text-white'}`}>
                           {t}
                        </button>
                     ))}
                  </div>
                  <button className="text-[9px] font-bold text-white/50 hover:text-white uppercase flex items-center gap-1 shrink-0">
                     VIEW COMPARISON TABLE <ArrowRight className="w-3 h-3" />
                  </button>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {otherScriptures.map((s, idx) => (
                     <Link href={`/knowledge/kitab/${s.id || ''}`} key={idx} className="bg-[#040914] border border-white/5 rounded-xl overflow-hidden flex flex-col group hover:border-white/20 transition-all cursor-pointer relative shadow-lg h-36">
                        <div className="absolute inset-0 w-full h-full z-0 bg-[#0A1224]">
                           <Image src={s.image || "/cover_eastern.png"} alt={s.name} fill className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-[2s]" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/80 to-transparent" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-end w-full p-3">
                           <div className="text-[10px] font-black text-white uppercase tracking-wider w-full truncate drop-shadow-md mb-0.5">{s.name}</div>
                           <div className="text-[8px] text-white/70 w-full truncate mb-1 drop-shadow-sm">{s.religion}</div>
                           <div className="text-[7px] font-mono text-white/40">{s.texts}</div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: TIMELINE */}
          <div className="w-full lg:w-56 flex-shrink-0 space-y-4">
            <div className="bg-[#0A1224] border border-white/5 rounded-xl p-5 shadow-lg">
               <h3 className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-5">Revelation Timeline</h3>
               
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-white/5">
                  {[
                     { icon: BookOpen, title: "Taurat", year: "~1445 BCE", author: "Moses (a.s)", color: "amber" },
                     { icon: BookOpen, title: "Zabur", year: "~1000 BCE", author: "David (a.s)", color: "blue" },
                     { icon: BookOpen, title: "Injil", year: "~30 CE", author: "Jesus (a.s)", color: "purple" },
                     { icon: BookOpen, title: "Al-Qur'an", year: "610-632 CE", author: "Muhammad ﷺ", subauthor: "(Final & Universal)", color: "emerald" }
                  ].map((item, i) => (
                     <div key={i} className="relative flex items-start gap-4 group">
                        <div className={`w-8 h-8 rounded-full border-[3px] border-[#0A1224] bg-${item.color}-500/20 text-${item.color}-400 flex items-center justify-center z-10 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]`}>
                           <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="pt-0.5">
                           <div className="text-[11px] font-black text-white">{item.title}</div>
                           <div className={`text-[9px] font-mono text-${item.color}-400`}>{item.year}</div>
                           <div className="text-[9px] text-white/50">{item.author}</div>
                           {item.subauthor && <div className="text-[8px] text-white/30">{item.subauthor}</div>}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 pt-5 border-t border-white/5">
                  <div className="text-[9px] font-black text-white uppercase flex items-center gap-1.5 mb-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     Final Revelation (Khatam)
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed mb-3">
                     Al-Qur'an — Guidance for all humanity.
                  </p>
                  <ul className="space-y-1.5 text-[8.5px] text-white/60 mb-5">
                     <li className="flex gap-1.5 items-start"><Check className="w-3 h-3 text-emerald-500 shrink-0" /> Clarifies & Confirms</li>
                     <li className="flex gap-1.5 items-start"><Check className="w-3 h-3 text-emerald-500 shrink-0" /> Completes Previous Scriptures</li>
                     <li className="flex gap-1.5 items-start"><Check className="w-3 h-3 text-emerald-500 shrink-0" /> Preserved Eternally by Allah SWT</li>
                  </ul>
                  <button className="w-full py-1.5 bg-white/5 border border-white/10 rounded text-[9px] font-black text-white/70 hover:bg-white/10 transition-colors uppercase">
                     Learn More
                  </button>
               </div>
            </div>

            {/* Arabic Quote */}
            <div className="bg-[#0A1224] border border-amber-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
               <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50" />
               <div className="font-arabic text-xl text-amber-400 mb-2 relative z-10 drop-shadow-md">
                 كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ
               </div>
               <p className="text-[9px] text-white/60 relative z-10 italic">
                 "Every soul will taste death."
                 <span className="block not-italic text-[8px] text-white/30 mt-1">(QS. Ali Imran 3:185)</span>
               </p>
            </div>
          </div>
        </div>

        {/* 5. Footer Features */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 mt-8">
           <div className="flex items-center gap-3 group cursor-pointer">
              <Globe2 className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" />
              <div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest">Interfaith Dialogue</div>
                 <div className="text-[8px] text-white/50">Understanding, not Debating</div>
              </div>
           </div>
           <div className="flex items-center gap-3 group cursor-pointer">
              <Network className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors" />
              <div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest">Text Comparison Lab</div>
                 <div className="text-[8px] text-white/50">AI-Powered Analysis</div>
              </div>
           </div>
           <div className="flex items-center gap-3 group cursor-pointer">
              <BookOpen className="w-5 h-5 text-white/30 group-hover:text-emerald-400 transition-colors" />
              <div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest">Digital Library</div>
                 <div className="text-[8px] text-white/50">120+ Language Translation</div>
              </div>
           </div>
           <div className="flex items-center gap-3 group cursor-pointer">
              <User className="w-5 h-5 text-white/30 group-hover:text-amber-400 transition-colors" />
              <div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest">Community Research</div>
                 <div className="text-[8px] text-white/50">Collaborate & Share Insight</div>
              </div>
           </div>
        </div>
        
        <div className="text-center w-full pt-8 pb-4">
           <div className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em]">
              ★ WHEN THE MOON WITNESSES, WE SHARE MESSAGES. ★
           </div>
        </div>
      </div>
    </div>
  )
}
