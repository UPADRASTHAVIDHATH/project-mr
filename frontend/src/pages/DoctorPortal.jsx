import React from 'react';
import DoctorSummary from '../components/DoctorSummary';

export default function DoctorPortal({ doctorSummaryData }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <DoctorSummary data={doctorSummaryData} />
    </div>
  );
}
