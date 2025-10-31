import React, {useEffect, useState} from 'react'
import SearchPage from './components/SearchPage'
import StationSelect from './components/StationSelect'
import Timetable from './components/Timetable'

export default function App(){
  const [stationMeta, setStationMeta] = useState(null)
  const [tab, setTab] = useState('search') // search | select
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    fetch('/data/station-meta.json').then(r=>r.json()).then(j=> setStationMeta(j)).catch(err=>{
      console.error('failed to load station-meta', err)
      setStationMeta({lines:[]})
    })
  },[])

  const onSelect = (station) => {
    setSelected(station)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold">地铁时刻表</div>
        <nav className="space-x-2">
          <button className={`px-3 py-1 ${tab==='search' ? 'bg-blue-600 text-white rounded' : ''}`} onClick={()=>setTab('search')}>搜索</button>
          <button className={`px-3 py-1 ${tab==='select' ? 'bg-blue-600 text-white rounded' : ''}`} onClick={()=>setTab('select')}>站点列表</button>
        </nav>
      </header>

      <main className="p-4">
        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow">
              {tab==='search' ? <SearchPage onSelect={onSelect} stationMeta={stationMeta} /> : <StationSelect stationMeta={stationMeta} onSelect={onSelect} />}
            </div>
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold">一览</h3>
              <p className="text-sm text-gray-600">选择车站即可查看详细时刻表。最近 10 次搜索记录将保存在本地。</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded shadow">
            <div className="p-2 border-b flex items-center justify-between">
              <div>
                <button className="text-sm text-blue-600 mr-2" onClick={()=>setSelected(null)}>← 返回</button>
                <span className="font-semibold">{selected.cname || selected.ename}</span>
              </div>
            </div>
            <Timetable station={selected} lineMetas={stationMeta.lines} />
          </div>
        )}
      </main>

      {/* <footer className="p-4 text-center text-sm text-gray-500">
        Data served from <code>/data/</code> — update the JSON files in your repo daily and GitHub Pages will serve them.
      </footer> */}
    </div>
  )
}