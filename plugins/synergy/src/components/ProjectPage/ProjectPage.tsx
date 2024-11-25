import React from 'react';
import { useSynergyApi } from '../../hooks';
import {
  CardTab,
  InfoCard,
  Link,
  LinkButton,
  MarkdownContent,
  Progress,
  ResponseErrorPanel,
  TabbedCard,
} from '@backstage/core-components';
import { Box, Grid } from '@material-ui/core';
import { ProjectCard } from '../ProjectCard';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { projectRouteRef } from '../../routes';
import { IssuesList } from '../IssuesList';

export const ProjectPage = () => {
  const tabStyles = {
    fontSize: '14px',
    // marginTop: '14px',
    padding: '18px 8px 13px ',
    whiteSpace: 'nowrap',
  };
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
      <InfoCard
        title="Project Details"
        subheader="Explore the project's open issues and start contributing."
      >
        <Box sx={{ mx: '.25rem', mb: '.25rem' }}>
          <Grid container spacing={2} justifyContent="flex-start">
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'centre',
                }}
              >
                <div>
                  <Link to="/synergy">Projects</Link> /{' '}
                  <span>{projectData.name}</span>
                </div>

                <LinkButton to="/synergy" variant="contained">
                  Back to All Projects
                </LinkButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <ProjectCard project={projectData} hideMore />
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
                <CardTab label="Readme" style={tabStyles}>
                  {projectData.readme ? (
                    <MarkdownContent
                      content={projectData.readme}
                      dialect="gfm"
                    />
                  ) : (
                    <p>README file not found.</p>
                  )}
                </CardTab>
                <CardTab label="Contributing Guidelines" style={tabStyles}>
                  {projectData.contributingGuidelines ? (
                    <MarkdownContent
                      content={projectData.contributingGuidelines}
                      dialect="gfm"
                    />
                  ) : (
                    <p>No contribution guideline found.</p>
                  )}
                </CardTab>
              </TabbedCard>
            </Grid>
          </Grid>
        </Box>
      </InfoCard>
    )
  );
};
