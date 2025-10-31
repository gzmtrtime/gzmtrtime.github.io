import React, {useState, useEffect} from 'react'
import { loadRecentStations } from '../utils'

export default function SearchPage({onSelect, stationMeta}){
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(()=>{
    setRecent(loadRecentStations())
  },[])

  useEffect(()=>{
    if(!query) { setResults([]); return }
    const q = query.toLowerCase()
    const all = stationMeta?.lines?.flatMap(l=>l.stationList.map(s=>({...s, lineC: l.cname, lineE: l.ename}))) || []
    setResults(all.filter(s=> (s.cname||s.ename||'').toLowerCase().includes(q) ))
  },[query, stationMeta])

  return (
    <div className="p-4">
      <div>
        <input className="w-full p-2 border rounded" placeholder="搜索车站名称" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">最近搜索</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {recent.length===0 && <div className="text-sm text-gray-500">历史记录</div>}
          {recent.map(s=> (
            <button key={s.stationNo} className="px-3 py-1 border rounded" onClick={()=>onSelect(s)}>{s.cname || s.ename}</button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {results.map(r => (
          <div key={r.stationNo} className="py-2 border-b cursor-pointer" onClick={()=>onSelect(r)}>
            <div className="font-medium">{r.cname || r.ename}</div>
            <div className="text-sm text-gray-500">{r.cname || r.ename} · {r.stationNo}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
