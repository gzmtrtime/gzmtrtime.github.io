import React, { useEffect, useState, useRef } from 'react'
import { secondsToHHMMSS, nowSecondsSinceMidnight, saveRecentStation } from '../utils'

export default function Timetable({ station }) {
  const [data, setData] = useState(null)
  const containerRef = useRef(null)
  const rowRefs = useRef({})

  useEffect(() => {
    if (!station) return
    const path = `/data/sta/${station.stationNo}.json`
    fetch(path).then(r => r.json())
      .then(j => setData(j)).catch(err => {
        console.warn('fetch timetable failed, using empty', err)
        setData({})
      })
    saveRecentStation(station)
  }, [station])

  useEffect(() => {
    console.log("is data good?", !data);
    if (!data) return
    // after render, scroll to nearest upcoming train
    setTimeout(() => {
      const now = nowSecondsSinceMidnight()
      for (const lineId in data) {
        let largestKey = null
        let nearestKey = null
        let nearestDelta = Infinity
        const byDir = data[lineId]
        if (isNaN(lineId)) continue;
        for (const dir in byDir) {
          for (const [tIdx, train] of byDir[dir].entries()) {
            const s = Number(train.time1)
            const delta = s - now
            const thisKey = `${lineId}-${dir}-${tIdx}`
            largestKey = thisKey
            if (delta >= 0 && delta < nearestDelta) {
              nearestDelta = delta
              nearestKey = thisKey
            }
          }
          if (nearestKey && rowRefs.current[nearestKey]) {
            rowRefs.current[nearestKey].scrollIntoView({ behavior: 'smooth', block: 'center' })
          } else if (largestKey && rowRefs.current[largestKey]) {
            console.log("largest key " + largestKey)
            rowRefs.current[largestKey].scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }
    }, 500)
  }, [data])

  if (!station) return <div className="p-4">选择一个车站</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{station.cname || station.ename} <span className="text-sm text-gray-500">{station.stationNo}</span></h2>
      <div ref={containerRef} className="mt-4 space-y-6 max-h-[65vh] overflow-auto">
        {Object.keys(data || {}).length === 0 && <div className="text-sm text-gray-500">此站点无数据可用</div>}

        {Object.entries(data || {}).map(([lineId, dirs]) => (
          isNaN(lineId) ||
          <div key={lineId} className="p-3 border rounded">
            <h3 className="font-semibold">{lineId}号线</h3>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {Object.entries(dirs).map(([dir, trains]) => (
                <div key={dir} className="mt-2">
                  <br />
                  <div className="text-sm text-gray-900 mb-1">开往 {(trains[0] && (trains[0].directionStationC || trains[0].directionStationE)) || (dir === '0' ? '下行' : '上行')}</div>
                  <br />
                  <div className="space-y-1" style={{
                    'overflow-y': 'scroll',
                    'height': '12em',
                    'width': '24em'
                  }}  >
                    {
                      trains.map((t, idx) => {
                        const key = `${lineId}-${dir}-${idx}`
                        return (
                          <div key={key} ref={el => rowRefs.current[key] = el} className="p-2 border rounded flex justify-between items-center">
                            <div key={idx} className="p-2 border-b last:border-none bg-white rounded-md shadow-sm mb-1">
                              <div className="text-xs text-gray-500">终点站 {t.trainNoStationC || t.trainNoStationE} #{t.trainNo}</div>
                              <div className="flex justify-between text-sm">
                                <span>下一站 {t.desStationC || t.desStationE} </span>
                                <span> {secondsToHHMMSS(t.time1)} - {secondsToHHMMSS(t.time2)}</span>
                              </div>
                              <div><br /></div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}