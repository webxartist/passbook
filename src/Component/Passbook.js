"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function PassbookPrint() {
  const printRef = useRef(null);

  const [rows, setRows] = useState([
    { date: "", particulars: "", debit: "", credit: "", balance: 0 },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { date: "", particulars: "", debit: "", credit: "", balance: 0 },
    ]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    const debit = Number(updated[index].debit || 0);
    const credit = Number(updated[index].credit || 0);
    const prevBalance = index > 0 ? Number(updated[index - 1].balance || 0) : 0;

    updated[index].balance = prevBalance + credit - debit;
    setRows(updated);
  };

  // ✅ Correct react-to-print usage
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Passbook",
    removeAfterPrint: true,
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Passbook Printing Software</h1>

      {/* ENTRY TABLE (SCREEN ONLY) */}
      <table className="w-full border text-sm mb-6 print:hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Particulars</th>
            <th className="border p-2">Debit</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border">
                <input
                  type="date"
                  className="w-full p-1 outline-none"
                  onChange={(e) => updateRow(i, "date", e.target.value)}
                />
              </td>
              <td className="border">
                <input
                  className="w-full p-1 outline-none"
                  placeholder="Details"
                  onChange={(e) => updateRow(i, "particulars", e.target.value)}
                />
              </td>
              <td className="border">
                <input
                  type="number"
                  className="w-full p-1 outline-none"
                  onChange={(e) => updateRow(i, "debit", e.target.value)}
                />
              </td>
              <td className="border">
                <input
                  type="number"
                  className="w-full p-1 outline-none"
                  onChange={(e) => updateRow(i, "credit", e.target.value)}
                />
              </td>
              <td className="border p-1 text-right">{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ACTION BUTTONS (SCREEN ONLY) */}
      <div className="flex gap-4 mb-8 print:hidden">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Row
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Print
        </button>
      </div>

      {/* ✅ PRINT CONTENT (ALWAYS IN DOM) */}
      <div ref={printRef} className="hidden print:block text-[11px] p-4">
        <h2 className="text-center font-semibold mb-2">
          System Generated Record – For Internal Use Only
        </h2>

        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-1">Date</th>
              <th className="border p-1">Particulars</th>
              <th className="border p-1">Debit</th>
              <th className="border p-1">Credit</th>
              <th className="border p-1">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="border p-1">{row.date}</td>
                <td className="border p-1">{row.particulars}</td>
                <td className="border p-1 text-right">{row.debit}</td>
                <td className="border p-1 text-right">{row.credit}</td>
                <td className="border p-1 text-right">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRINT CONFIG */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5;
            margin: 0;
          }
          body {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
