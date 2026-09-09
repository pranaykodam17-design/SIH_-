import React from 'react';
import { useParams } from 'react-router-dom';
import { useSrmStore, DEMO_JOB } from '../store/useSrmStore';
import { ValidationDashboard } from '../components/validation/ValidationDashboard';

export const ValidationPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { activeJob } = useSrmStore();

  const currentJob = activeJob || DEMO_JOB;
  const metrics = currentJob.metrics || DEMO_JOB.metrics!;

  return (
    <div className="space-y-6">
      <ValidationDashboard
        metrics={metrics}
        jobId={currentJob.jobId}
      />
    </div>
  );
};
