import { useContext } from 'solid-js';
import { ModalContext } from './ModalProvider';

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
