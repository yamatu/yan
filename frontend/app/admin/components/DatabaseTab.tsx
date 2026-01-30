'use client';

import { useState } from 'react';
import axios from 'axios';
import { getApiBase } from '../../lib/api';

interface DatabaseTabProps {
  onLogout: () => void;
}

export default function DatabaseTab({ onLogout }: DatabaseTabProps) {
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const getToken = () => localStorage.getItem('admin_token') || '';

  const handleDownloadBackup = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const baseUrl = getApiBase();
      const res = await axios.get(`${baseUrl}/api/admin/db/backup`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const disposition = res.headers['content-disposition'] as string | undefined;
      const fallbackName = `data.db.${new Date().toISOString().replace(/[:.]/g, '-')}.gz`;
      const filename = disposition?.match(/filename="?([^\"]+)"?/i)?.[1] || fallbackName;

      const blob = res.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage('Backup downloaded.');
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || 'Backup failed');
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      if (!restoreFile) {
        setError('Please choose a database backup file to restore.');
        return;
      }

      const baseUrl = getApiBase();
      const form = new FormData();
      form.append('file', restoreFile);

      await axios.post(`${baseUrl}/api/admin/db/restore`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Database restored successfully. Please log in again.');
      onLogout();
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || 'Restore failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-sky-50 to-white">
          <h2 className="text-2xl font-bold text-slate-900">Database</h2>
          <p className="text-gray-500 mt-2">
            Download a backup, or restore by uploading a compressed SQLite database file (zip/gz/tar/tar.gz).
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Backup</div>
              <div className="text-sm text-gray-500">Downloads a gzip file of the current database.</div>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              disabled={busy}
              className={`px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors ${busy ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Download Backup
            </button>
          </div>

          <div className="border-t border-gray-100 pt-8 space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Restore</div>
              <div className="text-sm text-gray-500">
                Restoring will temporarily block API requests and may overwrite current data.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <input
                type="file"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                className="flex-1 text-sm"
              />
              <button
                type="button"
                onClick={handleRestore}
                disabled={busy || !restoreFile}
                className={`px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors ${busy || !restoreFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Restore Now
              </button>
            </div>
          </div>

          {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-4">{message}</div>}
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">{error}</div>}
        </div>
      </div>
    </div>
  );
}
