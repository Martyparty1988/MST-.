
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../services/db';
import { SolarString, StringStatus, StringSize } from '../../types';
import { PlusIcon, TableIcon, DashboardIcon } from '../ui/Icons';

interface StringMapViewProps {
  strings: SolarString[];
  onStringClick: (s: SolarString) => void;
  getStatusColor: (status: StringStatus) => string;
}

const StringMapView: React.FC<StringMapViewProps> = ({ strings, onStringClick, getStatusColor }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    setZoom(prev => Math.min(Math.max(prev - e.deltaY * zoomSpeed, 0.2), 5));
  };

  const itemWidth = 60;
  const itemHeight = 30;
  const gap = 20;

  return (
    <div 
      ref={containerRef}
      className="glass rounded-3xl h-[600px] overflow-hidden cursor-move relative touch-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass px-3 py-2 rounded-xl text-xs font-bold text-white/60">
          Měřítko: {Math.round(zoom * 100)}%
        </div>
        <button 
          onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
          className="glass p-2 rounded-xl hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          Reset View
        </button>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="w-full h-full">
        <g transform={`translate(${500 + offset.x}, ${500 + offset.y}) scale(${zoom})`}>
          <line x1="-1000" y1="0" x2="1000" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="-1000" x2="0" y2="1000" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {strings.map((s) => {
            const [major, minor] = (s.id || '0.0').split('.').map(Number);
            const posX = s.position?.x ?? (major - 170) * (itemWidth + gap) * 2;
            const posY = s.position?.y ?? (minor - 1) * (itemHeight + gap);

            const fillColor = s.status === 'completed' ? '#10B981' : 
                             s.status === 'strings_done' ? '#3B82F6' :
                             s.status === 'panels_done' ? '#F59E0B' : '#6B7280';

            return (
              <g 
                key={s.id} 
                transform={`translate(${posX}, ${posY})`}
                onClick={(e) => { e.stopPropagation(); onStringClick(s); }}
                className="cursor-pointer"
              >
                <rect 
                  width={itemWidth} 
                  height={itemHeight} 
                  rx="4"
                  fill={fillColor}
                  fillOpacity="0.2"
                  stroke={fillColor}
                  strokeWidth="2"
                  className="transition-all hover:stroke-white"
                />
                <text 
                  x={itemWidth / 2} 
                  y={itemHeight / 2 + 4} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-white select-none pointer-events-none"
                >
                  {s.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const StringManagement: React.FC = () => {
  const [strings, setStrings] = useState<SolarString[]>([]);
  const [layout, setLayout] = useState<'grid' | 'map'>('grid');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedString, setSelectedString] = useState<SolarString | null>(null);
  const [bulkData, setBulkData] = useState({ startId: 175, count: 12, size: 'medium' as StringSize });

  const fetchStrings = async () => {
    const all = await db.solarStrings.toArray();
    setStrings(all);
  };

  useEffect(() => {
    fetchStrings();
  }, []);

  const handleBulkCreate = async () => {
    const newStrings: SolarString[] = [];
    for (let i = 0; i < bulkData.count; i++) {
      const id = `${bulkData.startId}.${i + 1}`;
      newStrings.push({
        id,
        projectId: 'proj-1',
        size: bulkData.size,
        status: 'unfinished',
        lastActionDate: new Date(),
        workers: ['worker-1'],
        position: {
          x: (bulkData.startId - 170) * 160,
          y: i * 50
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await db.solarStrings.bulkAdd(newStrings);
    setShowBulkModal(false);
    fetchStrings();
  };

  const getStatusColor = (status: StringStatus) => {
    switch(status) {
      case 'unfinished': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'panels_done': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'strings_done': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const updateStatus = async (id: string, newStatus: StringStatus) => {
    await db.solarStrings.update(id, { status: newStatus, updatedAt: new Date(), lastActionDate: new Date() });
    fetchStrings();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Správa Stringů</h2>
          <p className="text-sm text-white/40">Solar Park Ostrava • {strings.length} jednotek</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/5 p-1 rounded-xl flex gap-1">
            <button 
              onClick={() => setLayout('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${layout === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-white/40 hover:text-white'}`}
            >
              Mřížka
            </button>
            <button 
              onClick={() => setLayout('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${layout === 'map' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-white/40 hover:text-white'}`}
            >
              Mapa
            </button>
          </div>
          <button 
            onClick={() => setShowBulkModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-indigo-600/20 text-sm"
          >
            <PlusIcon size={18} />
            Hromadné
          </button>
        </div>
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {strings.map(s => (
            <motion.div 
              layout
              key={s.id} 
              className="glass p-4 rounded-2xl flex flex-col gap-3 relative group overflow-hidden border border-white/5"
            >
              <div className="flex justify-between items-start">
                <span className="text-xl font-black text-white/90">{s.id}</span>
                <span className="text-[10px] text-white/30 uppercase font-bold">{s.size}</span>
              </div>
              <div className={`text-[10px] py-1 px-2 rounded border uppercase font-bold text-center ${getStatusColor(s.status)}`}>
                {s.status.replace('_', ' ')}
              </div>
              <div className="flex gap-1 mt-2">
                <button 
                  onClick={() => updateStatus(s.id, 'completed')}
                  className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 text-[10px] py-2 rounded-lg border border-emerald-600/20 transition-colors font-bold"
                >
                  Hotovo
                </button>
                <button 
                  onClick={() => setSelectedString(s)}
                  className="bg-white/5 hover:bg-white/10 text-white/60 p-2 rounded-lg transition-colors border border-white/10"
                >
                  <DashboardIcon size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <StringMapView 
          strings={strings} 
          onStringClick={setSelectedString} 
          getStatusColor={getStatusColor}
        />
      )}

      {selectedString && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-lg p-8 rounded-3xl space-y-6 shadow-2xl relative border border-white/10">
            <button onClick={() => setSelectedString(null)} className="absolute top-4 right-4 text-white/40 hover:text-white p-2">✕</button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400"><TableIcon size={32} /></div>
              <div>
                <h3 className="text-3xl font-black">{selectedString.id}</h3>
                <p className="text-white/40 uppercase text-xs font-bold tracking-widest">{selectedString.size} string</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/30 uppercase font-black mb-1">Status</p>
                <div className={`text-xs font-bold px-2 py-1 rounded inline-block border ${getStatusColor(selectedString.status)}`}>{selectedString.status.toUpperCase()}</div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-white/30 uppercase font-black">Změnit stav na:</p>
              <div className="grid grid-cols-2 gap-2">
                {(['unfinished', 'panels_done', 'strings_done', 'completed'] as StringStatus[]).map(st => (
                  <button
                    key={st}
                    disabled={selectedString.status === st}
                    onClick={() => {
                      updateStatus(selectedString.id, st);
                      setSelectedString(prev => prev ? { ...prev, status: st } : null);
                    }}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedString.status === st ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60'}`}
                  >
                    {st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-md p-6 rounded-3xl space-y-6 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold">Nové Stringy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1">Počáteční ID (X)</label>
                <input type="number" value={bulkData.startId} onChange={e => setBulkData({...bulkData, startId: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Počet (vytvoří X.1 až X.N)</label>
                <input type="number" value={bulkData.count} onChange={e => setBulkData({...bulkData, count: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowBulkModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-medium">Zrušit</button>
              <button onClick={handleBulkCreate} className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/20">Vytvořit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StringManagement;
