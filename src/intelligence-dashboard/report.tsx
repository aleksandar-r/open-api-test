import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ReactRouter from 'react-router-dom';
import * as ReactHookForm from 'react-hook-form';
import * as Mui from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { enqueueSnackbar } from 'notistack';
import schema from './report.schema';
import * as ReportsStyle from './reports.style';
import useReports from './use-reports';
import * as Common from '../common';

const resolver = zodResolver(schema);

function Report() {
  const { id } = ReactRouter.useParams();
  const navigate = ReactRouter.useNavigate();
  const readOnly = id === 'new';

  const { reports, setReport } = useReports();
  const values =
    id && id !== 'new' ? reports[id] : { id: '', title: '', description: '' };

  const siteForm = ReactHookForm.useForm<z.infer<typeof schema>>({
    resolver,
    mode: 'onBlur',
    values
  });

  const { formState, control, register, handleSubmit, setValue, watch } =
    siteForm;

  const { generate, summarize, loading: aiLoading } = Common.useOpenAIDraft();

  const handleReportUpsert = handleSubmit((data) => {
    const newData = data.id ? data : { ...data, id: crypto.randomUUID() };
    setReport(newData);
    Common.logAnalytics(data.id ? 'Update report' : 'Save report', data);
    enqueueSnackbar(data.id ? 'Report updated' : 'Report saved', {
      variant: 'success'
    });
    navigate(Common.Routes.HOME());
  });

  const handleDraft = async () => {
    const title = watch('title');
    const result = await generate(title);
    if (result) {
      setValue('description', result);
      Common.logAnalytics('Draft report', { title, result });
      enqueueSnackbar('Description generated', { variant: 'success' });
    }
  };

  const handleSummarize = async () => {
    const description = watch('description');
    const result = await summarize(description);
    if (result) {
      setValue('description', result);
      Common.logAnalytics('Summarize report', { description, result });
      enqueueSnackbar('Text summarized', { variant: 'success' });
    }
  };

  const handleSuggestTitle = async () => {
    const description = watch('description');
    const result = await generate(`Suggest a concise title for:

${description}`);
    if (result) {
      setValue('title', result);
      Common.logAnalytics('Suggest title', { description, result });
      enqueueSnackbar('Title generated', { variant: 'success' });
    }
  };

  return (
    <ReportsStyle.Container>
      <Mui.Box width="100%" display="flex" justifyContent="center">
        <Mui.Box
          component={Mui.Paper}
          p={1}
          height="fit-content"
          position="relative"
          overflow="hidden"
          width="100%"
          alignSelf="center"
        >
          {aiLoading && (
            <Mui.LinearProgress
              sx={{ top: 0, left: 0, width: '100%', position: 'absolute' }}
            />
          )}
          <Mui.Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Mui.Tooltip title="Back to reports list">
              <ReactRouter.Link to={Common.Routes.HOME()}>
                <Mui.IconButton size="small">
                  <ArrowBackIosIcon />
                </Mui.IconButton>
              </ReactRouter.Link>
            </Mui.Tooltip>
            <Mui.Typography variant="h6" data-testid="ep-form-title-1">
              {readOnly ? 'New' : 'Edit'} Report
            </Mui.Typography>
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>

      <ReactHookForm.FormProvider {...siteForm}>
        <Mui.Box
          display="flex"
          flexDirection="column"
          gap={2}
          pt={2}
          component="form"
          onSubmit={handleReportUpsert}
        >
          <input {...register('id')} type="hidden" readOnly={readOnly} />

          <Mui.TextField
            {...register('title')}
            label="Title"
            variant="outlined"
            size="small"
            fullWidth
            error={!!formState.errors.title}
            helperText={formState.errors.title?.message}
            disabled={formState.isSubmitting || aiLoading}
          />

          <ReactHookForm.Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Editor
                  apiKey={Common.TINY_MCE_KEY}
                  init={{
                    height: 250,
                    menubar: false,
                    plugins: 'lists link paste help wordcount',
                    toolbar:
                      'undo redo | formatselect | bold italic underline | bullist numlist outdent indent | help'
                  }}
                  value={value}
                  onEditorChange={onChange}
                  disabled={formState.isSubmitting || aiLoading}
                />
                {error && (
                  <Mui.FormHelperText error>{error.message}</Mui.FormHelperText>
                )}
              </>
            )}
          />

          <Mui.Button
            type="submit"
            size="small"
            variant="contained"
            disabled={
              formState.isSubmitting ||
              aiLoading ||
              Object.keys(formState.errors).length > 0
            }
          >
            {readOnly ? 'Save' : 'Update'}
            {(formState.isSubmitting || aiLoading) && (
              <Mui.CircularProgress size={20} />
            )}
          </Mui.Button>
        </Mui.Box>
      </ReactHookForm.FormProvider>

      <Mui.Box mt={2} display="flex" gap={2} flexWrap="wrap">
        <Mui.Button
          size="small"
          variant="outlined"
          onClick={handleDraft}
          disabled={aiLoading}
        >
          Draft Report
        </Mui.Button>
        <Mui.Button
          size="small"
          variant="outlined"
          onClick={handleSummarize}
          disabled={aiLoading}
        >
          Summarize Report
        </Mui.Button>
        <Mui.Button
          size="small"
          variant="outlined"
          onClick={handleSuggestTitle}
          disabled={aiLoading}
        >
          Suggest Title
        </Mui.Button>
      </Mui.Box>
    </ReportsStyle.Container>
  );
}

export default Report;
