import React, { useState, useEffect } from 'react';
import { 
  Inbox, Atom, FunctionSquare, Lock, Cpu, Languages, 
  TrendingUp, Scale, FlaskConical, Settings, 
  TerminalSquare, X, ChevronRight, Activity, 
  AlertTriangle, CheckCircle, Calendar, ShieldAlert,
  UploadCloud, FileText, Download, Copy, ExternalLink,
  BookOpen, Layers, GitBranch, ArrowLeft, RefreshCw
} from 'lucide-react';

export default function App() {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'burnout', 'far-res', 'paper-deconstructor'
  
  // Paper Deconstructor States
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [deconstructionCompleted, setDeconstructionCompleted] = useState(false);
  const [deconstructorTab, setDeconstructorTab] = useState('summary'); // 'summary', 'formulas', 'citation', 'raw'

  // Vault View States
  const [vaultTab, setVaultTab] = useState('papers'); // 'papers', 'literature', 'synergy', 'timeline'
  const [selectedPaper, setSelectedPaper] = useState('paper1'); // 'paper1', 'paper2', 'paper3', 'paper4'

  // Simulate PDF upload & analysis
  const handleUploadClick = () => {
    setIsFileUploaded(true);
  };

  const handleDeconstruct = () => {
    if (!isFileUploaded) return;
    setIsProcessing(true);
    setProcessingProgress(0);
    setDeconstructionCompleted(false);
  };

  useEffect(() => {
    let interval;
    if (isProcessing) {
      const steps = [
        "Initializing Gemini 2.5 Pro session...",
        "Uploading PDF to Gemini API...",
        "Analyzing PDF layout and content...",
        "Extracting main thesis and methodology...",
        "Parsing LaTeX equations from page 4, 7...",
        "Auto-generating BibTeX citation record...",
        "Finalizing Markdown output structure..."
      ];
      
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          const next = prev + 10;
          const stepIndex = Math.min(steps.length - 1, Math.floor((next / 100) * steps.length));
          setProcessingStatus(steps[stepIndex]);
          
          if (next >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setDeconstructionCompleted(true);
            return 100;
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="flex h-screen w-full bg-bg-primary text-text-primary overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-[240px] bg-[#0A0A0C] border-r border-border-elevated flex flex-col justify-between shrink-0">
        <div className="p-4">
          <div className="font-mono text-lg font-bold mb-8 tracking-wider flex items-end gap-2">
            CORTEX-PRIME <span className="text-[10px] text-text-muted mb-1">v1.0</span>
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              icon={<Inbox size={18} />} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
            />
            <NavItem icon={<Inbox size={18} />} label="00 Inbox" badge="3" />
            
            <div className="pt-4 pb-2 text-[10px] uppercase font-bold tracking-widest text-text-muted">Vaults</div>
            <NavItem icon={<Atom size={18} />} label="Far-Phy" />
            <NavItem icon={<FunctionSquare size={18} />} label="Far-Math" />
            <NavItem icon={<Lock size={18} className="text-accent-red opacity-80" />} label="Far-Sec" />
            <NavItem icon={<Cpu size={18} />} label="Far-AI" />
            <NavItem icon={<Languages size={18} />} label="Far-Lang" />
            <NavItem icon={<TrendingUp size={18} />} label="Far-Econ" />
            <NavItem icon={<Scale size={18} />} label="Far-Law" />
            <NavItem 
              icon={<FlaskConical size={18} />} 
              label="Far-Res" 
              active={currentView === 'far-res'}
              onClick={() => setCurrentView('far-res')}
            />
            
            <div className="pt-4 pb-2 text-[10px] uppercase font-bold tracking-widest text-text-muted">Analytics & Tools</div>
            <NavItem 
              icon={<Activity size={18} />} 
              label="Burnout Radar" 
              active={currentView === 'burnout'} 
              onClick={() => setCurrentView('burnout')} 
            />
            <NavItem 
              icon={<TerminalSquare size={18} />} 
              label="Paper Deconstructor" 
              active={currentView === 'paper-deconstructor'} 
              onClick={() => setCurrentView('paper-deconstructor')} 
            />
            <NavItem icon={<Settings size={18} />} label="09 Meta" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-border-subtle">
          <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary w-full p-2 rounded-md hover:bg-bg-elevated transition-colors">
            <TerminalSquare size={18} />
            <span className="text-sm font-medium">Script Runner</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW SYSTEM */}
      {currentView === 'dashboard' && (
        <>
          {/* CENTER MAIN CONTENT (DASHBOARD) */}
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {/* METRICS ROW */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MetricCard 
                title="Knowledge Nodes" 
                value="847" 
                subtitle="total notes" 
                trend="+12 this week" 
                trendColor="text-accent-green" 
              />
              <MetricCard 
                title="Deep Work Rate" 
                value="67%" 
                subtitle="7-day average" 
                trend="↓ from 74%" 
                valueColor="text-accent-amber"
                trendColor="text-accent-amber" 
                onClick={() => setCurrentView('burnout')}
                hoverable={true}
              />
              <MetricCard 
                title="Papers in Progress" 
                value="4" 
                subtitle="active research" 
                dots={true} 
                onClick={() => setCurrentView('far-res')}
                hoverable={true}
              />
              <MetricCard 
                title="Mastered Concepts" 
                value="213" 
                subtitle="flashcard mastered" 
                valueColor="text-accent-green" 
              />
            </div>

            {/* QUICK CAPTURE WIDGET */}
            <div className="card mb-6 border-border-strong bg-gradient-to-br from-bg-secondary to-[#18181C]">
              <div className="relative">
                <textarea 
                  className="w-full bg-[#0D0D0F] border border-border-subtle rounded-md p-3 text-sm font-mono focus:border-accent-blue focus:outline-none min-h-[100px] resize-none"
                  placeholder="Brain dump here... (Cmd+K)"
                  onClick={() => setIsQuickCaptureOpen(true)}
                ></textarea>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <span className="text-xs text-text-secondary bg-bg-elevated px-2 py-1 rounded border border-border-subtle">Auto-detecting...</span>
                </div>
                <button 
                  className="bg-accent-blue text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                  onClick={() => setIsQuickCaptureOpen(true)}
                >
                  Process & File <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Recent Notes</h2>
                <button className="text-sm text-accent-blue hover:underline">View all &rarr;</button>
              </div>
              <div className="card !p-0 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle bg-bg-elevated text-text-secondary">
                      <th className="p-3 font-medium">Title</th>
                      <th className="p-3 font-medium">Vault</th>
                      <th className="p-3 font-medium">Type</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Energy</th>
                      <th className="p-3 font-medium text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    <TableRow title="Crank-Nicolson derivation" vault="Far-Math" type="knowledge" status="acquired" energy="deep" time="2h ago" />
                    <TableRow title="Setup local LLM Ollama" vault="Far-AI" type="task" status="todo" energy="shallow" time="4h ago" />
                    <TableRow title="CISG Art. 79 Analysis" vault="Far-Law" type="knowledge" status="reviewing" energy="deep" time="1d ago" />
                    <TableRow title="Weekly Review W20" vault="09 Meta" type="daily" status="done" energy="shallow" time="2d ago" />
                    <TableRow title="Quantum Entanglement basics" vault="Far-Phy" type="knowledge" status="mastered" energy="deep" time="3d ago" />
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {/* RIGHT ACTIVITY PANEL */}
          <aside className="w-[280px] bg-bg-secondary border-l border-border-subtle shrink-0 overflow-y-auto p-4 flex flex-col gap-6">
            {/* BURNOUT RADAR WIDGET */}
            <section className="cursor-pointer" onClick={() => setCurrentView('burnout')}>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide flex items-center justify-between">
                <span>Cognitive Load</span>
                <span className="text-text-muted text-xs normal-case tracking-normal">7 days &rarr;</span>
              </h3>
              <div className="card bg-bg-elevated !p-3 hover:border-border-strong transition-all duration-200">
                <div className="flex items-end gap-1 mb-2 h-16">
                  <Bar h="h-4" type="shallow" />
                  <Bar h="h-8" type="deep" />
                  <Bar h="h-12" type="deep" />
                  <Bar h="h-5" type="shallow" />
                  <Bar h="h-3" type="shallow" />
                  <Bar h="h-6" type="deep" />
                  <Bar h="h-2" type="shallow" />
                </div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <span className="text-accent-amber font-mono font-bold">Rate: 67%</span>
                  <span className="text-text-muted">Threshold: 70%</span>
                </div>
                <div className="mt-2 border border-accent-amber/30 bg-accent-amber/10 rounded px-2 py-1.5 text-xs text-accent-amber">
                  2 of 3 days below threshold
                </div>
              </div>
            </section>

            {/* SYNERGY SPARKS */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide">Synergy Sparks</h3>
              <div className="space-y-3">
                <SynergyCard vault1="Far-Math" vault2="Far-AI" text="Bayesian inference ↔ Adversarial ML" sim="0.83" />
                <SynergyCard vault1="Far-Phy" vault2="Far-Res" text="Thermal Sim ↔ Paper 01 Draft" sim="0.79" />
              </div>
            </section>

            {/* TODAY FOCUS */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide">Today Focus</h3>
              <div className="card !p-3 border-l-2 border-l-accent-purple">
                <div className="text-xs text-text-secondary mb-2">Tuesday, May 15</div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-2 h-2 rounded-full bg-accent-purple mt-1.5 shrink-0" />
                    <div className="text-sm">09:00-11:00<br/><span className="text-text-muted">Write methodology</span></div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-2 h-2 rounded-full border border-border-strong mt-1.5 shrink-0" />
                    <div className="text-sm">14:00-16:00<br/><span className="text-text-muted">PDE Simulation</span></div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </>
      )}

      {/* SCREEN 06 — BURNOUT RADAR */}
      {currentView === 'burnout' && (
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex justify-between items-start border-b border-border-subtle pb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">Cognitive Load Report</h1>
                <span className="bg-accent-amber/10 border border-accent-amber/30 text-accent-amber px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={12} /> Warning
                </span>
              </div>
              <div className="text-xs text-text-muted font-mono">
                Generated by burnout_radar.py • Sunday 20:00 auto-run • Week 20, 2026
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="btn-secondary text-xs flex items-center gap-1"
            >
              &larr; Back to Dashboard
            </button>
          </div>

          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard 
              title="Deep Work Sessions" 
              value="11" 
              subtitle="target: 14/week" 
              valueColor="text-accent-red" 
            />
            <MetricCard 
              title="Avg Session Length" 
              value="87 min" 
              subtitle="target: 90 min" 
              valueColor="text-accent-green" 
            />
            <MetricCard 
              title="Knowledge Notes" 
              value="34" 
              subtitle="this week" 
            />
            <MetricCard 
              title="Vault Coverage" 
              value="5/8" 
              subtitle="vaults touched this week" 
            />
          </div>

          {/* TWO COLUMN GRID FOR CHARTS */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* 7-DAY BREAKDOWN CHART (Left 2 cols) */}
            <div className="card col-span-2 flex flex-col justify-between">
              <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wide">7-Day Breakdown</h3>
              
              <div className="space-y-4">
                <DayRow day="Monday" date="May 14" deep={0} shallow={100} />
                <DayRow day="Tuesday" date="May 15" deep={60} shallow={40} />
                <DayRow day="Wednesday" date="May 16" deep={80} shallow={20} />
                <DayRow day="Thursday" date="May 17" deep={75} shallow={25} />
                <DayRow day="Friday" date="May 18" deep={0} shallow={70} />
                <DayRow day="Saturday" date="May 19" deep={50} shallow={30} />
                <DayRow day="Sunday" date="May 20" deep={40} shallow={10} />
              </div>

              <div className="flex gap-4 mt-6 text-xs text-text-secondary border-t border-border-subtle pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-accent-blue rounded-sm" />
                  <span>Deep Work</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#2A2A30] rounded-sm" />
                  <span>Shallow Work</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#141416] border border-border-subtle rounded-sm" />
                  <span>No Work</span>
                </div>
              </div>
            </div>

            {/* VAULT DISTRIBUTION (Right 1 col) */}
            <div className="card flex flex-col">
              <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wide">Vault Distribution</h3>
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <VaultProgress label="Far-Res (Research)" percentage={40} color="bg-accent-blue" />
                <VaultProgress label="Far-Math (Mathematics)" percentage={25} color="bg-accent-purple" />
                <VaultProgress label="Far-Phy (Physics)" percentage={15} color="bg-accent-teal" />
                <VaultProgress label="Far-AI (Artificial Intelligence)" percentage={10} color="bg-accent-green" />
                <VaultProgress label="Others" percentage={10} color="bg-border-strong" />
              </div>
            </div>

          </div>

          {/* ALERT BOX & TRENDS */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* ALERT BOX */}
            <div className="card col-span-2 border-accent-amber/40 bg-accent-amber/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 text-accent-amber">
                  <ShieldAlert size={20} />
                  <span className="font-bold text-sm uppercase tracking-wide">Burnout Risk Detected</span>
                </div>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Bạn đã có <strong>3 ngày liên tiếp (Thứ Hai, Thứ Ba, Thứ Sáu)</strong> có tỷ lệ Deep Work dưới ngưỡng tối thiểu <strong>40%</strong>. Áp lực nhận thức tích lũy đang tăng cao.
                </p>
                <div className="text-xs text-text-secondary space-y-2 bg-bg-primary/50 p-3 rounded border border-border-subtle">
                  <div className="font-semibold text-text-primary">AI Khuyến nghị cho tuần sau:</div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-accent-amber">•</span>
                    <span>Giảm 30% mục tiêu Deep Work (giảm từ 14 xuống 10 blocks).</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-accent-amber">•</span>
                    <span>Thêm 1 ngày nghỉ ngơi hoàn toàn vào Thứ Tư.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-accent-amber">•</span>
                    <span>Ưu tiên: Viết bản thảo Paper 01 (Cực kỳ quan trọng). Trì hoãn: GPU Optimization.</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-4">
                <button className="text-xs text-text-muted hover:text-text-primary px-3 py-2">Dismiss Warning</button>
                <button className="bg-accent-amber text-bg-primary font-bold text-xs px-4 py-2 rounded hover:bg-amber-600 transition-colors">
                  Apply to Next Week Template
                </button>
              </div>
            </div>

            {/* TREND SECTION */}
            <div className="card flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-text-primary uppercase tracking-wide">4-Week Trend</h3>
                <p className="text-xs text-text-secondary">Tỷ lệ Deep work trung bình trong 4 tuần qua đang có xu hướng giảm dần.</p>
              </div>
              
              <div className="h-20 flex items-end gap-3 px-4 my-2">
                <div className="flex-1 bg-accent-blue/30 h-[82%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">82%</div>
                </div>
                <div className="flex-1 bg-accent-blue/30 h-[74%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">74%</div>
                </div>
                <div className="flex-1 bg-accent-blue/30 h-[69%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">69%</div>
                </div>
                <div className="flex-1 bg-accent-amber/40 h-[54%] rounded-t-sm relative group hover:bg-accent-amber/60 transition-colors">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">54%</div>
                </div>
              </div>

              <div className="text-[11px] text-text-muted font-mono text-center border-t border-border-subtle pt-2 mt-2">
                Peak: W17 (82%) &rarr; Current: W20 (54%)
              </div>
            </div>

          </div>
        </main>
      )}

      {/* SCREEN 05 — VAULT VIEW (FAR-RES EXAMPLE) */}
      {currentView === 'far-res' && (
        <main className="flex-1 overflow-hidden flex">
          {/* LEFT CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth flex flex-col gap-6">
            
            {/* HEADER */}
            <div className="flex justify-between items-start border-b border-border-subtle pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                  🔬 Far-Res — Research & Papers
                </h1>
                <div className="text-xs text-text-secondary flex items-center gap-3">
                  <span>4 active papers</span>
                  <span className="text-text-muted">•</span>
                  <span>47 literature notes</span>
                  <span className="text-text-muted">•</span>
                  <span>12 synergy connections</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentView('paper-deconstructor')}
                  className="bg-accent-blue text-white rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <UploadCloud size={14} /> Deconstruct new PDF
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="btn-secondary text-xs"
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-border-subtle gap-2">
              <TabButton label="Papers" active={vaultTab === 'papers'} onClick={() => setVaultTab('papers')} icon={<BookOpen size={14} />} />
              <TabButton label="Literature" active={vaultTab === 'literature'} onClick={() => setVaultTab('literature')} icon={<FileText size={14} />} />
              <TabButton label="Synergy Sparks" active={vaultTab === 'synergy'} onClick={() => setVaultTab('synergy')} icon={<GitBranch size={14} />} />
              <TabButton label="Timeline" active={vaultTab === 'timeline'} onClick={() => setVaultTab('timeline')} icon={<Calendar size={14} />} />
            </div>

            {/* TAB CONTENTS */}
            {vaultTab === 'papers' && (
              <div className="space-y-6">
                {/* 2X2 GRID OF PAPER CARDS */}
                <div className="grid grid-cols-2 gap-4">
                  <PaperProjectCard 
                    id="paper1"
                    num="Paper 01"
                    title="Thermal Simulation via ML and Heat Equation PDEs"
                    progress={60}
                    status="Writing"
                    statusBg="bg-indigo-950 text-indigo-400"
                    tags={["Far-Phy", "Far-Math", "Far-AI"]}
                    modified="3 days ago"
                    selected={selectedPaper === 'paper1'}
                    onClick={() => setSelectedPaper('paper1')}
                  />
                  <PaperProjectCard 
                    id="paper2"
                    num="Paper 02"
                    title="Quantum Entanglement & Bell Inequality Tests"
                    progress={35}
                    status="Literature Review"
                    statusBg="bg-blue-950 text-blue-400"
                    tags={["Far-Phy", "Far-Math"]}
                    modified="1 week ago"
                    selected={selectedPaper === 'paper2'}
                    onClick={() => setSelectedPaper('paper2')}
                  />
                  <PaperProjectCard 
                    id="paper3"
                    num="Paper 03"
                    title="Adversarial Neural Cryptography"
                    progress={90}
                    status="Internal Review"
                    statusBg="bg-stone-800 text-amber-500"
                    tags={["Far-Sec", "Far-AI"]}
                    modified="2 days ago"
                    selected={selectedPaper === 'paper3'}
                    onClick={() => setSelectedPaper('paper3')}
                  />
                  <PaperProjectCard 
                    id="paper4"
                    num="Paper 04"
                    title="Automated Contract Extraction & CISG Rules"
                    progress={10}
                    status="Planning"
                    statusBg="bg-stone-900 text-text-secondary"
                    tags={["Far-Law", "Far-AI"]}
                    modified="2 weeks ago"
                    selected={selectedPaper === 'paper4'}
                    onClick={() => setSelectedPaper('paper4')}
                  />
                </div>

                {/* HORIZONTAL GANTT TIMELINE */}
                <div className="card">
                  <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wide">Project Milestones & Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex border-b border-border-subtle pb-2 text-[10px] font-mono text-text-muted">
                      <div className="w-24 shrink-0 font-semibold text-text-primary">PROJECT</div>
                      <div className="flex-1 flex justify-between">
                        <span>Q3 2026</span>
                        <span>Q4 2026</span>
                        <span>Q1 2027</span>
                        <span>Q2 2027</span>
                      </div>
                    </div>
                    
                    <TimelineRow label="Paper 01" lit="w-[20%]" writing="w-[40%]" review="w-[20%]" submitted="w-[20%]" active="writing" />
                    <TimelineRow label="Paper 02" lit="w-[45%]" writing="w-[25%]" review="w-[15%]" submitted="w-[15%]" active="lit" />
                    <TimelineRow label="Paper 03" lit="w-[10%]" writing="w-[50%]" review="w-[30%]" submitted="w-[10%]" active="review" />
                    <TimelineRow label="Paper 04" lit="w-[70%]" writing="w-[15%]" review="w-[10%]" submitted="w-[5%]" active="lit" />
                  </div>
                  
                  <div className="flex gap-4 mt-6 text-xs text-text-secondary border-t border-border-subtle pt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-accent-blue rounded-sm" />
                      <span>Literature Review</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-accent-purple rounded-sm" />
                      <span>Writing & Drafts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-accent-amber rounded-sm" />
                      <span>Peer Review</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-accent-green rounded-sm" />
                      <span>Submitted & Archive</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {vaultTab === 'literature' && (
              <div className="card">
                <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wide">literature library (47 notes)</h3>
                <div className="space-y-2">
                  <LiteratureItem title="Attention is All You Need" author="Vaswani et al." year="2017" tags={["AI", "Transformer"]} />
                  <LiteratureItem title="Crank-Nicolson Scheme stability" author="Smith, J." year="2021" tags={["Math", "PDE"]} />
                  <LiteratureItem title="CISG Force Majeure Exemptions" author="Schlechtriem, P." year="2015" tags={["Law", "Contract"]} />
                  <LiteratureItem title="Generative Adversarial Cryptography" author="Abadi & Andersen" year="2016" tags={["Sec", "AI"]} />
                </div>
              </div>
            )}

            {vaultTab === 'synergy' && (
              <div className="grid grid-cols-2 gap-4">
                <SynergyCard vault1="Far-Res" vault2="Far-Math" text="Paper 01 (Fluid Flow Simulation) ↔ Navier-Stokes analytical boundaries" sim="0.88" />
                <SynergyCard vault1="Far-Res" vault2="Far-AI" text="Paper 01 (Neural PDE) ↔ Physics-Informed Neural Networks (PINNs)" sim="0.84" />
                <SynergyCard vault1="Far-Res" vault2="Far-Phy" text="Paper 02 (Entanglement) ↔ Bell Inequality local realism models" sim="0.81" />
                <SynergyCard vault1="Far-Res" vault2="Far-Law" text="Paper 04 (CISG Rules) ↔ Smart contract automatic enforcement triggers" sim="0.77" />
              </div>
            )}

            {vaultTab === 'timeline' && (
              <div className="card">
                <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wide">Historical Archive</h3>
                <div className="space-y-4 border-l border-border-subtle pl-4 ml-2">
                  <TimelineHistoryItem date="May 18, 2026" title="Draft v3 compiled for Paper 01" desc="Calculated energy norms for thermal simulation model." />
                  <TimelineHistoryItem date="May 14, 2026" title="Extracted 3 research papers" desc="Processed attention_is_all_you_need.pdf and 2 math PDFs through Paper Deconstructor." />
                  <TimelineHistoryItem date="May 10, 2026" title="Established Zotero sync" desc="Connected BibTeX automatic export hooks to Far-Res library." />
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR (PAPER HEALTH) */}
          <aside className="w-[300px] bg-bg-secondary border-l border-border-subtle shrink-0 p-4 flex flex-col gap-6 overflow-y-auto">
            {/* PAPER HEALTH */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide">
                Paper Health
              </h3>
              
              <div className="card bg-bg-elevated !p-3 space-y-3">
                <div className="text-sm font-bold text-accent-blue">
                  {selectedPaper === 'paper1' && "Paper 01 Status"}
                  {selectedPaper === 'paper2' && "Paper 02 Status"}
                  {selectedPaper === 'paper3' && "Paper 03 Status"}
                  {selectedPaper === 'paper4' && "Paper 04 Status"}
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Word Count Estimate:</span>
                    <span className="font-mono text-text-primary">
                      {selectedPaper === 'paper1' && "~4,200 words"}
                      {selectedPaper === 'paper2' && "~1,800 words"}
                      {selectedPaper === 'paper3' && "~7,100 words"}
                      {selectedPaper === 'paper4' && "~450 words"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Citation Count:</span>
                    <span className="font-mono text-text-primary">
                      {selectedPaper === 'paper1' && "23 collected"}
                      {selectedPaper === 'paper2' && "14 collected"}
                      {selectedPaper === 'paper3' && "31 collected"}
                      {selectedPaper === 'paper4' && "3 collected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">LaTeX Formulas:</span>
                    <span className="font-mono text-text-primary">
                      {selectedPaper === 'paper1' && "8 linked"}
                      {selectedPaper === 'paper2' && "15 linked"}
                      {selectedPaper === 'paper3' && "1 linked"}
                      {selectedPaper === 'paper4' && "0 linked"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Synergy Connections:</span>
                    <span className="font-mono text-accent-teal font-semibold">
                      {selectedPaper === 'paper1' && "5 links"}
                      {selectedPaper === 'paper2' && "2 links"}
                      {selectedPaper === 'paper3' && "1 link"}
                      {selectedPaper === 'paper4' && "4 links"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* RELATED LITERATURE */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide">
                Related Literature
              </h3>
              <div className="space-y-2">
                <RelatedLitCard title="Physics-Informed Neural Nets" sim="0.84" link="Smith et al., 2023" />
                <RelatedLitCard title="Finite Element analysis of heat" sim="0.81" link="Johnson, 2020" />
                <RelatedLitCard title="Sparse grid PDE solvers" sim="0.75" link="Numerical Hub, 2022" />
              </div>
            </section>

            {/* SUGGESTED NEXT ACTION */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-text-primary uppercase tracking-wide">
                AI Suggestion
              </h3>
              <div className="card bg-bg-elevated !p-3 border-l-2 border-l-accent-purple space-y-3">
                <div className="flex items-center gap-1.5 text-accent-purple text-xs font-semibold uppercase tracking-wider">
                  <Activity size={14} /> Recommendation
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedPaper === 'paper1' && "3 literature notes from Far-Math have 0.81+ similarity to your Paper 01. Consider cross-referencing to strengthen mathematical proofs."}
                  {selectedPaper === 'paper2' && "A new paper by Bell et al. (2025) has been detected in Zotero. Use Paper Deconstructor to check for local realism updates."}
                  {selectedPaper === 'paper3' && "Your Adversarial Cryptography draft is 90% complete. Run synergy_spark.py to verify you have covered all security compliance references."}
                  {selectedPaper === 'paper4' && "Add literature notes regarding CISG rules. The paper is currently below critical depth."}
                </p>
                <button 
                  onClick={() => setCurrentView('paper-deconstructor')}
                  className="bg-accent-purple text-white text-xs font-bold w-full py-1.5 rounded hover:bg-purple-600 transition-colors"
                >
                  Run Paper Analysis
                </button>
              </div>
            </section>

          </aside>
        </main>
      )}

      {/* SCREEN 03 — PAPER DECONSTRUCTOR */}
      {currentView === 'paper-deconstructor' && (
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex justify-between items-start border-b border-border-subtle pb-4">
            <div>
              <div className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                CORTEX-PRIME &gt; Far-Res &gt; Tool
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Paper Deconstructor</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="bg-[#2A2A30] text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Gemini 2.5 Pro
                </span>
                <span className="text-[10px] text-text-muted font-mono mt-1">
                  Budget: 1.4M / 1.5M tokens
                </span>
              </div>
              
              <button 
                onClick={() => setCurrentView('far-res')}
                className="btn-secondary text-xs flex items-center gap-1"
              >
                &larr; Back to Research Vault
              </button>
            </div>
          </div>

          {/* TWO COLUMN GRID LAYOUT */}
          <div className="grid grid-cols-5 gap-6 items-start">
            
            {/* LEFT INPUT PANEL (40%) */}
            <div className="card col-span-2 flex flex-col gap-5">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Upload Research Paper
              </h3>
              
              {/* DRAG AND DROP ZONE */}
              {!isFileUploaded ? (
                <div 
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-border-strong hover:border-accent-blue rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group bg-bg-primary/50 transition-all duration-200"
                >
                  <UploadCloud size={40} className="text-text-muted group-hover:text-accent-blue transition-colors" />
                  <div className="text-sm font-medium text-text-primary text-center">
                    Drop PDF here or click to browse
                  </div>
                  <div className="text-xs text-text-muted text-center font-mono">
                    PDF up to 50 pages • Auto-indexed
                  </div>
                </div>
              ) : (
                <div className="border border-border-strong rounded-xl p-4 bg-[#1C1C20] flex items-center gap-3 relative group">
                  <div className="w-12 h-14 bg-bg-primary border border-border-subtle rounded flex items-center justify-center text-text-muted font-mono text-[10px] uppercase font-bold select-none shadow">
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      attention_is_all_you_need.pdf
                    </div>
                    <div className="text-xs text-text-secondary font-mono mt-1 flex gap-2">
                      <span>14.8 MB</span>
                      <span>•</span>
                      <span>15 pages</span>
                      <span>•</span>
                      <span className="text-accent-green font-semibold">✓ Ready</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsFileUploaded(false); 
                      setDeconstructionCompleted(false);
                    }}
                    className="absolute top-2 right-2 text-text-muted hover:text-text-primary"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* EXTRACTION SETTINGS */}
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Extraction Settings
                </div>
                
                <div className="space-y-2">
                  <Checkbox label="Main Arguments & Thesis" checked />
                  <Checkbox label="LaTeX Formulated Proofs" checked />
                  <Checkbox label="Research Gaps & Gaps log" checked />
                  <Checkbox label="Full Document Summary" />
                </div>
              </div>

              {/* VAULT & FORMAT DROPDOWNS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                    Target Vault
                  </label>
                  <select className="bg-bg-primary border border-border-subtle rounded p-2 text-xs text-text-primary w-full focus:outline-none focus:border-accent-blue font-mono">
                    <option>Far-AI (Auto)</option>
                    <option>Far-Phy</option>
                    <option>Far-Math</option>
                    <option>Far-Res</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                    Output Format
                  </label>
                  <select className="bg-bg-primary border border-border-subtle rounded p-2 text-xs text-text-primary w-full focus:outline-none focus:border-accent-blue font-mono">
                    <option>Obsidian Note (.md)</option>
                    <option>Raw JSON</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button 
                onClick={handleDeconstruct}
                disabled={!isFileUploaded || isProcessing}
                className={`w-full py-2.5 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  !isFileUploaded ? 'bg-border-strong text-text-muted cursor-not-allowed' :
                  isProcessing ? 'bg-accent-blue/50 text-white cursor-wait' :
                  'bg-accent-blue text-white hover:bg-blue-600'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Deconstructing...
                  </>
                ) : (
                  <>Deconstruct Paper &rarr;</>
                )}
              </button>

              {/* PROCESSING STATUS INDICATOR */}
              {isProcessing && (
                <div className="space-y-2 border-t border-border-subtle pt-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-secondary">Running extraction</span>
                    <span className="text-accent-blue font-bold">{processingProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
                    <div style={{ width: `${processingProgress}%` }} className="h-full bg-accent-blue rounded-full" />
                  </div>
                  <div className="text-[10px] text-text-muted font-mono animate-pulse">
                    {processingStatus}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT OUTPUT PANEL (60%) */}
            <div className="card col-span-3 min-h-[500px] flex flex-col justify-between">
              
              {/* TOP HEADER */}
              <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                  Extracted Knowledge
                </h3>
                
                {deconstructionCompleted && (
                  <div className="flex gap-2">
                    <button className="text-xs btn-secondary px-2.5 py-1 flex items-center gap-1">
                      <Copy size={12} /> Copy All
                    </button>
                    <button className="text-xs bg-accent-green text-bg-primary font-bold px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600 transition-colors">
                      <Download size={12} /> Save to Vault
                    </button>
                  </div>
                )}
              </div>

              {/* TAB SELECTOR */}
              <div className="flex border-b border-border-subtle gap-2 mb-4">
                <TabButtonMini label="Summary" active={deconstructorTab === 'summary'} onClick={() => setDeconstructorTab('summary')} />
                <TabButtonMini label="Formulas (LaTeX)" active={deconstructorTab === 'formulas'} onClick={() => setDeconstructorTab('formulas')} />
                <TabButtonMini label="Citation (BibTeX)" active={deconstructorTab === 'citation'} onClick={() => setDeconstructorTab('citation')} />
                <TabButtonMini label="Raw JSON" active={deconstructorTab === 'raw'} onClick={() => setDeconstructorTab('raw')} />
              </div>

              {/* DECONSTRUCTED CONTENTS */}
              <div className="flex-1 overflow-y-auto max-h-[360px] text-sm leading-relaxed pr-2 space-y-4">
                {!deconstructionCompleted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-20 gap-2">
                    <FileText size={48} className="opacity-40" />
                    <div className="font-semibold text-text-secondary">No deconstructed data yet</div>
                    <p className="text-xs max-w-xs leading-relaxed">
                      Upload a scientific PDF paper on the left panel and click "Deconstruct" to trigger the Gemini Pro extraction engine.
                    </p>
                  </div>
                ) : (
                  <>
                    {deconstructorTab === 'summary' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-1">Main Thesis</h4>
                          <p className="text-xs text-text-primary">
                            Đề xuất kiến trúc mạng nơ-ron Transformer mới hoàn toàn dựa trên cơ chế Self-Attention (tự chú ý) song song, loại bỏ hoàn toàn các cấu trúc tuần tự Recurrent (RNN) hoặc Convolutional (CNN) truyền thống, giúp tối ưu hóa thời gian tính toán và cải thiện hiệu năng dịch thuật ngôn ngữ.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-1">Methodology</h4>
                          <ul className="list-disc pl-4 text-xs text-text-secondary space-y-1">
                            <li><strong>Scaled Dot-Product Attention:</strong> Tính toán trọng số liên kết giữa các từ khóa dựa trên Query, Key, và Value.</li>
                            <li><strong>Multi-Head Attention:</strong> Chia các vector đại diện thành nhiều đầu (heads) để học thông tin ngữ cảnh chéo tại các không gian con biểu diễn khác nhau.</li>
                            <li><strong>Positional Encoding:</strong> Bổ sung vector vị trí hình sin/cosin để nạp thông tin thứ tự từ vào mạng.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-amber mb-1">Research Gaps Detected</h4>
                          <div className="space-y-2 mt-2">
                            <GapCard 
                              num="Gap 01" 
                              desc="Khả năng xử lý các chuỗi cực dài (O(N²) complexity). Chi phí tính toán tự chú ý tăng bình phương theo độ dài tài liệu đầu vào." 
                              tag="Far-Math"
                            />
                            <GapCard 
                              num="Gap 02" 
                              desc="Thiếu tính tuần tự tự nhiên của ngôn ngữ. Cần pos-encoding phức tạp và kém hiệu quả đối với các cấu trúc ngữ pháp sâu." 
                              tag="Far-Lang"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {deconstructorTab === 'formulas' && (
                      <div className="space-y-4">
                        <div className="text-xs text-text-muted">7 formulas extracted from paper:</div>
                        <FormulaCard 
                          num="Eq. 01"
                          title="Scaled Dot-Product Attention"
                          latex="{\rm Attention}(Q, K, V) = {\rm softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V"
                          desc="Tính toán ma trận phân bổ sự chú ý, chia cho căn bậc hai của số chiều key để tránh gradient triệt tiêu trong lớp Softmax."
                          tag="Far-Math"
                        />
                        <FormulaCard 
                          num="Eq. 02"
                          title="Multi-Head Attention Assembly"
                          latex="{\rm MultiHead}(Q, K, V) = {\rm Concat}({\rm head}_1, ..., {\rm head}_h)W^O"
                          desc="Tổng hợp kết quả học context từ nhiều đầu độc lập để chiếu qua ma trận trọng số ngõ ra."
                          tag="Far-Math"
                        />
                      </div>
                    )}
                    
                    {deconstructorTab === 'citation' && (
                      <div className="space-y-4">
                        <div className="text-xs text-text-muted">Citation metadata:</div>
                        <div className="bg-bg-primary p-3 rounded border border-border-subtle font-mono text-[11px] text-[#C0C0D0] overflow-x-auto whitespace-pre">
{`@inproceedings{vaswani2017attention,
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\L}ukasz and Polosukhin, Illia},
  title     = {Attention is all you need},
  booktitle = {Advances in neural information processing systems},
  pages     = {5998--6008},
  year      = {2017}
}`}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div className="flex flex-col gap-1">
                            <span className="text-text-muted uppercase">DOI</span>
                            <span className="text-text-primary">10.5555/3295222.3295349</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-text-muted uppercase">Year</span>
                            <span className="text-text-primary">2017</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-bg-elevated border border-border-strong text-text-secondary text-xs px-3 py-1.5 rounded hover:text-text-primary flex items-center gap-1.5">
                            <ExternalLink size={12} /> Add directly to Zotero
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {deconstructorTab === 'raw' && (
                      <div className="bg-bg-primary p-3 rounded border border-border-subtle font-mono text-[11px] text-[#C0C0D0] overflow-x-auto whitespace-pre max-h-[300px]">
{`{
  "paper_metadata": {
    "title": "Attention is All You Need",
    "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    "year": 2017,
    "pages": 15
  },
  "extraction_results": {
    "thesis": "Proposal of the Transformer architecture using self-attention...",
    "formulas": [
      {
        "id": "eq_1",
        "name": "Scaled Dot-Product Attention",
        "latex": "Attention(Q,K,V) = softmax(QK^T / \\sqrt{d_k})V"
      }
    ],
    "research_gaps": [
      {
        "id": "gap_1",
        "description": "Quadratic complexity compute limits long sequence handling..."
      }
    ]
  }
}`}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="text-[11px] text-text-muted font-mono pt-3 border-t border-border-subtle flex justify-between">
                <span>Obsidian vault status: synced</span>
                <span>Gemini API engine: ready</span>
              </div>

            </div>

          </div>
        </main>
      )}

      {/* QUICK CAPTURE MODAL */}
      {isQuickCaptureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[720px] bg-bg-elevated border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Quick Capture</h2>
                <span className="bg-[#2A2A30] text-text-secondary text-xs px-1.5 py-0.5 rounded font-mono">⌘K</span>
              </div>
              <button onClick={() => setIsQuickCaptureOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <textarea 
                className="w-full bg-[#0D0D0F] border border-border-subtle rounded-md p-4 text-sm font-mono focus:border-accent-blue focus:outline-none min-h-[180px] resize-none"
                placeholder="Paste text, voice transcript, or raw thoughts here...&#10;&#10;Examples:&#10;• 'Need to implement Crank-Nicolson for heat equation PDE project'&#10;• 'CISG Article 79 exempts force majeure — check against client contract'"
                autoFocus
              ></textarea>
              
              <div className="border border-border-subtle rounded-lg bg-bg-secondary p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
                  <span className="text-xs font-semibold uppercase text-accent-blue tracking-wider">AI Analysis Preview</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-text-muted mb-2 text-xs">Tasks found (1)</div>
                    <div className="flex items-start gap-2 bg-[#1C1C20] p-2 rounded border border-border-subtle">
                      <span className="badge badge-deep shrink-0">Math</span>
                      <span>Implement Crank-Nicolson method</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted mb-2 text-xs">Knowledge found (1)</div>
                    <div className="flex items-start gap-2 bg-[#1C1C20] p-2 rounded border border-border-subtle">
                      <span className="badge badge-acquired shrink-0">Law</span>
                      <span>CISG Article 79 — force majeure</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 bg-bg-secondary border border-border-subtle rounded hover:bg-bg-primary">Energy: <span className="text-accent-purple">Deep</span></button>
                  <button className="text-xs px-3 py-1.5 bg-bg-secondary border border-border-subtle rounded hover:bg-bg-primary">Vault: <span className="text-accent-blue">Auto</span></button>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm px-4 py-2 text-text-secondary hover:text-text-primary" onClick={() => setIsQuickCaptureOpen(false)}>Save Draft</button>
                  <button className="btn-primary flex items-center gap-2">
                    Process & File <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-primary px-4 py-2 border-t border-border-subtle text-[11px] text-text-muted flex justify-between">
              <span>API: Gemini 2.5 Flash • Est. cost: $0.00 • Vault: local</span>
              <span>cortex-prime engine ready</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full p-2 rounded-md transition-colors ${
        active ? 'bg-accent-blue/10 text-accent-blue font-semibold' : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {badge && <span className="bg-accent-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}
    </button>
  );
}

function MetricCard({ title, value, subtitle, trend, trendColor, valueColor = "text-text-primary", dots, onClick, hoverable }) {
  return (
    <div 
      onClick={onClick}
      className={`card flex flex-col justify-between ${onClick ? 'cursor-pointer' : ''} ${
        hoverable ? 'hover:border-border-strong transition-all duration-200' : ''
      }`}
    >
      <div className="text-xs text-text-secondary mb-2 uppercase tracking-wider font-semibold">{title}</div>
      <div className={`text-3xl font-mono font-light mb-1 ${valueColor}`}>{value}</div>
      <div className="flex justify-between items-end mt-2">
        <div className="text-[11px] text-text-muted">{subtitle}</div>
        {trend && <div className={`text-xs font-semibold ${trendColor}`}>{trend}</div>}
        {dots && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-border-strong"></div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableRow({ title, vault, type, status, energy, time }) {
  return (
    <tr className="hover:bg-bg-elevated/50 transition-colors">
      <td className="p-3 text-text-primary font-medium truncate max-w-[200px]">{title}</td>
      <td className="p-3"><span className="text-xs border border-border-strong px-2 py-0.5 rounded text-text-secondary">{vault}</span></td>
      <td className="p-3 text-text-secondary capitalize">{type}</td>
      <td className="p-3">
        <span className={`badge ${
          status === 'acquired' ? 'badge-acquired' :
          status === 'reviewing' ? 'badge-reviewing' :
          status === 'mastered' ? 'badge-mastered' : 'bg-bg-primary border border-border-strong text-text-secondary'
        }`}>{status}</span>
      </td>
      <td className="p-3">
        <span className={`badge ${energy === 'deep' ? 'badge-deep' : 'badge-shallow'}`}>{energy}</span>
      </td>
      <td className="p-3 text-right text-text-muted font-mono">{time}</td>
    </tr>
  );
}

function Bar({ h, type }) {
  const bg = type === 'deep' ? 'bg-accent-blue' : 'bg-[#2A2A30]';
  return <div className={`flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity ${h} ${bg}`}></div>;
}

function SynergyCard({ vault1, vault2, text, sim }) {
  return (
    <div className="bg-bg-elevated border border-border-subtle p-3 rounded-md">
      <div className="flex items-center gap-2 mb-2 text-[10px] uppercase font-bold tracking-wider text-text-muted">
        <span>{vault1}</span>
        <div className="flex-1 h-px bg-accent-teal/30 relative">
          <div className="absolute inset-0 bg-accent-teal/50 blur-[1px]"></div>
        </div>
        <span>{vault2}</span>
      </div>
      <div className="text-sm text-text-primary mb-2 line-clamp-2 leading-snug">{text}</div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-text-secondary">Sim: {sim}</span>
        <button className="text-xs text-accent-teal hover:underline">Link &rarr;</button>
      </div>
    </div>
  );
}

function DayRow({ day, date, deep, shallow }) {
  const deepWidth = `${deep}%`;
  const shallowWidth = `${shallow}%`;
  const total = deep + shallow;
  const noWorkWidth = `${100 - total}%`;
  
  return (
    <div className="flex items-center text-xs">
      <div className="w-24 shrink-0">
        <div className="font-semibold text-text-primary">{day}</div>
        <div className="text-text-muted text-[10px] font-mono">{date}</div>
      </div>
      
      <div className="flex-1 h-6 bg-[#0D0D0F] border border-border-subtle rounded-md overflow-hidden flex">
        {deep > 0 && (
          <div 
            style={{ width: deepWidth }} 
            className="bg-accent-blue h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
          >
            {deep >= 20 && `${deep}%`}
          </div>
        )}
        {shallow > 0 && (
          <div 
            style={{ width: shallowWidth }} 
            className="bg-[#2A2A30] h-full flex items-center justify-center text-[10px] text-text-secondary overflow-hidden"
          >
            {shallow >= 20 && `${shallow}%`}
          </div>
        )}
        {total < 100 && (
          <div 
            style={{ width: noWorkWidth }} 
            className="bg-bg-primary h-full"
          />
        )}
      </div>
    </div>
  );
}

function VaultProgress({ label, percentage, color }) {
  return (
    <div className="text-xs space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="font-semibold text-text-primary">{label}</span>
        <span className="font-mono text-text-muted">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
        <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

// Phase 4 specific subcomponents

function TabButton({ label, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${
        active 
          ? 'border-accent-blue text-accent-blue bg-accent-blue/5' 
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TabButtonMini({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 border-b-2 text-xs font-semibold transition-all ${
        active 
          ? 'border-accent-blue text-accent-blue bg-accent-blue/5' 
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

function Checkbox({ label, checked }) {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-secondary hover:text-text-primary">
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={() => setIsChecked(!isChecked)}
        className="w-3.5 h-3.5 rounded bg-bg-primary border border-border-subtle checked:bg-accent-blue focus:ring-0 focus:ring-offset-0" 
      />
      <span>{label}</span>
    </label>
  );
}

function GapCard({ num, desc, tag }) {
  return (
    <div className="border border-border-subtle rounded p-2.5 bg-bg-secondary flex justify-between items-start gap-4">
      <div className="space-y-1">
        <div className="text-[10px] font-bold text-accent-amber uppercase tracking-wider">{num}</div>
        <p className="text-xs text-text-primary leading-relaxed">{desc}</p>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <span className="badge badge-acquired text-center text-[10px] font-bold px-2 py-0.5">{tag}</span>
        <button className="bg-bg-elevated border border-border-strong text-[10px] font-bold py-1 px-2 rounded hover:text-text-primary">Create Research Note</button>
      </div>
    </div>
  );
}

function FormulaCard({ num, title, latex, desc, tag }) {
  return (
    <div className="border border-border-subtle rounded p-3 bg-bg-secondary space-y-3">
      <div className="flex justify-between items-center border-b border-border-subtle pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">{num}</span>
          <span className="text-xs font-bold text-text-primary">{title}</span>
        </div>
        <span className="badge badge-deep px-2 py-0.5 text-[10px]">{tag}</span>
      </div>
      
      {/* LaTeX formula block */}
      <div className="bg-bg-primary p-4 rounded border border-border-subtle text-center font-mono text-sm text-[#C0C0D0] overflow-x-auto select-all">
        {latex}
      </div>
      
      <div className="flex justify-between items-end">
        <p className="text-xs text-text-secondary max-w-xs">{desc}</p>
        <div className="flex gap-1.5">
          <button className="bg-bg-elevated border border-border-strong text-[10px] font-bold py-1 px-2 rounded hover:text-text-primary flex items-center gap-1">
            <Copy size={10} /> Copy LaTeX
          </button>
          <button className="bg-bg-elevated border border-border-strong text-[10px] font-bold py-1 px-2 rounded hover:text-text-primary flex items-center gap-1">
            <ExternalLink size={10} /> Open in Jupyter
          </button>
        </div>
      </div>
    </div>
  );
}

function PaperProjectCard({ id, num, title, progress, status, statusBg, tags, modified, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`card cursor-pointer flex flex-col justify-between hover:border-border-strong transition-all duration-200 ${
        selected ? 'border-accent-blue bg-bg-elevated' : 'bg-bg-secondary'
      }`}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{num}</span>
          <span className={`badge ${statusBg}`}>{status}</span>
        </div>
        <h4 className="text-sm font-bold text-text-primary leading-snug line-clamp-2 mb-3">
          {title}
        </h4>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-text-secondary">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="h-full bg-accent-blue rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] border-t border-border-subtle/50 pt-2.5">
          <div className="flex gap-1">
            {tags.map(t => (
              <span key={t} className="badge bg-[#1C1C20] text-text-secondary border border-border-subtle">{t}</span>
            ))}
          </div>
          <span className="text-text-muted font-mono">{modified}</span>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ label, lit, writing, review, submitted, active }) {
  return (
    <div className="flex items-center text-xs">
      <div className="w-24 shrink-0 font-semibold text-text-secondary">{label}</div>
      <div className="flex-1 h-6 bg-[#0D0D0F] border border-border-subtle rounded flex overflow-hidden">
        <div style={{ width: lit }} className={`h-full bg-accent-blue/30 border-r border-[#0D0D0F] ${active === 'lit' ? 'bg-accent-blue/80' : ''}`} />
        <div style={{ width: writing }} className={`h-full bg-accent-purple/30 border-r border-[#0D0D0F] ${active === 'writing' ? 'bg-accent-purple/80' : ''}`} />
        <div style={{ width: review }} className={`h-full bg-accent-amber/30 border-r border-[#0D0D0F] ${active === 'review' ? 'bg-accent-amber/80' : ''}`} />
        <div style={{ width: submitted }} className={`h-full bg-accent-green/30 ${active === 'submitted' ? 'bg-accent-green/80' : ''}`} />
      </div>
    </div>
  );
}

function LiteratureItem({ title, author, year, tags }) {
  return (
    <div className="p-3 border border-border-subtle rounded hover:bg-bg-elevated/50 transition-colors flex justify-between items-center text-xs">
      <div>
        <div className="font-semibold text-text-primary">{title}</div>
        <div className="text-text-secondary mt-1 font-mono text-[10px]">{author} ({year})</div>
      </div>
      <div className="flex gap-1">
        {tags.map(t => (
          <span key={t} className="badge badge-acquired">{t}</span>
        ))}
      </div>
    </div>
  );
}

function RelatedLitCard({ title, sim, link }) {
  return (
    <div className="bg-bg-elevated border border-border-subtle p-2.5 rounded text-xs space-y-1 hover:border-border-strong transition-colors cursor-pointer">
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-text-muted font-mono">{link}</span>
        <span className="text-accent-teal font-semibold font-mono">Sim: {sim}</span>
      </div>
      <div className="font-semibold text-text-primary leading-snug truncate">{title}</div>
    </div>
  );
}

function TimelineHistoryItem({ date, title, desc }) {
  return (
    <div className="relative pl-4 text-xs">
      <div className="absolute top-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-border-strong border-2 border-bg-secondary" />
      <div className="text-text-muted font-mono text-[10px] mb-1">{date}</div>
      <div className="font-semibold text-text-primary mb-0.5">{title}</div>
      <p className="text-text-secondary leading-relaxed text-[11px]">{desc}</p>
    </div>
  );
}
