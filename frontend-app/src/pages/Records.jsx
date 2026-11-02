
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X } from "lucide-react";

function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/records");

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `/api/records/${editingId}`
        : "/api/records";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save record");
      }

      setForm({ title: "", description: "" });
      setEditingId(null);

      await fetchRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      title: record.title,
      description: record.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      await fetchRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "" });
  };

  return (
    <main className="main-content">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Database Management</h1>
          <p>Manage PostgreSQL records hosted on AWS RDS</p>
        </div>

        <button className="icon-button" onClick={fetchRecords}>
          <RefreshCw size={18} />
        </button>
      </header>

      <section className="records-form-card">
        <h2>{editingId ? "Edit Record" : "Create New Record"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Record title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
            maxLength={150}
          />

          <textarea
            placeholder="Record description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="record-form-actions">
            <button type="submit" disabled={saving}>
              <Plus size={17} />
              {saving ? "Saving..." : editingId ? "Update Record" : "Create Record"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                <X size={17} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="records-table-card">
        <div className="table-heading">
          <div>
            <h3>Database Records</h3>
            <p>{records.length} records stored in PostgreSQL</p>
          </div>
        </div>

        {error && <p className="records-error">{error}</p>}

        {loading ? (
          <p>Loading records...</p>
        ) : records.length === 0 ? (
          <p>No records found. Create your first record above.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.title}</td>
                    <td>{record.description}</td>
                    <td>
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="record-action edit"
                        onClick={() => handleEdit(record)}
                        aria-label="Edit record"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="record-action delete"
                        onClick={() => handleDelete(record.id)}
                        aria-label="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Records;
