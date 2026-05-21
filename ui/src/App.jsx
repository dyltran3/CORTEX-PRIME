import React, { useState, useEffect, useRef } from 'react';
import { 
  Inbox, Atom, FunctionSquare, Lock, Cpu, Languages, 
  TrendingUp, Scale, FlaskConical, Settings, 
  TerminalSquare, X, ChevronRight, Activity, AlertTriangle, CheckCircle, Calendar, ShieldAlert,
  UploadCloud, FileText, Download, Copy, ExternalLink,
  BookOpen, Layers, GitBranch, ArrowLeft, RefreshCw,
  LayoutGrid, Monitor, Play, Folder, Clock, Check, Eye,
  Plus, Trash2, Search, Tag, LogIn
} from 'lucide-react';
import './App.css';

// Mock Databases for dynamic interactions
const INITIAL_INBOX_ITEMS = [];

const MOCK_SCRIPTS = [
  { id: 'setup', name: 'setup.py', desc: 'Initialize OS vault directory trees and check connections.', icon: <Settings size={16} /> },
  { id: 'synergy', name: 'synergy_spark.py', desc: 'Scan vaults and map cross-disciplinary note connections.', icon: <GitBranch size={16} /> },
  { id: 'git', name: 'git_backup.py', desc: 'Automate git staging, commit and backup push to GitHub.', icon: <UploadCloud size={16} /> }
];

