"use client"

import { useState, useEffect } from "react"
import { 
  Search, Bookmark, Share2, PlayCircle, BookOpen, Clock, 
  Shield, Sun, Moon, MapPin, Home, AlertCircle, Heart,
  CheckCircle2, Star, Target, Zap, LayoutGrid, List,
  Calendar, Download, Smartphone, Printer, Flame
} from "lucide-react"

const topStats = [
  { icon: Heart, label: "TOTAL DUA", value: "1,248", sub: "Terverifikasi", color: "blue" },
  { icon: BookOpen, label: "SUMBER", value: "16", sub: "Kitab Shahih", color: "emerald" },
  { icon: Search, label: "BAHASA", value: "7", sub: "Tersedia", color: "amber" },
  { icon: Star, label: "DIAKSES HARI INI", value: "12,843", sub: "Akses", color: "purple" }
]

const tabs = ["SEMUA", "HARIAN", "PAGI", "SORE", "MALAM", "PERJALANAN", "PERLINDUNGAN", "RUMAH & KELUARGA", "SHALAT & IBADAH", "DARURAT", "LAINNYA"]

export function DoaHarianView() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("HARIAN")
  const [searchQuery, setSearchQuery] = useState("")
  const [adhkarData, setAdhkarData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setIsLoading(true)
    fetch(`/api/adhkar`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setAdhkarData(json.data)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  if (!mounted || isLoading) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-blue-500 font-mono text-sm tracking-widest">INITIALIZING ADHKAR SYSTEM...</div>

  const filteredData = adhkarData.filter(item => {
    if (activeTab !== "SEMUA") {
       if (activeTab === "HARIAN" && !['Pagi', 'Sore', 'Malam'].includes(item.timing)) return false
       if (activeTab !== "HARIAN" && item.category?.toUpperCase() !== activeTab && item.timing?.toUpperCase() !== activeTab) return false
    }
    if (searchQuery) {
       const q = searchQuery.toLowerCase()
       return item.title.toLowerCase().includes(q) || item.translation.toLowerCase().includes(q)
    }
    return true
  })

  const dynamicTopStats = [
    { icon: Heart, label: "TOTAL DUA", value: adhkarData.length.toString(), sub: "Dari Hisnul Muslim", color: "blue" },
    { icon: BookOpen, label: "SUMBER", value: "Utama", sub: "Kitab Hisnul Muslim", color: "emerald" },
    { icon: Search, label: "BAHASA", value: "3", sub: "Arab, Latin, ID", color: "amber" },
    { icon: Star, label: "KATEGORI", value: new Set(adhkarData.map(d => d.category)).size.toString(), sub: "Klasifikasi", color: "purple" }
  ]

  return (
    <div className="min-h-screen bg-[#020813] text-white overflow-x-hidden font-sans selection:bg-blue-500/30 pb-20">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#040C1A] border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                 <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                 <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3 drop-shadow-md">
                    PROPHETIC ADHKAR & SUPPLICATIONS
                 </h1>
                 <p className="text-[#8F9FB3] text-sm max-w-2xl">
                    Kumpulan doa, dzikir, dan shahih harian dari Rasulullah ﷺ sebagai benteng perlindungan jiwa raga dalam setiap helaan nafas.
                 </p>
              </div>
           </div>

           <div className="flex flex-wrap gap-4 lg:gap-6 bg-[#040C1A] border border-white/5 p-4 rounded-2xl">
              {dynamicTopStats.map((stat, idx) => (
                 <div key={idx} className={`flex items-center gap-3 ${idx !== dynamicTopStats.length - 1 ? 'border-r border-white/5 pr-4 lg:pr-6' : ''}`}>
                    <div className={`w-10 h-10 rounded-full bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400`}>
                       <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                       <div className="text-[8px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-0.5">{stat.label}</div>
                       <div className="text-lg font-mono text-white font-bold leading-none mb-0.5">{stat.value}</div>
                       <div className="text-[8px] text-[#8F9FB3]">{stat.sub}</div>
                    </div>
                 </div>
              ))}
              <div className="pl-4 lg:pl-6 border-l border-white/5 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center overflow-hidden relative shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Allah-green.svg/1024px-Allah-green.svg.png" className="w-10 h-10 object-contain opacity-80 mix-blend-screen hue-rotate-[180deg]" alt="Calligraphy" />
                 </div>
              </div>
           </div>
        </div>

        {/* Action Bar (Time, Benefits, Sync, Status) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3">WAKTU TERBAIK BERDZIKIR</div>
              <div className="flex justify-between items-center text-[10px] text-[#8F9FB3]">
                 <div className="text-center"><Sun className="w-4 h-4 mx-auto mb-1 text-amber-400" /><span className="text-white">PAGI</span><br/>03:00 - 06:00</div>
                 <div className="text-center"><Sun className="w-4 h-4 mx-auto mb-1 text-emerald-400" /><span className="text-white">SIANG</span><br/>11:00 - 13:00</div>
                 <div className="text-center"><Moon className="w-4 h-4 mx-auto mb-1 text-orange-400" /><span className="text-white">SORE</span><br/>16:00 - 18:00</div>
                 <div className="text-center"><Moon className="w-4 h-4 mx-auto mb-1 text-blue-400" /><span className="text-white">MALAM</span><br/>01:00 - 03:00</div>
              </div>
           </div>
           
           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3">NILAI & MANFAAT</div>
              <div className="flex justify-around items-center text-[9px] text-[#8F9FB3]">
                 <div className="text-center"><Heart className="w-4 h-4 mx-auto mb-1 text-blue-400" />KETENANGAN HATI</div>
                 <div className="text-center"><Shield className="w-4 h-4 mx-auto mb-1 text-emerald-400" />PERLINDUNGAN DIRI</div>
                 <div className="text-center"><Star className="w-4 h-4 mx-auto mb-1 text-amber-400" />KEBERKAHAN HIDUP</div>
                 <div className="text-center"><Target className="w-4 h-4 mx-auto mb-1 text-purple-400" />PENGAMPUNAN DOSA</div>
              </div>
           </div>

           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-2">SINKRONISASI ADHKAR</div>
              <p className="text-[10px] text-[#8F9FB3] mb-3">Dapatkan jadwal dzikir harian sesuai waktu & lokasi Anda.</p>
              <button className="w-full py-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded text-[9px] font-bold tracking-widest hover:bg-blue-500/20 transition-colors">
                 SINKRONKAN SEKARANG
              </button>
           </div>

           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl flex flex-col justify-center items-end text-right">
              <div className="text-[9px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-1">STATUS SISTEM</div>
              <div className="text-[8px] uppercase tracking-widest text-blue-500 mb-3">OPERATION MODE<br/><span className="text-white">ADHKAR-SYNC-ROUTINE</span></div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-emerald-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 ONLINE
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 mb-6 pb-0 overflow-x-auto custom-scrollbar">
           <div className="flex gap-6 min-w-max px-2">
              {tabs.map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border-b-2 whitespace-nowrap ${
                       activeTab === tab
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-[#8F9FB3] hover:text-white"
                    }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
           <button className="hidden lg:flex shrink-0 items-center gap-2 px-3 py-1.5 mb-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] font-bold tracking-widest hover:bg-blue-500/20 transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              JADWAL HARIAN
           </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Left Sidebar */}
           <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Kategori Adhkar */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/5 pb-2">KATEGORI ADHKAR</div>
                 <div className="space-y-2 text-[10px] text-[#8F9FB3]">
                    {[
                      { icon: Sun, label: "Harian (Pagi & Sore)", count: adhkarData.filter(d => ['Harian', 'Pagi', 'Sore'].includes(d.category)).length },
                      { icon: Shield, label: "Perlindungan", count: adhkarData.filter(d => d.category === 'Perlindungan').length },
                      { icon: MapPin, label: "Perjalanan", count: adhkarData.filter(d => d.category === 'Perjalanan').length },
                      { icon: Home, label: "Rumah & Keluarga", count: adhkarData.filter(d => d.category === 'Rumah & Keluarga').length },
                      { icon: Target, label: "Shalat & Ibadah", count: adhkarData.filter(d => d.category === 'Shalat & Ibadah').length },
                      { icon: AlertCircle, label: "Darurat & Kesulitan", count: adhkarData.filter(d => d.category === 'Darurat & Kesulitan').length },
                      { icon: LayoutGrid, label: "Lainnya", count: adhkarData.filter(d => !['Harian', 'Pagi', 'Sore', 'Perlindungan', 'Perjalanan', 'Rumah & Keluarga', 'Shalat & Ibadah', 'Darurat & Kesulitan'].includes(d.category)).length }
                    ].map((cat, i) => (
                       <div key={i} className="flex justify-between items-center group cursor-pointer hover:text-white transition-colors" onClick={() => setActiveTab(cat.label === 'Harian (Pagi & Sore)' ? 'HARIAN' : cat.label.toUpperCase())}>
                          <div className="flex items-center gap-2">
                             <cat.icon className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-400" />
                             {cat.label}
                          </div>
                          <span className="font-mono">{cat.count}</span>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-4 py-1.5 border border-white/10 rounded text-[9px] font-bold tracking-widest text-[#8F9FB3] hover:text-white hover:bg-white/5 transition-colors">
                    LIHAT SEMUA KATEGORI
                 </button>
              </div>

              {/* Sumber Kitab */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/5 pb-2">SUMBER KITAB</div>
                 <div className="space-y-2 text-[10px] text-[#8F9FB3]">
                    {[
                      { label: "Hisnul Muslim", count: adhkarData.length, color: "emerald" },
                      { label: "Sahih Bukhari", count: adhkarData.filter(d => d.source?.toLowerCase().includes('bukhari')).length, color: "blue" },
                      { label: "Sahih Muslim", count: adhkarData.filter(d => d.source?.toLowerCase().includes('muslim')).length, color: "blue" },
                      { label: "Abu Dawud", count: adhkarData.filter(d => d.source?.toLowerCase().includes('dawud')).length, color: "amber" },
                      { label: "Tirmidzi", count: adhkarData.filter(d => d.source?.toLowerCase().includes('tirmidzi')).length, color: "purple" }
                    ].map((src, i) => (
                       <div key={i} className="flex justify-between items-center group cursor-pointer hover:text-white transition-colors">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full bg-${src.color}-500`} />
                             {src.label}
                          </div>
                          <span className="font-mono">{src.count}</span>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-4 py-1.5 border border-white/10 rounded text-[9px] font-bold tracking-widest text-[#8F9FB3] hover:text-white hover:bg-white/5 transition-colors">
                    LIHAT SEMUA SUMBER
                 </button>
              </div>

              {/* Pencarian Cepat */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3 border-b border-white/5 pb-2">PENCARIAN CEPAT</div>
                 <div className="relative mb-3">
                    <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-[#8F9FB3]" />
                    <input 
                       type="text" 
                       placeholder="Cari doa, keutamaan, atau tema..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full bg-[#020813] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-[10px] text-white placeholder:text-[#8F9FB3] outline-none focus:border-blue-500/50"
                    />
                 </div>
                 <div className="text-[9px] text-[#8F9FB3] mb-2">Pencarian Populer:</div>
                 <div className="flex flex-wrap gap-1.5">
                    {["Perlindungan", "Pagi", "Tidur", "Rezeki", "Hati Tenang", "Hutang"].map((tag) => (
                       <span key={tag} className="px-2 py-0.5 rounded border border-white/10 text-[8px] hover:bg-white/5 cursor-pointer">{tag}</span>
                    ))}
                 </div>
              </div>
           </div>

           {/* Center Grid */}
           <div className="lg:col-span-7 flex flex-col">
              
              <div className="flex justify-between items-end mb-4">
                 <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-1">
                       {activeTab === 'SEMUA' ? 'SEMUA ADHKAR' : `ADHKAR ${activeTab}`}
                    </h2>
                    <p className="text-[10px] text-[#8F9FB3]">Dzikir yang dibaca di waktu {activeTab.toLowerCase()} hari.</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="text-[10px] text-[#8F9FB3]">Menampilkan <span className="text-white">1 - {Math.min(12, filteredData.length)}</span> dari {filteredData.length}</div>
                    <div className="flex gap-1">
                       <button className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center"><LayoutGrid className="w-3 h-3" /></button>
                       <button className="w-6 h-6 rounded border border-white/10 text-[#8F9FB3] flex items-center justify-center"><List className="w-3 h-3" /></button>
                    </div>
                 </div>
              </div>

              {filteredData.length === 0 ? (
                 <div className="flex-1 bg-[#040C1A] border border-white/5 rounded-xl flex flex-col items-center justify-center text-[#8F9FB3] p-10">
                    <Search className="w-8 h-8 mb-3 opacity-20" />
                    <div className="text-sm font-bold tracking-widest uppercase mb-1">TIDAK DITEMUKAN</div>
                    <div className="text-[10px]">Coba gunakan kata kunci yang berbeda.</div>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {filteredData.slice(0, 12).map((item, idx) => {
                       const padId = (idx + 1).toString().padStart(2, '0')
                       let badgeColor = "blue"
                       let BadgeIcon = Sun
                       
                       if(item.timing?.includes('Pagi')) { badgeColor = "amber"; BadgeIcon = Sun }
                       else if(item.timing?.includes('Sore')) { badgeColor = "orange"; BadgeIcon = Sun }
                       else if(item.timing?.includes('Malam')) { badgeColor = "purple"; BadgeIcon = Moon }

                       return (
                          <div key={idx} className="bg-[#040C1A] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all flex flex-col group relative overflow-hidden">
                             {/* Top header of card */}
                             <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="text-sm font-mono text-white font-bold">{padId}</div>
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border border-${badgeColor}-500/30 text-${badgeColor}-400 bg-${badgeColor}-500/10 tracking-widest font-sans font-bold text-[8px] uppercase`}>
                                   <BadgeIcon className="w-3 h-3" />
                                   {item.timing === 'Semua' ? 'HARIAN' : item.timing}
                                </div>
                             </div>

                             {/* Content */}
                             <div className="relative z-10 flex-1 flex flex-col">
                                <div className="text-xl font-arabic text-right mb-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] leading-relaxed min-h-[60px] flex items-center justify-end">
                                   {item.arabic}
                                </div>
                                
                                <div className="text-[10px] text-[#8F9FB3] mb-2 italic">
                                   {item.latin}
                                </div>
                                
                                <div className="text-[10px] text-white/90 mb-4 line-clamp-3">
                                   {item.translation}
                                </div>
                                
                                <div className="mt-auto pt-3 border-t border-white/5 space-y-2">
                                   <div className="text-[9px] text-emerald-400 font-bold"><span className="text-[#8F9FB3] font-normal">Manfaat:</span> {item.benefit}</div>
                                   <div className="flex justify-between items-center">
                                      <div className="text-[8px] text-[#8F9FB3] font-mono">{item.source}</div>
                                      <div className="flex gap-2">
                                         <Bookmark className="w-3 h-3 text-[#8F9FB3] hover:text-amber-400 cursor-pointer" />
                                         <Share2 className="w-3 h-3 text-[#8F9FB3] hover:text-white cursor-pointer" />
                                         <PlayCircle className="w-3 h-3 text-blue-400 hover:text-blue-300 cursor-pointer" />
                                      </div>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                       )
                    })}
                 </div>
              )}
           </div>

           {/* Right Sidebar */}
           <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Hadis Pilihan */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/5 pb-2 relative z-10">HADIS PILIHAN</div>
                 
                 <div className="flex justify-between items-center text-[7px] text-[#8F9FB3] font-mono mb-4 relative z-10">
                    <span>HR. BUKHARI 7/158</span>
                    <span>HR. MUSLIM 4/2071</span>
                 </div>
                 
                 <div className="text-xl font-arabic text-center mb-4 text-white leading-relaxed relative z-10">
                    مَنْ لَزِمَ عَلَىٰ دُعَاءِهِ
                 </div>
                 <div className="text-[9px] text-[#8F9FB3] text-center italic mb-2 relative z-10">
                    Man la yazal 'ala du'a'ihi hatta yudkhalal jannah.
                 </div>
                 <div className="text-[10px] text-white/90 text-center mb-6 relative z-10">
                    Barangsiapa yang terus menerus berdoa kepada Allah sampai ia masuk surga.
                 </div>
                 <button className="w-full py-2 border border-white/10 rounded bg-white/5 text-[9px] font-bold tracking-widest text-white hover:bg-white/10 transition-colors relative z-10">
                    LIHAT HADIS LENGKAP
                 </button>
              </div>

              {/* Keutamaan Dzikir */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/5 pb-2">KEUTAMAAN DZIKIR</div>
                 <div className="space-y-3">
                    {[
                      { icon: CheckCircle2, text: "Menghapus dosa-dosa kecil" },
                      { icon: Heart, text: "Mendatangkan ketenangan hati" },
                      { icon: Shield, text: "Menolak gangguan setan" },
                      { icon: Star, text: "Mendatangkan rezeki & berkah" },
                      { icon: AlertCircle, text: "Melindungi dari keburukan" },
                      { icon: Target, text: "Meninggikan derajat di sisi Allah" }
                    ].map((item, i) => (
                       <div key={i} className="flex items-start gap-2.5 text-[10px] text-[#8F9FB3]">
                          <div className="mt-0.5"><item.icon className="w-3.5 h-3.5 text-amber-500" /></div>
                          <div>{item.text}</div>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-5 py-2 border border-white/10 rounded text-[9px] font-bold tracking-widest text-[#8F9FB3] hover:text-white hover:bg-white/5 transition-colors">
                    LIHAT SEMUA KEUTAMAAN
                 </button>
              </div>

              {/* Adhkar Streak */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-4 border-b border-white/5 pb-2">ADHKAR STREAK</div>
                 
                 <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                       <Flame className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="text-xl font-mono text-white font-bold leading-none mb-1">23 HARI</div>
                       <div className="text-[9px] text-emerald-400">Tetap istiqomah!</div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center mb-2 px-1">
                    {['S','S','R','K','J','S','M'].map((day, i) => (
                       <div key={i} className="flex flex-col items-center gap-1.5">
                          <div className="text-[8px] text-[#8F9FB3] font-bold">{day}</div>
                          {i < 5 ? (
                             <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>
                          ) : i === 5 ? (
                             <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                          ) : (
                             <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10" />
                          )}
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-[9px] text-[#8F9FB3] mb-2">
                       <span>TARGET HARIAN</span>
                       <span className="text-white font-bold">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-full rounded-full" />
                    </div>
                    <div className="text-[8px] text-blue-400 mt-1.5 font-mono">15/15 dzikir</div>
                 </div>

                 <button className="w-full mt-4 py-2 border border-blue-500/30 rounded bg-blue-500/10 text-[9px] font-bold tracking-widest text-blue-400 hover:bg-blue-500/20 transition-colors">
                    LIHAT PROGRESS
                 </button>
              </div>

           </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 border-t border-white/10 pt-6">
           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3">ADHKAR HARI INI (REKOMENDASI)</div>
              <div className="text-[10px] text-[#8F9FB3] mb-4">Dzikir pilihan sesuai waktu & kondisi Anda.</div>
              <div className="flex items-center justify-between text-[10px] px-2 mb-4">
                 <div className="text-center"><div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1"><Sun className="w-3 h-3"/></div>Pagi<br/><span className="text-[8px] text-[#8F9FB3]">5 dzikir</span></div>
                 <div className="w-4 border-t border-white/10 border-dashed" />
                 <div className="text-center opacity-50"><div className="w-6 h-6 rounded bg-white/5 text-[#8F9FB3] flex items-center justify-center mx-auto mb-1"><Sun className="w-3 h-3"/></div>Siang<br/><span className="text-[8px]">4 dzikir</span></div>
                 <div className="w-4 border-t border-white/10 border-dashed" />
                 <div className="text-center opacity-50"><div className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-1"><Moon className="w-3 h-3"/></div>Sore<br/><span className="text-[8px]">6 dzikir</span></div>
                 <div className="w-4 border-t border-white/10 border-dashed" />
                 <div className="text-center opacity-50"><div className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-1"><Moon className="w-3 h-3"/></div>Malam<br/><span className="text-[8px]">6 dzikir</span></div>
              </div>
              <button className="w-full py-1.5 border border-white/10 rounded text-[9px] font-bold tracking-widest text-white hover:bg-white/5 transition-colors">
                 LIHAT JADWAL SUMBER
              </button>
           </div>

           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3">PANDUAN PEMULA</div>
              <div className="text-[10px] text-[#8F9FB3] mb-4">Mulai perjalanan dzikir Anda dengan panduan lengkap.</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="flex items-center gap-2 text-[9px] text-white"><BookOpen className="w-3.5 h-3.5 text-blue-400" /> Cara Memulai Dzikir</div>
                 <div className="flex items-center gap-2 text-[9px] text-white"><Star className="w-3.5 h-3.5 text-amber-400" /> Tips Istiqomah</div>
                 <div className="flex items-center gap-2 text-[9px] text-white"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Adab & Waktu Terbaik</div>
                 <div className="flex items-center gap-2 text-[9px] text-white"><Target className="w-3.5 h-3.5 text-purple-400" /> Menghafal Dzikir</div>
              </div>
              <button className="w-full py-1.5 border border-white/10 rounded text-[9px] font-bold tracking-widest text-white hover:bg-white/5 transition-colors">
                 LIHAT PANDUAN
              </button>
           </div>

           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-blue-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3 relative z-10">TADABBUR HARIAN</div>
              <div className="text-center px-4 relative z-10 mb-4">
                 <p className="text-white text-[11px] leading-relaxed italic mb-2">
                    "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram."
                 </p>
                 <p className="text-[8px] text-[#8F9FB3]">(QS. Ar-Ra'd: 28)</p>
              </div>
              <button className="w-full mt-auto py-1.5 border border-white/10 rounded text-[9px] font-bold tracking-widest text-white hover:bg-white/5 transition-colors relative z-10">
                 LIHAT TADABBUR LENGKAP
              </button>
           </div>

           <div className="bg-[#040C1A] border border-white/5 p-4 rounded-xl flex flex-col">
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3">INTEGRASI & EKSPOR</div>
              <div className="text-[10px] text-[#8F9FB3] mb-4">Sinkronkan, bagikan, atau ekspor koleksi dzikir Anda.</div>
              <div className="grid grid-cols-3 gap-2 flex-1 items-center">
                 <div className="flex flex-col items-center gap-1.5 p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="text-[8px] text-center text-white">Sinkronisasi<br/>Cloud</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-[8px] text-center text-white">Bagikan<br/>QR / Link</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span className="text-[8px] text-center text-white">Ekspor<br/>PDF / TXT</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
