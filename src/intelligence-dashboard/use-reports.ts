import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createTrackedSelector } from 'react-tracked';
import { type Report } from './types';

type State = {
  reports: Record<string, Report>;
  setReport: (report: Report) => void;
  setReports: (reports: Report[]) => void;
  deleteReport: (id: string) => void;
};

export const reportsStore = create<State>()(
  persist(
    immer((set) => ({
      reports: {},
      setReports: (reports) =>
        set((draft) => {
          draft.reports = reports.reduce(
            (acc: Record<string, Report>, report) => {
              acc[report.id] = report;
              return acc;
            },
            {}
          );
        }),
      setReport: (report) =>
        set((draft) => {
          if (report.id) {
            draft.reports[report.id] = report;
          } else throw new Error('Cannot add report without id');
        }),
      deleteReport: (id) =>
        set((draft) => {
          delete draft.reports[id];
        })
    })),
    {
      name: 'reports'
    }
  )
);
export default createTrackedSelector(reportsStore);
