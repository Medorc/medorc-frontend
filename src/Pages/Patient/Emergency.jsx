import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";

const URL = "http://localhost:3000/api/v1/patient/profile/";
const CONTACTS_ENDPOINT = "emergency-contacts";
const CONTACT_ENDPOINT = "emergency-contact";

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone_no: "",
    relation: "",
  });

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) navigate("/");

    const fetchData = async () => {
      try {
        const res = await axios.get(URL + CONTACTS_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data.data.patient_emergency_contacts || []);
      } catch (err) {
        toast.error(
          "API Error: " + (err.response?.data?.message || err.message),
        );
      }
    };
    fetchData();
  }, [token]);

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

      const res = await axios.post(
        URL + CONTACT_ENDPOINT,
        { newEmergencyContact: form },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setContacts([...contacts, res.data.data]);
      toast.success("Contact saved!");
      resetFormAndCloseModal();
    } catch (err) {
      toast.error(
        "Save Error: " + (err.response?.data?.message || err.message),
      );
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
      toast.error(
        "Delete Error: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleAddNew = () => {
    resetFormAndCloseModal();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center  ">
      <NavBar />
      <div className=" w-full  flex flex-col ">
        <BackButton />
        <NavButton />
      </div>

      <div className="w-full max-w-4xl my-10 flex flex-col items-center gap-6 px-4">
        <div className="w-full flex flex-col gap-4 ">
          {contacts.map((contact) => (
            <div
              key={contact.emg_id}
              className="w-full backdrop-blur-md bg-white/70 border border-white/40 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                  {["Name", "Phone", "Relation"].map((label, i) => {
                    const key = ["full_name", "phone_no", "relation"][i];
                    return (
                      <div key={i} className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {label}
                        </label>
                        <p className="rounded-lg px-3 py-2 bg-white shadow-inner border border-gray-200 text-gray-700">
                          {contact[key]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center self-end mt-4 md:mt-0 md:self-center md:ml-4">
                  <button
                    className="text-gray-400 hover:text-red-500 hover:scale-110 transition duration-200"
                    onClick={() => handleDelete(contact.emg_id)}
                  >
                    <FaTimesCircle size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contacts.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-6">
            You can add{" "}
            <span className="font-semibold text-blue-600">
              {3 - contacts.length}
            </span>{" "}
            more contacts.
          </div>
        )}
        {contacts.length < 3 && (
          <button
            className="max-w-md mx-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200 mb-10"
            onClick={handleAddNew}
          >
            + Add Contact
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/40">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">
              Add Emergency Contact
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 bg-white/80 shadow-sm transition"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Phone"
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 bg-white/80 shadow-sm transition"
                value={form.phone_no}
                onChange={(e) => setForm({ ...form, phone_no: e.target.value })}
              />
              <input
                type="text"
                placeholder="Relation"
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 bg-white/80 shadow-sm transition"
                value={form.relation}
                onChange={(e) => setForm({ ...form, relation: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-3">
              <button
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={resetFormAndCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
