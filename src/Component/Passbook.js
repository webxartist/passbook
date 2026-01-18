"use client";

import React, { useState, useEffect } from "react";

const STORAGE_KEY = "passbook_rows_v1";

export default function PassbookPrint() {
  const [rows, setRows] = useState([
    { date: "", particulars: "", debit: "", credit: "", balance: 0 },
  ]);

  /* LOAD */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRows(JSON.parse(saved));
  }, []);

  /* SAVE */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const addRow = () => {
    setRows([...rows, { date: "", particulars: "", debit: "", credit: "", balance: 0 }]);
  };

  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;

    const debit = Number(updated[i].debit || 0);
    const credit = Number(updated[i].credit || 0);
    const prev = i > 0 ? Number(updated[i - 1].balance || 0) : 0;

    updated[i].balance = prev + credit - debit;
    setRows(updated);
  };

  const printNow = () => {
    window.print(); // ✅ MOST RELIABLE
  };

  return (
    <div className="p-4">
      {/* SCREEN VIEW */}
      <div className="print:hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><input type="date" value={r.date} onChange={e => updateRow(i, "date", e.target.value)} /></td>
                <td><input value={r.particulars} onChange={e => updateRow(i, "particulars", e.target.value)} /></td>
                <td><input type="number" value={r.debit} onChange={e => updateRow(i, "debit", e.target.value)} /></td>
                <td><input type="number" value={r.credit} onChange={e => updateRow(i, "credit", e.target.value)} /></td>
                <td>{r.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>Add Row</button>
        <button onClick={printNow}>Print</button>
      </div>

      {/* PRINT VIEW */}
      <div className="hidden print:block text-[11px]">
        <h3 style={{ textAlign: "center" }}>System Generated Record</h3>
        <table width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.particulars}</td>
                <td>{r.debit}</td>
                <td>{r.credit}</td>
                <td>{r.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A6; margin: 0 }
          body { margin: 0 }
        }
      `}</style>
    </div>
  );
}
