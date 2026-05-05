import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Dashboard     from './pages/Dashboard'
import ProfileFields from './pages/ProfileFields'
import Questions     from './pages/Questions'
import Sections      from './pages/Sections'
import Campaigns     from './pages/Campaigns'
import Analytics     from './pages/Analytics'
import ServiceAreas  from './pages/ServiceAreas'
import AuditLog      from './pages/AuditLog'

const IC = {
  dash:      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  campaigns: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sections:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  areas:     <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  questions: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  profile:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  analytics: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></svg>,
  audit:     <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  logout:    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

const NAV_PESQUISA = [
  { to: '/admin',                label: 'Visão Geral',           icon: IC.dash,      end: true },
  { to: '/admin/campaigns',      label: 'Campanhas',             icon: IC.campaigns },
  { to: '/admin/areas',          label: 'Áreas / Serviços',      icon: IC.areas },
  { to: '/admin/sections',       label: 'Seções',                icon: IC.sections },
  { to: '/admin/questions',      label: 'Perguntas',             icon: IC.questions },
  { to: '/admin/profile-fields', label: 'Perfil do Respondente', icon: IC.profile },
  { to: '/admin/analytics',      label: 'Analytics',             icon: IC.analytics },
]

const NAV_ADM = [
  { to: '/admin/audit', label: 'Auditoria', icon: IC.audit },
]

function initials(email = '') {
  const name  = email.split('@')[0]
  const parts = name.split(/[._-]/)
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function CollapseIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function AdminApp() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [campaign, setCampaign]   = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    supabase.from('campaigns').select('title, ends_at').eq('active', true).maybeSingle()
      .then(({ data }) => setCampaign(data ?? null))
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const email = session?.user?.email ?? ''
  const av    = initials(email)
  const cls   = collapsed ? ' collapsed' : ''

  return (
    <>
      <div className="adm-stripe" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className={'adm-layout' + cls}>

        <aside className={'adm-sidebar' + cls}>
          <div className="adm-sidebar-brand">
            <img src="/assets/logpmp.png" alt="Prefeitura de Parintins" />
            <div className="adm-sb-meta">
              <div className="adm-sb-eyebrow">SEFIN</div>
              <div className="adm-sb-title">Painel Admin</div>
            </div>
            <button className="adm-sb-collapse" onClick={() => setCollapsed((c) => !c)} title={collapsed ? 'Expandir menu' : 'Retrair menu'}>
              <CollapseIcon collapsed={collapsed} />
            </button>
          </div>

          <div className="adm-sb-section"><span className="adm-sb-lbl">Pesquisa</span></div>
          <nav className="adm-nav">
            {NAV_PESQUISA.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => 'adm-nav-item' + (isActive ? ' active' : '')}
                title={collapsed ? n.label : undefined}>
                <span className="adm-nav-icon">{n.icon}</span>
                <span className="adm-nav-label">{n.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="adm-sb-section"><span className="adm-sb-lbl">Administração</span></div>
          <nav className="adm-nav">
            {NAV_ADM.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => 'adm-nav-item' + (isActive ? ' active' : '')}
                title={collapsed ? n.label : undefined}>
                <span className="adm-nav-icon">{n.icon}</span>
                <span className="adm-nav-label">{n.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="adm-sb-cycle" style={!campaign ? { opacity: .55 } : {}}>
            <div className="adm-sb-cycle-lab">Ciclo Ativo</div>
            <div className="adm-sb-cycle-title">{campaign ? campaign.title : 'Nenhum'}</div>
            {campaign && (
              <>
                <div className="adm-sb-cycle-bar"><i style={{ width: '60%' }} /></div>
                <div className="adm-sb-cycle-stats">
                  <span>em andamento</span>
                  {campaign.ends_at && <span>até <b>{campaign.ends_at}</b></span>}
                </div>
              </>
            )}
          </div>

          <div className="adm-sb-user">
            <div className="adm-av">{av}</div>
            <div className="adm-sb-user-info">
              <div className="adm-sb-user-name">{email}</div>
              <div className="adm-sb-user-role">Administrador</div>
            </div>
            <button className="adm-sb-logout" onClick={handleSignOut} title="Sair">
              {IC.logout}
            </button>
          </div>
        </aside>

        <div className="adm-main">
          <header className="adm-topbar">
            <div className="adm-tb-left" />
            <div className="adm-tb-right">
              {campaign ? (
                <div className="adm-tb-campaign">
                  <span className="adm-ds" />
                  {campaign.title} · em andamento
                </div>
              ) : (
                <div className="adm-tb-campaign adm-tb-inactive">
                  <span className="adm-ds" />
                  Sem campanha ativa
                </div>
              )}
            </div>
          </header>

          <div className="adm-content">
            <Routes>
              <Route index               element={<Dashboard />} />
              <Route path="profile-fields" element={<ProfileFields />} />
              <Route path="questions"      element={<Questions />} />
              <Route path="areas"          element={<ServiceAreas />} />
              <Route path="sections"       element={<Sections />} />
              <Route path="campaigns"      element={<Campaigns />} />
              <Route path="analytics"      element={<Analytics />} />
              <Route path="audit"          element={<AuditLog />} />
            </Routes>
          </div>
        </div>

      </div>
    </>
  )
}
