import * as Mui from '@mui/material';
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import * as ReportsStyle from './reports.style';
import useReports from './use-reports';
import * as Common from '../common';

function Reports() {
  // const navigate = ReactRouter.useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filter, setFilter] = React.useState('');

  const { reports } = useReports();
  const reportsLength = Object.values(reports).length;
  const filteredReports = Object.values(reports).filter((report) =>
    report.title?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ReportsStyle.Container>
      <Mui.Typography variant="h5" data-testid="id-title-1">
        AI Intelligence Dashboard
      </Mui.Typography>
      <Mui.Typography variant="subtitle2" data-testid="id-subtitle-1">
        Use this dashboard to create, draft or summarize reports using AI
      </Mui.Typography>
      <ReportsStyle.Container
        sx={{ flexGrow: 1, flexBasis: '100%', minWidth: 0, px: 0 }}
      >
        <Mui.Box sx={{ width: '100%' }} py={1}>
          <ReportsStyle.TablePaper sx={{ width: '100%', mb: 2 }}>
            <Mui.Table
              sx={{ minWidth: 750 }}
              aria-label="Ai Intelligence Dashboard"
              data-testid="id-table-1"
            >
              <ReportsStyle.TableHead>
                <Mui.TableRow>
                  <Mui.TableCell data-testid="id-table-column-1">
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
                  <Mui.TableCell align="right" data-testid="ep-table-column-2">
                    Title
                  </Mui.TableCell>
                  <Mui.TableCell align="right" data-testid="ep-table-column-3">
                    Description
                  </Mui.TableCell>
                </Mui.TableRow>
              </ReportsStyle.TableHead>

              <Mui.TableBody>
                {Object.values(reports)
                  .filter((report) =>
                    report.title?.toLowerCase().includes(filter.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <Mui.TableRow hover key={row.id}>
                      <Mui.TableCell component="th" scope="row">
                        {row.title}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {row.description}
                      </Mui.TableCell>
                    </Mui.TableRow>
                  ))}
              </Mui.TableBody>
            </Mui.Table>

            <ReportsStyle.TableFooter>
              <Mui.Stack direction="row" spacing={2}>
                <Mui.Tooltip title="Add new report">
                  <ReactRouter.Link to={Common.Routes.HOME('new')}>
                    <Mui.IconButton color="primary">
                      <AddIcon />
                    </Mui.IconButton>
                  </ReactRouter.Link>
                </Mui.Tooltip>
              </Mui.Stack>

              <Mui.TablePagination
                component="div"
                count={
                  filteredReports.length === 0
                    ? reportsLength
                    : filteredReports.length
                }
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
    </ReportsStyle.Container>
  );
}

export default Reports;
