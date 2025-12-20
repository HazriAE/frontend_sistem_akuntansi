import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import JournalReport from "./JournalReport";
import HReportCard from "../../components/HReportCard";
import { data_offline } from "../../data/dataOflline";

const LaporanJurnal = () => {
  const [startDate, setStartDate] = useState(new Date(2025, 0, 2).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(2025, 3, 1).toISOString().split('T')[0]);

  const data = data_offline.jurnal_umum.data

  return (
    <div className="space-y-6">
      <HReportCard title="Jurnal Umum" setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate}  />
      <h2 className="text-2xl font-bold text-center">LAPORAN JURNAL</h2>

      <JournalReport data={data} />
    </div>
  );
};

export default LaporanJurnal;
