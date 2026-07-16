import React from 'react';

interface TicketPrintProps {
  noAntrian: string;
  namaPasien: string;
  poliTujuan: string;
  tanggal: string;
  jam: string;
}

export const TicketPrint = React.forwardRef<HTMLDivElement, TicketPrintProps>(
  ({ noAntrian, namaPasien, poliTujuan, tanggal, jam }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white p-4 text-black w-[300px] font-mono text-center mx-auto print:absolute print:top-0 print:left-0 print:w-[58mm] print:m-0 print:p-2"
        style={{ minHeight: '300px' }}
      >
        <div className="mb-2">
          <h2 className="font-bold text-lg leading-tight uppercase">Klinik Sehat Utama</h2>
          <p className="text-xs">Jl. Merdeka No. 45, Jakarta</p>
          <p className="text-xs">Telp: (021) 12345678</p>
        </div>

        <div className="border-t-2 border-dashed border-black my-3"></div>

        <div className="mb-3">
          <p className="text-sm font-semibold uppercase">{poliTujuan}</p>
          <p className="text-xs mt-1">NOMOR ANTREAN</p>
          <h1 className="text-5xl font-bold my-2 tracking-wider">{noAntrian}</h1>
        </div>

        <div className="border-t-2 border-dashed border-black my-3"></div>

        <div className="text-left text-xs space-y-1 mb-4">
          <p><span className="inline-block w-16">Nama</span>: {namaPasien}</p>
          <p><span className="inline-block w-16">Tanggal</span>: {tanggal}</p>
          <p><span className="inline-block w-16">Jam</span>: {jam} WIB</p>
        </div>

        <div className="border-t-2 border-dashed border-black my-3"></div>

        <div className="text-xs text-center">
          <p>Silakan tunggu panggilan di ruang tunggu poli.</p>
          <p className="font-semibold mt-2">Semoga Lekas Sembuh</p>
        </div>
      </div>
    );
  }
);

TicketPrint.displayName = 'TicketPrint';
