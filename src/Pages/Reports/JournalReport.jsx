const JournalReport = ({ data = [] }) => {
  // Hitung Grand Total
  const grandDebit = data.reduce((sum, j) => sum + (j.totalDebit || 0), 0);
  const grandKredit = data.reduce((sum, j) => sum + (j.totalKredit || 0), 0);

  return (
    <div className="w-full space-y-8">

      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* HEADER */}
          <thead>
            <tr className="bg-info text-white font-bold">
              <th className="w-1/2">Akun</th>
              <th className="text-right w-1/4">Debit</th>
              <th className="text-right w-1/4">Kredit</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((journal, index) => (
              <>
                {/* === Journal Header === */}
                <tr className="bg-base-200 font-semibold">
                  <td colSpan={3} className="py-3">
                    <div className="flex flex-col">
                      <span className="text-primary font-bold">
                        Journal Entry #{index + 1} |{" "}
                        {new Date(journal.tanggal).toLocaleDateString("id-ID")}
                      </span>
                      <span className="text-xs opacity-70">
                        (created on {new Date(journal.createdAt).toLocaleString("id-ID")})
                      </span>
                      <span className="text-xs opacity-70">
                        {journal.nomorJurnal} - {journal.deskripsi}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* === Journal Items === */}
                {journal.items.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td>
                      <div className="font-mono text-xs text-base-content/60">
                        ({item.kodeAkun}) - {item.namaAkun}
                      </div>
                    </td>
                    <td className="text-right font-mono">
                      {item.debit.toLocaleString("id-ID")}
                    </td>
                    <td className="text-right font-mono">
                      {item.kredit.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}

                {/* === Journal Subtotal === */}
                <tr className="border-t-2 border-base-300 font-bold bg-base-100">
                  <td className="text-center">Total</td>
                  <td className="text-right">
                    {journal.totalDebit.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right">
                    {journal.totalKredit.toLocaleString("id-ID")}
                  </td>
                </tr>

                {/* Spacer */}
                <tr>
                  <td colSpan={3} className="py-1"></td>
                </tr>
              </>
            ))}
          </tbody>

          {/* FOOTER GRAND TOTAL */}
          <tfoot>
            <tr className="bg-primary text-primary-content text-lg font-bold">
              <td className="text-center py-3">GRAND TOTAL</td>
              <td className="text-right">
                {grandDebit.toLocaleString("id-ID")}
              </td>
              <td className="text-right">
                {grandKredit.toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default JournalReport;
