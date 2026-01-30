import React from "react";
import { Phone, User, Heart, AlertCircle, ShieldAlert } from "lucide-react";

export default function EmergencyContacts({ emergency }) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-50 rounded-xl">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Emergency Contacts
          </h2>
          <p className="text-slate-500 text-sm">
            Primary contacts in case of emergency
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergency && emergency.length > 0 ? (
          emergency.map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100/50">
                  {contact.full_name ? (
                    contact.full_name[0].toUpperCase()
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-100 flex items-center gap-1">
                  <Heart size={10} className="text-red-400 fill-red-400" />
                  {contact.relation || "Kin"}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {contact.full_name || "Unknown Name"}
                </h3>
                <p className="text-slate-400 text-xs font-medium">Full Name</p>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <a
                  href={`tel:${contact.phone_no}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                >
                  <div className="p-1.5 bg-white rounded-full shadow-sm">
                    <Phone
                      size={14}
                      className="text-slate-400 group-hover:text-blue-500"
                    />
                  </div>
                  <span className="font-semibold text-slate-600 group-hover:text-blue-700">
                    {contact.phone_no || "N/A"}
                  </span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <AlertCircle size={32} className="text-slate-300" />
            </div>
            <p className="font-semibold text-lg text-slate-600">
              No contacts found
            </p>
            <p className="text-sm">
              Patient has not added any emergency contacts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
