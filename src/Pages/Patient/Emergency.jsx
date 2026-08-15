import { useState, useEffect } from "react";

import NavBar from "../../Components/NavBar";
import { FiUser, FiPhone, FiUsers, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import { API_BASE_URL } from "../../config/api";
import { Card } from "../../Components/ui/Card";
import { Button } from "../../Components/ui/Button";
import { Input } from "../../Components/ui/Field";
import { Modal } from "../../Components/ui/Modal";
import { EmptyState } from "../../Components/ui/EmptyState";
import { Loading } from "../../Components/Loading";

const URL = `${API_BASE_URL}/patient/profile/`;
const CONTACTS_ENDPOINT = "emergency-contacts";
const CONTACT_ENDPOINT = "emergency-contact";

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", phone_no: "", relation: "" });

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(URL + CONTACTS_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data.data.patient_emergency_contacts || []);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  const resetFormAndCloseModal = () => {
    setShowModal(false);
    setForm({ full_name: "", phone_no: "", relation: "" });
  };

  const handleSave = async () => {
    try {
      if (!form.full_name || !form.phone_no || !form.relation) {
        toast.error("All fields are required!");
        return;
      }
      if (form.phone_no.length !== 10) {
        toast.error("Phone number must be 10 digits!");
        return;
      }

      setSaving(true);
      const res = await axios.post(
        URL + CONTACT_ENDPOINT,
        { newEmergencyContact: form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContacts([...contacts, res.data.data]);
      toast.success("Contact saved!");
      resetFormAndCloseModal();
    } catch (err) {
      toast.error("Save Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emgIdToDelete) => {
    try {
      await axios.delete(URL + CONTACT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
        data: { emg_id: emgIdToDelete },
      });
      setContacts(contacts.filter((c) => c.emg_id !== emgIdToDelete));
      toast.success("Contact deleted!");
    } catch (err) {
      toast.error("Delete Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddNew = () => {
    resetFormAndCloseModal();
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background">
      <NavBar />
      <div className="flex w-full flex-col">
        <BackButton />
        <NavButton />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="my-8 flex w-full max-w-4xl flex-col items-center gap-6 px-4 pb-12">
          {contacts.length > 0 ? (
            <div className="flex w-full flex-col gap-4">
              {contacts.map((contact) => (
                <Card key={contact.emg_id} className="p-5 transition-shadow hover:shadow-lift sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 flex-wrap gap-4">
                      {[
                        { key: "full_name", label: "Name", icon: FiUser },
                        { key: "phone_no", label: "Phone", icon: FiPhone },
                        { key: "relation", label: "Relation", icon: FiUsers },
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex min-w-[140px] flex-1 flex-col">
                          <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-subtle">
                            {label}
                          </span>
                          <span className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
                            <Icon size={14} className="text-subtle" aria-hidden="true" />
                            {contact[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(contact.emg_id)}
                      aria-label={`Delete ${contact.full_name}`}
                      className="self-end rounded-lg p-2 text-subtle transition-colors hover:bg-danger-soft hover:text-danger sm:self-center"
                    >
                      <FiTrash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <EmptyState
                icon={FiUsers}
                title="No emergency contacts yet"
                description="Add up to 3 trusted contacts who can be reached in an emergency."
                action={
                  <Button onClick={handleAddNew} icon={FiPlus}>
                    Add Contact
                  </Button>
                }
              />
            </Card>
          )}

          {contacts.length > 0 && (
            <p className="text-center text-sm text-muted">
              You can add{" "}
              <span className="font-semibold text-primary">{3 - contacts.length}</span> more contacts.
            </p>
          )}
          {contacts.length < 3 && contacts.length > 0 && (
            <Button variant="outline" onClick={handleAddNew} icon={FiPlus} className="mb-4">
              Add Contact
            </Button>
          )}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={resetFormAndCloseModal}
        title="Add Emergency Contact"
        description="Someone doctors can reach in an emergency"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            id="emergency-contact-name"
            label="Name"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
          />
          <Input
            id="emergency-contact-phone"
            label="Phone"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit phone number"
            value={form.phone_no}
            onChange={(e) => setForm((prev) => ({ ...prev, phone_no: e.target.value }))}
          />
          <Input
            id="emergency-contact-relation"
            label="Relation"
            placeholder="e.g. Spouse, Parent"
            value={form.relation}
            onChange={(e) => setForm((prev) => ({ ...prev, relation: e.target.value }))}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={resetFormAndCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
