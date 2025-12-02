import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import JournalReport from "./JournalReport";

const LaporanJurnal = () => {

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["laporan-jurnal"],
    queryFn: async () => {
      const { data } = await api.get("laporan/jurnal-umum");
      return data.data;
    },
  });

  if (isLoading) return <div className="loading loading-spinner mx-auto"></div>;
  if (isError) return <div className="alert alert-error">Gagal memuat data</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">LAPORAN JURNAL</h2>

      <JournalReport data={data} />
    </div>
  );
};

export default LaporanJurnal;
