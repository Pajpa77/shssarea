import React, { useState, useEffect } from 'react';
import { useRescue } from '../context/RescueContext';
import { User } from '../types';
import {
  Shield,
  Radio,
  MapPin,
  Flame,
  Activity,
  AlertCircle,
  Users,
  MessageSquare,
  FileText,
  Archive,
  Layers,
  Sparkles,
  Zap,
  LogOut,
  UserCheck,
  ChevronDown,
  Navigation,
  CheckCircle,
  Cloud,
  CloudOff,
  PenTool,
  PlusCircle,
  Edit3,
  StopCircle,
  UserPlus,
  AlertTriangle,
  Menu,
  Trash2,
  RotateCcw,
  Share2,
  QrCode,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'sectors' | 'chat' | 'responders' | 'log' | 'archive' | 'admin';
  setActiveTab: (tab: 'map' | 'sectors' | 'chat' | 'responders' | 'log' | 'archive' | 'admin') => void;
  onOpenFindingModal: () => void;
  onOpenProfileModal: () => void;
  onOpenLoginModal: () => void;
  onOpenEndOperationModal?: () => void;
  onOpenPauseOperationModal?: () => void;
  onOpenCreateOperationModal?: () => void;
  onOpenEditOperationModal?: () => void;
  onOpenOperationDetailModal?: () => void;
  onOpenCreateUserModal?: () => void;
  onOpenEditUser?: (user: User) => void;
  onStartDrawingSector?: () => void;
  onOpenShareAppModal?: () => void;
  isAnyModalOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFindingModal,
  onOpenProfileModal,
  onOpenLoginModal,
  onOpenEndOperationModal,
  onOpenPauseOperationModal,
  onOpenCreateOperationModal,
  onOpenEditOperationModal,
  onOpenOperationDetailModal,
  onOpenCreateUserModal,
  onOpenEditUser,
  onStartDrawingSector,
  onOpenShareAppModal,
  isAnyModalOpen = false,
}) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    logout,
    requestLogout,
    currentOperation,
    allOperations,
    setCurrentOperationId,
    reactivateOperation,
    deleteOperation,
    pauseOperation,
    resumeOperation,
    isRealGpsActive,
    toggleRealGps,
    sendEmergencyAlert,
    isSimulatorRunning,
    toggleSimulator,
    findings,
    chatMessages,
    unreadChatCount,
    cloudSyncStatus,
    userLocations,
    getUserArrivalStatus,
    calculateDistanceToEzMeters,
    confirmUserReady,
  } = useRescue();

  const [showSarAdminMenu, setShowSarAdminMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showOpDropdown, setShowOpDropdown] = useState(false);
  const [showResponderListDropdown, setShowResponderListDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setShowSarAdminMenu(false);
    setShowUserDropdown(false);
    setShowOpDropdown(false);
    setShowResponderListDropdown(false);
  };

  useEffect(() => {
    if (isAnyModalOpen) {
      closeAllDropdowns();
    }
  }, [isAnyModalOpen]);

  useEffect(() => {
    closeAllDropdowns();
  }, [activeTab]);

  const isExercise = currentOperation?.type === 'exercise';
  const isAdmin = currentUser?.role === 'admin';
  const isEL = currentUser?.role === 'einsatzleitung';
  const canManageOps = isAdmin || isEL;

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 bg-[#1E293B] border-b border-slate-700 shadow-lg shrink-0 sticky top-0 z-[1000] text-slate-200">
      {/* Brand & Central SHS Leitstellen Menu Button */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {/* Interactive White SHS Button / Admin Hub */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSarAdminMenu((prev) => {
                const next = !prev;
                if (next) {
                  setShowOpDropdown(false);
                  setShowUserDropdown(false);
                  setShowResponderListDropdown(false);
                }
                return next;
              });
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-slate-100 active:scale-95 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-md border border-slate-300 tracking-wider text-xs sm:text-sm shrink-0 cursor-pointer transition-all duration-150 relative group"
            title="SHS EZ (Klicken für Einsatz- und Admin-Steuerung)"
          >
            <span className="font-black tracking-widest text-slate-950">SHS</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-slate-900 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-slate-900 rounded-full"></span>
          </button>

          {/* Central SHS EZ & Admin Dropdown Popover */}
          {showSarAdminMenu && (
            <>
              {/* Click-away transparent overlay */}
              <div
                className="fixed inset-0 z-[1200]"
                onClick={() => setShowSarAdminMenu(false)}
              />
              <div className="fixed sm:absolute top-14 sm:top-full left-2 sm:left-0 right-2 sm:right-auto sm:w-96 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-[#1E293B] border border-slate-600 rounded-2xl shadow-2xl p-3 z-[1300] text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                {/* Menu Header */}
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-700/80 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black text-xs shadow border border-slate-300">
                      SHS
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs uppercase tracking-wider">
                        SHS EZ
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        EZ & Admin-Steuerung
                      </div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300 font-mono text-[9px] uppercase font-bold">
                    {currentUser?.role === 'admin' ? 'EL / Admin' : 'Helfer'}
                  </span>
                </div>

                {/* Admin Actions Group (Logically Ordered) */}
                <div className="space-y-1.5 font-sans">
                  {/* 1. Neuen Einsatz anlegen */}
                  {onOpenCreateOperationModal && (
                    <button
                      onClick={() => {
                        setShowSarAdminMenu(false);
                        onOpenCreateOperationModal();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
                        ➕
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Neuen Einsatz anlegen</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-blue-900/50 text-blue-300 rounded font-mono">Neu</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Wohnadresse, Sichtungsort (PLS) & Vermisstenprofil
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 2. Aktuellen Einsatz editieren */}
                  {onOpenEditOperationModal && currentOperation && currentOperation.status === 'active' && (
                    <button
                      onClick={() => {
                        setShowSarAdminMenu(false);
                        onOpenEditOperationModal();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700/80 hover:border-amber-500/50 transition cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
                        ✏️
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs">Aktuellen Einsatz editieren (inkl. Sektoren & Suchgebiet)</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          #{currentOperation.id.slice(-4).toUpperCase()} • {currentOperation.title}
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 3. Einsatzdetails & Vermisstenprofil */}
                  {currentOperation && onOpenOperationDetailModal && (
                    <button
                      onClick={() => {
                        setShowSarAdminMenu(false);
                        onOpenOperationDetailModal();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 text-blue-200 hover:text-white border border-blue-800/60 hover:border-blue-400 transition cursor-pointer text-left group shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
                        📋
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>Einsatzdetails & Dossier</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900 text-blue-200 border border-blue-700">Info</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {currentOperation.missingPerson?.name ? `Vermisst: ${currentOperation.missingPerson.name}` : currentOperation.title}
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 4. Einsatz-Steuerung: Pausieren / Fortsetzen / Beenden (Zusammengeführt) */}
                  {isAdmin && currentOperation && (
                    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-2 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-mono px-1 flex items-center justify-between">
                        <span>Einsatz-Steuerung (ELZ)</span>
                        <span className="text-[9px] text-blue-400">Pausieren / Beenden</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {currentOperation.status === 'active' ? (
                          <button
                            onClick={() => {
                              setShowSarAdminMenu(false);
                              if (onOpenPauseOperationModal) {
                                onOpenPauseOperationModal();
                              } else {
                                pauseOperation(currentOperation.id, 'Einsatz pausiert');
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/70 text-amber-200 border border-amber-800/60 transition cursor-pointer font-bold text-xs"
                          >
                            <span>⏸️</span>
                            <span>Pausieren</span>
                          </button>
                        ) : currentOperation.status === 'paused' ? (
                          <button
                            onClick={() => {
                              resumeOperation(currentOperation.id);
                              setShowSarAdminMenu(false);
                            }}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-800/60 transition cursor-pointer font-bold text-xs"
                          >
                            <span>▶️</span>
                            <span>Fortsetzen</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        {onOpenEndOperationModal && currentOperation?.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setShowSarAdminMenu(false);
                              onOpenEndOperationModal();
                            }}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-800/60 transition cursor-pointer font-bold text-xs"
                          >
                            <span>🛑</span>
                            <span>Beenden</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. Einsatzkräfte & Accounts verwalten */}
                  {onOpenCreateUserModal && (
                    <button
                      onClick={() => {
                        setShowSarAdminMenu(false);
                        onOpenCreateUserModal();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700/80 hover:border-emerald-500/50 transition cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
                        👥
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs">Accountverwaltung</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Helfer anlegen, bearbeiten, Rollen & Funkrufnamen
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 6. App teilen & Kräfte einladen (QR-Code) */}
                  {onOpenShareAppModal && (
                    <button
                      onClick={() => {
                        setShowSarAdminMenu(false);
                        onOpenShareAppModal();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/70 text-blue-100 hover:text-white border border-blue-800/70 hover:border-blue-400 transition cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition">
                        📱
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>App teilen & Kräfte einladen</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900 text-blue-200 border border-blue-700">QR-Code</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          Direktlink & QR-Code für Helfer vor Ort (ohne Google-Login)
                        </div>
                      </div>
                    </button>
                  )}


                </div>

                {/* Quick links footer */}
                <div className="mt-2.5 pt-2 border-t border-slate-700/80 grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
                  <button
                    onClick={() => {
                      setActiveTab('log');
                      setShowSarAdminMenu(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    📜 Einsatztagebuch
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('archive');
                      setShowSarAdminMenu(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    📦 Einsatzarchiv
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-sm md:text-base font-bold leading-tight uppercase tracking-wider text-white truncate">
              SHS EZ
            </h1>
            {/* Quick Operation Selector Button */}
            <div className="relative inline-block shrink-0">
              <button
                onClick={() => {
                  setShowOpDropdown(!showOpDropdown);
                  setShowSarAdminMenu(false);
                  setShowUserDropdown(false);
                  setShowResponderListDropdown(false);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-200 flex items-center gap-1 cursor-pointer"
                title="Einsatz wechseln oder archivierte Einsätze ansehen"
              >
                <span className="font-bold">
                  {currentOperation ? `#${currentOperation.id.slice(-4).toUpperCase()}` : 'EINSÄTZE'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Operation Dropdown Menu */}
              {showOpDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-[1050]"
                    onClick={() => setShowOpDropdown(false)}
                  />
                  <div className="fixed sm:absolute top-14 sm:top-full left-2 sm:left-0 right-2 sm:right-auto sm:w-96 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-3 z-[1200] text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between font-bold text-slate-300 px-2 py-1 border-b border-slate-700 uppercase tracking-wider text-[10px] font-mono">
                      <span>Einsatz-Auswahl & Status</span>
                      {isAdmin && onOpenCreateOperationModal && (
                        <button
                          onClick={() => {
                            setShowOpDropdown(false);
                            onOpenCreateOperationModal();
                          }}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-bold"
                        >
                          + Neuer Einsatz
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 my-1.5 pr-1">
                      {/* Section 1: Aktive Einsätze */}
                      <div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono px-2 py-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Aktive Einsätze ({allOperations.filter((o) => o.status === 'active').length})</span>
                        </div>
                        {allOperations.filter((o) => o.status === 'active').length === 0 ? (
                          <div className="px-3 py-2 bg-slate-900/60 rounded-xl text-[11px] text-slate-400 font-mono text-center">
                            Kein aktiver Einsatz läuft.
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {allOperations
                              .filter((o) => o.status === 'active')
                              .map((op) => (
                                <div
                                  key={op.id}
                                  onClick={() => {
                                    setCurrentOperationId(op.id);
                                    setActiveTab('map');
                                    setShowOpDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition cursor-pointer group ${
                                    op.id === currentOperation?.id
                                      ? 'bg-blue-600/30 text-blue-200 border border-blue-400'
                                      : 'hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                                  }`}
                                >
                                  <div className="truncate flex-1 mr-2">
                                    <div className="font-semibold flex items-center gap-1.5">
                                      <span>{op.type === 'operation' ? '🔴' : '🟠'}</span>
                                      <span className="truncate">{op.title}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">
                                      Vermisst: {op.missingPerson?.name || 'Unbekannt'} • #{op.id.slice(-4).toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                                      Aktiv
                                    </span>
                                    {onOpenOperationDetailModal && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentOperationId(op.id);
                                          setShowOpDropdown(false);
                                          onOpenOperationDetailModal();
                                        }}
                                        className="p-1 text-slate-400 hover:text-blue-300 hover:bg-blue-950/60 rounded border border-transparent hover:border-blue-700 transition cursor-pointer"
                                        title="Vermisstendossier & Einsatzdetails anzeigen"
                                      >
                                        <FileText className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const confirmed = window.confirm(
                                            `🚨 Einsatz "${op.title}" wirklich endgültig löschen?\n\nAlle Sektoren, Funde und Protokolle werden gelöscht.`
                                          );
                                          if (confirmed) {
                                            deleteOperation(op.id);
                                          }
                                        }}
                                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/60 rounded border border-transparent hover:border-red-800 transition cursor-pointer"
                                        title="Einsatz löschen"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Beendete Einsätze im Archiv */}
                      {allOperations.filter((o) => o.status === 'completed').length > 0 && (
                        <div className="pt-2 border-t border-slate-700/80">
                          <div className="text-[10px] font-bold text-slate-400 uppercase font-mono px-2 py-1 flex items-center justify-between">
                            <span>📦 Archivierte Einsätze ({allOperations.filter((o) => o.status === 'completed').length})</span>
                            <button
                              onClick={() => {
                                setActiveTab('archive');
                                setShowOpDropdown(false);
                              }}
                              className="text-blue-400 hover:underline text-[9px]"
                            >
                              Alle öffnen
                            </button>
                          </div>
                          <div className="space-y-1">
                            {allOperations
                              .filter((o) => o.status === 'completed')
                              .slice(0, 3)
                              .map((op) => (
                                <div
                                  key={op.id}
                                  onClick={() => {
                                    setActiveTab('archive');
                                    setShowOpDropdown(false);
                                  }}
                                  className="w-full text-left p-2 rounded-xl flex items-center justify-between transition cursor-pointer bg-slate-900/50 hover:bg-slate-800 text-slate-400 border border-slate-800 group"
                                >
                                  <div className="truncate flex-1 mr-2">
                                    <div className="font-medium text-xs text-slate-300 truncate">
                                      {op.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono truncate">
                                      Beendet: {op.completedAt ? new Date(op.completedAt).toLocaleDateString() : 'Archiv'}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                      Archiv
                                    </span>
                                    {canManageOps && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm(
                                              `🔄 Einsatz "${op.title}" reaktivieren und neue Suchphase starten?\n\nBisherige Sektoren & GPS-Suchspuren bleiben erhalten.`
                                            );
                                            if (confirmed) {
                                              reactivateOperation(op.id, {
                                                phaseTitle: 'Suchphase 2 (Reaktiviert)',
                                              });
                                              setActiveTab('map');
                                              setShowOpDropdown(false);
                                            }
                                          }}
                                          className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/60 rounded border border-transparent hover:border-emerald-800 transition cursor-pointer"
                                          title="Einsatz reaktivieren & neue Suchphase starten"
                                        >
                                          <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm(
                                              `🚨 Archivierten Einsatz "${op.title}" wirklich endgültig löschen?`
                                            );
                                            if (confirmed) {
                                              deleteOperation(op.id);
                                            }
                                          }}
                                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded border border-transparent hover:border-red-800 transition cursor-pointer"
                                          title="Einsatz löschen"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isAdmin && currentOperation && (
                      <div className="pt-2 border-t border-slate-700 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase font-mono px-1">
                          Einsatz-Steuerung (Beenden / Pausieren / Reaktivieren)
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {currentOperation.status === 'active' ? (
                            <button
                              onClick={() => {
                                setShowOpDropdown(false);
                                if (onOpenPauseOperationModal) {
                                  onOpenPauseOperationModal();
                                } else {
                                  pauseOperation(currentOperation.id, 'Einsatz pausiert');
                                }
                              }}
                              className="py-1.5 px-2 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-[10px] font-bold transition flex items-center justify-center gap-1 font-mono cursor-pointer"
                              title="Laufenden Einsatz pausieren"
                            >
                              ⏸️ Pausieren
                            </button>
                          ) : currentOperation.status === 'paused' ? (
                            <button
                              onClick={() => {
                                setShowOpDropdown(false);
                                resumeOperation(currentOperation.id);
                              }}
                              className="py-1.5 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition flex items-center justify-center gap-1 font-mono cursor-pointer"
                              title="Pausierten Einsatz fortsetzen"
                            >
                              ▶️ Fortsetzen
                            </button>
                          ) : null}

                          {onOpenEndOperationModal && currentOperation.status === 'active' && (
                            <button
                              onClick={() => {
                                setShowOpDropdown(false);
                                onOpenEndOperationModal();
                              }}
                              className="py-1.5 px-2 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[10px] font-bold transition flex items-center justify-center gap-1 font-mono cursor-pointer"
                              title="Einsatz beenden"
                            >
                              🛑 Beenden
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Responder List & Readiness Dropdown Button next to Operation selector */}
            <div className="relative inline-block shrink-0">
              <button
                onClick={() => {
                  setShowResponderListDropdown(!showResponderListDropdown);
                  setShowOpDropdown(false);
                  setShowSarAdminMenu(false);
                  setShowUserDropdown(false);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 cursor-pointer"
                title="Einsatzkräfte & Bereitschaftsliste öffnen"
              >
                <span>👥 Einsatzkräfte ({allUsers.filter(u => u.isActive).length})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showResponderListDropdown && (
                <>
                  <div className="fixed inset-0 z-[1050]" onClick={() => setShowResponderListDropdown(false)} />
                  <div className="fixed sm:absolute top-14 sm:top-full left-2 sm:left-0 right-2 sm:right-auto sm:w-96 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-3 z-[1200] text-xs animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-300 px-1 border-b border-slate-700 uppercase tracking-wider text-[10px] font-mono pb-1">
                      <span>Einsatzkräfte & Bereitschaft</span>
                      <span className="text-blue-400">{allUsers.filter(u => u.isActive).length} aktiv</span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {[...allUsers].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0)).map((user) => {
                        const isOnline = user.isActive;
                        const status = getUserArrivalStatus(user.id);
                        const loc = userLocations[user.id]?.currentPosition;
                        const distMeters = loc && currentOperation?.headquartersLocation ? calculateDistanceToEzMeters(loc.lat, loc.lng) : null;
                        const distText = distMeters !== null ? (distMeters >= 1000 ? `${(distMeters / 1000).toFixed(1)} km` : `${Math.round(distMeters)} m`) : 'Kein GPS';

                        let statusBadge = { label: 'In Anfahrt', color: 'bg-red-500/20 text-red-300 border-red-500/50', icon: '🔴' };
                        if (status === 'ready') {
                          statusBadge = { label: 'Bereit', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500', icon: '🟢' };
                        } else if (status === 'ez_reached') {
                          statusBadge = { label: 'EZ erreicht', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50', icon: '🟡' };
                        }

                        return (
                          <div
                            key={user.id}
                            className={`flex items-center justify-between p-2 rounded-lg border transition ${
                              isOnline
                                ? 'bg-slate-800/90 border-slate-700 text-slate-100'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-40 grayscale'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center font-bold text-xs text-white">
                                {user.photoUrl ? (
                                  <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                  user.name.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate flex items-center gap-1.5">
                                  <span className="truncate">{user.name}</span>
                                  {user.role === 'admin' && <span className="text-[9px] text-amber-400 font-mono">🛡️ EL</span>}
                                </div>
                                <div className="text-[9px] text-slate-400 font-mono truncate">
                                  {user.callSign} • {isOnline ? `${distText}` : 'Abgemeldet'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isOnline ? (
                                <>
                                  <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold flex items-center gap-0.5 ${statusBadge.color}`}>
                                    <span>{statusBadge.icon}</span>
                                    <span>{statusBadge.label}</span>
                                  </span>
                                  {isAdmin && status !== 'ready' && (
                                    <button
                                      onClick={() => confirmUserReady(user.id)}
                                      className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold font-mono cursor-pointer"
                                      title="Als Bereit bestätigen"
                                    >
                                      ✓
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                  Offline
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {isAdmin && onOpenCreateOperationModal && (
                      <div className="pt-2 border-t border-slate-700">
                        <button
                          onClick={() => {
                            setShowResponderListDropdown(false);
                            onOpenCreateOperationModal();
                          }}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow"
                        >
                          <span>+ Einsatz starten</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 min-w-0">
            {currentOperation && currentOperation.status === 'active' ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenOperationDetailModal) {
                    onOpenOperationDetailModal();
                  }
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 hover:border-blue-500/60 text-slate-200 transition cursor-pointer group shadow-sm text-left max-w-[210px] sm:max-w-[340px]"
                title="📋 Einsatzdetails & Vermisstensteckbrief anzeigen (Klicken für Foto, Details & Bearbeitung)"
              >
                <span className="flex items-center gap-1 shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isExercise ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-pulse'
                    }`}
                  />
                  <span className="font-bold tracking-tight font-mono text-[9px] text-slate-400 group-hover:text-blue-300 hidden sm:inline">
                    {isExercise ? 'ÜBUNG:' : 'AKTIV:'}
                  </span>
                </span>

                {currentOperation.missingPerson?.photoUrl ? (
                  <img
                    src={currentOperation.missingPerson.photoUrl}
                    alt="Vermisst"
                    className="w-4 h-4 rounded-full object-cover border border-slate-600 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[9px] shrink-0">
                    👤
                  </span>
                )}

                <span className="font-semibold truncate text-[10px] sm:text-xs text-white group-hover:text-blue-200">
                  {currentOperation.title}
                </span>

                {currentOperation.missingPerson?.name && (
                  <span className="text-[10px] text-slate-400 font-normal truncate hidden md:inline">
                    ({currentOperation.missingPerson.name})
                  </span>
                )}

                <span className="text-[9px] font-mono text-blue-400 opacity-70 group-hover:opacity-100 shrink-0 ml-0.5">
                  ℹ️ Details
                </span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-sm my-2 p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span className="font-mono text-slate-400 font-medium text-xs">Bereitschaft (Kein aktiver Einsatz)</span>
                </div>

                {/* Active user list placed directly above the Einsatz starten button */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <div className="text-[10px] font-bold text-slate-400 font-mono uppercase px-1">
                    Aktive Einsatzkräfte ({allUsers.filter(u => u.isActive).length}/{allUsers.length}):
                  </div>
                  {[...allUsers].sort((a, b) => {
                    if (a.isActive && !b.isActive) return -1;
                    if (!a.isActive && b.isActive) return 1;
                    return a.name.localeCompare(b.name);
                  }).map((u) => {
                    const arrivalStatus = getUserArrivalStatus ? getUserArrivalStatus(u.id) : 'in_transit';
                    const statusColor = !u.isActive
                      ? 'bg-slate-800 text-slate-500 border-slate-700'
                      : arrivalStatus === 'ready'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/70'
                      : arrivalStatus === 'ez_reached'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/70'
                      : 'bg-red-950/60 text-red-300 border-red-600/70';

                    const statusText = !u.isActive
                      ? 'Abgemeldet'
                      : arrivalStatus === 'ready'
                      ? '🟢 Bereit'
                      : arrivalStatus === 'ez_reached'
                      ? '🟡 EZ erreicht'
                      : '🔴 In Anfahrt';

                    return (
                      <div
                        key={u.id}
                        className={`p-2 rounded-xl border flex items-center justify-between text-[11px] transition ${
                          !u.isActive
                            ? 'opacity-50 grayscale bg-slate-950/60 border-slate-900 text-slate-500'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-6 w-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                            {u.photoUrl ? (
                              <img src={u.photoUrl} alt={u.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {u.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold truncate">
                              {u.callSign || u.name}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono truncate">
                              {u.role === 'admin' ? '🛡️ Admin' : '🚶 Sucher'} • {u.licensePlate || 'Kein KFZ'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold ${statusColor}`}>
                            {statusText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAdmin && onOpenCreateOperationModal && (
                  <button
                    onClick={onOpenCreateOperationModal}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>+ Einsatz starten</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Desktop Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'map'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Lagekarte
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'sectors'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Sektoren ({currentOperation?.sectors.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer relative ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Funk / Chat
          {unreadChatCount > 0 && (
            <span className="h-4 min-w-[16px] px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center font-mono animate-pulse">
              {unreadChatCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('responders')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'responders'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Kräfte ({allUsers.filter((u) => u.isActive).length})
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'log'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Tagebuch
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'archive'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          Archiv
        </button>
      </nav>

      {/* Right Controls: Actions, Telemetry & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">


        {/* Quick Action: Einsatz beenden button directly for Admins */}
        {isAdmin && onOpenEndOperationModal && currentOperation?.status !== 'completed' && (
          <button
            onClick={onOpenEndOperationModal}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow font-mono uppercase cursor-pointer"
            title="Diesen Einsatz beenden und archivieren"
          >
            <span>🛑</span>
            <span>Einsatz beenden</span>
          </button>
        )}

        {/* Cloud Sync Status Indicator */}
        <div
          className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition ${
            cloudSyncStatus === 'connected'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
              : cloudSyncStatus === 'quota_exceeded'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title={
            cloudSyncStatus === 'connected'
              ? 'Firebase Firestore Cloud-Sync ist aktiv'
              : cloudSyncStatus === 'quota_exceeded'
              ? 'Tägliches Firestore Free-Tier Schreiblimit erreicht. Lokaler Multi-Tab-Funk & Speicherung aktiv.'
              : 'Offline-Modus aktiv'
          }
        >
          {cloudSyncStatus === 'connected' ? (
            <>
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span>CLOUD: AKTIV</span>
            </>
          ) : cloudSyncStatus === 'quota_exceeded' ? (
            <>
              <CloudOff className="w-3 h-3 text-amber-400" />
              <span>CLOUD: LIMIT (LOKAL AKTIV)</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3 h-3 text-slate-400" />
              <span>OFFLINE</span>
            </>
          )}
        </div>

        {/* GPS Mode toggle */}
        <button
          onClick={toggleRealGps}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition cursor-pointer ${
            isRealGpsActive
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Echtes Smartphone/Browser GPS aktivieren"
        >
          <Navigation className="w-3 h-3" />
          <span>GPS: {isRealGpsActive ? 'ECHT' : 'SIM'}</span>
        </button>

        {/* Share App / QR Code Button */}
        {onOpenShareAppModal && (
          <button
            onClick={onOpenShareAppModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-700/60 transition cursor-pointer text-[10px] font-mono font-bold shadow-sm"
            title="App per QR-Code oder Direktlink an andere Einsatzkräfte teilen"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">TEILEN / QR</span>
          </button>
        )}

        {/* User Profile Lockup & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown((prev) => {
                const next = !prev;
                if (next) {
                  setShowSarAdminMenu(false);
                  setShowOpDropdown(false);
                  setShowResponderListDropdown(false);
                }
                return next;
              });
            }}
            className="flex items-center gap-2 sm:gap-3 p-1 rounded-xl hover:bg-slate-800 transition cursor-pointer text-left"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-bold text-slate-100">{currentUser?.name || 'Benutzer'}</p>
              <p className="text-[10px] text-emerald-400 font-medium uppercase font-mono tracking-wide">
                {currentUser?.role === 'admin' ? 'EINSATZLEITUNG' : (currentUser?.callSign || 'EINSATZKRAFT')}
              </p>
            </div>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center overflow-hidden shadow">
              {currentUser?.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-white uppercase">{currentUser?.name.charAt(0) || 'U'}</span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-[1150]"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="fixed sm:absolute top-14 sm:top-full right-2 sm:right-0 left-2 sm:left-auto sm:w-80 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-3 z-[1200] text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-700 mb-2">
                  <div className="font-bold text-white text-sm">{currentUser?.name}</div>
                  <div className="text-blue-400 font-mono text-[11px]">{currentUser?.callSign}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5 font-mono">
                    KFZ: {currentUser?.licensePlate || 'k.A.'} • {currentUser?.role === 'admin' ? 'ELZ (Admin)' : 'Einsatzkraft'}
                  </div>
                </div>

                <div className="space-y-1 mb-2 font-mono">
                  <button
                    onClick={() => {
                      onOpenProfileModal();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-100 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition cursor-pointer text-left font-bold"
                  >
                    <span>⚙️</span> Mein Profil, Ausrüstung & KFZ
                  </button>

                  <button
                    onClick={() => {
                      requestLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-red-400 hover:bg-red-900/30 font-bold transition cursor-pointer text-left border border-transparent hover:border-red-500/30"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Abmelden (Logout)</span>
                  </button>
                </div>

              {isAdmin && (
                <div className="border-t border-slate-700 pt-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase px-2 mb-1 font-mono flex items-center justify-between">
                    <span>Einsatzleitung: Accounts</span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">Admin</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {allUsers.map((u) => (
                      <div
                        key={u.id}
                        className={`w-full flex items-center justify-between p-1.5 rounded-xl transition ${
                          u.id === currentUser?.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => {
                            switchUser(u.id);
                            setShowUserDropdown(false);
                          }}
                          className="flex-1 flex items-center gap-2 truncate cursor-pointer text-left"
                        >
                          <span className="text-sm">
                            {u.role === 'admin'
                              ? '🛡️'
                              : u.equipment.includes('drone')
                              ? '🚁'
                              : u.equipment.includes('k9_mantrailer') || u.equipment.includes('k9_area')
                              ? '🐕'
                              : '👤'}
                          </span>
                          <div className="truncate">
                            <div className="font-semibold text-xs leading-none">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.callSign}</div>
                          </div>
                        </button>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {onOpenEditUser && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowUserDropdown(false);
                                onOpenEditUser(u);
                              }}
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                              title="Diesen Account bearbeiten / löschen"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                          {u.role === 'admin' && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-red-900/60 text-red-300 font-mono font-bold">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  );
};
