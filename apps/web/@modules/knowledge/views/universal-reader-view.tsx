"use client"

import { useState, useEffect, Suspense } from "react"
import { ArrowLeft, BookOpen, ChevronDown, CheckCircle2, PlayCircle, Pause, Settings2, Info, Search, Bookmark, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useGlobalAudio } from "@core/contexts/audio-context"

function ReaderContent({ id }: { id: string }) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openTafsirId, setOpenTafsirId] = useState<number | null>(null)
  const [isTajweedOn, setIsTajweedOn] = useState(false)
  const [isTransliterationOn, setIsTransliterationOn] = useState(true)
  const audio = useGlobalAudio()
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentBook = searchParams.get('book') || "1"
  const currentChapterStr = searchParams.get('chapter') || "1"

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/scriptures/${id}/read?book=${currentBook}&chapter=${currentChapterStr}`)
      .then(res => res.json())
      .then(json => {
        setData(json.data)
        setIsLoading(false)
        window.scrollTo(0, 0)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [id, currentBook, currentChapterStr])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#040914] flex flex-col items-center justify-center text-white/50 space-y-4">
        <BookOpen className="w-8 h-8 animate-pulse text-blue-500/50" />
        <div className="text-xs uppercase tracking-widest font-bold">Unlocking Divine Codex...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#040914] flex flex-col items-center justify-center text-white space-y-4">
        <p>Error loading scripture.</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-white/10 rounded">Go Back</button>
      </div>
    )
  }

  const { 
    scripture_name, scripture_arabic, scripture_tag, scripture_desc, stats, 
    left_sidebar, right_sidebar, bottom_panels, 
    book, verses, current_chapter 
  } = data

  const totalChapters = book.chapters_count || 1;
  const currentChNum = parseInt(current_chapter) || 1;

  const navigateToChapter = (ch: number) => {
    if (ch >= 1 && ch <= totalChapters) {
      router.push(`?book=${currentBook}&chapter=${ch}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#040914] text-white font-sans overflow-x-hidden">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="border-b border-white/10 bg-[#040914]/80 backdrop-blur-xl sticky top-0 z-50">
        {/* Master Header */}
        <div className="px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{scripture_name}</h1>
              {scripture_arabic && <span className="text-2xl font-serif text-amber-500">{scripture_arabic}</span>}
              <span className="px-2 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[9px] font-bold tracking-widest rounded">{scripture_tag}</span>
            </div>
            <p className="text-sm text-white/60">{scripture_desc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/50">
            {stats && Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-bold">{key}</span>
                <span className="text-sm font-bold text-white">{value as React.ReactNode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN DASHBOARD */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 max-w-[1920px] mx-auto">
        
        {/* LEFT SIDEBAR: NAVIGATION */}
        <div className="md:col-span-3 lg:col-span-2 space-y-6">
          <div className="bg-[#0A1224] border border-white/5 rounded-xl p-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">{left_sidebar.title}</h3>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/30" />
              <input type="text" placeholder="Search..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500/50" />
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {left_sidebar.items.map((item: any) => {
                const isActive = item.book_number.toString() === currentBook.toString()
                return (
                  <button 
                    key={item.id}
                    onClick={() => router.push(`?book=${item.book_number}&chapter=1`)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors border ${
                      isActive 
                        ? 'bg-blue-500/10 border-blue-500/30' 
                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                        {item.book_number}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isActive ? 'text-blue-400' : 'text-white/80'}`}>{item.name}</span>
                        <span className="text-[9px] text-white/40">{item.subname}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* CENTER AREA: READER CANVAS */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-6">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 overflow-x-auto custom-scrollbar pb-px">
            {['OVERVIEW', 'READ & EXPLORE', 'THEMES & TOPICS', 'INSIGHTS', 'CONTEXT'].map((tab, i) => (
              <button key={tab} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${i === 1 ? 'border-blue-500 text-blue-400' : 'border-transparent text-white/40 hover:text-white/80'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#0A1224] border border-white/5 rounded-xl p-5 md:p-6 relative overflow-hidden">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-2 inline-block">BOOK {currentBook}</span>
                <h2 className="text-2xl font-black flex items-center gap-3">
                  {book.name} <span className="text-amber-500/80 font-serif">{book.original_name}</span>
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-white/40">
                  <span>{book.summary}</span>
                  {book.meaning && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-amber-500/80">Arti: {book.meaning}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {book.audio_url && (
                  <button 
                    onClick={() => {
                      if (audio.isPlaying && audio.currentTrack?.url === book.audio_url) {
                        audio.pause()
                      } else {
                        audio.play({ url: book.audio_url, name: book.name, number: currentChNum })
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 ${audio.isPlaying && audio.currentTrack?.url === book.audio_url ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'} border rounded-lg text-xs font-bold transition-colors`}
                  >
                    {audio.isPlaying && audio.currentTrack?.url === book.audio_url ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />} 
                    {audio.isPlaying && audio.currentTrack?.url === book.audio_url ? "Playing..." : "Listen Audio"}
                  </button>
                )}
                <button className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {/* Verses Column Layout */}
            <div className="space-y-6">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 pl-2">Transliteration & Translation</div>
                <div className="col-span-6 text-right pr-2">Original Text</div>
              </div>

              {verses.map((verse: any) => {
                const isRtl = verse.text_original && (/[\u0590-\u05FF]/.test(verse.text_original) || /[\u0600-\u06FF]/.test(verse.text_original));
                return (
                  <div key={verse.id} className="grid grid-cols-12 gap-4 items-start group">
                    <div className="col-span-1 flex justify-center pt-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 group-hover:border-blue-500/30 transition-colors">
                        {verse.verse_number}
                      </div>
                    </div>
                    
                    <div className="col-span-5 space-y-2 pt-1 pl-2">
                      {isTransliterationOn && verse.text_transliteration && (
                        <p className="text-xs font-mono text-blue-300/70">{verse.text_transliteration}</p>
                      )}
                      <p className="text-sm font-serif text-white/90 leading-relaxed">{verse.text_translated}</p>
                    </div>

                    <div className="col-span-6 text-right pt-1 pr-2">
                      {isTajweedOn && verse.text_tajweed && verse.text_tajweed !== verse.text_original ? (
                        <div 
                           className="text-2xl font-serif text-amber-400/90 leading-[2.5] tajweed-container" 
                           dir={isRtl ? 'rtl' : 'ltr'}
                           dangerouslySetInnerHTML={{ __html: verse.text_tajweed }}
                        />
                      ) : (
                        <p className="text-2xl font-serif text-amber-400/90 leading-[2.5]" dir={isRtl ? 'rtl' : 'ltr'}>
                          {verse.text_original}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Toolbar & Pagination */}
            <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setIsTransliterationOn(!isTransliterationOn)} className={`px-3 py-1.5 border rounded text-[10px] font-bold transition-colors ${isTransliterationOn ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-black/40 border-white/10 text-white/60'}`}>
                   Transliteration: {isTransliterationOn ? 'ON' : 'OFF'}
                </button>
                {verses.some((v: any) => v.text_tajweed && v.text_tajweed !== v.text_original) && (
                  <button onClick={() => setIsTajweedOn(!isTajweedOn)} className={`px-3 py-1.5 border rounded text-[10px] font-bold transition-colors ${isTajweedOn ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-black/40 border-white/10 text-white/60'}`}>
                     Tajweed Colors: {isTajweedOn ? 'ON' : 'OFF'}
                  </button>
                )}
                <button className="px-3 py-1.5 bg-black/40 border border-white/10 rounded text-[10px] font-bold text-white/60">Tafsir: ON</button>
              </div>

              {totalChapters > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => navigateToChapter(currentChNum - 1)} disabled={currentChNum <= 1} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold disabled:opacity-30 border border-white/10">Prev</button>
                  <span className="text-xs font-bold px-2 text-amber-500">Ch. {currentChNum} / {totalChapters}</span>
                  <button onClick={() => navigateToChapter(currentChNum + 1)} disabled={currentChNum >= totalChapters} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold disabled:opacity-30 border border-white/10">Next</button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR: INSIGHTS & FACTS */}
        <div className="md:col-span-3 lg:col-span-3 space-y-6">
          
          <div className="bg-transparent border border-white/10 rounded-xl p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">QUICK FACTS</h3>
            <div className="space-y-3">
              {right_sidebar.quick_facts?.map((f: any, i: number) => (
                <div key={i} className="flex justify-between items-start text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40">{f.label}</span>
                  <span className="text-white/90 font-medium text-right w-1/2">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <Info className="w-3 h-3" /> INSIGHTS
            </h3>
            <div className="space-y-4">
              {right_sidebar.insights?.map((f: any, i: number) => (
                <div key={i}>
                  <span className="text-[10px] text-amber-500 font-bold block mb-1">{f.label}</span>
                  <span className="text-xs text-white/70 leading-relaxed">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM PANELS (EXTRA FEATURES) */}
      <div className="px-6 py-5 border-t border-white/10 bg-black/40">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">THEMES & TOPICS</h4>
            <div className="flex flex-wrap gap-2">
              {bottom_panels.themes?.map((t: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/60 hover:text-white hover:border-blue-500/50 cursor-pointer transition-colors">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">RELATED VERSES</h4>
            <div className="space-y-2">
              {bottom_panels.related?.map((r: any, i: number) => (
                <div key={i} className="text-xs">
                  <span className="text-blue-400 font-bold mr-2">{r.ref}</span>
                  <span className="text-white/50">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">TAFSIR HIGHLIGHT</h4>
            <p className="text-xs text-white/60 italic leading-relaxed border-l-2 border-amber-500 pl-3">
              "{bottom_panels.tafsir_highlight?.text}"
              <span className="block mt-2 font-bold text-white/40 not-italic">— {bottom_panels.tafsir_highlight?.author}</span>
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">FEATURES</h4>
            <ul className="text-xs text-white/60 space-y-2">
              {bottom_panels.science?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 text-teal-500 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  )
}

export function UniversalReaderView({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040914] text-white p-8">Loading Reader...</div>}>
      <ReaderContent id={id} />
    </Suspense>
  )
}
