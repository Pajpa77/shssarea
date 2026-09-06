import React, { useState, useEffect } from 'react';
import { RescueProvider, useRescue } from './context/RescueContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { TacticalMap } from './components/TacticalMap';
import { SectorOverview } from './components/SectorOverview';
import { ChatPanel } from './components/ChatPanel';
import { ResponderList } from './components/ResponderList';
import { MissionLog } from './components/MissionLog';
import { OperationsArchive } from './components/OperationsArchive';

import { FindingModal } from './components/FindingModal';
import { FindingDetailModal } from './components/FindingDetailModal';
import { SectorEditorModal } from './components/SectorEditorModal';
import { UserManagementModal } from './components/UserManagement';
import { OperationCreatorModal } from './components/OperationCreatorModal';
import { OperationDetailModal } from './components/OperationDetailModal';
import { OperationEndModal } from './components/OperationEndModal';
import { OperationPauseModal } from './components/OperationPauseModal';
import { ProfileModal } from './components/ProfileModal';
import { ShareAppModal } from './components/ShareAppModal';
import { SearchTeamsModal } from './components/SearchTeamsModal';
import { TrackingTestOverlay } from './components/TrackingTestOverlay';
import { QuotaNotificationBanner } from './components/QuotaNotificationBanner';

import { useWakeLock } from './hooks/useWakeLock';
import { usePWAInstall } from './hooks/usePWAInstall';

