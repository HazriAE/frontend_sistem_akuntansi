import PageWithTabs from "../../components/PageWithTabs"
import CardReport from "./CardReport"

const dataReports = [
  {
    title: "Neraca Saldo",
    desc: "Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah diinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu.",
    path: "/reports/neraca-saldo"
  },
  {
    title: "Buku Besar",
    desc: "Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah diinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu.",
    path: "/reports/buku-besar"
  },
  {
    title: "Laba rugi",
    desc: "Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah diinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu.",
    path: "/reports/profit-loss"
  },
  {
    title: "Jurnal Umum",
    desc: "Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah diinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu.",
    path: "/reports/jurnal-umum"
  },
]

const Overviews = () => {
  return (
    <PageWithTabs title="Laporan Keuangan" subtitle="Laporan">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataReports.map((report) => 
          <CardReport key={report.title} report={report} />
        )}
      </div>
    </PageWithTabs>
  )
}

export default Overviews