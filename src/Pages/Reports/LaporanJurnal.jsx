import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import JournalReport from "./JournalReport";
import HReportCard from "../../components/HReportCard";

const LaporanJurnal = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jurnal-umum', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await api.get(`/laporan/jurnal-umum?${params}`);
      return data.data;
    },
    enabled: !!endDate
  });

  if (isLoading) return <div className="loading loading-spinner mx-auto"></div>;
  if (isError) return <div className="alert alert-error">Gagal memuat data</div>;

  return (
    <div className="space-y-6">
      <HReportCard title="Jurnal Umum" setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} refetch={refetch} />
      <h2 className="text-2xl font-bold text-center">LAPORAN JURNAL</h2>

      <JournalReport data={data} />
    </div>
  );
};

export default LaporanJurnal;
