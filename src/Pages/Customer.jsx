import { useState } from "react";
import { MdAdd, MdArrowBack, MdPeople, MdPersonAdd, MdHighlightOff, MdNewReleases } from "react-icons/md";
import Card from "../components/utils/Card";

const Customer = () => {
  const [mode, setMode] = useState("list"); // list | add

  // Dummy customer list
  const customers = [
    { name: "Aisyah", email: "aisyah@mail.com", phone: "081234567890", status: "Active" },
    { name: "Hilmy", email: "hilmy@mail.com", phone: "081234567111", status: "New" },
    { name: "Dendun", email: "dendun@mail.com", phone: "089876543210", status: "Inactive" },
    { name: "Nabil", email: "nabil@mail.com", phone: "081398761111", status: "Active" },
    { name: "Rizky", email: "rizky@mail.com", phone: "081200300400", status: "Active" },
    { name: "Syifa", email: "syifa@mail.com", phone: "081233344455", status: "New" },
    { name: "Dimas", email: "dimas@mail.com", phone: "089900112233", status: "Inactive" },
  ];

  const active = customers.filter(c => c.status === "Active").length;
  const newCust = customers.filter(c => c.status === "New").length;
  const inactive = customers.filter(c => c.status === "Inactive").length;

  return (
    <div>
      {/* TOP HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Customers</h1>

        {mode === "list" ? (
          <button 
            className="btn btn-primary flex gap-2"
            onClick={() => setMode("add")}
          >
            <MdAdd size={20} />
            Add Customer
          </button>
        ) : (
          <button 
            className="btn flex gap-2"
            onClick={() => setMode("list")}
          >
            <MdArrowBack size={20} />
            Back
          </button>
        )}
      </div>

      {/* ==== DASHBOARD-STYLE CARDS (IMPROVED) ==== */}
      {mode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Customers */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-[#4F46E5] shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#4F46E5]/10 rounded-xl">
                <MdPeople size={28} className="text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Customers</p>
                <h2 className="text-3xl font-bold text-[#4F46E5]">{customers.length}</h2>
              </div>
            </div>
            <div className="mt-3">
              <progress className="progress progress-primary w-full" value={100} max={100}></progress>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-[#16A34A] shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#16A34A]/10 rounded-xl">
                <MdPersonAdd size={28} className="text-[#16A34A]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Customers</p>
                <h2 className="text-3xl font-bold text-[#16A34A]">{active}</h2>
              </div>
            </div>
            <div className="mt-3">
              <progress className="progress progress-success w-full" value={(active / customers.length) * 100} max={100}></progress>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-[#3B82F6] shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#3B82F6]/10 rounded-xl">
                <MdNewReleases size={28} className="text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">New Customers</p>
                <h2 className="text-3xl font-bold text-[#3B82F6]">{newCust}</h2>
              </div>
            </div>
            <div className="mt-3">
              <progress className="progress progress-info w-full" value={(newCust / customers.length) * 100} max={100}></progress>
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-[#EF4444] shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#EF4444]/10 rounded-xl">
                <MdHighlightOff size={28} className="text-[#EF4444]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Inactive</p>
                <h2 className="text-3xl font-bold text-[#EF4444]">{inactive}</h2>
              </div>
            </div>
            <div className="mt-3">
              <progress className="progress progress-error w-full" value={(inactive / customers.length) * 100} max={100}></progress>
            </div>
          </div>

        </div>
      )}

      {/* CUSTOMER LIST */}
      {mode === "list" && (
        <div className="bg-white shadow-lg p-6 rounded-xl overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base">Name</th>
                <th className="text-base">Email</th>
                <th className="text-base">Phone</th>
                <th className="text-base">Status</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, index) => (
                <tr key={index}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    {c.status === "Active" && <span className="badge badge-success">Active</span>}
                    {c.status === "New" && <span className="badge badge-info">New</span>}
                    {c.status === "Inactive" && <span className="badge badge-error">Inactive</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD CUSTOMER FORM */}
      {mode === "add" && (
        <div className="bg-white shadow-lg rounded-xl p-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Add New Customer</h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base-content/80">Full Name</label>
              <input 
                type="text" 
                className="input input-bordered h-12 rounded-lg"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base-content/80">Email</label>
              <input 
                type="email" 
                className="input input-bordered h-12 rounded-lg"
                placeholder="Enter email"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base-content/80">Phone Number</label>
              <input 
                type="text" 
                className="input input-bordered h-12 rounded-lg"
                placeholder="Enter phone number"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base-content/80">Status</label>
              <select className="select select-bordered h-12 rounded-lg">
                <option>Active</option>
                <option>New</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button className="btn bg-[#4F46E5] hover:bg-[#4338CA] text-white px-10 h-12 rounded-lg shadow-md">
                Save Customer
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default Customer;
