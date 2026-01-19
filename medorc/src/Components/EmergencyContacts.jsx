import React from 'react'

export default function EmergencyContacts({emergency}) {
  return (
     <div className="w-full max-w-7xl bg-white border border-gray-400 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0751A7] mb-2">
            Emergency Contacts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergency.length > 0 ? (
              emergency.map((contact, index) => (
                <div key={index} className="border border-gray-500 p-4 rounded bg-white">
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <span className="font-bold">Full name:</span>
                    <span className="truncate">{contact.full_name || "N/A"}</span>

                    <span className="font-bold">Phone no:</span>
                    <span>{contact.phone_no || "N/A"}</span>

                    <span className="font-bold">Relation:</span>
                    <span>{contact.relation || "N/A"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                No emergency contacts available.
              </div>
            )}
          </div>
        </div>
  )
}