export default function App() {
  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // System time for clock
  const [systemTime, setSystemTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Background Notification Loop (Check every 5 seconds)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0');
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      setScheduleTasks(prevTasks => {
        let changed = false;
        const updatedTasks = prevTasks.map(task => {
          let updatedTask = { ...task };
          
          // 1. Check STARTED notification
          if (
            !task.isCompleted && 
            !task.notifiedStart && 
            task.date === currentDateStr && 
            task.startTime && 
            currentTimeStr >= task.startTime
          ) {
            updatedTask.notifiedStart = true;
            changed = true;
            triggerToast('STARTED', task.title);
          }

          // 2. Check OVERDUE notification
          const isTaskDatePast = task.date < currentDateStr;
          const isTaskDeadlinePast = task.date === currentDateStr && task.deadlineTime && currentTimeStr > task.deadlineTime;
          
          if (
            !task.isCompleted && 
            !task.notifiedOverdue && 
            (isTaskDatePast || isTaskDeadlinePast)
          ) {
            updatedTask.notifiedOverdue = true;
            changed = true;
            triggerToast('OVERDUE', task.title);
          }

          return updatedTask;
        });

        if (changed) {
          return updatedTasks;
        }
        return prevTasks;
      });
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [scheduleTasks]);

  // Wallpaper settings
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('cortex_prime_wallpaper') || 'nebula'; // 'nebula', 'cyberpunk', 'deepspace'
  });

  // Windows State Manager
  const [windows, setWindows] = useState(() => {
    const saved = localStorage.getItem('cortex_prime_windows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        if (parsed.dashboard && parsed.inbox && parsed.farRes && parsed.schedule) {
          return parsed;
        }
      } catch (e) {
        console.error("Local storage parse error, resetting window settings", e);
      }
    }
    return {
      dashboard: { id: 'dashboard', title: 'Dashboard', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10, x: 60, y: 40, w: 960, h: 630, icon: '📊', theme: 'glow-far-ai' },
      inbox: { id: 'inbox', title: '00 Inbox', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 120, y: 80, w: 760, h: 500, icon: '📥', theme: 'glow-far-phy' },
      schedule: { id: 'schedule', title: '02 Schedule', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 80, y: 50, w: 860, h: 580, icon: '📅', theme: 'glow-far-sec' },
      burnout: { id: 'burnout', title: 'Burnout Radar', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 100, y: 60, w: 1020, h: 650, icon: '☄️', theme: 'glow-far-sec' },
      farRes: { id: 'farRes', title: 'Far-Res (Research Vault)', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 150, y: 70, w: 1060, h: 660, icon: '🔬', theme: 'glow-far-res' },
      deconstructor: { id: 'deconstructor', title: 'Paper Deconstructor', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 200, y: 100, w: 1040, h: 660, icon: '📄', theme: 'glow-far-math' },
      scriptRunner: { id: 'scriptRunner', title: 'Script Runner', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 260, y: 140, w: 720, h: 480, icon: '🐚', theme: 'glow-far-phy' },
      settings: { id: 'settings', title: 'Meta Config (09 Meta)', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 300, y: 180, w: 640, h: 480, icon: '⚙️', theme: 'glow-far-phy' }
    };
  });

  // Save windows states to local storage
  useEffect(() => {
    localStorage.setItem('cortex_prime_windows', JSON.stringify(windows));
  }, [windows]);

  // Save theme settings to local storage
  useEffect(() => {
    localStorage.setItem('cortex_prime_wallpaper', wallpaper);
  }, [wallpaper]);

  // Selected Desktop Icon State
  const [selectedIconId, setSelectedIconId] = useState(null);

  // States to track active window dragging and resizing to disable transition animations (performance optimization)
  const [activeDragId, setActiveDragId] = useState(null);
  const [isResizing, setIsResizing] = useState(null); // stores appId of window currently resizing

  // Aero Peek Show Desktop State: remembers previous window open/minimize states
  const [prevWindowStates, setPrevWindowStates] = useState(null);

  // Helpers for Desktop Icons Click & Double Click behavior
  const handleIconClick = (appId) => {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobile || isTouchDevice) {
      if (appId === 'farRes') {
        setExplorerVault('Far-Res');
      }
      focusWindow(appId);
      setSelectedIconId(null);
    } else {
      setSelectedIconId(appId);
    }
  };

  const handleIconDoubleClick = (appId) => {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isMobile && !isTouchDevice) {
      if (appId === 'farRes') {
        setExplorerVault('Far-Res');
      }
      focusWindow(appId);
      setSelectedIconId(null);
    }
  };

  // Window System Controls
  const getMaxZIndex = () => {
    return Math.max(...Object.values(windows).map(w => w.zIndex || 0), 10);
  };

  const focusWindow = (appId) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map(w => w.zIndex || 0), 10);
      if (prev[appId].zIndex === maxZ && prev[appId].isOpen && !prev[appId].isMinimized) {
        return prev;
      }
      return {
        ...prev,
        [appId]: {
          ...prev[appId],
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1
        }
      };
    });
  };

  const toggleWindow = (appId) => {
    setWindows(prev => {
      const win = prev[appId];
      const maxZ = Math.max(...Object.values(prev).map(w => w.zIndex || 0), 10);
      
      if (win.isOpen) {
        if (win.isMinimized) {
          return {
            ...prev,
            [appId]: { ...win, isMinimized: false, zIndex: maxZ + 1 }
          };
        } else {
          // If clicked and is already top window, minimize it. If open but not focused, focus it!
          const isCurrentlyTop = win.zIndex === maxZ;
          if (isCurrentlyTop) {
            return {
              ...prev,
              [appId]: { ...win, isMinimized: true }
            };
          } else {
            return {
              ...prev,
              [appId]: { ...win, zIndex: maxZ + 1 }
            };
          }
        }
      } else {
        return {
          ...prev,
          [appId]: { ...win, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
        };
      }
    });
  };

  const closeWindow = (appId, e) => {
    e?.stopPropagation();
    setWindows(prev => ({
      ...prev,
      [appId]: { ...prev[appId], isOpen: false }
    }));
  };

  const minimizeWindow = (appId, e) => {
    e?.stopPropagation();
    setWindows(prev => ({
      ...prev,
      [appId]: { ...prev[appId], isMinimized: true }
    }));
  };

  const maximizeWindow = (appId, e) => {
    e?.stopPropagation();
    setWindows(prev => ({
      ...prev,
      [appId]: { ...prev[appId], isMaximized: !prev[appId].isMaximized }
    }));
  };

  // Draggable Handler on Window Header supporting both Mouse and Touch
  const startDrag = (appId, e) => {
    if (windows[appId].isMaximized || isMobile) return;
    
    // Determine if it is a touch event or mouse event
    const isTouch = e.type === 'touchstart';
    const touchObj = isTouch ? e.touches[0] : null;
    
    if (!isTouch) {
      e.preventDefault();
    }
    
    focusWindow(appId);
    setActiveDragId(appId);
    
    const clientX = isTouch ? touchObj.clientX : e.clientX;
    const clientY = isTouch ? touchObj.clientY : e.clientY;
    
    const startX = clientX - windows[appId].x;
    const startY = clientY - windows[appId].y;
    
    const handleMove = (moveX, moveY) => {
      let newX = moveX - startX;
      let newY = moveY - startY;
      
      // Keep headers reachable
      const docW = window.innerWidth;
      const docH = window.innerHeight;
      newX = Math.max(-windows[appId].w + 120, Math.min(newX, docW - 120));
      newY = Math.max(0, Math.min(newY, docH - 120));
      
      setWindows(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          x: newX,
          y: newY
        }
      }));
    };
    
    const onMouseMove = (moveEvent) => {
      handleMove(moveEvent.clientX, moveEvent.clientY);
    };
    
    const onTouchMove = (moveEvent) => {
      if (moveEvent.touches && moveEvent.touches.length > 0) {
        // Prevent default scrolling behavior when dragging window
        if (moveEvent.cancelable) {
          moveEvent.preventDefault();
        }
        handleMove(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
      }
    };
    
    const onMouseUp = () => {
      setActiveDragId(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    const onTouchEnd = () => {
      setActiveDragId(null);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    
    if (isTouch) {
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    } else {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  // Resizing Handler on Window Corner Handle supporting both Mouse and Touch
  const startResize = (appId, e) => {
    if (windows[appId].isMaximized || isMobile) return;
    
    const isTouch = e.type === 'touchstart';
    const touchObj = isTouch ? e.touches[0] : null;
    
    e.stopPropagation(); // Prevent drag/focus event firing on parent elements
    if (!isTouch) {
      e.preventDefault();
    }
    
    focusWindow(appId);
    setIsResizing(appId);
    
    const startWidth = windows[appId].w;
    const startHeight = windows[appId].h;
    
    const clientX = isTouch ? touchObj.clientX : e.clientX;
    const clientY = isTouch ? touchObj.clientY : e.clientY;
    const startX = clientX;
    const startY = clientY;
    
    const handleMove = (moveX, moveY) => {
      const deltaX = moveX - startX;
      const deltaY = moveY - startY;
      
      // Set distinct minimum widths & heights based on app needs
      let minW = 480;
      let minH = 360;
      if (appId === 'dashboard' || appId === 'burnout' || appId === 'farRes' || appId === 'deconstructor') {
        minW = 640;
        minH = 480;
      }
      
      const newW = Math.max(minW, startWidth + deltaX);
      const newH = Math.max(minH, startHeight + deltaY);
      
      setWindows(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          w: newW,
          h: newH
        }
      }));
    };
    
    const onMouseMove = (moveEvent) => {
      handleMove(moveEvent.clientX, moveEvent.clientY);
    };
    
    const onTouchMove = (moveEvent) => {
      if (moveEvent.touches && moveEvent.touches.length > 0) {
        if (moveEvent.cancelable) {
          moveEvent.preventDefault();
        }
        handleMove(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
      }
    };
    
    const onMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    const onTouchEnd = () => {
      setIsResizing(null);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    
    if (isTouch) {
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    } else {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  // Show Desktop Toggle: minimizes all windows or restores their state
  const handleShowDesktop = () => {
    const openActiveApps = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);
    
    if (openActiveApps.length > 0) {
      // Remember which windows were open and their minimization state
      const currentStates = {};
      Object.keys(windows).forEach(key => {
        currentStates[key] = {
          isOpen: windows[key].isOpen,
          isMinimized: windows[key].isMinimized
        };
      });
      setPrevWindowStates(currentStates);
      
      // Minimize all windows
      setWindows(prev => {
        const next = {};
        Object.keys(prev).forEach(key => {
          next[key] = {
            ...prev[key],
            isMinimized: true
          };
        });
        return next;
      });
    } else if (prevWindowStates) {
      // Restore all windows to their previous state
      setWindows(prev => {
        const next = {};
        Object.keys(prev).forEach(key => {
          next[key] = {
            ...prev[key],
            isOpen: prevWindowStates[key].isOpen,
            isMinimized: prevWindowStates[key].isMinimized
          };
        });
        return next;
      });
      setPrevWindowStates(null);
    }
  };

  // Dynamic active window derivation based on max zIndex
  const getActiveWindowId = () => {
    const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);
    if (openWindows.length === 0) return null;
    return openWindows.reduce((maxWin, win) => (win.zIndex > maxWin.zIndex ? win : maxWin), openWindows[0]).id;
  };
  const activeWindowId = getActiveWindowId();

  // State: Start Menu
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // State: Quick Capture & Brain Dump
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [desktopCaptureText, setDesktopCaptureText] = useState("");

  // State: 02 Schedule Manager Data
  const [scheduleTasks, setScheduleTasks] = useState(() => {
    const saved = localStorage.getItem('cortex_prime_schedule');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('cortex_prime_schedule', JSON.stringify(scheduleTasks));
  }, [scheduleTasks]);

  const [availableTags, setAvailableTags] = useState(() => {
    const saved = localStorage.getItem('cortex_prime_tags');
    return saved ? JSON.parse(saved) : ['Far-Math', 'Far-Phy', 'Far-AI', 'Far-Law', 'Deadline', 'Research'];
  });
  useEffect(() => {
    localStorage.setItem('cortex_prime_tags', JSON.stringify(availableTags));
  }, [availableTags]);

  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem('cortex_prime_google_user');
    return saved ? JSON.parse(saved) : null;
  });
  useEffect(() => {
    localStorage.setItem('cortex_prime_google_user', JSON.stringify(googleUser));
  }, [googleUser]);

  // Multi-toast state & helper
  const [toasts, setToasts] = useState([]);
  const triggerToast = (type, title) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, type, title };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // AI Parsing Engine for Brain Dump
  const parseAITask = (text) => {
    const extractedTags = [];
    const textWithoutTags = text.replace(/#([\w\-]+)/g, (match, tagName) => {
      extractedTags.push(tagName);
      return '';
    });

    // Add unique tags to available list if they aren't there
    if (extractedTags.length > 0) {
      setAvailableTags(prev => {
        const next = [...prev];
        extractedTags.forEach(t => {
          if (!next.includes(t)) {
            next.push(t);
          }
        });
        return next;
      });
    }

    // Extract Date keywords or patterns
    let parsedDate = null;
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
    let textWithoutDate = textWithoutTags;
    if (/hôm nay|today/i.test(textWithoutTags)) {
      parsedDate = todayStr;
      textWithoutDate = textWithoutTags.replace(/hôm nay|today/gi, '');
    } else if (/ngày mai|tomorrow/i.test(textWithoutTags)) {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      parsedDate = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');
      textWithoutDate = textWithoutTags.replace(/ngày mai|tomorrow/gi, '');
    } else if (/ngày kia|day after tomorrow/i.test(textWithoutTags)) {
      const dayAfter = new Date();
      dayAfter.setDate(today.getDate() + 2);
      parsedDate = dayAfter.getFullYear() + '-' + String(dayAfter.getMonth() + 1).padStart(2, '0') + '-' + String(dayAfter.getDate()).padStart(2, '0');
      textWithoutDate = textWithoutTags.replace(/ngày kia|day after tomorrow/gi, '');
    } else {
      // Look for DD/MM/YYYY or DD/MM pattern
      const dateMatch = textWithoutTags.match(/\b(\d{1,2})[\/\-](\d{1,2})([\/\-](\d{4}))?\b/);
      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = dateMatch[4] ? parseInt(dateMatch[4]) : today.getFullYear();
        parsedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        textWithoutDate = textWithoutTags.replace(/\b\d{1,2}[\/\-]\d{1,2}([\/\-]\d{4})?\b/g, '');
      } else {
        parsedDate = todayStr; // default
      }
    }

    // Extract Times (patterns like 9h, 09:00, 14h30, 22:00, 15h, 9h30)
    const timeMatches = [];
    const timeRegex = /\b(\d{1,2})[h:](\d{2})?\b/g;
    let timeMatch;
    while ((timeMatch = timeRegex.exec(textWithoutDate)) !== null) {
      const hours = String(timeMatch[1]).padStart(2, '0');
      const minutes = timeMatch[2] ? String(timeMatch[2]).padStart(2, '0') : '00';
      timeMatches.push(`${hours}:${minutes}`);
    }

    let startTime = null;
    let deadlineTime = null;

    if (timeMatches.length === 1) {
      if (/deadline|dl|hạn chót|trước|ends|end/i.test(textWithoutDate)) {
        deadlineTime = timeMatches[0];
      } else {
        startTime = timeMatches[0];
      }
    } else if (timeMatches.length >= 2) {
      timeMatches.sort();
      startTime = timeMatches[0];
      deadlineTime = timeMatches[timeMatches.length - 1];
    }

    // Clean text without time strings
    let cleanedTitle = textWithoutDate.replace(/\b\d{1,2}[h:]\d{0,2}\b/g, '');
    
    // Clean up extra punctuations/spaces
    cleanedTitle = cleanedTitle
      .replace(/deadline|hạn chót|lúc|bắt đầu|start|dl/gi, '')
      .replace(/[\s,\-\:\.\(\)]+/g, ' ')
      .trim();

    if (!cleanedTitle || cleanedTitle.length < 2) {
      cleanedTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    return {
      title: cleanedTitle,
      date: parsedDate,
      startTime: startTime || "",
      deadlineTime: deadlineTime || "",
      tags: extractedTags.length > 0 ? extractedTags : ['Research']
    };
  };

  // Schedule States
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleFilterTab, setScheduleFilterTab] = useState("all");
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    date: "",
    startTime: "",
    deadlineTime: "",
    tags: []
  });
  const [customTagInput, setCustomTagInput] = useState("");

  // Schedule Form & Actions Handler
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) {
      triggerToast('INFO', 'Vui lòng điền tiêu đề công việc!');
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const taskDate = newTaskForm.date || todayStr;
    const task = {
      id: `task_${Date.now()}`,
      title: newTaskForm.title.trim(),
      date: taskDate,
      startTime: newTaskForm.startTime,
      deadlineTime: newTaskForm.deadlineTime,
      tags: newTaskForm.tags.length > 0 ? newTaskForm.tags : ['Research'],
      isCompleted: false,
      notifiedStart: false,
      notifiedOverdue: false
    };

    setScheduleTasks(prev => [task, ...prev]);
    setNewTaskForm({
      title: "",
      date: "",
      startTime: "",
      deadlineTime: "",
      tags: []
    });
    triggerToast('INFO', `Đã tạo công việc "${task.title}" thành công!`);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = scheduleTasks.find(t => t.id === taskId);
    setScheduleTasks(prev => prev.filter(t => t.id !== taskId));
    if (taskToDelete) {
      triggerToast('INFO', `Đã xóa công việc "${taskToDelete.title}"!`);
    }
  };

  const handleToggleTaskComplete = (taskId) => {
    setScheduleTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = !t.isCompleted;
        return { 
          ...t, 
          isCompleted: nextStatus,
          notifiedStart: nextStatus ? t.notifiedStart : false,
          notifiedOverdue: nextStatus ? t.notifiedOverdue : false
        };
      }
      return t;
    }));
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const tag = customTagInput.trim();
    if (!tag) return;
    if (!availableTags.includes(tag)) {
      setAvailableTags(prev => [...prev, tag]);
    }
    if (!newTaskForm.tags.includes(tag)) {
      setNewTaskForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setCustomTagInput("");
    triggerToast('INFO', `Đã thêm tag #${tag}!`);
  };

  // State: 00 Inbox Data
  const [inboxItems, setInboxItems] = useState(INITIAL_INBOX_ITEMS);
  const [selectedInboxItem, setSelectedInboxItem] = useState(INITIAL_INBOX_ITEMS[0]?.id || null);
  const [inboxNotification, setInboxNotification] = useState("");

  const handleFileInboxItem = (itemId, targetVault, energy) => {
    setInboxItems(prev => prev.filter(item => item.id !== itemId));
    const filedItem = inboxItems.find(item => item.id === itemId);
    
    setInboxNotification(`Successfully filed note "${filedItem.title}" to ${targetVault} (${energy})!`);
    setTimeout(() => setInboxNotification(""), 4000);
    
    // Auto-select next item if available
    const remaining = inboxItems.filter(item => item.id !== itemId);
    if (remaining.length > 0) {
      setSelectedInboxItem(remaining[0].id);
    } else {
      setSelectedInboxItem(null);
    }
  };

  // State: Paper Deconstructor View States
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [deconstructionCompleted, setDeconstructionCompleted] = useState(false);
  const [deconstructorTab, setDeconstructorTab] = useState('summary'); // 'summary', 'formulas', 'citation', 'raw'

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

  // State: Vault Explorer (Far-Res) View States
  const [vaultTab, setVaultTab] = useState('papers'); // 'papers', 'literature', 'synergy', 'timeline'
  const [selectedPaper, setSelectedPaper] = useState('paper1'); // 'paper1', 'paper2', 'paper3', 'paper4'
  const [explorerVault, setExplorerVault] = useState('Far-Res'); // Current focused vault folder in Explorer

  // State: Script Runner Terminal Simulation
  const [activeScript, setActiveScript] = useState(null);
  const [scriptLogs, setScriptLogs] = useState([]);
  const [scriptStatus, setScriptStatus] = useState('idle'); // 'idle', 'running', 'completed', 'failed'

  const scriptIntervalRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs to bottom when new logs are added
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [scriptLogs]);

  // Clean up any running interval when the component is unmounted
  useEffect(() => {
    return () => {
      if (scriptIntervalRef.current) {
        clearInterval(scriptIntervalRef.current);
      }
    };
  }, []);

  const handleRunScript = (scriptId) => {
    const script = MOCK_SCRIPTS.find(s => s.id === scriptId);
    if (!script) return;
    
    // Clear any previous running interval to prevent concurrent overlapping executions
    if (scriptIntervalRef.current) {
      clearInterval(scriptIntervalRef.current);
      scriptIntervalRef.current = null;
    }
    
    setActiveScript(script);
    setScriptStatus('running');
    
    const initialLogs = [
      "[INIT] Booting virtual Python 3.11 sandbox...",
      `[INFO] Initializing system script: ${script.name}...`
    ];
    setScriptLogs(initialLogs);

    let logs = [];
    if (scriptId === 'synergy') {
      logs = [
        "[INFO] Connecting to Gemini API (Model: text-embedding-004)...",
        "[INFO] Scanning local Obsidian vaults for updates...",
        "[INFO] Found 847 markdown files across 8 active vaults.",
        "[INFO] Generating vector embeddings for 34 newly modified files...",
        "[SUCCESS] Embedded 34 files in 1.48s (Cache hits: 813 notes)",
        "[INFO] Re-computing Cosine Similarity matrix (847 x 847 nodes)...",
        "[SUCCESS] Matrix computation complete. Identified 3 new highly-relevant Synergy Sparks!",
        "[SPARK] Far-Math ('Crank-Nicolson Scheme stability') ↔ Far-AI ('Physics-Informed Neural Networks') | Sim: 0.88",
        "[SPARK] Far-Phy ('Quantum Entanglement basics') ↔ Far-Res ('Bell Inequality local realism') | Sim: 0.81",
        "[INFO] Injecting backlinks and synergy metadata into frontmatter...",
        "[SUCCESS] Synergy analysis complete. Obsidian vaults are synchronized.",
        "[SUCCESS] Run finished successfully. Output written to vault/09-meta/synergies.md."
      ];
    } else if (scriptId === 'git') {
      logs = [
        "[INFO] Checking local Git repository status at C:\\Users\\TuanAnh\\CORTEX-PRIME...",
        "[INFO] Detected 5 unstaged file modifications and 3 untracked files.",
        "[COMMAND] git add .",
        "[COMMAND] git commit -m \"CORTEX-PRIME Auto-Backup: 2026-05-21 15:52:12\"",
        "[SUCCESS] Local commit successful. Created local tree with SHA-1: 9a2f5db",
        "[COMMAND] git push origin main",
        "[INFO] Connecting to secure remote: https://github.com/dyltran3/CORTEX-PRIME.git...",
        "[SUCCESS] Pushed 8 objects successfully to branch origin/main.",
        "[SUCCESS] Remote backup complete! System state is locked and secured.",
        "[SUCCESS] Run finished successfully."
      ];
    } else {
      logs = [
        "[INFO] Scanning root folder configuration settings...",
        "[SUCCESS] Environment config file (.env) found.",
        "[INFO] Testing connection to Gemini API...",
        "[SUCCESS] Gemini API responded in 380ms. Token credits: 1.4M / 1.5M free tier intact.",
        "[INFO] Testing connection to AnkiConnect daemon on port 8765...",
        "[SUCCESS] AnkiConnect is active and listening.",
        "[INFO] Verifying Obsidian vault subdirectory structure...",
        "[INFO] Directory '00-inbox' exists. Verified.",
        "[INFO] Directory '01-far-phy' exists. Verified.",
        "[INFO] Directory '08-far-res' exists. Verified.",
        "[SUCCESS] All 11 folders successfully analyzed and verified.",
        "[SUCCESS] CORTEX-PRIME setup check finished successfully. System is healthy!"
      ];
    }

    let currentStep = 0;
    const intervalId = setInterval(() => {
      if (currentStep < logs.length) {
        const nextLog = logs[currentStep];
        if (nextLog) {
          setScriptLogs(prev => [...prev, nextLog]);
        }
        currentStep++;
      } else {
        clearInterval(intervalId);
        if (scriptIntervalRef.current === intervalId) {
          scriptIntervalRef.current = null;
        }
        setScriptStatus('completed');
      }
    }, 450);
    
    scriptIntervalRef.current = intervalId;
  };

  // State: Settings Config
  const [settingsForm, setSettingsForm] = useState({
    geminiKey: '••••••••••••••••••••••••••••••••',
    vaultDir: 'C:\\Users\\TuanAnh\\Documents\\ObsidianVault',
    ankiPort: '8765',
    backupInterval: '6'
  });

  const handleDesktopQuickCapture = (e) => {
    e.preventDefault();
    if (!desktopCaptureText.trim()) return;
    
    const text = desktopCaptureText;
    
    // 1. Add new inbox item
    const newItem = {
      id: `inbox_${Date.now()}`,
      title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
      source: 'desktop-widget',
      content: text,
      age: 'Just now',
      energy: 'deep',
      target: 'Far-AI'
    };
    
    setInboxItems(prev => [newItem, ...prev]);
    setSelectedInboxItem(newItem.id);
    
    // 2. AI Parsing Engine to extract Schedule Task
    const parsedTask = parseAITask(text);
    const newScheduleTask = {
      id: `task_${Date.now()}`,
      title: parsedTask.title,
      date: parsedTask.date,
      startTime: parsedTask.startTime,
      deadlineTime: parsedTask.deadlineTime,
      tags: parsedTask.tags,
      isCompleted: false,
      notifiedStart: false,
      notifiedOverdue: false
    };
    
    setScheduleTasks(prev => [newScheduleTask, ...prev]);
    setDesktopCaptureText("");
    
    // Open inbox window
    focusWindow('inbox');
    
    // Trigger stacked info toasts
    triggerToast('INFO', `Đã lưu ghi chép thô vào 00 Inbox!`);
    triggerToast('INFO', `AI trích xuất task: "${parsedTask.title}" và thêm vào 02 Schedule!`);
  };

  return (
    <div 
      onClick={() => setSelectedIconId(null)}
      className={`relative w-screen h-screen overflow-hidden flex flex-col font-sans text-text-primary select-none ${
        wallpaper === 'cyberpunk' ? 'wallpaper-cyberpunk' :
        wallpaper === 'deepspace' ? 'wallpaper-deepspace' : 'wallpaper-nebula'
      }`}
    >
      
      {/* DESKTOP WIDGETS OVERLAY (Giao diện hiển thị trực tiếp trên màn hình nền) */}
      <div className="absolute inset-0 z-0 p-8 flex justify-between pointer-events-none select-text">
        {/* Left column: Circular Burnout SVGs & System status */}
        <div className="w-[352px] flex flex-col gap-6 pt-16 pl-24">
          <div className="glass-panel rounded-xl p-4 pointer-events-auto hover:border-white/20 transition-all duration-300">
            <div className="text-xs uppercase font-bold tracking-widest text-text-secondary mb-2">Cognitive Load</div>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 36 36" className="circular-chart text-accent-amber w-full h-full">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle stroke-accent-amber" strokeDasharray="67, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-display font-light text-text-primary">67%</span>
                <span className="text-[9px] text-text-muted uppercase font-bold">Stable</span>
              </div>
            </div>
            <div className="text-[10px] text-text-secondary text-center font-sans mt-3">
              Burnout Risk: <span className="text-accent-amber font-bold">Warning</span> (Threshold: 70%)
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 pointer-events-auto hover:border-white/20 transition-all duration-300">
            <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2 flex items-center justify-between">
              <span>Cortex Engines</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
            </div>
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-text-muted">Gemini status:</span>
                <span className="text-accent-green font-semibold">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Anki Sync:</span>
                <span className="text-accent-green font-semibold">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Zotero sync:</span>
                <span className="text-text-secondary">Standby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center-bottom area: Digital Clock & Brain Dump Input */}
        <div className="flex-1 flex flex-col justify-between items-center py-12">
          {/* Futuristic Clock */}
          <div className="text-center pt-8">
            <h1 className="text-7xl font-display font-light tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              {systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h1>
            <p className="text-xs uppercase tracking-widest text-text-secondary font-semibold font-sans mt-3">
              {systemTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Quick Brain Dump Desktop Input */}
          <form 
            onSubmit={handleDesktopQuickCapture}
            className="w-full max-w-lg glass-panel rounded-xl p-4 flex flex-col gap-3 pointer-events-auto border-border-strong bg-gradient-to-br from-bg-secondary/40 to-bg-primary/20 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary flex items-center gap-1.5 font-sans">
                <Monitor size={12} /> Instant Brain Dump
              </span>
              <span className="text-[9px] font-sans text-text-muted">Cmd+K anywhere to trigger modal</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                value={desktopCaptureText}
                onChange={(e) => setDesktopCaptureText(e.target.value)}
                placeholder="Type thoughts here... (e.g. Need to implement Navier-Stokes)"
                className="flex-1 bg-black/40 border border-white/5 rounded-md px-3 py-1.5 text-sm font-sans focus:outline-none focus:border-accent-blue/50 text-text-primary placeholder:text-text-muted"
              />
              <button 
                type="submit"
                className="bg-accent-blue/80 text-white rounded-md px-3 hover:bg-accent-blue transition-colors flex items-center justify-center shrink-0"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Recent Synergy Sparks feed */}
        <div className="w-72 flex flex-col pt-16 gap-6">
          <div className="glass-panel rounded-xl p-4 pointer-events-auto hover:border-white/20 transition-all duration-300 flex flex-col h-[320px]">
            <div className="text-xs uppercase font-bold tracking-widest text-text-secondary mb-3 flex items-center gap-1.5 shrink-0">
              <GitBranch size={14} className="text-accent-teal" /> Synergy Sparks Feed
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="border border-white/5 rounded p-2.5 bg-black/20 space-y-1.5">
                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-text-muted">
                  <span>Far-Math</span>
                  <span className="text-accent-teal">Sim: 0.88</span>
                  <span>Far-AI</span>
                </div>
                <div className="text-text-primary leading-snug">
                  Crank-Nicolson derivation ↔ Physics-Informed Neural Nets (PINNs) stability.
                </div>
              </div>

              <div className="border border-white/5 rounded p-2.5 bg-black/20 space-y-1.5">
                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-text-muted">
                  <span>Far-Phy</span>
                  <span className="text-accent-teal">Sim: 0.81</span>
                  <span>Far-Res</span>
                </div>
                <div className="text-text-primary leading-snug">
                  Quantum Entanglement physics ↔ Bell Inequality testing milestones.
                </div>
              </div>

              <div className="border border-white/5 rounded p-2.5 bg-black/20 space-y-1.5">
                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-text-muted">
                  <span>Far-Law</span>
                  <span className="text-accent-teal">Sim: 0.77</span>
                  <span>Far-AI</span>
                </div>
                <div className="text-text-primary leading-snug">
                  CISG Force Majeure rules ↔ Smart contract execution safety nets.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM MULTI-TOAST FLOATING NOTIFICATIONS (Stacked container) */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm pointer-events-none select-none">
        {toasts.map(toast => {
          if (toast.type === 'STARTED') {
            return (
              <div 
                key={toast.id} 
                className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/90 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.35)] text-xs font-mono animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
              >
                <CheckCircle size={18} className="text-emerald-400 shrink-0 animate-bounce" />
                <div className="flex-1 text-emerald-100 font-medium">
                  <span className="text-emerald-400 font-bold uppercase block text-[9px] mb-0.5 tracking-wider">[STARTED]</span>
                  {toast.title} đã bắt đầu!
                </div>
              </div>
            );
          }
          if (toast.type === 'OVERDUE') {
            return (
              <div 
                key={toast.id} 
                className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/40 bg-rose-950/90 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.35)] text-xs font-mono animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
              >
                <AlertTriangle size={18} className="text-rose-400 shrink-0 animate-pulse" />
                <div className="flex-1 text-rose-100 font-medium">
                  <span className="text-rose-400 font-bold uppercase block text-[9px] mb-0.5 tracking-wider">[OVERDUE] WARNING</span>
                  Cảnh báo: {toast.title} đã trễ hạn!
                </div>
              </div>
            );
          }
          // Default INFO/success toast
          return (
            <div 
              key={toast.id} 
              className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-500/35 bg-slate-900/90 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] text-xs font-mono animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
            >
              <CheckCircle size={16} className="text-blue-400 shrink-0" />
              <div className="flex-1 text-slate-100 font-medium">{toast.title}</div>
            </div>
          );
        })}
      </div>

      {/* APP WINDOW SYSTEM CANVAS (Quản lý và hiển thị đa cửa sổ) */}
      <div className="relative w-full h-full flex-1 z-20 pointer-events-none">
        
        {/* ==================== 1. DASHBOARD WINDOW ==================== */}
        {windows.dashboard.isOpen && (
          <WindowContainer
            app={windows.dashboard}
            isMobile={isMobile}
            onClose={(e) => closeWindow('dashboard', e)}
            onMinimize={(e) => minimizeWindow('dashboard', e)}
            onMaximize={(e) => maximizeWindow('dashboard', e)}
            onFocus={() => focusWindow('dashboard')}
            onDragStart={(e) => startDrag('dashboard', e)}
            onResizeStart={(e) => startResize('dashboard', e)}
            onDoubleClick={(e) => maximizeWindow('dashboard', e)}
            isActive={activeWindowId === 'dashboard'}
            isDragging={activeDragId === 'dashboard'}
            isResizing={isResizing === 'dashboard'}
          >
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-6">
              {/* METRICS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  onClick={() => focusWindow('burnout')}
                  hoverable={true}
                />
                <MetricCard 
                  title="Papers in Progress" 
                  value="4" 
                  subtitle="active research" 
                  dots={true} 
                  onClick={() => focusWindow('farRes')}
                  hoverable={true}
                />
                <MetricCard 
                  title="Mastered Concepts" 
                  value="213" 
                  subtitle="flashcard mastered" 
                  valueColor="text-accent-green" 
                />
              </div>

              {/* QUICK CAPTURE TEXTAREA IN DASHBOARD */}
              <div className="card border-border-strong bg-gradient-to-br from-bg-secondary to-[#18181C] p-4 rounded-lg">
                <div className="relative">
                  <textarea 
                    className="w-full bg-[#0D0D0F] border border-border-subtle rounded-md p-3 text-sm font-mono focus:border-accent-blue focus:outline-none min-h-[90px] resize-none"
                    placeholder="Brain dump here... (Cmd+K to open popup)"
                    onClick={() => setIsQuickCaptureOpen(true)}
                    readOnly
                  ></textarea>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-text-muted font-mono">Gemini instant classifier enabled</span>
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
                  <h2 className="text-sm uppercase font-bold tracking-widest text-text-primary">Recent Notes</h2>
                  <button className="text-xs text-accent-blue hover:underline" onClick={() => focusWindow('inbox')}>Manage Inbox &rarr;</button>
                </div>
                <div className="card !p-0 overflow-x-auto rounded-lg">
                  <table className="w-full text-left text-xs border-collapse min-w-[500px]">
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
            </div>
          </WindowContainer>
        )}

        {/* ==================== 2. 00 INBOX WINDOW ==================== */}
        {windows.inbox.isOpen && (
          <WindowContainer
            app={windows.inbox}
            isMobile={isMobile}
            onClose={(e) => closeWindow('inbox', e)}
            onMinimize={(e) => minimizeWindow('inbox', e)}
            onMaximize={(e) => maximizeWindow('inbox', e)}
            onFocus={() => focusWindow('inbox')}
            onDragStart={(e) => startDrag('inbox', e)}
            onResizeStart={(e) => startResize('inbox', e)}
            onDoubleClick={(e) => maximizeWindow('inbox', e)}
            isActive={activeWindowId === 'inbox'}
            isDragging={activeDragId === 'inbox'}
            isResizing={isResizing === 'inbox'}
          >
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row h-full">
              {/* Left pane: Inbox items list */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col overflow-y-auto">
                <div className="p-3 bg-black/10 border-b border-border-subtle flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Inbox Entries</span>
                  <span className="badge bg-[#1C1C20] border border-border-subtle text-text-primary">{inboxItems.length} Notes</span>
                </div>
                
                {inboxItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted">
                    <CheckCircle size={32} className="text-accent-green mb-2 opacity-50" />
                    <div className="text-xs font-semibold text-text-secondary">Inbox is cleared!</div>
                    <p className="text-[10px] mt-1">Excellent work. Dump new ideas directly using the desktop capture.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle flex-1">
                    {inboxItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedInboxItem(item.id)}
                        className={`w-full text-left p-3 text-xs space-y-1.5 transition-colors ${
                          selectedInboxItem === item.id ? 'bg-accent-blue/10 border-l-2 border-accent-blue' : 'hover:bg-bg-elevated/40'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-text-primary truncate">{item.title}</span>
                          <span className="text-[9px] font-mono text-text-muted shrink-0">{item.age}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{item.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-accent-purple uppercase">{item.source}</span>
                          <span className={`badge shrink-0 ${item.energy === 'deep' ? 'badge-deep' : 'badge-shallow'}`}>{item.energy}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right pane: Review & File details */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
                {selectedInboxItem && inboxItems.find(i => i.id === selectedInboxItem) ? (() => {
                  const currentItem = inboxItems.find(i => i.id === selectedInboxItem);
                  return (
                    <div className="flex-col h-full justify-between flex space-y-4">
                      <div className="space-y-3">
                        <div className="border-b border-border-subtle pb-3">
                          <div className="text-[10px] uppercase font-bold tracking-widest text-accent-purple mb-1">Unclassified Idea</div>
                          <h2 className="text-sm font-bold text-text-primary">{currentItem.title}</h2>
                        </div>
                        
                        <div className="bg-black/35 rounded-md p-3 border border-border-subtle text-xs font-mono leading-relaxed whitespace-pre-wrap select-text max-h-[160px] overflow-y-auto">
                          {currentItem.content}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">AI Predicted Vault</label>
                            <span className="badge badge-acquired font-mono font-semibold">{currentItem.target}</span>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Energy Required</label>
                            <span className={`badge font-semibold ${currentItem.energy === 'deep' ? 'badge-deep' : 'badge-shallow'}`}>{currentItem.energy}</span>
                          </div>
                        </div>
                      </div>

                      {/* Filing Controls */}
                      <div className="border-t border-border-subtle pt-4 space-y-3">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Filing Actions</div>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => handleFileInboxItem(currentItem.id, currentItem.target, currentItem.energy)}
                            className="bg-accent-teal text-bg-primary font-bold text-xs px-3 py-1.5 rounded hover:bg-teal-600 transition-colors flex items-center gap-1"
                          >
                            <Check size={14} /> Auto-File to {currentItem.target}
                          </button>
                          
                          <select 
                            onChange={(e) => handleFileInboxItem(currentItem.id, e.target.value, currentItem.energy)}
                            className="bg-[#1C1C20] border border-border-subtle rounded text-[11px] px-2 py-1 focus:outline-none font-mono text-text-secondary"
                            defaultValue=""
                          >
                            <option value="" disabled>Manual Vault Override...</option>
                            <option value="Far-Phy">01 Far-Phy</option>
                            <option value="Far-Math">02 Far-Math</option>
                            <option value="Far-Sec">03 Far-Sec</option>
                            <option value="Far-AI">04 Far-AI</option>
                            <option value="Far-Res">08 Far-Res</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-20">
                    <FileText size={48} className="opacity-20 mb-3" />
                    <div className="text-xs font-semibold text-text-secondary">No item selected</div>
                    <p className="text-[10px] max-w-xs mt-1">Select an inbox entry from the left list to review and file it into a targeted CORTEX-PRIME Vault.</p>
                  </div>
                )}
              </div>
            </div>
          </WindowContainer>
        )}

        {/* ==================== 2.5 02 SCHEDULE WINDOW ==================== */}
        {windows.schedule.isOpen && (() => {
          // Filters tasks according to searching query & active status tab
          const filteredTasks = scheduleTasks.filter(task => {
            // 1. Search filter
            const matchesSearch = !scheduleSearch.trim() || 
              task.title.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
              task.tags.some(t => t.toLowerCase().includes(scheduleSearch.toLowerCase()));

            if (!matchesSearch) return false;

            // 2. Tab filter
            if (scheduleFilterTab === 'all') return true;
            if (scheduleFilterTab === 'done') return task.isCompleted;
            
            // Check if task is overdue
            const today = new Date();
            const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            const nowTimeStr = today.toTimeString().slice(0, 5); // "HH:MM"
            const isOverdue = !task.isCompleted && 
              (task.date < todayStr || (task.date === todayStr && task.deadlineTime && nowTimeStr > task.deadlineTime));

            if (scheduleFilterTab === 'overdue') return isOverdue;
            if (scheduleFilterTab === 'active') return !task.isCompleted && !isOverdue;

            return true;
          });

          // Group tasks by date sorted
          const groupedTasks = filteredTasks.reduce((groups, task) => {
            const date = task.date;
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(task);
            return groups;
          }, {});

          // Sort dates and tasks inside each date by startTime
          const sortedDates = Object.keys(groupedTasks).sort();
          
          return (
            <WindowContainer
              app={windows.schedule}
              isMobile={isMobile}
              onClose={(e) => closeWindow('schedule', e)}
              onMinimize={(e) => minimizeWindow('schedule', e)}
              onMaximize={(e) => maximizeWindow('schedule', e)}
              onFocus={() => focusWindow('schedule')}
              onDragStart={(e) => startDrag('schedule', e)}
              onResizeStart={(e) => startResize('schedule', e)}
              onDoubleClick={(e) => maximizeWindow('schedule', e)}
              isActive={activeWindowId === 'schedule'}
              isDragging={activeDragId === 'schedule'}
              isResizing={isResizing === 'schedule'}
            >
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row h-full font-sans select-text">
                
                {/* LEFT COLUMN: Timeline & Filter */}
                <div className="w-full md:w-[460px] border-b md:border-b-0 md:border-r border-border-subtle flex flex-col overflow-hidden bg-black/15">
                  
                  {/* Search & Filter Header */}
                  <div className="p-4 border-b border-border-subtle bg-black/20 space-y-3 shrink-0">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Dòng thời gian (Timeline)</span>
                      <span className="badge bg-[#1C1C20] border border-border-subtle text-text-primary">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>

                    {/* Search input with Search icon */}
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm công việc, tag..."
                        value={scheduleSearch}
                        onChange={(e) => setScheduleSearch(e.target.value)}
                        className="w-full bg-[#0D0D0F] border border-border-subtle rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-accent-blue placeholder:text-text-muted text-text-primary font-sans"
                      />
                      <div className="absolute left-2.5 top-2.5 text-text-muted">
                        <Search size={13} />
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1.5 p-0.5 bg-black/40 rounded-lg border border-white/5">
                      {['all', 'active', 'overdue', 'done'].map((tab) => {
                        const label = tab === 'all' ? 'Tất cả' :
                                      tab === 'active' ? 'Đang chạy' :
                                      tab === 'overdue' ? 'Quá hạn' : 'Đã xong';
                        return (
                          <button
                            key={tab}
                            onClick={() => setScheduleFilterTab(tab)}
                            className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all duration-150 ${
                              scheduleFilterTab === tab 
                                ? 'bg-accent-blue/15 border border-accent-blue/30 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Task List container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {filteredTasks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-12">
                        <Calendar size={36} className="opacity-25 mb-2" />
                        <div className="text-xs font-semibold text-text-secondary">Không có công việc nào</div>
                        <p className="text-[10px] max-w-[240px] mt-1">Dùng Brain Dump hoặc form bên phải để thêm lịch trình mới.</p>
                      </div>
                    ) : (
                      // Group tasks by date for visual elegance
                      sortedDates.map((dateStr) => {
                        const tasks = groupedTasks[dateStr];
                        tasks.sort((a, b) => {
                          if (!a.startTime) return 1;
                          if (!b.startTime) return -1;
                          return a.startTime.localeCompare(b.startTime);
                        });

                        const today = new Date();
                        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                        
                        const tomorrow = new Date();
                        tomorrow.setDate(today.getDate() + 1);
                        const tomorrowStr = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');

                        let dateLabel = dateStr;
                        if (dateStr === todayStr) {
                          dateLabel = "Hôm nay (Today)";
                        } else if (dateStr === tomorrowStr) {
                          dateLabel = "Ngày mai (Tomorrow)";
                        } else {
                          const [y, m, d] = dateStr.split('-');
                          dateLabel = `${d}/${m}/${y}`;
                        }

                        return (
                          <div key={dateStr} className="space-y-2.5">
                            <div className="text-[9px] uppercase font-bold tracking-widest text-accent-teal/80 flex items-center gap-2">
                              <span>{dateLabel}</span>
                              <div className="flex-1 h-[1px] bg-accent-teal/15" />
                            </div>

                            <div className="space-y-2">
                              {tasks.map(task => {
                                const nowStr = new Date().toTimeString().slice(0, 5); // "HH:MM"
                                const isOverdue = !task.isCompleted && 
                                  (task.date < todayStr || (task.date === todayStr && task.deadlineTime && nowStr > task.deadlineTime));

                                return (
                                  <div 
                                    key={task.id}
                                    className={`p-3 rounded-lg border transition-all duration-200 bg-[#0A0A0C]/60 flex gap-3 items-start justify-between group ${
                                      task.isCompleted 
                                        ? 'border-emerald-500/10 opacity-60 hover:opacity-85' 
                                        : isOverdue 
                                          ? 'border-rose-500/30 bg-rose-950/5 hover:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.03)]' 
                                          : 'border-white/5 hover:border-white/10 hover:bg-[#0E0E12]'
                                    }`}
                                  >
                                    {/* Left: Complete Checkbox */}
                                    <button
                                      onClick={() => handleToggleTaskComplete(task.id)}
                                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        task.isCompleted
                                          ? 'bg-accent-green border-emerald-600 text-bg-primary shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                          : isOverdue
                                            ? 'border-rose-500/40 hover:border-rose-500'
                                            : 'border-white/20 hover:border-white/40'
                                      }`}
                                    >
                                      {task.isCompleted && <Check size={12} strokeWidth={3} />}
                                    </button>

                                    {/* Middle: Content details */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                      <div className="flex flex-col gap-0.5">
                                        <span className={`text-xs font-semibold truncate select-text ${
                                          task.isCompleted ? 'line-through text-text-muted font-normal' : 'text-text-primary'
                                        }`}>
                                          {task.title}
                                        </span>
                                        
                                        {(task.startTime || task.deadlineTime) && (
                                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-secondary">
                                            <Clock size={10} className="text-text-muted" />
                                            <span>
                                              {task.startTime || "--:--"}
                                              {" → "}
                                              {task.deadlineTime ? (
                                                <span className={isOverdue ? 'text-accent-red font-bold animate-pulse' : ''}>
                                                  {task.deadlineTime} {isOverdue && "(QUÁ HẠN!)"}
                                                </span>
                                              ) : "--:--"}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex flex-wrap gap-1">
                                        {task.tags.map(t => (
                                          <span 
                                            key={t}
                                            className="text-[8px] font-bold tracking-wider font-sans uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-text-secondary"
                                          >
                                            #{t}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-text-muted hover:text-accent-red hover:bg-rose-500/10 p-1 rounded opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                      title="Xóa công việc"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Form Creator & Custom Tag Manager */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-black/5">
                  
                  <div className="border-b border-border-subtle pb-3">
                    <h3 className="text-sm font-bold text-text-primary">Thêm công việc thủ công</h3>
                    <p className="text-[10px] text-text-muted font-mono mt-0.5">Lên lịch trình chi tiết và phân loại nhãn công việc</p>
                  </div>

                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Tiêu đề công việc</label>
                      <input 
                        type="text"
                        placeholder="e.g. Xem lại bài báo cáo khoa học..."
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                        className="w-full bg-black/40 border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-accent-blue text-text-primary font-sans"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Ngày thực hiện</label>
                        <input 
                          type="date"
                          value={newTaskForm.date}
                          onChange={(e) => setNewTaskForm({...newTaskForm, date: e.target.value})}
                          className="w-full bg-black/40 border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-accent-blue text-text-primary font-sans font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Giờ bắt đầu</label>
                        <input 
                          type="time"
                          value={newTaskForm.startTime}
                          onChange={(e) => setNewTaskForm({...newTaskForm, startTime: e.target.value})}
                          className="w-full bg-black/40 border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-accent-blue text-text-primary font-sans font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Hạn chót (Deadline)</label>
                        <input 
                          type="time"
                          value={newTaskForm.deadlineTime}
                          onChange={(e) => setNewTaskForm({...newTaskForm, deadlineTime: e.target.value})}
                          className="w-full bg-black/40 border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-accent-blue text-text-primary font-sans font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Chọn nhãn dán (Tags)</label>
                      <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 bg-black/30 rounded border border-border-subtle">
                        {availableTags.map(tag => {
                          const isSelected = newTaskForm.tags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setNewTaskForm(prev => ({
                                    ...prev,
                                    tags: prev.tags.filter(t => t !== tag)
                                  }));
                                } else {
                                  setNewTaskForm(prev => ({
                                    ...prev,
                                    tags: [...prev.tags, tag]
                                  }));
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-sans font-medium uppercase tracking-wider border transition-all ${
                                isSelected 
                                  ? 'bg-accent-blue/15 border-accent-blue/50 text-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.15)] font-semibold' 
                                  : 'bg-transparent border-white/5 text-text-secondary hover:text-text-primary hover:border-white/10'
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent-blue hover:bg-blue-600 transition-colors text-white text-xs font-bold py-2 rounded shadow-[0_0_12px_rgba(59,130,246,0.25)] flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> Thêm vào lịch trình
                    </button>
                  </form>

                  <div className="border-t border-border-subtle pt-4 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <Tag size={12} className="text-accent-teal" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Tạo nhãn mới</span>
                    </div>
                    <form onSubmit={handleAddCustomTag} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. Personal, Study, Urgent..."
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        className="flex-1 bg-black/40 border border-border-subtle rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent-blue text-text-primary font-sans"
                      />
                      <button
                        type="submit"
                        className="bg-transparent border border-accent-teal/40 hover:border-accent-teal text-accent-teal text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center justify-center"
                      >
                        Thêm Tag
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </WindowContainer>
          );
        })()}

        {/* ==================== 3. BURNOUT RADAR WINDOW ==================== */}
        {windows.burnout.isOpen && (
          <WindowContainer
            app={windows.burnout}
            isMobile={isMobile}
            onClose={(e) => closeWindow('burnout', e)}
            onMinimize={(e) => minimizeWindow('burnout', e)}
            onMaximize={(e) => maximizeWindow('burnout', e)}
            onFocus={() => focusWindow('burnout')}
            onDragStart={(e) => startDrag('burnout', e)}
            onResizeStart={(e) => startResize('burnout', e)}
            onDoubleClick={(e) => maximizeWindow('burnout', e)}
            isActive={activeWindowId === 'burnout'}
            isDragging={activeDragId === 'burnout'}
            isResizing={isResizing === 'burnout'}
          >
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-6">
              {/* TOP HEADER */}
              <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-base font-bold tracking-tight">Cognitive Load & Burnout Analytics</h1>
                    <span className="bg-accent-amber/10 border border-accent-amber/30 text-accent-amber px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> Warning
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted font-mono">
                    Generated by burnout_radar.py • Sunday 20:00 Auto-Scan • Week 20, 2026
                  </div>
                </div>
              </div>

              {/* TOP METRICS ROW */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 7-DAY BREAKDOWN CHART (Left 2 cols) */}
                <div className="card md:col-span-2 flex flex-col justify-between p-4 rounded-lg">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-4">7-Day Breakdown</h3>
                  
                  <div className="space-y-4">
                    <DayRow day="Monday" date="May 14" deep={0} shallow={100} />
                    <DayRow day="Tuesday" date="May 15" deep={60} shallow={40} />
                    <DayRow day="Wednesday" date="May 16" deep={80} shallow={20} />
                    <DayRow day="Thursday" date="May 17" deep={75} shallow={25} />
                    <DayRow day="Friday" date="May 18" deep={0} shallow={70} />
                    <DayRow day="Saturday" date="May 19" deep={50} shallow={30} />
                    <DayRow day="Sunday" date="May 20" deep={40} shallow={10} />
                  </div>

                  <div className="flex gap-4 mt-6 text-[10px] text-text-secondary border-t border-border-subtle pt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-accent-blue rounded-sm" />
                      <span>Deep Work</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-[#2A2A30] rounded-sm" />
                      <span>Shallow Work</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-[#141416] border border-border-subtle rounded-sm" />
                      <span>No Work</span>
                    </div>
                  </div>
                </div>

                {/* VAULT DISTRIBUTION (Right 1 col) */}
                <div className="card flex flex-col p-4 rounded-lg">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-4">Vault Distribution</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ALERT BOX */}
                <div className="card md:col-span-2 border-accent-amber/40 bg-accent-amber/5 flex flex-col justify-between p-4 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-accent-amber">
                      <ShieldAlert size={18} />
                      <span className="font-bold text-xs uppercase tracking-wide">Burnout Risk Detected</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      Bạn đã có <strong>3 ngày liên tiếp (Thứ Hai, Thứ Ba, Thứ Sáu)</strong> có tỷ lệ Deep Work dưới ngưỡng tối thiểu <strong>40%</strong>. Áp lực nhận thức tích lũy đang tăng cao.
                    </p>
                    <div className="text-[11px] text-text-secondary space-y-2 bg-bg-primary/50 p-3 rounded border border-border-subtle">
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
                        <span>Ưu tiên: Viết bản thảo Paper 01. Trì hoãn: GPU Optimization.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-4">
                    <button className="text-[10px] text-text-muted hover:text-text-primary px-3 py-2">Dismiss Warning</button>
                    <button className="bg-accent-amber text-bg-primary font-bold text-[10px] px-4 py-2 rounded hover:bg-amber-600 transition-colors">
                      Apply to Next Week Template
                    </button>
                  </div>
                </div>

                {/* TREND SECTION */}
                <div className="card flex flex-col justify-between p-4 rounded-lg">
                  <div>
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-2">4-Week Trend</h3>
                    <p className="text-[11px] text-text-secondary leading-normal">Tỷ lệ Deep work trung bình trong 4 tuần qua đang có xu hướng giảm dần.</p>
                  </div>
                  
                  <div className="h-20 flex items-end gap-3 px-4 my-2">
                    <div className="flex-1 bg-accent-blue/30 h-[82%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">82%</div>
                    </div>
                    <div className="flex-1 bg-accent-blue/30 h-[74%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">74%</div>
                    </div>
                    <div className="flex-1 bg-accent-blue/30 h-[69%] rounded-t-sm relative group hover:bg-accent-blue/60 transition-colors">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">69%</div>
                    </div>
                    <div className="flex-1 bg-accent-amber/40 h-[54%] rounded-t-sm relative group hover:bg-accent-amber/60 transition-colors">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-elevated px-1.5 py-0.5 rounded border border-border-subtle text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">54%</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-muted font-mono text-center border-t border-border-subtle pt-2 mt-2">
                    Peak: W17 (82%) &rarr; Current: W20 (54%)
                  </div>
                </div>
              </div>
            </div>
          </WindowContainer>
        )}

        {/* ==================== 4. VAULT EXPLORER (FAR-RES) WINDOW ==================== */}
        {windows.farRes.isOpen && (
          <WindowContainer
            app={windows.farRes}
            isMobile={isMobile}
            onClose={(e) => closeWindow('farRes', e)}
            onMinimize={(e) => minimizeWindow('farRes', e)}
            onMaximize={(e) => maximizeWindow('farRes', e)}
            onFocus={() => focusWindow('farRes')}
            onDragStart={(e) => startDrag('farRes', e)}
            onResizeStart={(e) => startResize('farRes', e)}
            onDoubleClick={(e) => maximizeWindow('farRes', e)}
            isActive={activeWindowId === 'farRes'}
            isDragging={activeDragId === 'farRes'}
            isResizing={isResizing === 'farRes'}
          >
            <div className="flex-1 overflow-hidden flex h-full">
              {/* Vault Selector Left Navigation */}
              <aside className="w-48 border-r border-border-subtle bg-black/15 flex flex-col justify-between shrink-0">
                <div className="p-3 space-y-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Vault Folders</div>
                  <nav className="space-y-1">
                    <VaultNavItem icon={<Inbox size={14} />} label="00 Inbox" active={explorerVault === '00 Inbox'} onClick={() => { setExplorerVault('00 Inbox'); focusWindow('inbox'); }} />
                    <div className="pt-2 pb-1 text-[9px] uppercase font-bold tracking-widest text-text-muted">Fields</div>
                    <VaultNavItem icon={<Atom size={14} />} label="Far-Phy" active={explorerVault === 'Far-Phy'} onClick={() => setExplorerVault('Far-Phy')} />
                    <VaultNavItem icon={<FunctionSquare size={14} />} label="Far-Math" active={explorerVault === 'Far-Math'} onClick={() => setExplorerVault('Far-Math')} />
                    <VaultNavItem icon={<Lock size={14} />} label="Far-Sec" active={explorerVault === 'Far-Sec'} onClick={() => setExplorerVault('Far-Sec')} />
                    <VaultNavItem icon={<Cpu size={14} />} label="Far-AI" active={explorerVault === 'Far-AI'} onClick={() => setExplorerVault('Far-AI')} />
                    <VaultNavItem icon={<Languages size={14} />} label="Far-Lang" active={explorerVault === 'Far-Lang'} onClick={() => setExplorerVault('Far-Lang')} />
                    <VaultNavItem icon={<FlaskConical size={14} />} label="Far-Res" active={explorerVault === 'Far-Res'} onClick={() => setExplorerVault('Far-Res')} />
                  </nav>
                </div>
                <div className="p-3 border-t border-border-subtle bg-black/5 text-[9px] text-text-muted font-mono text-center">
                  Sync status: OK
                </div>
              </aside>

              {/* Main Content Area depending on selected vault */}
              {explorerVault === 'Far-Res' ? (
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                  {/* LEFT CONTENT AREA */}
                  <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-6">
                    {/* HEADER */}
                    <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                      <div>
                        <h1 className="text-base font-bold tracking-tight mb-1 flex items-center gap-1.5">
                          🔬 Far-Res — Research & Papers
                        </h1>
                        <div className="text-[10px] text-text-secondary flex items-center gap-3">
                          <span>4 active papers</span>
                          <span className="text-text-muted">•</span>
                          <span>47 literature notes</span>
                          <span className="text-text-muted">•</span>
                          <span>12 synergy connections</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => focusWindow('deconstructor')}
                          className="bg-accent-blue text-white rounded px-2.5 py-1.5 text-[10px] font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1"
                        >
                          <UploadCloud size={12} /> Deconstruct PDF
                        </button>
                      </div>
                    </div>

                    {/* TAB SELECTOR */}
                    <div className="flex border-b border-border-subtle gap-2">
                      <TabButton label="Papers" active={vaultTab === 'papers'} onClick={() => setVaultTab('papers')} icon={<BookOpen size={12} />} />
                      <TabButton label="Literature" active={vaultTab === 'literature'} onClick={() => setVaultTab('literature')} icon={<FileText size={12} />} />
                      <TabButton label="Synergy Sparks" active={vaultTab === 'synergy'} onClick={() => setVaultTab('synergy')} icon={<GitBranch size={12} />} />
                      <TabButton label="Timeline" active={vaultTab === 'timeline'} onClick={() => setVaultTab('timeline')} icon={<Calendar size={12} />} />
                    </div>

                    {/* TAB CONTENTS */}
                    {vaultTab === 'papers' && (
                      <div className="space-y-6">
                        {/* 2X2 GRID OF PAPER CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="card p-4 rounded-lg">
                          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-4">Project Milestones & Timeline</h3>
                          <div className="space-y-4">
                            <div className="flex border-b border-border-subtle pb-2 text-[9px] font-mono text-text-muted">
                              <div className="w-20 shrink-0 font-semibold text-text-primary">PROJECT</div>
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
                          
                          <div className="flex gap-4 mt-6 text-[10px] text-text-secondary border-t border-border-subtle pt-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-accent-blue rounded-sm" />
                              <span>Literature Review</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-accent-purple rounded-sm" />
                              <span>Writing & Drafts</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-accent-amber rounded-sm" />
                              <span>Peer Review</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-accent-green rounded-sm" />
                              <span>Submitted</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {vaultTab === 'literature' && (
                      <div className="card p-4 rounded-lg space-y-4">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">literature library (47 notes)</h3>
                        <div className="space-y-2">
                          <LiteratureItem title="Attention is All You Need" author="Vaswani et al." year="2017" tags={["AI", "Transformer"]} />
                          <LiteratureItem title="Crank-Nicolson Scheme stability" author="Smith, J." year="2021" tags={["Math", "PDE"]} />
                          <LiteratureItem title="CISG Force Majeure Exemptions" author="Schlechtriem, P." year="2015" tags={["Law", "Contract"]} />
                          <LiteratureItem title="Generative Adversarial Cryptography" author="Abadi & Andersen" year="2016" tags={["Sec", "AI"]} />
                        </div>
                      </div>
                    )}

                    {vaultTab === 'synergy' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SynergyCard vault1="Far-Res" vault2="Far-Math" text="Paper 01 (Fluid Flow Simulation) ↔ Navier-Stokes analytical boundaries" sim="0.88" />
                        <SynergyCard vault1="Far-Res" vault2="Far-AI" text="Paper 01 (Neural PDE) ↔ Physics-Informed Neural Networks (PINNs)" sim="0.84" />
                        <SynergyCard vault1="Far-Res" vault2="Far-Phy" text="Paper 02 (Entanglement) ↔ Bell Inequality local realism models" sim="0.81" />
                        <SynergyCard vault1="Far-Res" vault2="Far-Law" text="Paper 04 (CISG Rules) ↔ Smart contract automatic enforcement triggers" sim="0.77" />
                      </div>
                    )}

                    {vaultTab === 'timeline' && (
                      <div className="card p-4 rounded-lg">
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-4">Historical Archive</h3>
                        <div className="space-y-4 border-l border-border-subtle pl-4 ml-2">
                          <TimelineHistoryItem date="May 18, 2026" title="Draft v3 compiled for Paper 01" desc="Calculated energy norms for thermal simulation model." />
                          <TimelineHistoryItem date="May 14, 2026" title="Extracted 3 research papers" desc="Processed attention_is_all_you_need.pdf through Paper Deconstructor." />
                          <TimelineHistoryItem date="May 10, 2026" title="Established Zotero sync" desc="Connected BibTeX automatic export hooks to Far-Res library." />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDEBAR (PAPER HEALTH) */}
                  <aside className="w-full md:w-64 bg-black/10 border-t md:border-t-0 md:border-l border-border-subtle shrink-0 p-4 flex flex-col gap-5 overflow-y-auto">
                    <section>
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-2">Paper Health</h3>
                      <div className="card bg-[#1C1C20]/40 p-3 rounded-lg space-y-3">
                        <div className="text-xs font-bold text-accent-blue">
                          {selectedPaper === 'paper1' && "Paper 01 Status"}
                          {selectedPaper === 'paper2' && "Paper 02 Status"}
                          {selectedPaper === 'paper3' && "Paper 03 Status"}
                          {selectedPaper === 'paper4' && "Paper 04 Status"}
                        </div>
                        <div className="space-y-2 text-[11px] font-mono">
                          <div className="flex justify-between">
                            <span className="text-text-muted">Words:</span>
                            <span className="text-text-primary">
                              {selectedPaper === 'paper1' && "~4,200 words"}
                              {selectedPaper === 'paper2' && "~1,800 words"}
                              {selectedPaper === 'paper3' && "~7,100 words"}
                              {selectedPaper === 'paper4' && "~450 words"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-muted">Citations:</span>
                            <span className="text-text-primary">
                              {selectedPaper === 'paper1' && "23 items"}
                              {selectedPaper === 'paper2' && "14 items"}
                              {selectedPaper === 'paper3' && "31 items"}
                              {selectedPaper === 'paper4' && "3 items"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-muted">Formulas:</span>
                            <span className="text-text-primary">
                              {selectedPaper === 'paper1' && "8 linked"}
                              {selectedPaper === 'paper2' && "15 linked"}
                              {selectedPaper === 'paper3' && "1 linked"}
                              {selectedPaper === 'paper4' && "0 linked"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-2 font-mono">AI Suggestions</h3>
                      <div className="card bg-accent-purple/5 border-accent-purple/20 p-3 rounded-lg text-[11px] leading-relaxed text-text-secondary space-y-2">
                        <div className="flex items-center gap-1 text-accent-purple font-bold uppercase tracking-wider text-[9px]">
                          <Activity size={10} /> Recommendation
                        </div>
                        <p>
                          {selectedPaper === 'paper1' && "3 literature notes from Far-Math have 0.81+ similarity to your Paper 01. Consider cross-referencing to strengthen mathematical proofs."}
                          {selectedPaper === 'paper2' && "A new paper by Bell et al. (2025) has been detected in Zotero. Use Paper Deconstructor to check for local realism updates."}
                          {selectedPaper === 'paper3' && "Your Adversarial Cryptography draft is 90% complete. Run synergy_spark.py to verify you have covered all security compliance references."}
                          {selectedPaper === 'paper4' && "Add literature notes regarding CISG rules. The paper is currently below critical depth."}
                        </p>
                      </div>
                    </section>
                  </aside>
                </div>
              ) : (
                // Display for other empty vaults
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted select-text">
                  <Folder size={48} className="opacity-25 mb-2" />
                  <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">{explorerVault} Vault Directory</div>
                  <p className="text-xs max-w-sm mt-1">Obsidian local subdirectory: <code>vault/0{explorerVault === 'Far-Phy' ? '1' : explorerVault === 'Far-Math' ? '2' : explorerVault === 'Far-Sec' ? '3' : explorerVault === 'Far-AI' ? '4' : '5'}-{explorerVault.toLowerCase()}/</code></p>
                  <div className="mt-4 flex gap-2 pointer-events-auto">
                    <button className="bg-bg-elevated border border-border-strong text-xs font-semibold px-3 py-1.5 rounded hover:text-text-primary">Open in VS Code</button>
                    <button className="bg-bg-elevated border border-border-strong text-xs font-semibold px-3 py-1.5 rounded hover:text-text-primary">Scan folder</button>
                  </div>
                </div>
              )}
            </div>
          </WindowContainer>
        )}

        {/* ==================== 5. PAPER DECONSTRUCTOR WINDOW ==================== */}
        {windows.deconstructor.isOpen && (
          <WindowContainer
            app={windows.deconstructor}
            isMobile={isMobile}
            onClose={(e) => closeWindow('deconstructor', e)}
            onMinimize={(e) => minimizeWindow('deconstructor', e)}
            onMaximize={(e) => maximizeWindow('deconstructor', e)}
            onFocus={() => focusWindow('deconstructor')}
            onDragStart={(e) => startDrag('deconstructor', e)}
            onResizeStart={(e) => startResize('deconstructor', e)}
            onDoubleClick={(e) => maximizeWindow('deconstructor', e)}
            isActive={activeWindowId === 'deconstructor'}
            isDragging={activeDragId === 'deconstructor'}
            isResizing={isResizing === 'deconstructor'}
          >
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-6">
              {/* HEADER */}
              <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                <div>
                  <div className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-0.5">
                    CORTEX-PRIME &gt; Far-Res &gt; Deconstruction Engine
                  </div>
                  <h1 className="text-base font-bold tracking-tight">Paper Deconstructor</h1>
                </div>
                
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col text-xs font-mono">
                    <span className="bg-[#2A2A30] text-text-secondary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Gemini 2.5 Pro
                    </span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                
                {/* LEFT INPUT PANEL (40%) */}
                <div className="card md:col-span-2 flex flex-col gap-4 p-4 rounded-lg">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                    Upload Scientific PDF
                  </h3>
                  
                  {/* DRAG AND DROP ZONE */}
                  {!isFileUploaded ? (
                    <div 
                      onClick={handleUploadClick}
                      className="border-2 border-dashed border-border-strong hover:border-accent-blue rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer group bg-bg-primary/50 transition-all duration-200"
                    >
                      <UploadCloud size={32} className="text-text-muted group-hover:text-accent-blue transition-colors" />
                      <div className="text-xs font-medium text-text-primary text-center">
                        Drop PDF here or click to browse
                      </div>
                      <div className="text-[10px] text-text-muted text-center font-mono">
                        PDF limit: 50 pages • Auto-structured
                      </div>
                    </div>
                  ) : (
                    <div className="border border-border-strong rounded-xl p-3 bg-[#1C1C20] flex items-center gap-3 relative group">
                      <div className="w-10 h-12 bg-bg-primary border border-border-subtle rounded flex items-center justify-center text-text-muted font-mono text-[9px] uppercase font-bold select-none shadow">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          attention_is_all_you_need.pdf
                        </div>
                        <div className="text-[10px] text-text-secondary font-mono mt-0.5 flex gap-2">
                          <span>14.8 MB</span>
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
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* EXTRACTION SETTINGS */}
                  <div className="space-y-3 border-t border-border-subtle pt-3 text-xs">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Extraction Parameters
                    </div>
                    <div className="space-y-2">
                      <Checkbox label="Main Arguments & Thesis" checked />
                      <Checkbox label="LaTeX Formulated Proofs" checked />
                      <Checkbox label="Research Gaps & Gaps log" checked />
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <button 
                    onClick={handleDeconstruct}
                    disabled={!isFileUploaded || isProcessing}
                    className={`w-full py-2 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                      !isFileUploaded ? 'bg-border-strong text-text-muted cursor-not-allowed' :
                      isProcessing ? 'bg-accent-blue/50 text-white cursor-wait' :
                      'bg-accent-blue text-white hover:bg-blue-600'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Deconstructing...
                      </>
                    ) : (
                      <>Deconstruct Paper &rarr;</>
                    )}
                  </button>

                  {/* PROCESSING STATUS INDICATOR */}
                  {isProcessing && (
                    <div className="space-y-2 border-t border-border-subtle pt-3">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-text-secondary">AI parsing</span>
                        <span className="text-accent-blue font-bold">{processingProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
                        <div style={{ width: `${processingProgress}%` }} className="h-full bg-accent-blue rounded-full" />
                      </div>
                      <div className="text-[9px] text-text-muted font-mono animate-pulse">
                        {processingStatus}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT OUTPUT PANEL (60%) */}
                <div className="card md:col-span-3 min-h-[350px] flex flex-col justify-between p-4 rounded-lg">
                  <div className="flex flex-col flex-1">
                    {/* TOP HEADER */}
                    <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3 shrink-0">
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                        Extracted Knowledge Node
                      </h3>
                      
                      {deconstructionCompleted && (
                        <div className="flex gap-2">
                          <button className="text-[10px] btn-secondary px-2 py-1 flex items-center gap-1">
                            <Copy size={12} /> Copy
                          </button>
                          <button className="text-[10px] bg-accent-green text-bg-primary font-bold px-2.5 py-1 rounded flex items-center gap-1 hover:bg-green-600 transition-colors">
                            <Download size={12} /> Sync to Vault
                          </button>
                        </div>
                      )}
                    </div>

                    {/* TAB SELECTOR */}
                    <div className="flex border-b border-border-subtle gap-2 mb-3 shrink-0">
                      <TabButtonMini label="Summary" active={deconstructorTab === 'summary'} onClick={() => setDeconstructorTab('summary')} />
                      <TabButtonMini label="Formulas (LaTeX)" active={deconstructorTab === 'formulas'} onClick={() => setDeconstructorTab('formulas')} />
                      <TabButtonMini label="Citation (BibTeX)" active={deconstructorTab === 'citation'} onClick={() => setDeconstructorTab('citation')} />
                    </div>

                    {/* DECONSTRUCTED CONTENTS */}
                    <div className="flex-1 overflow-y-auto max-h-[220px] text-xs leading-relaxed pr-1 space-y-4 select-text">
                      {!deconstructionCompleted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-12 gap-2">
                          <FileText size={40} className="opacity-20" />
                          <div className="font-semibold text-text-secondary text-xs">No analysis computed yet</div>
                          <p className="text-[10px] max-w-xs leading-normal">
                            Upload a scientific PDF paper on the left panel and click "Deconstruct Paper" to trigger the local Gemini pipeline.
                          </p>
                        </div>
                      ) : (
                        <>
                          {deconstructorTab === 'summary' && (
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-accent-blue mb-1">Main Thesis</h4>
                                <p>
                                  Đề xuất kiến trúc mạng nơ-ron Transformer mới hoàn toàn dựa trên cơ chế Self-Attention (tự chú ý) song song, loại bỏ hoàn toàn các cấu trúc tuần tự Recurrent (RNN) hoặc Convolutional (CNN) truyền thống, giúp tối ưu hóa thời gian tính toán và cải thiện hiệu năng dịch thuật ngôn ngữ.
                                </p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-accent-purple mb-1">Methodology</h4>
                                <ul className="list-disc pl-4 text-text-secondary space-y-1">
                                  <li><strong>Scaled Dot-Product Attention:</strong> Tính toán trọng số liên kết giữa các từ khóa dựa trên Query, Key, và Value.</li>
                                  <li><strong>Multi-Head Attention:</strong> Chia các vector đại diện thành nhiều đầu (heads) để học thông tin ngữ cảnh chéo.</li>
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {deconstructorTab === 'formulas' && (
                            <div className="space-y-3">
                              <FormulaCard 
                                num="Eq. 01"
                                title="Scaled Dot-Product Attention"
                                latex="{\rm Attention}(Q, K, V) = {\rm softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V"
                                desc="Tính toán ma trận phân bổ sự chú ý, chia cho căn bậc hai của số chiều key."
                                tag="Far-Math"
                              />
                            </div>
                          )}
                          
                          {deconstructorTab === 'citation' && (
                            <div className="space-y-3">
                              <div className="bg-bg-primary p-2.5 rounded border border-border-subtle font-mono text-[10px] text-[#C0C0D0] overflow-x-auto whitespace-pre">
{`@inproceedings{vaswani2017attention,
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki},
  title     = {Attention is all you need},
  booktitle = {Advances in neural information processing systems},
  pages     = {5998--6008},
  year      = {2017}
}`}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-text-muted font-mono pt-2 border-t border-border-subtle flex justify-between shrink-0 mt-3">
                    <span>Obsidian vault: synced</span>
                    <span>Gemini API: ready</span>
                  </div>
                </div>
              </div>
            </div>
          </WindowContainer>
        )}

        {/* ==================== 6. SCRIPT RUNNER WINDOW (TERMINAL SIMULATOR) ==================== */}
        {windows.scriptRunner.isOpen && (
          <WindowContainer
            app={windows.scriptRunner}
            isMobile={isMobile}
            onClose={(e) => closeWindow('scriptRunner', e)}
            onMinimize={(e) => minimizeWindow('scriptRunner', e)}
            onMaximize={(e) => maximizeWindow('scriptRunner', e)}
            onFocus={() => focusWindow('scriptRunner')}
            onDragStart={(e) => startDrag('scriptRunner', e)}
            onResizeStart={(e) => startResize('scriptRunner', e)}
            onDoubleClick={(e) => maximizeWindow('scriptRunner', e)}
            isActive={activeWindowId === 'scriptRunner'}
            isDragging={activeDragId === 'scriptRunner'}
            isResizing={isResizing === 'scriptRunner'}
          >
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row h-full">
              {/* Left pane: Available Scripts */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col bg-black/10 select-none">
                <div className="p-2.5 border-b border-border-subtle text-[10px] uppercase font-bold tracking-widest text-text-secondary">
                  System Scripts
                </div>
                <div className="p-2 space-y-1.5 flex-1">
                  {MOCK_SCRIPTS.map(script => (
                    <button
                      key={script.id}
                      onClick={() => handleRunScript(script.id)}
                      disabled={scriptStatus === 'running'}
                      className={`w-full text-left p-2.5 rounded-md text-xs flex items-start gap-2 border transition-all ${
                        activeScript?.id === script.id ? 'bg-accent-blue/15 border-accent-blue/40 text-text-primary' : 'bg-transparent border-transparent text-text-secondary hover:bg-bg-elevated/40 hover:text-text-primary'
                      }`}
                    >
                      <div className="mt-0.5 text-accent-blue shrink-0">{script.icon}</div>
                      <div className="min-w-0">
                        <div className="font-mono font-bold truncate">{script.name}</div>
                        <div className="text-[10px] text-text-muted truncate mt-0.5">{script.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right pane: Retro Monospace Terminal Log Stream */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0C] terminal-crt select-text">
                <div className="p-2 border-b border-border-subtle bg-black/25 flex justify-between items-center text-[10px] font-mono shrink-0">
                  <span className="text-text-muted flex items-center gap-1"><TerminalSquare size={12} /> terminal@cortex-prime:~</span>
                  <span className="text-accent-teal font-semibold">Active Mode</span>
                </div>

                {/* Shell Logs viewport */}
                <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-accent-green leading-relaxed space-y-1.5 terminal-crt-text">
                  {scriptLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-16 gap-1 select-none">
                      <Play size={24} className="opacity-20 mb-2" />
                      <div>Terminal console is idle.</div>
                      <div className="text-[9px]">Select a Python daemon script on the left side to trigger sandbox runtime.</div>
                    </div>
                  ) : (
                    <>
                      {scriptLogs.map((log, i) => {
                        if (!log) return null;
                        return (
                          <div key={i} className={
                            log.startsWith('[SUCCESS]') ? 'text-accent-green font-bold' :
                            log.startsWith('[COMMAND]') ? 'text-accent-purple font-semibold' :
                            log.startsWith('[SPARK]') ? 'text-accent-teal font-medium' :
                            log.startsWith('[INIT]') ? 'text-accent-blue' : 'text-text-primary opacity-85'
                          }>
                            {log}
                          </div>
                        );
                      })}
                      {scriptStatus === 'running' && (
                        <div className="flex items-center gap-1.5 text-accent-blue animate-pulse select-none pt-1">
                          <RefreshCw size={12} className="animate-spin" /> Synchronizing background thread...
                        </div>
                      )}
                      <div ref={terminalEndRef} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </WindowContainer>
        )}

        {/* ==================== 7. META CONFIG (SETTINGS) WINDOW ==================== */}
        {windows.settings.isOpen && (
          <WindowContainer
            app={windows.settings}
            isMobile={isMobile}
            onClose={(e) => closeWindow('settings', e)}
            onMinimize={(e) => minimizeWindow('settings', e)}
            onMaximize={(e) => maximizeWindow('settings', e)}
            onFocus={() => focusWindow('settings')}
            onDragStart={(e) => startDrag('settings', e)}
            onResizeStart={(e) => startResize('settings', e)}
            onDoubleClick={(e) => maximizeWindow('settings', e)}
            isActive={activeWindowId === 'settings'}
            isDragging={activeDragId === 'settings'}
            isResizing={isResizing === 'settings'}
          >
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-5">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-sm font-bold text-text-primary">System Settings & Customization</h2>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">Control wallpaper styles, local vault pointers and credentials</p>
              </div>

              {/* Wallpaper Theme Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">Desktop Wallpaper Style</label>
                <div className="grid grid-cols-3 gap-3">
                  <ThemeCard 
                    name="Purple Nebula" 
                    theme="nebula" 
                    bg="bg-gradient-to-br from-indigo-950 via-purple-900 to-black"
                    active={wallpaper === 'nebula'} 
                    onClick={() => setWallpaper('nebula')} 
                  />
                  <ThemeCard 
                    name="Cyberpunk Grid" 
                    theme="cyberpunk" 
                    bg="bg-black border border-accent-purple/20 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"
                    active={wallpaper === 'cyberpunk'} 
                    onClick={() => setWallpaper('cyberpunk')} 
                  />
                  <ThemeCard 
                    name="Deep Space Blue" 
                    theme="deepspace" 
                    bg="bg-gradient-to-b from-[#0A1128] to-[#000411]"
                    active={wallpaper === 'deepspace'} 
                    onClick={() => setWallpaper('deepspace')} 
                  />
                </div>
              </div>

              {/* Configuration Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Gemini API Key</label>
                  <input 
                    type="password"
                    value={settingsForm.geminiKey}
                    onChange={(e) => setSettingsForm({...settingsForm, geminiKey: e.target.value})}
                    className="w-full bg-black/40 border border-border-subtle rounded p-2 text-text-primary focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Obsidian Directory</label>
                  <input 
                    type="text"
                    value={settingsForm.vaultDir}
                    onChange={(e) => setSettingsForm({...settingsForm, vaultDir: e.target.value})}
                    className="w-full bg-black/40 border border-border-subtle rounded p-2 text-text-primary focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">AnkiConnect Port</label>
                  <input 
                    type="text"
                    value={settingsForm.ankiPort}
                    onChange={(e) => setSettingsForm({...settingsForm, ankiPort: e.target.value})}
                    className="w-full bg-black/40 border border-border-subtle rounded p-2 text-text-primary focus:outline-none focus:border-accent-blue font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Auto-backup push interval</label>
                  <select 
                    value={settingsForm.backupInterval}
                    onChange={(e) => setSettingsForm({...settingsForm, backupInterval: e.target.value})}
                    className="w-full bg-[#1C1C20] border border-border-subtle rounded p-2 text-text-primary focus:outline-none font-mono"
                  >
                    <option value="1">Every 1 Hour</option>
                    <option value="6">Every 6 Hours</option>
                    <option value="24">Every 24 Hours (Daily)</option>
                  </select>
                </div>
              </div>

              {/* Google Account Multi-Device Sync (Google Sync & Sync Key) */}
              <div className="glass-panel border-white/5 rounded-xl p-4 bg-gradient-to-br from-bg-secondary/20 to-bg-primary/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary flex items-center gap-1.5">
                    <RefreshCw size={12} className="text-rose-400" /> Đồng bộ đám mây (Google Sync)
                  </span>
                  {googleUser && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono">
                      CONNECTED
                    </span>
                  )}
                </div>

                {!googleUser ? (
                  <div className="space-y-3">
                    <p className="text-[11px] leading-relaxed text-text-muted font-sans">
                      Thiết lập khóa đồng bộ đám mây để liên kết dữ liệu thời gian thực giữa máy tính, điện thoại Android và máy tính bảng Samsung Tab của bạn qua Google Cloud.
                    </p>
                    <button
                      onClick={() => {
                        const randomKey = 'CTX-G-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-PRIME';
                        setGoogleUser({
                          name: 'Tuan Anh',
                          email: 'tuananh@gmail.com',
                          syncKey: randomKey,
                          connected: true,
                          lastSynced: new Date().toLocaleTimeString()
                        });
                        triggerToast('SUCCESS', 'Đăng nhập Google thành công! Sync Key đã được kích hoạt.');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-sans font-bold text-xs py-2 rounded hover:bg-neutral-200 transition-colors"
                    >
                      <LogIn size={14} /> Đăng nhập bằng Google Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-purple/20 flex items-center justify-center text-[10px] font-bold text-accent-purple border border-accent-purple/30 font-sans">
                          TA
                        </div>
                        <div>
                          <div className="font-bold text-text-primary text-[11px] font-sans">{googleUser.name}</div>
                          <div className="text-[9px] text-text-muted font-mono">{googleUser.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setGoogleUser(null);
                          triggerToast('INFO', 'Đã đăng xuất tài khoản Google.');
                        }}
                        className="text-[10px] px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded hover:bg-red-500/20 transition-colors font-sans"
                      >
                        Đăng xuất
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted block">Google Sync Key</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-black/40 border border-border-subtle rounded px-2.5 py-1.5 font-mono text-accent-teal text-xs flex items-center tracking-wider justify-between">
                          <span>{googleUser.syncKey}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(googleUser.syncKey);
                            triggerToast('SUCCESS', 'Đã copy Sync Key vào clipboard!');
                          }}
                          className="bg-white/5 border border-border-subtle hover:bg-white/10 rounded px-3 py-1.5 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                          title="Copy Sync Key"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded p-2.5 space-y-1.5 text-[10px] font-mono">
                      <div className="text-text-secondary uppercase text-[8px] font-bold tracking-widest border-b border-white/5 pb-1 flex justify-between">
                        <span>Trạng thái kết nối Cloud</span>
                        <span className="text-text-muted">Last synced: {googleUser.lastSynced}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">● Máy tính cá nhân (Personal PC)</span>
                        <span className="text-green-400">Đồng bộ hoàn tất</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">● Điện thoại (Android Device)</span>
                        <span className="text-green-400">Thiết bị hoạt động</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">● Máy tính bảng (Samsung Tab)</span>
                        <span className="text-green-400">Thiết bị hoạt động</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset CORTEX-PRIME về Không (System Clean Reset) */}
              <div className="glass-panel border-red-500/10 rounded-xl p-4 bg-gradient-to-br from-red-950/10 to-transparent space-y-3">
                <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 flex items-center gap-1.5">
                    <Trash2 size={12} className="text-red-400" /> Khôi phục hệ thống về không
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] leading-relaxed text-text-muted font-sans">
                    Hành động này sẽ xóa toàn bộ LocalStorage, dọn dẹp các mảng dữ liệu lịch trình, inbox, nhãn và cài đặt cấu hình về trạng thái sạch sẽ tuyệt đối (0 dữ liệu).
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Cảnh báo: Hành động này sẽ xóa toàn bộ LocalStorage, danh sách công việc, inbox và cấu hình hệ thống để đưa ứng dụng về trạng thái sạch sẽ tuyệt đối như khi tải về. Bạn có chắc chắn muốn tiếp tục?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 font-sans font-bold text-xs py-2 rounded hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={13} /> Reset CORTEX-PRIME về Không
                  </button>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 flex justify-between items-center text-[10px] font-mono text-text-muted">
                <span>System architecture: Intel x64 Local sandbox</span>
                <button 
                  onClick={() => {
                    setInboxNotification("Configuration successfully saved!");
                    setTimeout(() => setInboxNotification(""), 3000);
                  }}
                  className="bg-accent-blue text-white font-sans font-bold text-xs px-3.5 py-1.5 rounded hover:bg-blue-600 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </WindowContainer>
        )}

      </div>

      {/* SYSTEM TASKBAR & GLASSMORPHIC DOCK (Thanh Dock điều khiển ứng dụng dưới cùng) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel-heavy h-16 max-w-[90vw] transition-all duration-300 ${
          isMobile ? 'bottom-0 left-0 translate-x-0 w-full rounded-none max-w-none border-t border-b-0 border-x-0 border-white/10 h-16' : ''
        }`}
      >
        
        {/* Launcher Button (Start Menu) */}
        <button 
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isStartMenuOpen ? 'bg-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]' : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
          }`}
        >
          <LayoutGrid size={18} />
        </button>

        <div className="w-[1px] h-8 bg-white/10 mx-1 shrink-0" />

        {/* Dynamic Dock Application Icons */}
        <div className="flex items-center gap-2 overflow-x-auto select-none no-scrollbar flex-1 justify-center">
          <DockIcon 
            name="Dashboard"
            icon={<Monitor size={18} />} 
            color="text-teal-400"
            isOpen={windows.dashboard.isOpen} 
            isMinimized={windows.dashboard.isMinimized}
            onClick={() => toggleWindow('dashboard')} 
          />
          <DockIcon 
            name="00 Inbox"
            icon={<Inbox size={18} />} 
            color="text-blue-400"
            isOpen={windows.inbox.isOpen} 
            isMinimized={windows.inbox.isMinimized}
            onClick={() => toggleWindow('inbox')} 
          />
          <DockIcon 
            name="02 Schedule"
            icon={<Calendar size={18} />} 
            color="text-rose-400"
            isOpen={windows.schedule.isOpen} 
            isMinimized={windows.schedule.isMinimized}
            onClick={() => toggleWindow('schedule')} 
          />
          <DockIcon 
            name="Far-Res"
            icon={<FlaskConical size={18} />} 
            color="text-purple-400"
            isOpen={windows.farRes.isOpen} 
            isMinimized={windows.farRes.isMinimized}
            onClick={() => {
              setExplorerVault('Far-Res');
              toggleWindow('farRes');
            }} 
          />
          <DockIcon 
            name="Burnout Radar"
            icon={<Activity size={18} />} 
            color="text-amber-400"
            isOpen={windows.burnout.isOpen} 
            isMinimized={windows.burnout.isMinimized}
            onClick={() => toggleWindow('burnout')} 
          />
          <DockIcon 
            name="Deconstructor"
            icon={<FileText size={18} />} 
            color="text-sky-400"
            isOpen={windows.deconstructor.isOpen} 
            isMinimized={windows.deconstructor.isMinimized}
            onClick={() => toggleWindow('deconstructor')} 
          />
          <DockIcon 
            name="Script Runner"
            icon={<TerminalSquare size={18} />} 
            color="text-stone-400"
            isOpen={windows.scriptRunner.isOpen} 
            isMinimized={windows.scriptRunner.isMinimized}
            onClick={() => toggleWindow('scriptRunner')} 
          />
          <DockIcon 
            name="09 Meta"
            icon={<Settings size={18} />} 
            color="text-slate-400"
            isOpen={windows.settings.isOpen} 
            isMinimized={windows.settings.isMinimized}
            onClick={() => toggleWindow('settings')} 
          />
        </div>

        <div className="w-[1px] h-8 bg-white/10 mx-1 shrink-0" />

        {/* System tray items */}
        <div className="flex items-center gap-3 text-xs font-sans shrink-0 pl-1 h-full">
          {!isMobile && (
            <div className="flex items-center gap-1.5 text-text-secondary bg-white/5 border border-white/5 rounded-md px-2 py-1 shrink-0 select-text">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse"></span>
              <span>CL: 67%</span>
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-text-primary text-[11px]">{systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[8px] text-text-muted tracking-wider">{systemTime.toLocaleDateString([], { day: '2-digit', month: '2-digit' })}</span>
          </div>

          {/* Aero Peek Show Desktop vertical sliver */}
          {!isMobile && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShowDesktop();
              }}
              className="w-1.5 self-stretch hover:bg-white/10 border-l border-white/10 ml-1.5 transition-colors duration-150 rounded-r-md cursor-pointer h-full"
              title="Show Desktop (Aero Peek)"
            />
          )}
        </div>
      </div>

      {/* START LAUNCHER MENU PANEL (Bảng điều khiển Start Menu mở nhanh) */}
      {isStartMenuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:ml-12 z-[1000] w-72 glass-panel-heavy rounded-2xl p-3 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 border border-white/15 bg-black/85`}
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
              <span className="text-xs font-bold tracking-wider font-sans">CORTEX launcher</span>
            </div>
            <button onClick={() => setIsStartMenuOpen(false)} className="text-text-muted hover:text-white"><X size={14} /></button>
          </div>
          
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            <StartMenuItem name="Personal Dashboard" desc="System metrics & notes checklist." icon={<Monitor size={14} />} onClick={() => { toggleWindow('dashboard'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="00 Inbox Manager" desc="Filer and review raw ideas." icon={<Inbox size={14} />} onClick={() => { toggleWindow('inbox'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="02 Schedule Manager" desc="AI-powered agenda & schedule." icon={<Calendar size={14} />} onClick={() => { toggleWindow('schedule'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="Vault Explorer" desc="Explore academic vaults folders." icon={<Folder size={14} />} onClick={() => { setExplorerVault('Far-Res'); toggleWindow('farRes'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="Burnout Radar" desc="Deep work & cognitive load tracker." icon={<Activity size={14} />} onClick={() => { toggleWindow('burnout'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="Paper Deconstructor" desc="Auto-extract knowledge from PDF." icon={<FileText size={14} />} onClick={() => { toggleWindow('deconstructor'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="Script Runner" desc="Run custom Python daemons." icon={<TerminalSquare size={14} />} onClick={() => { toggleWindow('scriptRunner'); setIsStartMenuOpen(false); }} />
            <StartMenuItem name="Meta Config" desc="Settings & theme configurations." icon={<Settings size={14} />} onClick={() => { toggleWindow('settings'); setIsStartMenuOpen(false); }} />
          </div>

          <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[9px] text-text-muted font-sans">
            <span>Local Node: Online</span>
            <span>v1.0.2</span>
          </div>
        </div>
      )}

      {/* QUICK CAPTURE SYSTEM MODAL (Cmd+K Global Capture Overlay) */}
      {isQuickCaptureOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-[640px] bg-bg-elevated border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-3.5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">Cortex Quick Capture</h2>
                <span className="bg-[#2A2A30] text-text-secondary text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">⌘K</span>
              </div>
              <button onClick={() => setIsQuickCaptureOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <textarea 
                className="w-full bg-[#0D0D0F] border border-border-subtle rounded-md p-3 text-xs font-mono focus:border-accent-blue focus:outline-none min-h-[140px] resize-none text-text-primary select-text"
                placeholder="Paste research outlines, thoughts or brain dumps here...&#10;&#10;Examples:&#10;• 'Need to implement Crank-Nicolson method for thermal simulation'&#10;• 'CISG Article 79 force majeure exclusions for contract review'"
                autoFocus
                onChange={(e) => setDesktopCaptureText(e.target.value)}
                value={desktopCaptureText}
              ></textarea>
              
              <div className="border border-border-subtle rounded-lg bg-bg-secondary p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse"></div>
                  <span className="text-[10px] font-semibold uppercase text-accent-blue tracking-wider">AI Instant Preview Classification</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                  <div>
                    <div className="text-text-muted mb-1">Tasks detected</div>
                    <div className="flex items-center gap-1.5 bg-[#1C1C20] p-1.5 rounded border border-border-subtle text-text-primary leading-normal">
                      <span className="badge badge-deep shrink-0 font-bold">Math</span>
                      <span className="truncate">Implement Crank-Nicolson solver</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted mb-1 font-mono">Knowledge found</div>
                    <div className="flex items-center gap-1.5 bg-[#1C1C20] p-1.5 rounded border border-border-subtle text-text-primary leading-normal">
                      <span className="badge badge-acquired shrink-0 font-bold">Law</span>
                      <span className="truncate">CISG Art 79 - force majeure</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1.5 bg-bg-secondary border border-border-subtle rounded text-text-secondary font-mono">Energy: <span className="text-accent-purple font-bold">Deep</span></span>
                  <span className="text-[10px] px-2 py-1.5 bg-bg-secondary border border-border-subtle rounded text-text-secondary font-mono">Vault: <span className="text-accent-blue font-bold">Auto</span></span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3.5 py-1.5 text-text-secondary hover:text-text-primary" onClick={() => setIsQuickCaptureOpen(false)}>Close</button>
                  <button 
                    onClick={(e) => {
                      setIsQuickCaptureOpen(false);
                      handleDesktopQuickCapture(e);
                    }}
                    className="bg-accent-blue text-white rounded px-4 py-1.5 text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    File Note <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-primary px-3 py-2 border-t border-border-subtle text-[9px] text-text-muted font-mono flex justify-between">
              <span>API engine: Gemini 2.5 Flash • local vault</span>
              <span>ready</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==================== APP SYSTEM LAYOUT SUB-COMPONENTS ====================

// Standard floating draggable window wrapper
function WindowContainer({ app, isMobile, onClose, onMinimize, onMaximize, onFocus, onDragStart, onResizeStart, onDoubleClick, isActive, isDragging, isResizing, children }) {
  if (app.isMinimized) return null;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onFocus();
      }}
      style={isMobile ? {
        zIndex: app.zIndex,
      } : {
        position: 'absolute',
        left: `${app.x}px`,
        top: `${app.y}px`,
        width: `${app.w}px`,
        height: `${app.h}px`,
        zIndex: app.zIndex,
      }}
      className={`glass-panel-heavy rounded-xl flex flex-col overflow-hidden pointer-events-auto border transition-all select-none animate-window-open ${
        app.isMaximized ? 'window-maximized' : ''
      } ${
        isMobile ? 'fixed top-0 left-0 w-full h-[calc(100vh-64px)] rounded-none border-none' : ''
      } ${
        !isMobile && (isDragging || isResizing) ? 'no-transition' : 'window-transition'
      } ${
        !isMobile && isActive 
          ? 'window-active border-white/20 ring-1 ring-white/10 shadow-[0_0_30px_-5px_rgba(59,130,246,0.12)]' 
          : 'window-inactive opacity-85 hover:opacity-95 border-white/5 shadow-md'
      }`}
    >
      {/* Window Title Bar (Header) */}
      <div 
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onDoubleClick={onDoubleClick}
        className={`border-b px-3 py-2.5 flex items-center justify-between select-none shrink-0 transition-colors duration-150 ${
          isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        } ${
          isActive ? 'bg-black/55 border-white/10 text-white' : 'bg-black/25 border-white/5 text-text-secondary'
        }`}
      >
        {/* Title details */}
        <div className="flex items-center gap-2 font-sans text-[11.5px] font-semibold tracking-wide">
          <span>{app.icon}</span>
          <span className="truncate max-w-[200px] md:max-w-none">{app.title}</span>
        </div>

        {/* Mac OS Colored flat window controllers */}
        <div className="flex items-center gap-2">
          {/* Minimize button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(e); }}
            className="w-3.5 h-3.5 rounded-full bg-accent-amber border border-amber-600/30 hover:bg-amber-600 transition-colors flex items-center justify-center text-[10px] text-amber-900 font-bold shrink-0 shadow-inner"
            title="Minimize"
          >
            <span className="opacity-0 hover:opacity-100 mb-1">-</span>
          </button>
          
          {/* Maximize/Restore button */}
          {!isMobile && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(e); }}
              className="w-3.5 h-3.5 rounded-full bg-accent-green border border-green-600/30 hover:bg-green-600 transition-colors flex items-center justify-center text-[8px] text-green-950 font-bold shrink-0 shadow-inner"
              title="Maximize"
            >
              <span className="opacity-0 hover:opacity-100">{app.isMaximized ? '❐' : '❑'}</span>
            </button>
          )}

          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(e); }}
            className="w-3.5 h-3.5 rounded-full bg-accent-red border border-red-600/30 hover:bg-red-600 transition-colors flex items-center justify-center text-[9px] text-red-950 font-bold shrink-0 shadow-inner"
            title="Close"
          >
            <span className="opacity-0 hover:opacity-100 mb-0.5">×</span>
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-hidden flex flex-col bg-bg-primary/95 text-text-primary">
        {children}
      </div>

      {/* Dynamic Window Resizer Grip Corner (Triangular shape) */}
      {!isMobile && !app.isMaximized && (
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onResizeStart(e);
          }}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 select-none z-[100]"
          title="Drag to resize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-white/20 hover:text-white/40 transition-colors pointer-events-none mb-0.5 mr-0.5">
            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.2" />
            <line x1="8" y1="5" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Desktop grid item icon shortcut
function DesktopIcon({ label, icon, color, badge, isOpen, isSelected, onSelect, onDoubleClick }) {
  const handleSingleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <div 
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center gap-1 group text-center focus:outline-none w-20 shrink-0 pointer-events-auto cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg relative transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${color} ${
        isOpen ? 'shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-white/10' : 'hover:border-white/20'
      } ${
        isSelected ? 'bg-white/10 ring-2 ring-accent-blue/60 border-accent-blue/50 scale-105 shadow-[0_0_12px_rgba(59,130,246,0.2)]' : ''
      }`}>
        {icon}
        
        {/* Glow badge overlay count */}
        {badge && (
          <span className="absolute -top-1.5 -right-1.5 bg-accent-blue text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] font-mono">
            {badge}
          </span>
        )}

        {/* Active open application underline */}
        {isOpen && (
          <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        )}
      </div>
      <span className={`text-[10px] group-hover:text-text-primary font-sans tracking-wide font-medium truncate max-w-[80px] drop-shadow ${
        isSelected ? 'text-text-primary underline font-semibold' : 'text-text-secondary'
      }`}>
        {label}
      </span>
    </div>
  );
}

// Dock Icon (bottom bar)
function DockIcon({ name, icon, color, isOpen, isMinimized, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`dock-item w-11 h-11 rounded-xl flex flex-col items-center justify-center bg-white/5 border border-white/5 hover:bg-white/15 relative shrink-0 transition-all select-none ${
        isOpen && !isMinimized ? 'bg-white/10 border-white/15 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : ''
      }`}
      title={name}
    >
      <div className={`${color} shrink-0`}>{icon}</div>
      {/* Small dot underneath to indicate status */}
      {isOpen && (
        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${
          isMinimized ? 'bg-text-muted shadow-none' : 'bg-accent-teal shadow-[0_0_8px_rgba(20,184,166,0.8)]'
        }`} />
      )}
    </button>
  );
}

// Start Menu Item
function StartMenuItem({ name, desc, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 hover:bg-white/5 hover:text-text-primary transition-all group font-mono text-text-secondary border border-transparent hover:border-white/5"
    >
      <div className="mt-0.5 text-accent-purple group-hover:scale-105 transition-transform">{icon}</div>
      <div>
        <div className="font-bold text-text-primary">{name}</div>
        <div className="text-[9px] text-text-muted mt-0.5">{desc}</div>
      </div>
    </button>
  );
}

// Sidebar Vault Navigation Item
function VaultNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full p-2 rounded-md transition-colors text-xs font-mono select-none ${
        active ? 'bg-accent-blue/10 text-accent-blue font-bold border-l-2 border-accent-blue' : 'text-text-secondary hover:bg-bg-elevated/40 hover:text-text-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Desktop theme chooser card
function ThemeCard({ name, theme, bg, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border text-center transition-all ${
        active ? 'border-accent-blue bg-accent-blue/5 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'border-border-subtle bg-bg-secondary/40 hover:border-border-strong'
      }`}
    >
      <div className={`w-full h-10 rounded-md shadow-inner ${bg}`} />
      <span className="text-[10px] font-mono text-text-secondary font-medium">{name}</span>
    </button>
  );
}

// Existing metric display cards
function MetricCard({ title, value, subtitle, trend, trendColor, valueColor = "text-text-primary", dots, onClick, hoverable }) {
  return (
    <div 
      onClick={onClick}
      className={`card flex flex-col justify-between p-3 rounded-lg border border-border-subtle bg-bg-secondary/50 ${onClick ? 'cursor-pointer' : ''} ${
        hoverable ? 'hover:border-border-strong hover:bg-bg-secondary transition-all duration-200 shadow-sm' : ''
      }`}
    >
      <div className="text-[9px] text-text-muted mb-2 uppercase tracking-widest font-bold">{title}</div>
      <div className={`text-2xl font-display font-light mb-1 ${valueColor}`}>{value}</div>
      <div className="flex justify-between items-end mt-2">
        <div className="text-[10px] text-text-muted">{subtitle}</div>
        {trend && <div className={`text-[10px] font-semibold ${trendColor}`}>{trend}</div>}
        {dots && (
          <div className="flex gap-1 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-border-strong"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Table row for dashboard recent notes
function TableRow({ title, vault, type, status, energy, time }) {
  return (
    <tr className="hover:bg-bg-elevated/40 transition-colors">
      <td className="p-3 text-text-primary font-medium truncate max-w-[160px]">{title}</td>
      <td className="p-3"><span className="text-[10px] font-sans border border-border-strong px-2 py-0.5 rounded text-text-secondary">{vault}</span></td>
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

// Day breakdown rows for burnout analytics
function DayRow({ day, date, deep, shallow }) {
  const deepWidth = `${deep}%`;
  const shallowWidth = `${shallow}%`;
  const total = deep + shallow;
  const noWorkWidth = `${100 - total}%`;
  
  return (
    <div className="flex items-center text-xs">
      <div className="w-20 shrink-0 font-mono">
        <div className="font-semibold text-text-primary text-[11px]">{day}</div>
        <div className="text-text-muted text-[9px]">{date}</div>
      </div>
      
      <div className="flex-1 h-5 bg-[#0D0D0F] border border-border-subtle rounded-md overflow-hidden flex shadow-inner">
        {deep > 0 && (
          <div 
            style={{ width: deepWidth }} 
            className="bg-accent-blue h-full flex items-center justify-center text-[9px] font-bold text-white overflow-hidden"
          >
            {deep >= 25 && `${deep}%`}
          </div>
        )}
        {shallow > 0 && (
          <div 
            style={{ width: shallowWidth }} 
            className="bg-[#2A2A30] h-full flex items-center justify-center text-[9px] text-text-secondary overflow-hidden"
          >
            {shallow >= 25 && `${shallow}%`}
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

// Progress bars for cognitive analysis
function VaultProgress({ label, percentage, color }) {
  return (
    <div className="text-xs space-y-1.5">
      <div className="flex justify-between text-[10px]">
        <span className="font-semibold text-text-secondary">{label}</span>
        <span className="font-mono text-text-muted">{percentage}%</span>
      </div>
      <div className="w-full h-1 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
        <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

// Mini subcomponents
function TabButton({ label, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-all font-mono ${
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
      className={`px-3 py-1 border-b-2 text-[10px] font-mono font-semibold transition-all ${
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
    <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-text-secondary hover:text-text-primary">
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={() => setIsChecked(!isChecked)}
        className="w-3.5 h-3.5 rounded bg-bg-primary border border-border-subtle checked:bg-accent-blue focus:ring-0 focus:ring-offset-0 shrink-0" 
      />
      <span>{label}</span>
    </label>
  );
}

function FormulaCard({ num, title, latex, desc, tag }) {
  return (
    <div className="border border-border-subtle rounded-lg p-3 bg-bg-secondary/40 space-y-2 select-text">
      <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-accent-purple uppercase tracking-widest">{num}</span>
          <span className="text-xs font-bold text-text-primary">{title}</span>
        </div>
        <span className="badge badge-deep px-2 py-0.5 text-[9px]">{tag}</span>
      </div>
      
      {/* LaTeX formula block */}
      <div className="bg-bg-primary p-3 rounded border border-border-subtle text-center font-mono text-xs text-[#C0C0D0] overflow-x-auto select-all shadow-inner leading-normal">
        {latex}
      </div>
      
      <div className="flex justify-between items-end gap-3">
        <p className="text-[10px] text-text-secondary leading-normal">{desc}</p>
        <button className="bg-bg-elevated border border-border-strong text-[9px] font-bold py-1 px-2 rounded hover:text-text-primary flex items-center gap-1 shrink-0">
          <Copy size={10} /> Copy LaTeX
        </button>
      </div>
    </div>
  );
}

function SynergyCard({ vault1, vault2, text, sim }) {
  return (
    <div className="bg-bg-secondary/30 border border-border-subtle p-3 rounded-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2 text-[9px] uppercase font-bold tracking-widest text-text-muted">
          <span>{vault1}</span>
          <div className="flex-1 h-px bg-accent-teal/30 relative">
            <div className="absolute inset-0 bg-accent-teal/50 blur-[1px]"></div>
          </div>
          <span>{vault2}</span>
        </div>
        <div className="text-xs text-text-primary mb-2 line-clamp-2 leading-relaxed font-sans">{text}</div>
      </div>
      <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1 shrink-0 font-mono">
        <span className="text-[10px] text-text-secondary">Similarity: {sim}</span>
        <button className="text-[10px] text-accent-teal hover:underline font-bold">Inspect note &rarr;</button>
      </div>
    </div>
  );
}

function PaperProjectCard({ id, num, title, progress, status, statusBg, tags, modified, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`card cursor-pointer flex flex-col justify-between hover:border-border-strong transition-all duration-200 p-3.5 rounded-lg border ${
        selected ? 'border-accent-blue bg-bg-elevated/45' : 'bg-bg-secondary/30 border-border-subtle'
      }`}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-mono">{num}</span>
          <span className={`badge ${statusBg} text-[9px] font-bold`}>{status}</span>
        </div>
        <h4 className="text-xs font-bold text-text-primary leading-snug line-clamp-2 mb-3">
          {title}
        </h4>
      </div>

      <div className="space-y-2.5">
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-text-secondary">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[#0D0D0F] border border-border-subtle rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="h-full bg-accent-blue rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] border-t border-border-subtle/50 pt-2 font-mono">
          <div className="flex gap-1 truncate max-w-[140px]">
            {tags.map(t => (
              <span key={t} className="badge bg-[#1C1C20] text-text-secondary border border-border-subtle text-[8px] font-bold">{t}</span>
            ))}
          </div>
          <span className="text-text-muted shrink-0">{modified}</span>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ label, lit, writing, review, submitted, active }) {
  return (
    <div className="flex items-center text-xs">
      <div className="w-20 shrink-0 font-mono font-semibold text-text-secondary text-[11px]">{label}</div>
      <div className="flex-1 h-5 bg-[#0D0D0F] border border-border-subtle rounded flex overflow-hidden shadow-inner">
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
    <div className="p-2.5 border border-border-subtle rounded hover:bg-bg-elevated/40 transition-colors flex justify-between items-center text-xs">
      <div className="min-w-0">
        <div className="font-semibold text-text-primary truncate">{title}</div>
        <div className="text-text-secondary mt-0.5 font-mono text-[9px]">{author} ({year})</div>
      </div>
      <div className="flex gap-1 shrink-0 pl-3">
        {tags.map(t => (
          <span key={t} className="badge badge-acquired font-bold text-[8px]">{t}</span>
        ))}
      </div>
    </div>
  );
}

function TimelineHistoryItem({ date, title, desc }) {
  return (
    <div className="relative pl-4 text-xs select-text">
      <div className="absolute top-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-border-strong border-2 border-bg-secondary" />
      <div className="text-text-muted font-mono text-[9px] mb-1">{date}</div>
      <div className="font-semibold text-text-primary mb-0.5">{title}</div>
      <p className="text-text-secondary leading-normal text-[11px]">{desc}</p>
    </div>
  );
}
