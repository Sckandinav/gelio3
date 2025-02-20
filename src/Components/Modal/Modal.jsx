import { Modal as BsModal } from 'react-bootstrap';

export const Modal = ({ show, close, title, children, size = 'lg', fullscreen = false }) => {
  return (
    <>
      <BsModal show={show} onHide={close} size={size} fullscreen={fullscreen}>
        <BsModal.Header closeButton>
          <BsModal.Title>{title}</BsModal.Title>
        </BsModal.Header>

        <BsModal.Body>{children}</BsModal.Body>
      </BsModal>
    </>
  );
};
