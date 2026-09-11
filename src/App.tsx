import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HUD from './components/HUD';
import StartScreen from './screens/StartScreen';
import './styles/game.css';

const WorldMap = lazy(() => import('./screens/WorldScreen'));
const QuestBoard = lazy(() => import('./screens/QuestBoard'));
const SkillTree = lazy(() => import('./screens/SkillTree'));
const AchievementRoom = lazy(() => import('./screens/AchievementRoom'));
const MemoryGallery = lazy(() => import('./screens/MemoryGallery'));
const RecruiterMode = lazy(() => import('./screens/RecruiterMode'));
const ContactPortal = lazy(() => import('./screens/ContactPortal'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}
function Fallback() { return <div className="page wrap" aria-busy="true"><p className="hud-text" style={{ color: 'var(--muted)' }}>Entering…</p></div>; }

function Shell() {
  const { pathname } = useLocation();
  return (
    <>
      {pathname !== '/' && <HUD />}
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/world" element={<WorldMap />} />
          <Route path="/world/:id" element={<WorldMap />} />
          <Route path="/quests" element={<QuestBoard />} />
          <Route path="/quests/:id" element={<QuestBoard />} />
          <Route path="/skills" element={<SkillTree />} />
          <Route path="/achievements" element={<AchievementRoom />} />
          <Route path="/memories" element={<MemoryGallery />} />
          <Route path="/recruiter" element={<RecruiterMode />} />
          <Route path="/contact" element={<ContactPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
export default function App() { return <BrowserRouter><Shell /></BrowserRouter>; }
