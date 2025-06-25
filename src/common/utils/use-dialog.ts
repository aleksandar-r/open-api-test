import React from 'react';

export type Dialog = {
  open: boolean;
  onClose: () => void;
};

function useDialog(startOpen = false) {
  const [open, setOpen] = React.useState(startOpen);
  const onCloseRef = React.useRef<(res?: unknown) => void | undefined>();

  const openPanel = React.useCallback(
    (onClose: (res?: unknown) => void = () => {}) => {
      setOpen(true);
      onCloseRef.current = onClose;
    },
    [setOpen]
  );

  const closePanel = React.useCallback(
    (res?: unknown) => {
      setOpen(false);
      onCloseRef.current!(res);
    },
    [setOpen]
  );

  const onClose = () => {
    closePanel();
  };

  return {
    closePanel,
    openPanel,
    dialog: {
      open,
      onClose
    } as Dialog
  };
}

export default useDialog;
