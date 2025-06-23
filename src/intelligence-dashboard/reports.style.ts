import * as Mui from '@mui/material';

export const Container = Mui.styled(Mui.Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  elevation: 4
}));

export const TablePaper = Mui.styled(Mui.Paper)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

export const TableHead = Mui.styled(Mui.TableHead)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(8)
}));

export const TableFooter = Mui.styled(Mui.Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  width: '100%',
  bottom: 0,
  padding: theme.spacing(1),
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`
}));
