import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import type { CandidateProfile } from "../store/useStore";
import { DEFAULT_ROUND_TEMPLATES, PROGRAMMING_LANGUAGES, type RoundTemplate } from "../lib/roundTemplates";

/* ── Design tokens ── */
const GLASS: React.CSSProperties = {
  background: "rgba(8,19,31,0.9)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
};
const GLASS_INSET: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "12px",
};

const LANGUAGES = [
  { id: "english", flag: "🇺🇸", name: "English" },
  { id: "hindi",   flag: "🇮🇳", name: "Hindi"   },
  { id: "marathi", flag: "🇮🇳", name: "Marathi" },
  { id: "spanish", flag: "🇪🇸", name: "Spanish" },
  { id: "french",  flag: "🇫🇷", name: "French"  },
  { id: "german",  flag: "🇩🇪", name: "German"  },
  { id: "japanese",flag: "🇯🇵", name: "Japanese"},
  { id: "chinese", flag: "🇨🇳", name: "Chinese" },
];

const EMPTY_PROFILE: CandidateProfile = {
  fullName: "", email: "", phone: "", location: "",
  summary: "", skills: "", experience: "", projects: "",
  education: "", certifications: "", linkedin: "", github: "",
};

/* ── Styled input helper ── */
const GlassInput: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; label?: string; emoji?: string;
}> = ({ value, onChange, placeholder, type = "text", label, emoji }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.28)" }}>
          {emoji} {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full rounded-xl text-[11px] font-medium outline-none transition-all placeholder:text-white/15"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused ? "1px solid rgba(24,199,181,0.5)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(24,199,181,0.1)" : "none",
          color: "rgba(255,255,255,0.82)",
          padding: "8px 10px",
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
};

const GlassTextarea: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; label?: string; emoji?: string;
}> = ({ value, onChange, placeholder, rows = 2, label, emoji }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.28)" }}>
          {emoji} {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl text-[11px] font-medium outline-none resize-none leading-relaxed transition-all placeholder:text-white/15"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused ? "1px solid rgba(24,199,181,0.5)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(24,199,181,0.1)" : "none",
          color: "rgba(255,255,255,0.82)",
          padding: "8px 10px",
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
};

