
import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { TimeRecord, Project } from '../../types';

const TimeLogging: React.FC = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    startTime: '07:00',
    endTime: '15:30',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    const p = await db.projects.toArray();
    const tr = await db.timeRecords.orderBy('date').reverse().toArray();
    setProjects(p);
    setRecords(tr);
    if (p.length > 0) setFormData(prev => ({ ...prev, projectId: p[0].id }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TimeRecord = {
      id: crypto.randomUUID(),
      workerId: 'worker-1',
      projectId: formData.projectId,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: 480, // Simplification for demo
      description: formData.description,
      type: 'work',
      createdAt: new Date()
    };
    await db.timeRecords.add(newRecord);
    setIsLogging(false);
    fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Zápis Práce</h2>
        <button 
          onClick={() => setIsLogging(!isLogging)}
          className="bg-indigo-600 px-4 py-2 rounded-xl font-bold"
        >
          {isLogging ? 'Zrušit' : 'Nový záznam'}
        </button>
      </div>

      {isLogging && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1">Projekt</label>
              <select 
                value={formData.projectId}
                onChange={e => setFormData({...formData, projectId: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 appearance-none"
              >
                {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Datum</label>
              <input 
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Od</label>
              <input 
                type="time"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Do</label>
              <input 
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1">Poznámka</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none h-24"
              placeholder="Co jsi dnes dělal?"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
            Uložit záznam
          </button>
        </form>
      )}

      <div className="space-y-4">
        {records.map(r => (
          <div key={r.id} className="glass p-4 rounded-xl flex items-center justify-between border-l-4 border-l-indigo-400">
            <div>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                {new Date(r.date).toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h4 className="font-semibold text-lg">{r.description || 'Instalace panelů'}</h4>
              <p className="text-xs text-white/40">Solar Park Ostrava</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono text-white/90">{r.startTime} - {r.endTime}</span>
              <p className="text-[10px] text-white/30 uppercase font-black">Celkem: 8.5h</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLogging;
