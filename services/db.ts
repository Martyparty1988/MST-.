
import { Dexie, type Table as DexieTable } from 'dexie';
import { Project, Worker, TimeRecord, SolarString, StringAction, ChatMessage } from '../types';

// Fix: Use named export for Dexie and member non-null assertions to ensure proper type inheritance and property mapping.
export class MST_Database extends Dexie {
  projects!: DexieTable<Project>;
  workers!: DexieTable<Worker>;
  timeRecords!: DexieTable<TimeRecord>;
  solarStrings!: DexieTable<SolarString>;
  stringActions!: DexieTable<StringAction>;
  chatMessages!: DexieTable<ChatMessage>;

  constructor() {
    super('MST_DB');
    
    // Fix: Correctly define version and stores. Dexie automatically initializes table properties that match the store names.
    this.version(2).stores({
      projects: 'id, name, status, createdAt',
      workers: 'id, name, email',
      timeRecords: 'id, workerId, projectId, stringId, date',
      solarStrings: 'id, projectId, status, size, lastActionDate',
      stringActions: 'id, stringId, workerId, timestamp',
      chatMessages: 'id, timestamp, senderId'
    });
  }
}

export const db = new MST_Database();

export const seedDatabase = async () => {
  try {
    const projectCount = await db.projects.count();
    if (projectCount === 0) {
      const pId = 'proj-1';
      await db.projects.add({
        id: pId,
        name: 'Solar Park Ostrava',
        location: 'Ostrava-Hrabová',
        status: 'in-progress',
        startDate: new Date(),
        budget: 1500000,
        assignedWorkers: ['worker-1'],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await db.workers.add({
        id: 'worker-1',
        name: 'Martin Solar',
        email: 'martin@solar.cz',
        phone: '+420 777 888 999',
        position: 'Senior Installer',
        hourlyRate: 450,
        totalHours: 0,
        createdAt: new Date()
      });

      await db.solarStrings.add({
        id: '175.1',
        projectId: pId,
        size: 'medium',
        status: 'unfinished',
        lastActionDate: new Date(),
        workers: ['worker-1'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
};