export const InterviewSetupPage: React.FC = () => {
  const { setAppScreen, setInterviewSession, settings, updateSettings, savedProfile, setSavedProfile } = useStore();
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition]       = useState("");
  const [language, setLanguage]       = useState("english");
  const [codeLanguage, setCodeLanguage] = useState(settings.language || "python");
  const [rounds, setRounds] = useState<RoundTemplate[]>(settings.roundTemplates?.length ? settings.roundTemplates : DEFAULT_ROUND_TEMPLATES);
  const [selectedRoundId, setSelectedRoundId] = useState(settings.interviewType === "dsa" ? "coding" : settings.interviewType || "general");
  const [newRoundName, setNewRoundName] = useState("");
  const [autoAI, setAutoAI]           = useState(settings.autoAI ?? true);
  const [customInstructions, setCustomInstructions] = useState(settings.customInstructions ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeStatus, setResumeStatus] = useState("");
  const [langOpen, setLangOpen]       = useState(false);
  const [profile, setProfile]         = useState<CandidateProfile>(savedProfile ?? EMPTY_PROFILE);
  const [activeTab, setActiveTab]     = useState<"session" | "rounds" | "profile">("session");

  React.useEffect(() => {
    window.ibuddy.getSavedProfile().then(saved => {
      if (saved) { setProfile(saved); setSavedProfile(saved); }
    }).catch(() => {});
  }, [setSavedProfile]);

  const isReady    = !!(companyName.trim() && position.trim());
  const hasProfile = !!(profile.fullName || profile.skills || profile.experience);
  const setField   = (key: keyof CandidateProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfile(p => ({ ...p, [key]: e.target.value }));
  const selLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  const handleAttachResume = async () => {
    setResumeStatus("Reading resume…");
    try {
      const resume = await window.ibuddy.attachResume();
      if (!resume) { setResumeStatus(""); return; }
      setResumeName(resume.name);
      setResumeText(resume.text);
      setResumeStatus(`${resume.name} attached`);
    } catch (error) {
      setResumeStatus(error instanceof Error ? error.message : "Could not read resume");
    }
  };

  const handleContinue = async () => {
    if (!isReady) return;
    const selectedRound = rounds.find(round => round.id === selectedRoundId) || rounds[0];
    updateSettings({ autoAI, customInstructions, language: codeLanguage, interviewType: selectedRound.id, roundTemplates: rounds });
    if (hasProfile) { setSavedProfile(profile); await window.ibuddy.saveProfile(profile).catch(() => {}); }
    setInterviewSession({
      companyName: companyName.trim(), position: position.trim(),
      language, description: customInstructions.trim(),
      profile: hasProfile ? profile : null,
      roundId: selectedRound.id, roundName: selectedRound.name,
      roundPrompt: selectedRound.prompt, programmingLanguage: codeLanguage,
      jobDescription: jobDescription.trim(), resumeName, resumeText,
    });
    setTimeout(() => window.ibuddy.saveSettings(useStore.getState().settings), 50);
    setAppScreen("api-setup");
  };

  const TABS = [
    { id: "session" as const, icon: "🎯", label: "Session" },
    { id: "rounds" as const, icon: "🧩", label: "Rounds" },
  ];

  return (
    <div
      className="h-screen w-full flex items-center justify-center px-3 py-2 overflow-y-auto"
      style={{ background: "transparent", pointerEvents: "none", userSelect: "none", fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(24,199,181,0.09) 0%, transparent 60%)" }} />

      <motion.div
        data-ibuddy-surface="true"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="no-drag w-full max-w-[370px] flex flex-col gap-2.5 relative z-10"
        style={{ pointerEvents: "auto", WebkitAppRegion: "no-drag" }}
        onMouseEnter={() => window.ibuddy.enableMouse()}
      >
        {/* ── Header ── */}
        <div
          className="drag-region flex items-center justify-between px-0.5 cursor-move"
          style={{ WebkitAppRegion: "drag" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-[13px] flex items-center justify-center text-[17px] shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(24,199,181,0.25), rgba(14,165,164,0.18))",
                border: "1.5px solid rgba(24,199,181,0.4)",
                boxShadow: "0 0 20px rgba(24,199,181,0.25), 0 4px 12px rgba(0,0,0,0.4)",
              }}
            >🎯</div>
            <div>
              <p className="text-[13px] font-black text-white leading-tight">Interview Setup</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: i === 1 ? "20px" : "10px",
                      background: i === 1 ? "rgba(24,199,181,0.8)" : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
                <span className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Step 1/3</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setAppScreen("home")}
            className="flex items-center gap-2 text-[11px] font-extrabold px-3 py-2 rounded-xl transition-all"
            style={{ background: "rgba(24,199,181,0.18)", border: "1px solid rgba(142,232,220,0.45)", color: "rgba(255,255,255,0.92)", boxShadow: "0 3px 12px rgba(0,0,0,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
        </div>

        {/* ── Main Card ── */}
        <div
          className="no-drag w-full rounded-[22px] overflow-hidden"
          style={{ ...GLASS, WebkitAppRegion: "no-drag", pointerEvents: "auto" }}
        >
          {/* Violet accent top */}
          <div className="h-0.5" style={{ background: "linear-gradient(90deg, transparent, rgba(24,199,181,0.7), rgba(14,165,164,0.5), transparent)" }} />

          {/* ── Tabs ── */}
          <div className="flex gap-1.5 px-3 pt-3">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={{
                  background: activeTab === tab.id ? "rgba(24,199,181,0.15)" : "rgba(255,255,255,0.04)",
                  border: activeTab === tab.id ? "1px solid rgba(24,199,181,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  color: activeTab === tab.id ? "#8ee8dc" : "rgba(255,255,255,0.35)",
                  boxShadow: activeTab === tab.id ? "0 0 12px rgba(24,199,181,0.15)" : "none",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "session" ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="no-drag px-3 pt-3 pb-3 flex flex-col gap-3 max-h-[52vh] overflow-y-auto"
                style={{ scrollbarWidth: "none", WebkitAppRegion: "no-drag", overscrollBehavior: "contain" }}
              >
                {/* Company + Position */}
                <div className="grid grid-cols-2 gap-2">
                  <GlassInput value={companyName} onChange={setCompanyName} placeholder="Google, TCS…" label="Company *" emoji="🏢" />
                  <GlassInput value={position} onChange={setPosition} placeholder="SWE, PM…" label="Position *" emoji="💼" />
                </div>

                {/* Language dropdown */}
                <div className="flex flex-col gap-1 relative z-50">
                  <label className="text-[8px] font-black uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                    🌐 Language
                  </label>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: langOpen ? "1px solid rgba(24,199,181,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: langOpen ? "0 0 0 3px rgba(24,199,181,0.1)" : "none",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <span className="flex items-center gap-2 text-[11px] font-semibold">
                      <span>{selLang.flag}</span>{selLang.name}
                    </span>
                    <span className={`text-[8px] transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.3)" }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.12 }}
                        className="absolute top-[calc(100%+4px)] left-0 right-0 rounded-[16px] z-50 p-2"
                        style={{
                          background: "rgba(8,19,31,0.98)",
                          backdropFilter: "blur(24px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
                        }}
                      >
                        <div className="grid grid-cols-2 gap-1">
                          {LANGUAGES.map(l => (
                            <button
                              key={l.id}
                              onClick={() => { setLanguage(l.id); setLangOpen(false); }}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[10px] font-semibold text-left transition-all"
                              style={{
                                background: language === l.id ? "rgba(24,199,181,0.15)" : "transparent",
                                border: language === l.id ? "1px solid rgba(24,199,181,0.3)" : "1px solid transparent",
                                color: language === l.id ? "#8ee8dc" : "rgba(255,255,255,0.55)",
                              }}
                              onMouseEnter={e => { if (language !== l.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                              onMouseLeave={e => { if (language !== l.id) e.currentTarget.style.background = "transparent"; }}
                            >
                              {l.flag} {l.name}
                              {language === l.id && <span className="ml-auto text-[9px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-[0.12em] text-white/30">🧩 Interview Round</label>
                    <select value={selectedRoundId} onChange={e => setSelectedRoundId(e.target.value)}
                      className="rounded-xl px-2.5 py-2.5 text-[10px] outline-none text-white/80 bg-[#17171f] border border-white/10">
                      {rounds.map(round => <option key={round.id} value={round.id}>{round.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-[0.12em] text-white/30">💻 Code Language</label>
                    <select value={codeLanguage} onChange={e => setCodeLanguage(e.target.value)}
                      className="rounded-xl px-2.5 py-2.5 text-[10px] outline-none text-white/80 bg-[#17171f] border border-white/10">
                      {PROGRAMMING_LANGUAGES.map(item => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>

                <GlassTextarea
                  value={jobDescription}
                  onChange={setJobDescription}
                  placeholder="Paste the responsibilities, requirements, and preferred skills…"
                  rows={4}
                  label="Job Description"
                  emoji="📋"
                />

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-[0.12em] text-white/30">📎 Resume</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAttachResume}
                      className="flex-1 rounded-xl px-3 py-2.5 text-[10px] font-bold text-violet-300 bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/20 transition-all">
                      {resumeName ? "Replace Resume" : "Attach PDF, DOCX or TXT"}
                    </button>
                    {resumeName && <button type="button" onClick={() => { setResumeName(""); setResumeText(""); setResumeStatus(""); }}
                      className="rounded-xl px-3 text-[10px] text-red-300 bg-red-500/10 border border-red-500/20">Remove</button>}
                  </div>
                  {resumeStatus && <p className={`text-[8.5px] font-semibold ${resumeText ? "text-green-400/70" : "text-white/35"}`}>{resumeStatus}</p>}
                </div>

                {/* Auto AI toggle */}
                <div
                  className="flex items-center justify-between px-3 py-3 rounded-xl"
                  style={{
                    background: autoAI ? "rgba(24,199,181,0.08)" : "rgba(255,255,255,0.04)",
                    border: autoAI ? "1px solid rgba(24,199,181,0.25)" : "1px solid rgba(255,255,255,0.07)",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <p className="text-[11px] font-bold" style={{ color: autoAI ? "#8ee8dc" : "rgba(255,255,255,0.6)" }}>
                      Auto AI Answer
                    </p>
                    <p className="text-[8.5px] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Responds after silence detected
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoAI(!autoAI)}
                    style={{
                      width: "36px", height: "20px",
                      background: autoAI ? "linear-gradient(135deg, #18c7b5, #0fae9f)" : "rgba(255,255,255,0.08)",
                      boxShadow: autoAI ? "0 0 12px rgba(24,199,181,0.4)" : "none",
                      borderRadius: "999px", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s",
                    }}
                  >
                    <motion.div
                      animate={{ x: autoAI ? 17 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{
                        position: "absolute", top: "3px",
                        width: "14px", height: "14px",
                        borderRadius: "50%", background: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                      }}
                    />
                  </button>
                </div>

                {/* Custom Instructions */}
                <GlassTextarea
                  value={customInstructions}
                  onChange={setCustomInstructions}
                  placeholder="Always write code in Python…"
                  rows={2}
                  label="Custom Instructions"
                  emoji="✏️"
                />
              </motion.div>
            ) : activeTab === "rounds" ? (
              <motion.div key="rounds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="no-drag px-3 pt-3 pb-3 flex flex-col gap-2.5 max-h-[52vh] overflow-y-auto"
                style={{ scrollbarWidth: "none", WebkitAppRegion: "no-drag", overscrollBehavior: "contain" }}>
                <div className="flex gap-2">
                  <input value={newRoundName} onChange={e => setNewRoundName(e.target.value)} placeholder="New round name"
                    className="flex-1 rounded-xl px-3 py-2 text-[10px] outline-none text-white bg-white/[0.04] border border-white/10" />
                  <button onClick={() => {
                    const name = newRoundName.trim();
                    if (!name) return;
                    const id = `custom-${Date.now()}`;
                    setRounds(current => [...current, { id, name, prompt: "Lead with the answer. Add instructions for this round here." }]);
                    setSelectedRoundId(id); setNewRoundName("");
                  }} className="px-3 rounded-xl text-[10px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30">+ Add</button>
                </div>
                {rounds.map(round => (
                  <div key={round.id} className="rounded-xl p-2.5 bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-2">
                      <input value={round.name} onChange={e => setRounds(items => items.map(item => item.id === round.id ? { ...item, name: e.target.value } : item))}
                        className="flex-1 bg-transparent text-[11px] font-bold text-white/80 outline-none" />
                      <button onClick={() => setSelectedRoundId(round.id)} className="text-[9px] text-violet-300">Use</button>
                      {!round.builtIn && <button onClick={() => {
                        setRounds(items => items.filter(item => item.id !== round.id));
                        if (selectedRoundId === round.id) setSelectedRoundId("general");
                      }} className="text-[9px] text-red-400">Delete</button>}
                    </div>
                    <textarea value={round.prompt} rows={7}
                      onChange={e => setRounds(items => items.map(item => item.id === round.id ? { ...item, prompt: e.target.value } : item))}
                      className="w-full resize-y rounded-lg p-2 text-[9px] leading-relaxed outline-none text-white/65 bg-black/20 border border-white/[0.06]" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="no-drag px-3 pt-3 pb-3 flex flex-col gap-2.5 max-h-[52vh] overflow-y-auto"
                style={{ scrollbarWidth: "none", WebkitAppRegion: "no-drag", overscrollBehavior: "contain" }}
              >
                {/* Banner */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{
                    background: hasProfile ? "rgba(24,199,181,0.1)" : "rgba(255,255,255,0.04)",
                    border: hasProfile ? "1px solid rgba(24,199,181,0.25)" : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-[13px]">{hasProfile ? "✓" : "💡"}</span>
                  <p className="text-[9px] font-semibold" style={{ color: hasProfile ? "#8ee8dc" : "rgba(255,255,255,0.38)" }}>
                    {hasProfile ? "Profile saved — AI will speak as you" : "AI will speak as you using your profile info."}
                  </p>
                </div>

                {/* Name / Location / Email / Phone */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "fullName", label: "Name",     emoji: "👤", ph: "Rahul Sharma"   },
                    { key: "location", label: "Location", emoji: "📍", ph: "Pune, India"    },
                    { key: "email",    label: "Email",    emoji: "📧", ph: "you@email.com"  },
                    { key: "phone",    label: "Phone",    emoji: "📱", ph: "+91 98765…"     },
                  ].map(({ key, label, emoji, ph }) => (
                    <GlassInput
                      key={key}
                      value={profile[key as keyof CandidateProfile]}
                      onChange={v => setProfile(p => ({ ...p, [key]: v }))}
                      placeholder={ph}
                      label={label}
                      emoji={emoji}
                    />
                  ))}
                </div>

                {/* Textareas */}
                {[
                  { key: "summary",        label: "Summary",       emoji: "📝", ph: "3+ years full-stack developer…",    rows: 2 },
                  { key: "skills",         label: "Skills",         emoji: "⚡", ph: "React, Node.js, Python, AWS…",      rows: 2 },
                  { key: "experience",     label: "Experience",     emoji: "💼", ph: "SWE @ Infosys (2022–Now)…",        rows: 3 },
                  { key: "projects",       label: "Projects",       emoji: "🚀", ph: "E-Commerce (React+Node)…",         rows: 3 },
                  { key: "education",      label: "Education",      emoji: "🎓", ph: "B.E. CS — SPPU, Pune (2022)",       rows: 1 },
                  { key: "certifications", label: "Certifications", emoji: "🏆", ph: "AWS Developer, GCP…",              rows: 1 },
                ].map(({ key, label, emoji, ph, rows }) => (
                  <GlassTextarea
                    key={key}
                    value={profile[key as keyof CandidateProfile]}
                    onChange={v => setProfile(p => ({ ...p, [key]: v }))}
                    placeholder={ph}
                    rows={rows}
                    label={label}
                    emoji={emoji}
                  />
                ))}

                {/* GitHub + LinkedIn */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "github",   label: "GitHub",   emoji: "🐙", ph: "github.com/you" },
                    { key: "linkedin", label: "LinkedIn",  emoji: "💼", ph: "linkedin.com/in/you" },
                  ].map(({ key, label, emoji, ph }) => (
                    <GlassInput
                      key={key}
                      value={profile[key as keyof CandidateProfile]}
                      onChange={v => setProfile(p => ({ ...p, [key]: v }))}
                      placeholder={ph}
                      label={label}
                      emoji={emoji}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer ── */}
          <div className="px-3 pb-3 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {!isReady && activeTab === "profile" && (
              <p className="text-[8.5px] font-semibold text-center mb-2 flex items-center justify-center gap-1.5" style={{ color: "rgba(251,191,36,0.7)" }}>
                <span>⚠</span> Fill Company & Position in Session tab first
              </p>
            )}
            <motion.button
              whileHover={isReady ? { scale: 1.02, y: -1 } : {}}
              whileTap={isReady ? { scale: 0.97 } : {}}
              onClick={handleContinue} disabled={!isReady}
              className="w-full py-3 rounded-[14px] text-[12px] font-extrabold flex items-center justify-center gap-2 relative overflow-hidden transition-all"
              style={{
                background: isReady ? "linear-gradient(135deg, #18c7b5 0%, #0fae9f 100%)" : "rgba(255,255,255,0.04)",
                color: isReady ? "#fff" : "rgba(255,255,255,0.22)",
                border: isReady ? "none" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isReady ? "0 6px 24px rgba(24,199,181,0.45), 0 1px 0 rgba(255,255,255,0.2) inset" : "none",
                cursor: isReady ? "pointer" : "not-allowed",
              }}
            >
              {isReady && (
                <motion.div
                  className="absolute inset-0 w-1/3"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                  animate={{ x: ["-100%", "400%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative z-10 text-[14px]">{isReady ? "🔑" : "🔒"}</span>
              <span className="relative z-10">{isReady ? "Continue to API Setup →" : "Fill Company & Position first"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
