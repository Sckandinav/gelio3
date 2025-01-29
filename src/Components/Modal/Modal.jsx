import { Modal as BsModal } from 'react-bootstrap';

export const Modal = ({ show, close, title, children, size = 'lg' }) => {
  return (
    <>
      <BsModal show={show} onHide={close} size={size}>
        <BsModal.Header closeButton>
          <BsModal.Title>{title}</BsModal.Title>
        </BsModal.Header>

        <BsModal.Body>{children}</BsModal.Body>
      </BsModal>
    </>
  );
};
