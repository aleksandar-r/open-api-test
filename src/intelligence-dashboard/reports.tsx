import * as Mui from '@mui/material';
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import * as ReportsStyle from './reports.style';
import useReports from './use-reports';
import * as Common from '../common';
import * as Auth from '../user';
import {
  MuiSortableTable,
  MuiRowDragHandleCell
} from '../common/components/draggable-row';
import { type Report } from './types';
import DOMPurify from 'dompurify';
import * as Utils from './utils';
import { enqueueSnackbar } from 'notistack';

export function Reports() {
  const { role } = Auth.useUser();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filter, setFilter] = React.useState('');
  const [reportOrder, setReportOrder] = React.useState<string[]>([]);

  const { reports, deleteReport } = useReports();
  const reportsArray = React.useMemo(() => Object.values(reports), [reports]);
  const reportsLength = reportsArray.length;

  const columns = React.useMemo(
    () => [
      {
        id: 'drag-handle',
        cell: (row: Report) => <MuiRowDragHandleCell rowId={row.id} />
      },
      {
        id: 'title',
        cell: (row: Report) => row.title
      },
      {
        id: 'description',
        cell: (row: Report) => (
          <span
            dangerouslySetInnerHTML={{
              __html:
                row.description.length > 50
                  ? `${DOMPurify.sanitize(row.description.substring(0, 50))}...`
                  : DOMPurify.sanitize(row.description)
            }}
          />
        )
      },
      {
        id: 'actions',
        cell: (row) => (
          <>
            <Auth.Role role={role} match={Auth.UserRole.Admin}>
              <Mui.Tooltip title="Edit report">
                <ReactRouter.Link
                  to={Common.Routes.HOME(row.id)}
                  onClick={() =>
                    Common.logAnalytics('edit_report_clicked', { id: row.id })
                  }
                >
                  <Mui.IconButton color="primary">
                    <EditIcon />
                  </Mui.IconButton>
                </ReactRouter.Link>
              </Mui.Tooltip>
            </Auth.Role>
            <Auth.Role role={role} match={Auth.UserRole.Admin}>
              <Mui.Tooltip title="Delete report">
                <Mui.IconButton
                  color="error"
                  onClick={() => {
                    deleteReport(row.id);
                    Common.logAnalytics('delete_report', { id: row.id });
                    enqueueSnackbar('Report deleted', {
                      variant: 'success'
                    });
                  }}
                >
                  <DeleteIcon />
                </Mui.IconButton>
              </Mui.Tooltip>
            </Auth.Role>
          </>
        )
      }
    ],
    [deleteReport, role]
  );

  React.useEffect(() => {
    const parsed = Utils.getStoredOrder();
    if (parsed) {
      setReportOrder(parsed);
    }
  }, []);

  React.useEffect(() => {
    if (reportOrder.length > 0) {
      Utils.saveOrderToStorage(reportOrder);
    }
  }, [reportOrder]);

  React.useEffect(() => {
    const allIds = reportsArray.map((r) => r.id);
    setReportOrder((prev) =>
      prev.length
        ? prev
            .filter((id) => allIds.includes(id))
            .concat(allIds.filter((id) => !prev.includes(id)))
        : allIds
    );
  }, [reportsArray]);

  const orderedReports = reportOrder.map((id) => reports[id]).filter(Boolean);
  const filteredReports = orderedReports.filter((report) =>
    report?.title?.toLowerCase().includes(filter.toLowerCase())
  );
  const visibleRows = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ReportsStyle.Container>
      <Mui.Typography variant="h5" data-testid="id-title-1">
        AI Intelligence Dashboard
      </Mui.Typography>
      <Mui.Typography variant="subtitle2" data-testid="id-subtitle-1">
        Use this dashboard to create, draft or summarize reports using AI
      </Mui.Typography>
      <Mui.Box sx={{ width: '100%' }} py={1}>
        <ReportsStyle.TablePaper sx={{ width: '100%', mb: 2 }}>
          <Mui.Table
            sx={{ minWidth: 750 }}
            aria-label="AI Intelligence Dashboard"
            data-testid="id-table-1"
          >
            <ReportsStyle.TableHead>
              <Mui.TableRow>
                <Mui.TableCell>
                  <Mui.TextField
                    id="standard-search"
                    label="Filter on title..."
                    type="search"
                    variant="standard"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(0);
                    }}
                    data-testid="id-input-1"
                  />
                </Mui.TableCell>
                <Mui.TableCell>Title</Mui.TableCell>
                <Mui.TableCell>Description</Mui.TableCell>
                <Mui.TableCell>Actions</Mui.TableCell>
              </Mui.TableRow>
            </ReportsStyle.TableHead>

            <MuiSortableTable
              columns={columns}
              data={visibleRows}
              setData={(updatedRows: Report[]) => {
                const updatedIds = [...reportOrder];
                for (let i = 0; i < updatedRows.length; i++) {
                  const id = updatedRows[i].id;
                  const currentIndex = updatedIds.indexOf(id);
                  updatedIds.splice(currentIndex, 1);
                  updatedIds.splice(page * rowsPerPage + i, 0, id);
                }
                setReportOrder(updatedIds);
              }}
              getRowId={(row: Report) => row.id}
            />
          </Mui.Table>

          <ReportsStyle.TableFooter>
            <Mui.Stack direction="row" spacing={2}>
              <Auth.Role role={role} match={Auth.UserRole.Admin}>
                <Mui.Tooltip title="Add new report">
                  <ReactRouter.Link
                    to={Common.Routes.HOME('new')}
                    onClick={() =>
                      Common.logAnalytics('add_report_clicked', { id: 'new' })
                    }
                  >
                    <Mui.IconButton color="primary">
                      <AddIcon />
                    </Mui.IconButton>
                  </ReactRouter.Link>
                </Mui.Tooltip>
              </Auth.Role>
            </Mui.Stack>

            <Mui.TablePagination
              component="div"
              count={filteredReports.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, _page) => setPage(_page)}
              ActionsComponent={Mui.TablePaginationActions}
              onRowsPerPageChange={({ target: { value: _rowsPerPage } }) => {
                setRowsPerPage(+_rowsPerPage);
                setPage(0);
              }}
            />
          </ReportsStyle.TableFooter>
        </ReportsStyle.TablePaper>
      </Mui.Box>
      <Mui.Typography
        variant="caption"
        sx={{ mx: 2 }}
        data-testid="ep-caption-1"
      >
        There have been {reportsLength} submitted reports.
      </Mui.Typography>
    </ReportsStyle.Container>
  );
}

export default Reports;
