import React from 'react';
import { useSynergyApi } from '../../hooks';
import {
  CardTab,
  Link,
  MarkdownContent,
  Progress,
  ResponseErrorPanel,
  TabbedCard,
} from '@backstage/core-components';
import { Box, Card, Grid, makeStyles, Theme } from '@material-ui/core';
import { ProjectCard } from '../ProjectCard';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { projectRouteRef } from '../../routes';
import { IssuesList } from '../IssuesList';

const useStyles = makeStyles<Theme>(theme => ({
  infoCard: {
    width: '100%',
  },
}));

export const ProjectPage = () => {
  const tabStyles = {
    fontSize: '14px',
    width: '8rem',
    marginTop: '14px',
    paddingBottom: '13px',
  };
  const classes = useStyles();
  const { owner, project } = useRouteRefParams(projectRouteRef);
  const {
    value: projectData,
    loading,
    error,
  } = useSynergyApi(api => api.getProject(project, owner));

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    projectData && (
      <Card>
        <Box sx={{ m: '1.5rem' }}>
          <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'centre',
                }}
              >
                <div>
                  <Link to="/synergy">
                    Projects
                  </Link>{' '}
                  / <span>{projectData.name}</span>
                </div>
                <div>
                  <Link to="/synergy">
                    Back to Projects
                  </Link>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <ProjectCard project={projectData} hideMore={true} />
            </Grid>
            <Grid item md={6} lg={7}>
              <TabbedCard>
                <CardTab label="Pinned Issues" style={tabStyles}>
                  {projectData.pinnedIssues.length ? (
                    <IssuesList issues={projectData.pinnedIssues} />
                  ) : (
                    'No Pinned Issues found for this project.'
                  )}
                </CardTab>
                <CardTab label="All Issues" style={tabStyles}>
                  {projectData.issues.length ? (
                    <IssuesList issues={projectData.issues} />
                  ) : (
                    'No Open Issues found for this project.'
                  )}
                </CardTab>
                <CardTab label="README" style={tabStyles}>
                  <MarkdownContent content={projectData.readme} dialect="gfm" />
                </CardTab>
              </TabbedCard>
            </Grid>
          </Grid>
        </Box>
      </Card>
    )
  );
};