import { Finding, SearchSector, User } from './types';
import {
  AlertTriangle,
  Layers,
  Plus,
  Compass,
  Radio,
  User as UserIcon,
  Shield,
  Eye,
  CheckCircle2,
  FileText,
  Archive,
  MapPin,
  MessageSquare,
  Users,
  Minus,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentUser,
    currentOperation,
    isOperationActive,
    setSectorStatus,
    chatMessages,
    unreadChatCount,
    markChatAsRead,
    activeAlertNotification,
    setActiveAlertNotification,
    isLogoutConfirmOpen,
    cancelLogout,
    confirmLogout,
    authNotification,
    clearAuthNotification,
    uiScale,
    setUiScale,
    activeTrackingTest,
  } = useRescue();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  
  // Prevent accidental page leave
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentUser) {
        // Most modern browsers require setting returnValue to a non-empty string to trigger the dialog
        // The actual string is usually ignored and replaced by a browser-default message
        event.preventDefault();
        event.returnValue = ''; 
        return '';
      }
    };

    const handleUnload = () => {
      if (currentUser) {
        // Best-effort cleanup: Ensure local session is cleared on actual close
        // This ensures the user is "logged out" from the local perspective
        localStorage.removeItem('rescue_app_current_user_id_slk_v4');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [currentUser]);

  // Activate Wake Lock if operation is active OR tracking test is active
  const isTrackingActive = !!(isOperationActive || activeTrackingTest);
  useWakeLock(isTrackingActive);

  // Apply UI Scale to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--ui-scale', uiScale.toString());
  }, [uiScale]);

  const [activeTab, setActiveTab] = useState<'admin' | 'map' | 'sectors' | 'chat' | 'responders' | 'log' | 'archive'>('map');

  // Automatically clear unread badge when opening chat
  useEffect(() => {
    if (activeTab === 'chat') {
      markChatAsRead();
    }
  }, [activeTab, markChatAsRead]);

  // Modals state
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [sectorToEdit, setSectorToEdit] = useState<SearchSector | null>(null);
  const [isSectorEditorOpen, setIsSectorEditorOpen] = useState(false);
  const [isDrawingSector, setIsDrawingSector] = useState(false);
  const [pendingPolygon, setPendingPolygon] = useState<[number, number][] | undefined>(undefined);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isOperationCreatorOpen, setIsOperationCreatorOpen] = useState(false);
  const [operationCreatorMode, setOperationCreatorMode] = useState<'create' | 'edit'>('create');
  const [isOperationDetailModalOpen, setIsOperationDetailModalOpen] = useState(false);
  const [isOperationEndModalOpen, setIsOperationEndModalOpen] = useState(false);
  const [isOperationPauseModalOpen, setIsOperationPauseModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShareAppModalOpen, setIsShareAppModalOpen] = useState(false);
  const [isSearchTeamsModalOpen, setIsSearchTeamsModalOpen] = useState(false);
  const [directChatTarget, setDirectChatTarget] = useState<User | null>(null);

  // If not authenticated, show login
  if (!currentUser) {
    return <LoginScreen />;
  }

  const isAdmin = currentUser.role === 'admin';

  const isAnyModalOpen =
    isFindingModalOpen ||
    !!selectedFinding ||
    isSectorEditorOpen ||
    isUserManagementOpen ||
    isOperationCreatorOpen ||
    isOperationDetailModalOpen ||
    isOperationEndModalOpen ||
    isOperationPauseModalOpen ||
    isProfileOpen ||
    isShareAppModalOpen ||
    isSearchTeamsModalOpen;

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-[#0F172A] font-sans text-slate-200 overflow-hidden select-none">
      <TrackingTestOverlay />
      {/* Active Alert Notification Modal */}
      {activeAlertNotification && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow animate-pulse">
                🚨
              </div>
              <div>
                <h3 className="font-bold text-base text-red-200 uppercase tracking-wide">
                  {activeAlertNotification.title}
                </h3>
                <span className="text-[10px] text-red-300 font-mono">
                  {activeAlertNotification.timestamp}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-100 bg-red-900/50 p-3 rounded-xl border border-red-700 font-medium">
              {activeAlertNotification.message}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveAlertNotification(null)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition"
              >
                Zur Kenntnis genommen & Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && currentUser && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border-2 border-amber-500 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-base text-amber-300 uppercase tracking-wide">
                  Abmeldung bestätigen
                </h3>
                <span className="text-[10px] text-slate-400">
                  Sicherheitsabfrage für Einsatzkraft
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-200 bg-slate-900 p-3.5 rounded-xl border border-slate-700 font-sans leading-relaxed">
              Möchten Sie sich wirklich von Ihrem aktuellen Account abmelden?
              <br />
              <strong className="text-white font-mono mt-1 block">
                {currentUser.name} ({currentUser.callSign || currentUser.role})
              </strong>
              <span className="text-xs text-slate-400 block mt-1">
                Dieser Logout wird im Einsatzprotokoll dokumentiert und ändert Ihren Status auf offline.
              </span>
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancelLogout}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase cursor-pointer transition border border-slate-600"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition flex items-center gap-2"
              >
                <span>Ja, abmelden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth / Login Success Notification Toast */}
      {authNotification && (
        <div className="fixed top-20 right-4 z-[3200] max-w-md bg-slate-900 border-2 border-blue-500 rounded-2xl p-4 shadow-2xl text-white flex items-center justify-between gap-4 animate-in slide-in-from-top-5 duration-200 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center shrink-0">
              {authNotification.type === 'login' ? '🟢' : '⚠️'}
            </div>
            <div>
              <div className="text-xs font-bold text-blue-200 uppercase">
                {authNotification.type === 'login' ? 'Anmeldung erfolgreich' : 'Abgemeldet'}
              </div>
              <div className="text-xs text-slate-100 font-sans mt-0.5">{authNotification.message}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{authNotification.timestamp}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAuthNotification}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quota Exhaustion Fallback Banner */}
      <QuotaNotificationBanner />

      {/* PWA Install Banner */}
      {(!isInstalled && (isInstallable || isIOS)) && (
        <div className="fixed bottom-20 left-4 right-4 z-[2500] bg-blue-900/90 border-2 border-blue-400 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Plus className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                App installieren für Hintergrund-Tracking
              </h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                {isIOS 
                  ? 'Tippe auf das Teilen-Icon und "Zum Home-Bildschirm", damit die Synchronisierung auch im Hintergrund zuverlässig funktioniert.'
                  : 'Installiere die App als Web-App, um eine stabile Echtzeit-Synchronisierung im Hintergrund zu gewährleisten.'}
              </p>
              {isInstallable && (
                <button
                  onClick={install}
                  className="mt-3 px-4 py-2 bg-white text-blue-900 rounded-lg font-bold text-xs uppercase tracking-wide transition active:scale-95 shadow-lg"
                >
                  Jetzt Installieren
                </button>
              )}
            </div>
            <button 
              onClick={() => { /* Could add a "dismiss" state if needed */ }}
              className="text-blue-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* UI Zoom Controls - Floating for Mobile Precision */}
      <div className="fixed top-24 left-4 z-[2000] flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-1 p-1.5 bg-slate-900/95 border-2 border-slate-700 rounded-2xl shadow-2xl backdrop-blur-lg pointer-events-auto ring-1 ring-white/10">
          <button
            onClick={() => setUiScale(uiScale + 0.1)}
            className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-blue-400 active:text-white rounded-xl transition-all active:scale-90 cursor-pointer shadow-inner"
            title="UI Vergrößern"
          >
            <Plus className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center py-1.5 select-none">
            <span className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-tighter">Scale</span>
            <span className="text-[11px] font-black text-blue-400 font-mono leading-none">{Math.round(uiScale * 100)}%</span>
          </div>
          <button
            onClick={() => setUiScale(uiScale - 0.1)}
            className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-blue-400 active:text-white rounded-xl transition-all active:scale-90 cursor-pointer shadow-inner"
            title="UI Verkleinern"
          >
            <Minus className="w-6 h-6" />
          </button>
          <button
            onClick={() => setUiScale(1.0)}
            className="mt-1.5 w-11 h-9 flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-white rounded-lg transition-all active:scale-95 cursor-pointer text-[9px] font-black uppercase border border-slate-800"
            title="UI Reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Top Tactical Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFindingModal={() => setIsFindingModalOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenLoginModal={() => {}}
        onOpenEndOperationModal={() => setIsOperationEndModalOpen(true)}
        onOpenPauseOperationModal={() => setIsOperationPauseModalOpen(true)}
        onOpenCreateOperationModal={() => {
          setOperationCreatorMode('create');
          setIsOperationCreatorOpen(true);
        }}
        onOpenEditOperationModal={() => {
          setOperationCreatorMode('edit');
          setIsOperationCreatorOpen(true);
        }}
        onOpenOperationDetailModal={() => {
          setIsOperationDetailModalOpen(true);
        }}
        onStartDrawingSector={() => {
          setActiveTab('map');
          setSectorToEdit(null);
          setPendingPolygon(undefined);
          setIsDrawingSector(true);
        }}
        onOpenCreateUserModal={() => {
          setUserToEdit(null);
          setIsUserManagementOpen(true);
        }}
        onOpenEditUser={(user) => {
          setUserToEdit(user);
          setIsUserManagementOpen(true);
        }}
        onOpenShareAppModal={() => setIsShareAppModalOpen(true)}
        isAnyModalOpen={isAnyModalOpen}
      />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0F172A]">
        {activeTab === 'map' && (
          <div className="flex-1 relative flex flex-col h-full w-full">
            <TacticalMap
              onOpenFindingDetail={(f) => setSelectedFinding(f)}
              onOpenSectorEditor={(s) => {
                setSectorToEdit(s);
                setIsSectorEditorOpen(true);
              }}
              onStartFreehandDrawing={() => {
                setSectorToEdit(null);
                setPendingPolygon(undefined);
                setIsDrawingSector(true);
              }}
              isDrawingSector={isDrawingSector}
              onFinishDrawing={(coords) => {
                setPendingPolygon(coords);
                setIsDrawingSector(false);
                setIsSectorEditorOpen(true);
              }}
              onCancelDrawing={() => {
                setIsDrawingSector(false);
              }}
              onOpenDirectChat={(user) => {
                setDirectChatTarget(user);
                setActiveTab('chat');
              }}
            />

            {/* Geometric Floating Action & Tab Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md z-[850] max-w-[95vw]">
              <button
                onClick={() => setActiveTab('sectors')}
                className="flex flex-col items-center gap-1 w-14 sm:w-20 group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:bg-slate-700 transition">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-slate-300">Sektoren</span>
              </button>

              <button
                onClick={() => setActiveTab('responders')}
                className="flex flex-col items-center gap-1 w-14 sm:w-20 group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:bg-slate-700 transition">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-slate-300">Kräfte</span>
              </button>

              <div className="h-8 sm:h-10 w-px bg-slate-700"></div>

              {/* Central Prominent FUND! Action */}
              <button
                onClick={() => setIsFindingModalOpen(true)}
                className="flex flex-col items-center gap-1 w-16 sm:w-20 group cursor-pointer"
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 -mt-2.5 sm:-mt-3 rounded-full bg-red-600 border-4 border-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:bg-red-500 transition active:scale-95 animate-pulse">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-500">FUND!</span>
              </button>

              <div className="h-8 sm:h-10 w-px bg-slate-700"></div>

              <button
                onClick={() => setActiveTab('chat')}
                className="flex flex-col items-center gap-1 w-14 sm:w-20 group cursor-pointer relative"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:bg-slate-700 transition">
                  <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-slate-300">Funk</span>
                {unreadChatCount > 0 && (
                  <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {unreadChatCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('archive')}
                className="flex flex-col items-center gap-1 w-14 sm:w-20 group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:bg-slate-700 transition">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-slate-300">Archiv</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sectors' && (
          <div className="flex-1 overflow-y-auto pb-16 bg-[#0F172A]">
            <SectorOverview
              onOpenSectorEditor={(sec) => {
                setSectorToEdit(sec || null);
                setIsSectorEditorOpen(true);
              }}
              onFocusSectorOnMap={() => {
                setActiveTab('map');
              }}
              onOpenSearchTeams={() => setIsSearchTeamsModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden pb-14 lg:pb-0 bg-[#0F172A]">
            <ChatPanel initialDirectUser={directChatTarget} />
          </div>
        )}

        {activeTab === 'responders' && (
          <div className="flex-1 overflow-y-auto pb-16 bg-[#0F172A]">
            <ResponderList
              onOpenCreateUser={() => {
                setUserToEdit(null);
                setIsUserManagementOpen(true);
              }}
              onOpenDirectChat={(user) => {
                setDirectChatTarget(user);
                setActiveTab('chat');
              }}
              onOpenSearchTeams={() => setIsSearchTeamsModalOpen(true)}
              onFocusUserOnMap={() => setActiveTab('map')}
            />
          </div>
        )}

        {activeTab === 'log' && (
          <div className="flex-1 overflow-y-auto pb-16 bg-[#0F172A]">
            <MissionLog />
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="flex-1 overflow-y-auto pb-16 bg-[#0F172A]">
            <OperationsArchive onNavigateToMap={() => setActiveTab('map')} />
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="lg:hidden h-14 bg-slate-900/95 border-t border-slate-700 flex items-center justify-around px-2 z-[900] shrink-0 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'map' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Karte</span>
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'sectors' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sektoren</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer relative ${
            activeTab === 'chat' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Funk</span>
          {unreadChatCount > 0 && (
            <span className="absolute top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[8px] flex items-center justify-center animate-pulse">
              {unreadChatCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('responders')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'responders' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kräfte</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'log' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Protokoll</span>
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'archive' ? 'text-blue-400 bg-slate-800 font-bold border border-slate-700' : 'text-slate-400'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Archiv</span>
        </button>
      </nav>

      {/* Modals */}
      <FindingModal
        isOpen={isFindingModalOpen}
        onClose={() => setIsFindingModalOpen(false)}
      />

      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

      <SectorEditorModal
        sector={sectorToEdit}
        isOpen={isSectorEditorOpen}
        pendingPolygon={pendingPolygon}
        onStartDrawing={() => {
          setIsSectorEditorOpen(false);
          setActiveTab('map');
          setIsDrawingSector(true);
        }}
        onClose={() => {
          setIsSectorEditorOpen(false);
          setSectorToEdit(null);
          setPendingPolygon(undefined);
        }}
      />

      <UserManagementModal
        userToEdit={userToEdit}
        isOpen={isUserManagementOpen}
        onClose={() => {
          setIsUserManagementOpen(false);
          setUserToEdit(null);
        }}
      />

      <OperationCreatorModal
        isOpen={isOperationCreatorOpen}
        mode={operationCreatorMode}
        onClose={() => setIsOperationCreatorOpen(false)}
        onStartDrawingSector={() => {
          setActiveTab('map');
          setSectorToEdit(null);
          setPendingPolygon(undefined);
          setIsDrawingSector(true);
        }}
      />

      <OperationDetailModal
        isOpen={isOperationDetailModalOpen}
        onClose={() => setIsOperationDetailModalOpen(false)}
        onOpenEditOperation={() => {
          setIsOperationDetailModalOpen(false);
          setOperationCreatorMode('edit');
          setIsOperationCreatorOpen(true);
        }}
        onNavigateToMapPoint={() => {
          setIsOperationDetailModalOpen(false);
          setActiveTab('map');
        }}
      />

      <OperationEndModal
        isOpen={isOperationEndModalOpen}
        onClose={() => setIsOperationEndModalOpen(false)}
        onSuccessNavigateToMap={() => {
          setIsOperationEndModalOpen(false);
          setActiveTab('map');
        }}
      />

      <OperationPauseModal
        isOpen={isOperationPauseModalOpen}
        onClose={() => setIsOperationPauseModalOpen(false)}
        onSuccessNavigateToMap={() => {
          setIsOperationPauseModalOpen(false);
          setActiveTab('map');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <ShareAppModal
        isOpen={isShareAppModalOpen}
        onClose={() => setIsShareAppModalOpen(false)}
      />

      <SearchTeamsModal
        isOpen={isSearchTeamsModalOpen}
        onClose={() => setIsSearchTeamsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <RescueProvider>
      <MainApp />
    </RescueProvider>
  );
}
