import React from 'react'

export default function StationSelect({stationMeta, onSelect}){
  return (
    <div className="p-4 max-h-[60vh] overflow-auto">
      {stationMeta?.lines?.map(line => (
        <div key={line.id} className="mb-4">
          <h3 className="font-bold text-lg">{line.cname || line.ename}</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {line.stationList.map(st => (
              <button key={st.stationNo} className="text-left p-2 border rounded" onClick={()=> onSelect({...st, lineId: line.id})}>
                <div className="font-medium">{st.cname || st.ename}</div>
                <div className="text-sm text-gray-500">{st.stationNo}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}