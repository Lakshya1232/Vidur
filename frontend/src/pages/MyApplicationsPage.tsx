import { useEffect, useState } from 'react';
import {
  getMyApplications,
  getApplication,
  getApplicationHistory,
} from '@/lib/api';


type Application = {
  id: string;
  serviceId: string;
  serviceName: string;
  department: string;
  category: string;
  applicantName: string;
  state: string;
  district: string;
  applicationData: Record<string, any>;
  status: string;
  submittedAt: string;
  updatedAt: string;
};

export function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] =
  useState<Application | null>(null);
  const [applicationHistory, setApplicationHistory] = useState<
  { status: string; updated_at: string }[]
>([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="border rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {application.serviceName}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1">
                    Application ID: {application.id}
                  </p>

                  <p className="text-sm text-gray-600">
                    Department: {application.department}
                  </p>

                  <p className="text-sm text-gray-600">
                    Location: {application.district}, {application.state}
                  </p>

                  <p className="text-sm text-gray-600">
                    Applicant: {application.applicantName}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  {application.status}
                </span>

                <button
                    type="button"
                    onClick={async () => {
                        try {
                            const details = await getApplication(application.id);
                            const history = await getApplicationHistory(application.id);

                            setSelectedApplication(details);
                            setApplicationHistory(history);
                        } catch (error) {
                            console.error(error);
                            alert('Failed to load application details');
                        }
                    }}
                    className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                    >
                    View Details
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Submitted:{' '}
                {new Date(application.submittedAt).toLocaleString()}
              </p>
              
              {selectedApplication?.id === application.id && (
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-3">
                    Application Details
                    </h3>

                    <p className="text-sm text-gray-700">
                    Application ID: {selectedApplication.id}
                    </p>

                    <p className="text-sm text-gray-700">
                    Service: {selectedApplication.serviceName}
                    </p>

                    <p className="text-sm text-gray-700">
                    Department: {selectedApplication.department}
                    </p>

                    <p className="text-sm text-gray-700">
                    Applicant: {selectedApplication.applicantName}
                    </p>

                    <p className="text-sm text-gray-700">
                    Location: {selectedApplication.district}, {selectedApplication.state}
                    </p>

                    <p className="text-sm text-gray-700">
                    Status: {selectedApplication.status}
                    </p>

                    <div className="mt-6">
                    <h4 className="font-semibold text-md mb-3">
                        Application Status History
                    </h4>

                    <div className="space-y-0">
                    {[
                        'Submitted',
                        'Under Review',
                        'Processing',
                        'Approved',
                        'Completed',
                    ].map((stage, index) => {
                        const historyItem = applicationHistory.find(
                        (item) => item.status.toLowerCase() === stage.toLowerCase()
                        );

                        const isCompleted = !!historyItem;

                        return (
                        <div key={stage} className="flex">
                            {/* Timeline line + circle */}
                            <div className="flex flex-col items-center mr-4">
                            <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                isCompleted
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white border-gray-300'
                                }`}
                            />

                            {index < 4 && (
                                <div
                                className={`w-0.5 h-12 ${
                                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                                />
                            )}
                            </div>

                            {/* Timeline content */}
                            <div className="pb-6">
                            <p
                                className={`font-medium ${
                                isCompleted
                                    ? 'text-gray-900'
                                    : 'text-gray-400'
                                }`}
                            >
                                {stage}
                            </p>

                            {historyItem ? (
                                <p className="text-sm text-gray-500 mt-1">
                                {new Date(historyItem.updated_at).toLocaleString()}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 mt-1">
                                Pending
                                </p>
                            )}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    </div>
                </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}