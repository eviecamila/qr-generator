import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTrash, FaTimes } from "react-icons/fa";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrList, setQrList] = useState<string[]>([]);
  const [generatedQR, setGeneratedQR] = useState("");
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  // Cargar QRs desde localStorage al iniciar
  useEffect(() => {
    const storedQRs = JSON.parse(localStorage.getItem("qrList") || "[]");
    setQrList(storedQRs);
  }, []);

  // Generar y guardar QR automáticamente
  const handleGenerateQR = () => {
    if (!text.trim()) return;
    const updatedList = [text, ...qrList.slice(0, 9)]; // Máximo 10 QRs
    setGeneratedQR(text);
    setQrList(updatedList);
    localStorage.setItem("qrList", JSON.stringify(updatedList));
  };

  // Eliminar QR de la lista y localStorage
  const handleDeleteQR = (qr: string) => {
    const updatedList = qrList.filter((item) => item !== qr);
    setQrList(updatedList);
    localStorage.setItem("qrList", JSON.stringify(updatedList));
  };

  // Descargar QR como imagen
  const handleDownloadQR = (qr: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 250;

    if (context) {
      canvas.width = size;
      canvas.height = size;

      const qrCanvas = document.createElement("canvas");

      context.drawImage(qrCanvas, 0, 0, size, size);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "QR_Code.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-sm w-full">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
          Generador de QR
        </h1>
        <input
          type="text"
          placeholder="Escribe algo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleGenerateQR}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Generar QR
        </button>

        {/* Área del QR con icono de descarga */}
        <div className="mt-4 flex flex-col items-center">
          {generatedQR ? (
            <>
              <QRCodeCanvas value={generatedQR} size={200} className="shadow-xl rounded-lg p-4" />
              


              <br />
              <div className="text-right w-full pr-16">
              <button
                onClick={() => handleDownloadQR(generatedQR)}
                className="mt-2 text-green-500 hover:text-green-700 text-xl"
              >
                
                <FaDownload />
                
              </button>
              </div>
            </>
          ) : (
            ":("
          )}
        </div>
      </div>

      {/* Historial de QRs */}
      <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
        <div className="text-center">Historial</div>
        {qrList.length?qrList.map((qr, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center justify-between cursor-pointer w-full"
            onClick={() => setSelectedQR(qr)}
          >
            <p className="truncate max-w-[70%]">{qr}</p>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadQR(qr);
                }}
                className="text-green-500 hover:text-green-700"
              >
                <FaDownload />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteQR(qr);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )):<><br />
        <div className="text-center">No tienes QR's generados</div>
        </>}
      </div>

      {/* Modal de QR en grande */}
      <AnimatePresence>
        {selectedQR && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQR(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic en el modal
            >
              <button
                onClick={() => setSelectedQR(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
              <QRCodeCanvas value={selectedQR} size={250} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
