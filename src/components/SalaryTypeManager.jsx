import { useState, useEffect } from 'react';
import { salaryTypeAPI } from '../services/api';

const SalaryTypeManager = () => {
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', hourlyRate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSalaryTypes();
  }, []);

  const loadSalaryTypes = async () => {
    try {
      const response = await salaryTypeAPI.getAll();
      setSalaryTypes(response.data);
    } catch (err) {
      setError('Failed to load salary types');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        await salaryTypeAPI.update(editingId, formData);
      } else {
        await salaryTypeAPI.create(formData);
      }
      setFormData({ name: '', hourlyRate: '' });
      setIsAdding(false);
      setEditingId(null);
      loadSalaryTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save salary type');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type) => {
    setFormData({ name: type.name, hourlyRate: type.hourlyRate });
    setEditingId(type.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this salary type?')) return;

    try {
      await salaryTypeAPI.delete(id);
      loadSalaryTypes();
    } catch (err) {
      setError('Failed to delete salary type');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', hourlyRate: '' });
    setIsAdding(false);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Salary Types</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            + Add New
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-4">
            {editingId ? 'Edit Salary Type' : 'Add New Salary Type'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (¥)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {salaryTypes.map((type) => (
          <div
            key={type.id}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div>
              <h3 className="font-semibold">{type.name}</h3>
              <p className="text-sm text-gray-600">¥{type.hourlyRate}/hour</p>
            </div>
            {type.userId && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaryTypeManager;
