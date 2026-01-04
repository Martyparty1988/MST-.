
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/db';
import { Project, TimeRecord } from '../types';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentWork, setRecentWork] = useState<TimeRecord[]>([]);
  const [stringCount, setStringCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const p = await db.projects.toArray();
      const tr = await db.timeRecords.orderBy('date').reverse().limit(5).toArray();
      const sc = await db.solarStrings.count();
      setProjects(p);
      setRecentWork(tr);
      setStringCount(sc);
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-white/90">Ahoj, Martine 👋</h2>
          <p className="text-white/40 font-medium">Zde je tvůj dnešní přehled instalací.</p>
        </div>
        <div className="hidden md:block glass px-4 py-2 rounded-2xl text-xs font-bold border-indigo-500/20">
          <span className="text-indigo-400">Pondělí</span>, 22. května
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Aktivní Projekty', value: projects.length, color: 'indigo', icon: '⚡' },
          { label: 'Dnes odpracováno', value: '6.5 h', color: 'cyan', icon: '⏱️' },
          { label: 'Splněno Stringů', value: `${stringCount} / 175`, color: 'emerald', icon: '✅' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className={`glass p-6 rounded-[2rem] border-l-4 border-l-${stat.color}-500 relative overflow-hidden group`}
          >
            <div className={`absolute -right-4 -top-4 text-6xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500`}>
              {stat.icon}
            </div>
            <p className="text-white/50 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black flex items-center gap-2">
              Dnešní úkoly
              <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] uppercase font-black border border-indigo-500/20">
                Aktivní
              </span>
            </h4>
            <button className="text-xs font-bold text-white/30 hover:text-white transition-colors">Zobrazit vše</button>
          </div>
          <div className="space-y-4">
            {projects.map((p, i) => (
              <motion.div 
                key={p.id} 
                whileHover={{ x: 8 }}
                className="glass-intense p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    🏗️
                  </div>
                  <div>
                    <h5 className="font-bold text-white/90">{p.name}</h5>
                    <p className="text-xs text-white/40 font-medium">{p.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[9px] px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase font-black tracking-tighter">
                    V procesu
                  </div>
                  <div className="mt-2 h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-1/3"></div>
                  </div>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/5">
                <p className="text-white/30 italic font-medium">Žádné aktivní úkoly pro dnešek.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-xl font-black">Historie aktivity</h4>
          <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-white/5 text-white/30 uppercase text-[10px] tracking-widest font-black">
                  <tr>
                    <th className="px-6 py-4">Datum</th>
                    <th className="px-6 py-4">Lokalita</th>
                    <th className="px-6 py-4">Časový rozsah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentWork.map(record => (
                     <tr key={record.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5 font-bold text-white/80">{new Date(record.date).toLocaleDateString('cs-CZ')}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white/70">Ostrava-Hrabová</span>
                          <span className="text-[10px] text-white/30 uppercase font-black tracking-tighter">Pole A-12</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-mono text-xs border border-indigo-500/20">
                          {record.startTime} — {record.endTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
