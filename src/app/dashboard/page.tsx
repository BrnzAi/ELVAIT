'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Eye, Users, Clock, CheckCircle, AlertCircle, FileText, Trash2 } from 'lucide-react';

interface Assessment {
  id: string;
  variant: string;
  status: string;
  decisionTitle: string;
  investmentType: string;
  timeHorizon: string;
  createdAt: string;
  firstResponseAt: string | null;
  completedAt: string | null;
  _count: {
    participants: number;
    responses: number;
  };
}

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadAssessments = () => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setAssessments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load assessments');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleDelete = async (id: string, title: string, hasResponses: boolean) => {
    const message = hasResponses 
      ? `Delete "${title}"? This assessment has responses that will also be deleted.`
      : `Delete "${title}"?`;
    
    if (!confirm(message)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/cases/${id}?force=true`, { method: 'DELETE' });
      if (res.ok) {
        setAssessments(prev => prev.filter(a => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete assessment');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string, hasResponses: boolean) => {
    if (status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          <CheckCircle className="w-4 h-4" />
          Completed
        </span>
      );
    }
    if (hasResponses) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          <Clock className="w-4 h-4" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
        <AlertCircle className="w-4 h-4" />
        Draft
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">My Assessments</h1>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-clarity-600 text-white rounded-lg hover:bg-clarity-700 transition"
            >
              <Plus className="w-5 h-5" />
              New Assessment
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-clarity-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading assessments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No assessments yet</h2>
            <p className="text-gray-500 mb-6">Create your first assessment to get started</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-clarity-600 text-white rounded-lg hover:bg-clarity-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">{assessment.decisionTitle}</h2>
                      {getStatusBadge(assessment.status, assessment._count.responses > 0)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{assessment.variant.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{assessment.investmentType}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {assessment._count.participants} participant{assessment._count.participants !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span>{assessment._count.responses} responses</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/cases/${assessment.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Users className="w-4 h-4" />
                      Manage
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(assessment.id, assessment.decisionTitle, assessment._count.responses > 0)}
                      disabled={deleting === assessment.id}
                      className="inline-flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                      title="Delete assessment"
                    >
                      {deleting === assessment.id ? (
                        <span className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    
                    {assessment._count.responses > 0 && (
                      <Link
                        href={`/cases/${assessment.id}/results`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-clarity-600 text-white rounded-lg hover:bg-clarity-700 transition font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Help Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works</h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li><strong>1. Create</strong> — Set up your assessment with decision context</li>
            <li><strong>2. Invite</strong> — Add participants and share their unique survey links</li>
            <li><strong>3. Collect</strong> — Wait for participants to complete their surveys</li>
            <li><strong>4. Review</strong> — Click "View Results" to see the ICS score and recommendation</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
