import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  console.log('🔥 MODAL RENDER:', { isOpen, type, title, hasOnConfirm: !!onConfirm });
  
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'warning':
        return <AlertTriangle className="text-orange-500" size={48} />;
      case 'info':
        return <Info className="text-blue-500" size={48} />;
      case 'confirm':
        return <AlertTriangle className="text-[#37b7ff]" size={48} />;
      default:
        return <Info className="text-blue-500" size={48} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'confirm':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-[#37b7ff] hover:bg-[#2da7ef]'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`w-20 h-20 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center mx-auto mb-4`}>
              {getIcon()}
            </div>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={() => {
                    console.log('🔥 MODAL: Botón cancelar clickeado');
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    console.log('🔥 MODAL: Botón confirmar clickeado');
                    console.log('🔥 MODAL: onConfirm existe?', !!onConfirm);
                    // Para modales de confirmación, no cerrar automáticamente
                    // Dejar que onConfirm maneje el cierre del modal
                    if (onConfirm) {
                      console.log('🔥 MODAL: Ejecutando onConfirm...');
                      onConfirm();
                      console.log('🔥 MODAL: onConfirm ejecutado');
                    } else {
                      console.log('🔥 MODAL: ERROR - onConfirm no existe');
                    }
                  }}
                  className={`flex-1 px-4 py-3 ${colors.button} text-white rounded-lg transition-colors font-medium`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full px-4 py-3 ${colors.button} text-white rounded-lg transition-colors font-medium`}
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;