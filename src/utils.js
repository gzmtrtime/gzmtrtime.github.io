/* -----------------------------------------
  File: src/utils.js
------------------------------------------*/

export function secondsToHHMMSS(s) {
  const sec = Number(s) || 0
  const hh = Math.floor(sec / 3600) % 24
  const mm = Math.floor((sec % 3600) / 60)
  const ss = sec % 60
  const pad = n => String(n).padStart(2, '0')
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`
}

export function nowSecondsSinceMidnight() {
  const d = new Date()
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
}

export function saveRecentStation(station) {
  const key = 'recentStations'
  const raw = localStorage.getItem(key)
  const arr = raw ? JSON.parse(raw) : []
  // keep unique most recent
  const filtered = [station, ...arr.filter(s => s.stationNo !== station.stationNo)]
  localStorage.setItem(key, JSON.stringify(filtered.slice(0, 10)))
}

export function loadRecentStations() {
  return JSON.parse(localStorage.getItem('recentStations') || '[]')
}
